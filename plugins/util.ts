import fsP from "node:fs/promises";
import { exec } from "node:child_process";
import remark from "remark";
import remarkSlug from "remark-slug";
import remarkAutolinkHeadings from "remark-autolink-headings";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export async function exists(filepath: URL): Promise<boolean> {
  try {
    await fsP.access(filepath);
    return true;
  } catch {
    return false;
  }
}

export async function execute(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      error ? reject(error) : resolve(stdout);
    });
  });
}

export async function markdownify(
  content: string,
  toc: boolean = false
): Promise<string> {
  const effectiveContent = toc ? `## Table Of Contents\n${content}` : content;
  return remark()
    .use(remarkSlug)
    .use(remarkAutolinkHeadings)
    .use(remarkToc, { tight: true })
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(effectiveContent)
    .then((result) => result.contents) as Promise<string>;
}

export function discussionLinks(discussionsTo?: string): string[] {
  if (discussionsTo) {
    return discussionsTo.split(",").map((r) => r.trim());
  } else {
    return [];
  }
}

export function authorsParsed(
  author?: string
): Array<{ name: string; link: string | null }> {
  const authors = [];
  if (!author) return []
  const authorsOriginal: string[] = author?.split(",") || [];
  for (const a of authorsOriginal) {
    const withEmail = a.match(/([\w\s]+)<([\w@\\.]+)>\s*/);
    if (withEmail) {
      authors.push({
        name: withEmail[1].trim(),
        link: `mailto:${withEmail[2]}`,
      });
    } else {
      const withGithub = a.match(/([\w\s]+)\((@[\w\-_\\.]+)\)/);
      if (withGithub) {
        const handle = withGithub[2].replace(/@/, "");
        authors.push({
          name: withGithub[1].trim(),
          link: `https://github.com/${handle}`,
        });
      } else {
        authors.push({
          name: a.trim(),
          link: null,
        });
      }
    }
  }
  return authors;
}
