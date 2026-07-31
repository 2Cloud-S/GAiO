import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1200).url();
      if (!url) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={typeof value?.alt === "string" ? value.alt : ""}
          style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)" }}
        />
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="section-title">{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    normal: ({ children }) => <p>{children}</p>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const rel = href.startsWith("http") ? "noreferrer noopener" : undefined;
      return (
        <a href={href} rel={rel}>
          {children}
        </a>
      );
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
