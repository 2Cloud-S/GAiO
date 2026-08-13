import type { Path } from "@portabletext/editor";

/** Table schema field names — must match `sanity/schemaTypes/table.ts`. */
export const TABLE_CONFIG = {
  tableType: "table",
  rowsField: "rows",
  rowType: "row",
  cellsField: "cells",
  cellType: "cell",
  valueField: "value",
} as const;

type TableConfig = typeof TABLE_CONFIG;

type KeyGenerator = () => string;

type TableNode = Record<string, unknown> & { _type: string; _key: string };
type RowNode = Record<string, unknown> & { _type: string; _key: string };
type CellNode = Record<string, unknown> & { _type: string; _key: string };

export function parseTsv(text: string): string[][] | null {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n+$/, "");
  if (!normalized.includes("\t") && !normalized.includes("\n")) return null;

  const rows = normalized.split("\n").map((row) => row.split("\t"));
  if (rows.length === 0) return null;

  const maxCols = Math.max(...rows.map((row) => row.length));
  if (maxCols <= 1 && rows.length <= 1) return null;

  return rows.map((row) => {
    const padded = [...row];
    while (padded.length < maxCols) padded.push("");
    return padded;
  });
}

export function parseHtmlTable(html: string): string[][] | null {
  if (!html.trim()) return null;

  const doc = new DOMParser().parseFromString(html, "text/html");
  const table = doc.querySelector("table");
  if (!table) return null;

  const rows = Array.from(table.querySelectorAll("tr"));
  if (rows.length === 0) return null;

  const grid = rows.map((row) =>
    Array.from(row.querySelectorAll("th, td")).map(
      (cell) => cell.textContent?.replace(/\u00a0/g, " ").trim() ?? "",
    ),
  );

  const maxCols = Math.max(...grid.map((row) => row.length));
  if (maxCols === 0) return null;

  return grid.map((row) => {
    const padded = [...row];
    while (padded.length < maxCols) padded.push("");
    return padded;
  });
}

export function getTabularGrid(dataTransfer: DataTransfer): string[][] | null {
  const html = dataTransfer.getData("text/html");
  if (html) {
    const fromHtml = parseHtmlTable(html);
    if (fromHtml && fromHtml.length > 0) return fromHtml;
  }

  const plain = dataTransfer.getData("text/plain");
  if (plain) {
    const fromTsv = parseTsv(plain);
    if (fromTsv) return fromTsv;
  }

  return null;
}

function emptyTextBlock(keyGenerator: KeyGenerator) {
  return {
    _type: "block",
    _key: keyGenerator(),
    style: "normal",
    markDefs: [] as unknown[],
    children: [
      {
        _type: "span",
        _key: keyGenerator(),
        text: "",
        marks: [] as string[],
      },
    ],
  };
}

function textToBlocks(text: string, keyGenerator: KeyGenerator) {
  const lines = text.split("\n");
  return lines.map((line) => ({
    _type: "block",
    _key: keyGenerator(),
    style: "normal",
    markDefs: [] as unknown[],
    children: [
      {
        _type: "span",
        _key: keyGenerator(),
        text: line,
        marks: [] as string[],
      },
    ],
  }));
}

export function buildTableFragmentFromGrid(
  grid: string[][],
  keyGenerator: KeyGenerator,
  config: TableConfig = TABLE_CONFIG,
): TableNode {
  const rows = grid.map((rowValues) => {
    const rowKey = keyGenerator();
    const cells = rowValues.map((value) => ({
      _type: config.cellType,
      _key: keyGenerator(),
      [config.valueField]:
        value.trim().length > 0 ? textToBlocks(value, keyGenerator) : [emptyTextBlock(keyGenerator)],
    }));

    return {
      _type: config.rowType,
      _key: rowKey,
      [config.cellsField]: cells,
    };
  });

  return {
    _type: config.tableType,
    _key: keyGenerator(),
    [config.rowsField]: rows,
  };
}

function tableRows(config: TableConfig, table: TableNode): RowNode[] {
  const rows = table[config.rowsField];
  return Array.isArray(rows) ? (rows as RowNode[]) : [];
}

function rowCells(config: TableConfig, row: RowNode): CellNode[] {
  const cells = row[config.cellsField];
  return Array.isArray(cells) ? (cells as CellNode[]) : [];
}

function cellValue(config: TableConfig, cell: CellNode): Array<{ _key: string }> {
  const value = cell[config.valueField];
  return Array.isArray(value) ? (value as Array<{ _key: string }>) : [];
}

function cellPathFor(config: TableConfig, tablePath: Path, rowKey: string, cellKey: string) {
  return [
    ...tablePath,
    config.rowsField,
    { _key: rowKey },
    config.cellsField,
    { _key: cellKey },
  ];
}

function rekeyBlocks(keyGenerator: KeyGenerator, blocks: Array<Record<string, unknown>>) {
  return blocks.map((block) => {
    const blockKey = keyGenerator();
    const children = Array.isArray(block.children)
      ? block.children.map((child) => ({
          ...(child as Record<string, unknown>),
          _key: keyGenerator(),
        }))
      : block.children;

    return {
      ...block,
      _key: blockKey,
      children,
    };
  });
}

export type TablePastePlan = {
  replacements: Array<{
    cellPath: Path;
    originalBlockKeys: string[];
    blocks: Array<Record<string, unknown>>;
  }>;
  cellAppends: Array<{
    afterCellPath: Path;
    cell: CellNode;
  }>;
  rowAppends: Array<{
    afterRowPath: Path;
    row: RowNode;
  }>;
  selection: {
    anchor: { path: Path; offset: number };
    focus: { path: Path; offset: number };
  };
};

