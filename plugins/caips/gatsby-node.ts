import type { NodePluginArgs } from "gatsby";
import fsP from "node:fs/promises";
import grayMatter from "gray-matter";
import {
  authorsParsed,
  discussionLinks,
  execute,
  exists,
  markdownify,
} from "../util";

const CAIP_NODE_TYPE = "Caip";

const FILENAME = new URL(`file://${__filename}`);
const REPO_DIR = new URL("../../originals/CAIPs/", FILENAME);
const CAIPS_DIR = new URL("./CAIPs/", REPO_DIR);
const GITHUB_REPO_DIR = new URL(
  `https://github.com/ChainAgnostic/CAIPs/blob/master/`
);

export async function onPreInit() {
  const isCaipsDirPresent = await exists(REPO_DIR);
  if (!isCaipsDirPresent) {
    await execute(
      `git clone https://github.com/ChainAgnostic/CAIPs.git ${REPO_DIR.pathname}`
    );
  }
}

export async function sourceNodes(args: NodePluginArgs) {
  const createNode = args.actions.createNode;

  const files = await fsP.readdir(CAIPS_DIR);
  const filesP = files.map(async (relativeFilename) => {
    // for (const relativeFilename of files) {
    const filename = new URL(`./${relativeFilename}`, CAIPS_DIR);
    const relative = filename.href.replace(REPO_DIR.href, "./");
    const sourceURL = new URL(relative, GITHUB_REPO_DIR);
    const content = await fsP.readFile(filename, "utf-8");
    const matter = grayMatter(content);
    const meta = matter.data;
    let requires = [];
    if (meta.requires) {
      if (typeof meta.requires === "number") {
        requires.push(meta.requires);
      }
      if (typeof meta.requires === "string") {
        meta.requires.split(",").forEach((n) => {
          requires.push(Number(n));
        });
      }
    }
    const authors = authorsParsed(matter.data.author);

    const markdowned = await markdownify(matter.content, true);

    createNode({
      caip: meta.caip,
      meta: {
        ...meta,
        requires: requires,
        authors: authors,
        source: sourceURL.href,
        discussionsTo: discussionLinks(meta["discussions-to"]),
      },
      content: matter.content,
      markdowned: markdowned,
      id: args.createNodeId(`${CAIP_NODE_TYPE}-${meta.caip}`),
      parent: null,
      children: [],
      internal: {
        type: CAIP_NODE_TYPE,
        contentDigest: args.createContentDigest(matter),
      },
    });
    // }
  });
  await Promise.any(filesP);
}
