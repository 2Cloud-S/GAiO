import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import { resolveImageUrl } from "@/sanity/lib/image";

type TableCell = {
  _key?: string;
  _type?: string;
  value?: PortableTextBlock[];
};

type TableRow = {
  _key?: string;
  _type?: string;
  cells?: TableCell[];
};

type TableValue = {
  caption?: string;
  headerRows?: number;
  rows?: TableRow[];
};

type CalloutValue = {
  tone?: string;
  title?: string;
  body?: string;
};

type CodeValue = {
  code?: string;
  language?: string;
  filename?: string;
};

type StatsItem = {
  _key?: string;
  value?: string;
  label?: string;
  detail?: string;
};

type StatsRowValue = {
  items?: StatsItem[];
};

/** Minimal marks for nested table cell Portable Text (avoid recursive custom types). */
const cellComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="prose-table-cell-p">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="prose-underline">{children}</span>,
    "strike-through": ({ children }) => <s className="prose-strike">{children}</s>,
    code: ({ children }) => <code className="prose-code">{children}</code>,
    highlight: ({ children }) => <mark className="prose-highlight">{children}</mark>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http") || href.startsWith("//");
      const blank = value?.blank !== false && external;
      return (
        <a
          className="prose-link"
          href={href}
          rel={external ? "noreferrer noopener" : undefined}
          target={blank ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="prose-list">{children}</ul>,
    number: ({ children }) => <ol className="prose-list prose-list-ordered">{children}</ol>,
  },
};

function TableBlock({ value }: { value: TableValue }) {
  const rows = Array.isArray(value?.rows) ? value.rows : [];
  if (!rows.length) return null;

  const headerRows = Math.max(0, Math.min(Number(value.headerRows) || 0, rows.length));
  const head = rows.slice(0, headerRows);
  const body = rows.slice(headerRows);

  const renderCells = (row: TableRow, asHeader: boolean) =>
    (row.cells ?? []).map((cell, index) => {
      const Tag = asHeader ? "th" : "td";
      const key = cell._key ?? `${row._key ?? "row"}-${index}`;
      const content = Array.isArray(cell.value) && cell.value.length > 0 ? (
        <PortableText value={cell.value} components={cellComponents} />
      ) : null;
      return (
        <Tag key={key} className={asHeader ? "prose-th" : "prose-td"} scope={asHeader ? "col" : undefined}>
          {content}
        </Tag>
      );
    });

  return (
    <figure className="prose-table-figure">
      <div className="prose-table-scroll" role="region" aria-label={value.caption || "Data table"} tabIndex={0}>
        <table className="prose-table">
          {head.length > 0 ? (
            <thead>
              {head.map((row, i) => (
                <tr key={row._key ?? `head-${i}`}>{renderCells(row, true)}</tr>
              ))}
            </thead>
          ) : null}
          {body.length > 0 ? (
            <tbody>
              {body.map((row, i) => (
                <tr key={row._key ?? `body-${i}`}>{renderCells(row, false)}</tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </div>
      {value.caption ? <figcaption className="prose-caption">{value.caption}</figcaption> : null}
    </figure>
  );
}

function CalloutBlock({ value }: { value: CalloutValue }) {
  const tone = ["note", "tip", "warning", "important"].includes(String(value?.tone))
    ? String(value.tone)
    : "note";
  const title =
    (typeof value?.title === "string" && value.title.trim()) ||
    tone.charAt(0).toUpperCase() + tone.slice(1);
  const body = typeof value?.body === "string" ? value.body : "";
  if (!body) return null;

  return (
    <aside className={`prose-callout prose-callout-${tone}`} data-tone={tone}>
      <p className="prose-callout-label">{title}</p>
      <p className="prose-callout-body">{body}</p>
    </aside>
  );
}

function CodeBlock({ value }: { value: CodeValue }) {
  const code = typeof value?.code === "string" ? value.code : "";
  if (!code) return null;
  const language = typeof value?.language === "string" ? value.language : "";
  const filename = typeof value?.filename === "string" ? value.filename : "";

  return (
    <figure className="prose-codeblock">
      {(filename || language) && (
        <figcaption className="prose-codeblock-meta">
          {filename ? <span className="prose-codeblock-filename">{filename}</span> : null}
          {language ? <span className="prose-codeblock-lang">{language}</span> : null}
        </figcaption>
      )}
      <pre className="prose-pre">
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>
    </figure>
  );
}

function StatsRowBlock({ value }: { value: StatsRowValue }) {
  const items = Array.isArray(value?.items) ? value.items : [];
  if (!items.length) return null;

  return (
    <dl className="prose-stats">
      {items.map((item, i) => (
        <div key={item._key ?? `stat-${i}`} className="prose-stat">
          <dt className="prose-stat-value">{item.value}</dt>
          <dd className="prose-stat-label">{item.label}</dd>
          {item.detail ? <p className="prose-stat-detail">{item.detail}</p> : null}
        </div>
      ))}
    </dl>
  );
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = resolveImageUrl(value, (b) => b.width(1200));
      if (!url) return null;
      const alt = typeof value?.alt === "string" ? value.alt : "";
      const caption = typeof value?.caption === "string" ? value.caption : "";
      return (
        <figure className="prose-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="prose-image" src={url} alt={alt} />
          {caption ? <figcaption className="prose-caption">{caption}</figcaption> : null}
        </figure>
      );
    },
    table: ({ value }) => <TableBlock value={value as TableValue} />,
    callout: ({ value }) => <CalloutBlock value={value as CalloutValue} />,
    code: ({ value }) => <CodeBlock value={value as CodeValue} />,
    horizontalRule: () => <hr className="prose-hr" />,
    statsRow: ({ value }) => <StatsRowBlock value={value as StatsRowValue} />,
  },
  block: {
    h1: ({ children }) => <h1 className="prose-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="section-title prose-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="prose-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="prose-h4">{children}</h4>,
    h5: ({ children }) => <h5 className="prose-h5">{children}</h5>,
    h6: ({ children }) => <h6 className="prose-h6">{children}</h6>,
    normal: ({ children }) => <p>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="prose-quote">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="prose-list">{children}</ul>,
    number: ({ children }) => <ol className="prose-list prose-list-ordered">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="prose-underline">{children}</span>,
    "strike-through": ({ children }) => <s className="prose-strike">{children}</s>,
    code: ({ children }) => <code className="prose-code">{children}</code>,
    highlight: ({ children }) => <mark className="prose-highlight">{children}</mark>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http") || href.startsWith("//");
      const blank = value?.blank !== false && external;
      return (
        <a
          className="prose-link"
          href={href}
          rel={external ? "noreferrer noopener" : undefined}
          target={blank ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
    citation: ({ children, value }) => {
      const source = typeof value?.source === "string" ? value.source : "";
      const url = typeof value?.url === "string" ? value.url : "";
      const label = (
        <>
          {children}
          {source ? (
            <span className="prose-citation-source">
              {" "}
              — {url ? (
                <a className="prose-link" href={url} rel="noreferrer noopener" target="_blank">
                  {source}
                </a>
              ) : (
                source
              )}
            </span>
          ) : null}
        </>
      );
      return <cite className="prose-citation">{label}</cite>;
    },
  },
};

export function PostBody({
  value,
}: {
  value: PortableTextBlock[] | string[] | undefined;
}) {
  if (!value?.length) return null;

  if (typeof value[0] === "string") {
    return (
      <>
        {(value as string[]).map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </>
    );
  }

  return <PortableText value={value as PortableTextBlock[]} components={components} />;
}
