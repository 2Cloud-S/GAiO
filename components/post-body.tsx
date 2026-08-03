import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import { resolveImageUrl } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = resolveImageUrl(value, (b) => b.width(1200));
      if (!url) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="prose-image"
          src={url}
          alt={typeof value?.alt === "string" ? value.alt : ""}
        />
      );
    },
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
