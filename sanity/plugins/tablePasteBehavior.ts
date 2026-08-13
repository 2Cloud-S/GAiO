import { defineBehavior, raise } from "@portabletext/editor/behaviors";
import type { PortableTextBlock } from "@portabletext/editor";
import { getEnclosingBlock, getParent } from "@portabletext/editor/traversal";
import { isSelectionCollapsed } from "@portabletext/editor/selectors";
import type { EditorSnapshot } from "@portabletext/editor";
import {
  TABLE_CONFIG,
  buildTableFragmentFromGrid,
  getTabularGrid,
  planTablePasteDistribution,
  type TablePastePlan,
} from "./tablePasteUtils";

const config = TABLE_CONFIG;

function createTableGuards() {
  return {
    isTable: (node: PortableTextBlock): node is PortableTextBlock =>
      node._type === config.tableType &&
      Array.isArray((node as Record<string, unknown>)[config.rowsField]),
    isRow: (node: PortableTextBlock): node is PortableTextBlock =>
      node._type === config.rowType &&
      Array.isArray((node as Record<string, unknown>)[config.cellsField]),
    isCell: (node: PortableTextBlock): node is PortableTextBlock => node._type === config.cellType,
  };
}

function tableRows(table: PortableTextBlock) {
  const rows = (table as Record<string, unknown>)[config.rowsField];
  return Array.isArray(rows) ? (rows as PortableTextBlock[]) : [];
}

function rowCells(row: PortableTextBlock) {
  const cells = (row as Record<string, unknown>)[config.cellsField];
  return Array.isArray(cells) ? (cells as PortableTextBlock[]) : [];
}

function resolveAnchorCell(snapshot: EditorSnapshot) {
  const { isCell, isRow, isTable } = createTableGuards();
  const selection = snapshot.context.selection;
  if (!selection) return undefined;

  const pathsToTry = selection.anchor.path === selection.focus.path
    ? [selection.focus.path]
    : [selection.anchor.path, selection.focus.path];

  for (const path of pathsToTry) {
    const cell = getEnclosingBlock(snapshot, path, { match: isCell });
    if (!cell) continue;

    const row = getParent(snapshot, cell.path, { match: isRow });
    const table = row ? getParent(snapshot, row.path, { match: isTable }) : undefined;
    if (!row || !table) continue;

    const rowIndex = tableRows(table.node).findIndex((entry) => entry._key === row.node._key);
    const colIndex = rowCells(row.node).findIndex((entry) => entry._key === cell.node._key);

    if (rowIndex !== -1 && colIndex !== -1) {
      return {
        table: table.node,
        tablePath: table.path,
        rowIndex,
        colIndex,
      };
    }
  }

  if (!isSelectionCollapsed(snapshot)) return undefined;

  const caretCell = getEnclosingBlock(snapshot, selection.focus.path, { match: isCell });
  if (!caretCell) return undefined;

  const row = getParent(snapshot, caretCell.path, { match: isRow });
  const table = row ? getParent(snapshot, row.path, { match: isTable }) : undefined;
  if (!row || !table) return undefined;

  const rowIndex = tableRows(table.node).findIndex((entry) => entry._key === row.node._key);
  const colIndex = rowCells(row.node).findIndex((entry) => entry._key === caretCell.node._key);

  if (rowIndex === -1 || colIndex === -1) return undefined;

  return {
    table: table.node,
    tablePath: table.path,
    rowIndex,
    colIndex,
  };
}

/**
 * Intercepts TSV / HTML table paste inside Sanity PTE table cells.
 * The built-in `@portabletext/plugin-table` paste handler only reads
 * `application/x-portable-text` (intra-Studio copy); external spreadsheets
 * and docs paste as plain text into a single cell without this behavior.
 */
export const externalTablePasteBehavior = defineBehavior({
  on: "clipboard.paste",
  guard: ({ snapshot, event }) => {
    const dataTransfer = event.originEvent.dataTransfer;
    const grid = getTabularGrid(dataTransfer);
    if (!grid) return false;

    const anchor = resolveAnchorCell(snapshot);
    if (!anchor) return false;

    const keyGenerator = snapshot.context.keyGenerator;
    const fragment = buildTableFragmentFromGrid(grid, keyGenerator);
    const plan = planTablePasteDistribution(config, keyGenerator, fragment, {
      table: anchor.table as ReturnType<typeof buildTableFragmentFromGrid>,
      tablePath: anchor.tablePath,
      rowIndex: anchor.rowIndex,
      colIndex: anchor.colIndex,
    });
    return plan || false;
  },
  actions: [
    (_, plan: TablePastePlan | false) => {
      if (!plan) return [];

      const { replacements, cellAppends, rowAppends, selection } = plan;

      return [
        ...cellAppends.map((append) =>
          raise({
            type: "insert",
            at: append.afterCellPath,
            value: append.cell,
            position: "after",
          }),
        ),
        ...rowAppends.map((append) =>
          raise({
            type: "insert",
            at: append.afterRowPath,
            value: append.row,
            position: "after",
          }),
        ),
        ...replacements.flatMap((replacement) => {
          const lastOriginalKey = replacement.originalBlockKeys[replacement.originalBlockKeys.length - 1];
          if (lastOriginalKey === undefined) return [];

          return [
            ...replacement.blocks.map((block, index) =>
              raise({
                type: "insert",
                at: [
                  ...replacement.cellPath,
                  config.valueField,
                  { _key: index === 0 ? lastOriginalKey : (replacement.blocks[index - 1]?._key as string) },
                ],
                value: block as PortableTextBlock,
                position: "after",
              }),
            ),
            ...replacement.originalBlockKeys.map((blockKey) =>
              raise({
                type: "unset",
                at: [...replacement.cellPath, config.valueField, { _key: blockKey }],
              }),
            ),
          ];
        }),
        raise({
          type: "select",
          at: selection,
        }),
      ];
    },
  ],
});