/** Mirrors `@portabletext/plugin-table` paste distribution for TSV/HTML fragments. */
export function planTablePasteDistribution(
  config: TableConfig,
  keyGenerator: KeyGenerator,
  fragment: TableNode,
  anchor: {
    table: TableNode;
    tablePath: Path;
    rowIndex: number;
    colIndex: number;
  },
): TablePastePlan | false {
  const fragmentRows = tableRows(config, fragment);
  const anchorRows = tableRows(config, anchor.table);
  const fragmentColCount = Math.max(...fragmentRows.map((row) => rowCells(config, row).length), 0);
  const tableColCount = Math.max(...anchorRows.map((row) => rowCells(config, row).length), 0);
  const grownColCount = Math.max(tableColCount, anchor.colIndex + fragmentColCount);
  const grownRowCount = Math.max(anchorRows.length, anchor.rowIndex + fragmentRows.length);

  const contentAt = (rowIndex: number, colIndex: number): CellNode | undefined => {
    const fragmentRow = fragmentRows[rowIndex - anchor.rowIndex];
    const fragmentCell = fragmentRow ? rowCells(config, fragmentRow)[colIndex - anchor.colIndex] : undefined;
    if (!fragmentCell) return undefined;

    const blocks = cellValue(config, fragmentCell);
    return blocks.length > 0
      ? ({
          ...fragmentCell,
          [config.valueField]: blocks,
        } as CellNode)
      : undefined;
  };

  const replacements: TablePastePlan["replacements"] = [];
  const cellAppends: TablePastePlan["cellAppends"] = [];
  const rowAppends: TablePastePlan["rowAppends"] = [];
  const contentTargets: Array<{
    cellPath: Path;
    blocks: Array<Record<string, unknown>>;
  }> = [];

  const buildCell = (fragmentCell: CellNode | undefined): CellNode => ({
    _type: config.cellType,
    _key: keyGenerator(),
    [config.valueField]: fragmentCell
      ? rekeyBlocks(keyGenerator, cellValue(config, fragmentCell) as Array<Record<string, unknown>>)
      : [emptyTextBlock(keyGenerator)],
  });

  let previousRowKey = anchorRows[anchorRows.length - 1]?._key;
  if (!previousRowKey) return false;

  for (let rowIndex = 0; rowIndex < grownRowCount; rowIndex++) {
    const existingRow = anchorRows[rowIndex];

    if (!existingRow) {
      const newCells: CellNode[] = [];
      const row: RowNode = {
        _type: config.rowType,
        _key: keyGenerator(),
        [config.cellsField]: newCells,
      };

      for (let colIndex = 0; colIndex < grownColCount; colIndex++) {
        const fragmentCell = contentAt(rowIndex, colIndex);
        const cellNode = buildCell(fragmentCell);
        newCells.push(cellNode);
        if (fragmentCell) {
          contentTargets.push({
            cellPath: cellPathFor(config, anchor.tablePath, row._key, cellNode._key),
            blocks: cellValue(config, cellNode) as Array<Record<string, unknown>>,
          });
        }
      }

      rowAppends.push({
        afterRowPath: [...anchor.tablePath, config.rowsField, { _key: previousRowKey }],
        row,
      });
      previousRowKey = row._key;
      continue;
    }

    const existingCells = rowCells(config, existingRow);
    let previousCellKey = existingCells[existingCells.length - 1]?._key;

    for (let colIndex = 0; colIndex < grownColCount; colIndex++) {
      const fragmentCell = contentAt(rowIndex, colIndex);
      const existingCell = existingCells[colIndex];

      if (existingCell) {
        if (fragmentCell) {
          const blocks = rekeyBlocks(
            keyGenerator,
            cellValue(config, fragmentCell) as Array<Record<string, unknown>>,
          );
          const cellPath = cellPathFor(config, anchor.tablePath, existingRow._key, existingCell._key);
          replacements.push({
            cellPath,
            originalBlockKeys: cellValue(config, existingCell).map((block) => block._key),
            blocks,
          });
          contentTargets.push({ cellPath, blocks });
        }
        continue;
      }

      if (!previousCellKey) return false;

      const cellNode = buildCell(fragmentCell);
      cellAppends.push({
        afterCellPath: [
          ...anchor.tablePath,
          config.rowsField,
          { _key: existingRow._key },
          config.cellsField,
          { _key: previousCellKey },
        ],
        cell: cellNode,
      });
      previousCellKey = cellNode._key;

      if (fragmentCell) {
        contentTargets.push({
          cellPath: cellPathFor(config, anchor.tablePath, existingRow._key, cellNode._key),
          blocks: cellValue(config, cellNode) as Array<Record<string, unknown>>,
        });
      }
    }
  }

  const first = contentTargets.find((target) => target.blocks.length > 0);
  const last = [...contentTargets].reverse().find((target) => target.blocks.length > 0);
  if (!first || !last) return false;

  const firstBlock = first.blocks[0] as { _key: string; children?: Array<{ text?: string }> };
  const lastBlock = last.blocks[last.blocks.length - 1] as {
    _key: string;
    children?: Array<{ text?: string }>;
  };

  const firstText = firstBlock.children?.[0]?.text ?? "";
  const lastText = lastBlock.children?.[lastBlock.children.length - 1]?.text ?? "";

  return {
    replacements,
    cellAppends,
    rowAppends,
    selection: {
      anchor: {
        path: [...first.cellPath, config.valueField, { _key: firstBlock._key }],
        offset: 0,
      },
      focus: {
        path: [...last.cellPath, config.valueField, { _key: lastBlock._key }],
        offset: lastText.length,
      },
    },
  };
}
