import type { CreatePagesArgs, NodePluginArgs } from "gatsby";
import {
  authorsParsed,
  discussionLinks,
  execute,
  exists,
  markdownify,
} from "../util";
import fsP from "node:fs/promises";
import grayMatter from "gray-matter";
import * as path from "node:path";

const NODE_TYPE = "Namespace";
const NAMESPACE_CAIP_NODE_TYPE = "NamespaceCaip";

const FILENAME = new URL(`file://${__filename}`);
const REPO_DIR = new URL("../../originals/namespaces/", FILENAME);

export async function onPreInit() {
  const isDirPresent = await exists(REPO_DIR);
  if (!isDirPresent) {
    await execute(
      `git clone https://github.com/ukstv/namespaces.git ${REPO_DIR.pathname} && cd ${REPO_DIR.pathname} && git checkout su/editorial-harmonize`
    );
  }
}

function caipNameToNumber(input: string[]): number[] {
  return input.map((r) => Number(r.replace(`CAIP-`, "")));
}

export async function sourceNodes(args: NodePluginArgs) {
  const createNode = args.actions.createNode;
  const files = await fsP.readdir(REPO_DIR);
  for (const relativeFilename of files) {
    if (relativeFilename.startsWith(`.`) || relativeFilename === "template")
      continue;
    const absoluteFilename = new URL(`./${relativeFilename}`, REPO_DIR);
    const stat = await fsP.stat(absoluteFilename);
    if (!stat.isDirectory()) continue;
    const absoluteDir = new URL(`${absoluteFilename}/`);
    const readmeFilepath = new URL("./README.md", absoluteDir);
    const readmeMatter = await fsP
      .readFile(readmeFilepath, "utf-8")
      .then(grayMatter);

    const filesInDir = await fsP.readdir(absoluteDir);
    const caipsImplemented = [];
    for (const relativeFileInDir of filesInDir) {
      const match = relativeFileInDir.match(/^caip\-?(\d+).md/);
      if (match) {
        const caipContent = await fsP.readFile(
          new URL(`./${relativeFileInDir}`, absoluteDir)
        );
        const matter = grayMatter(caipContent);
        const markdowned = await markdownify(matter.content, false);
        const requiresCAIPs: string[] =
          typeof matter.data.requires === "string"
            ? [matter.data.requires]
            : matter.data.requires;

        let replacesCAIPs: string[] = [];
        if (matter.data.replaces) {
          if (typeof matter.data.replaces === "string") {
            replacesCAIPs.push(matter.data.replaces);
          } else {
            replacesCAIPs = matter.data.replaces;
          }
        }
        const discussionsTo =
          typeof matter.data["discussions-to"] === "string"
            ? [matter.data["discussions-to"]]
            : matter.data["discussions-to"];
        const meta = {
          ...matter.data,
          authors: authorsParsed(matter.data.author),
          replaces: caipNameToNumber(replacesCAIPs),
          "discussions-to": null,
          discussionsTo: discussionsTo,
          requires: caipNameToNumber(requiresCAIPs),
        };
        caipsImplemented.push({
          caip: Number(match[1]),
          meta: meta,
          markdowned: markdowned,
        });
      }
    }

    let replacedCAIPs: string[] = [];
    if (readmeMatter.data.replaces) {
      if (typeof readmeMatter.data.replaces === "string") {
        replacedCAIPs.push(readmeMatter.data.replaces);
      } else {
        replacedCAIPs = readmeMatter.data.replaces;
      }
    }
    const replaces = replacedCAIPs.map((r) => Number(r.replace(`CAIP-`, "")));
    const nodeId = args.createNodeId(`${NODE_TYPE}-${relativeFilename}`);

    const caipNodes: string[] = [];
    caipsImplemented.forEach((caip: any) => {
      const id = args.createNodeId(
        `${NAMESPACE_CAIP_NODE_TYPE}-${relativeFilename}-${caip.caip}`
      );
      createNode({
        ...caip,
        id: id,
        caipN: caip.caip,
        namespace: relativeFilename,
        internal: {
          type: NAMESPACE_CAIP_NODE_TYPE,
          contentDigest: args.createContentDigest(caip),
        },
      });
      caipNodes.push(id);
    });

    createNode({
      name: relativeFilename,
      readme: {
        meta: {
          ...readmeMatter.data,
          replaces: replaces,
          authors: authorsParsed(readmeMatter.data.author),
          discussionsTo: discussionLinks(readmeMatter.data["discussions-to"]),
        },
        markdowned: await markdownify(readmeMatter.content, false),
      },
      id: nodeId,
      caips: caipsImplemented,
      internal: {
        type: NODE_TYPE,
        contentDigest: args.createContentDigest(relativeFilename),
      },
    });
  }
}

export async function createPages(args: CreatePagesArgs) {
  const template = path.resolve("src/templates/namespace-caip.tsx");

  const namespaceNodes = await args
    .graphql(
      `
    query {
      allNamespace {
        nodes {
          name
          caips {
            caip
            markdowned
            meta {
              namespace_identifier
              title
              discussionsTo
              status
              type
              created
              updated
              requires
              replaces
              authors {
                name 
                link
              }
            }
          }
        }
      }
    }
  `
    )
    .then((r: any) => r.data.allNamespace.nodes);
  namespaceNodes.forEach((namespaceNode: any) => {
    namespaceNode.caips.forEach((caip: any) => {
      args.actions.createPage({
        path: `/namespaces/${namespaceNode.name}/caips/${caip.caip}`,
        component: template,
        context: {
          namespace: namespaceNode,
          caip: caip,
        },
      });
    });
  });
}
