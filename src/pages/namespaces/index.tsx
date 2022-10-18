import React from "react";
import { graphql, HeadFC, Link, PageProps } from "gatsby";
import { Layout } from "../../components/layout";

function NamespacesPage(props: PageProps<any>) {
  const nodes = props.data.allNamespace.edges.map((edge: any) => edge.node);
  const uniqueCaips: Set<number> = nodes.reduce(
    (acc: Set<number>, node: any) => {
      node.caips.forEach((c: any) => {
        acc.add(c.caip);
      });
      return acc;
    },
    new Set<number>()
  );
  const sortedCaips = Array.from(uniqueCaips).sort((a, b) => a - b);
  const thElements = sortedCaips.map((caipNumber) => {
    return (
      <th key={caipNumber} className={"w-28"}>
        <Link to={`/caips/${caipNumber}/`}>CAIP-{caipNumber}</Link>
        {/*TODO Hint on what it is*/}
      </th>
    );
  });
  const caipsPerNode = (node: any) => {
    const implemented = node.caips.map((c: any) => c.caip);
    return sortedCaips.map((caipNumber) => {
      if (implemented.includes(caipNumber)) {
        return (
          <td key={caipNumber} className={"text-center"}>
            <Link
              to={`/namespaces/${node.name}/caips/${caipNumber}/`}
              className={"normal-like"}
            >
              ✓
            </Link>
          </td>
        );
      } else {
        return (
          <td key={caipNumber} className={"text-center text-gray-300"}>
            -
          </td>
        );
      }
    });
  };
  const tbodyElements = nodes.map((node: any) => {
    return (
      <tr key={node.name}>
        <td className={"text-right"}>
          <Link to={`/namespaces/${node.name}/`}>{node.name}</Link>
        </td>
        {caipsPerNode(node)}
      </tr>
    );
  });
  return (
    <Layout>
      <h1>Namespaces</h1>
      <table>
        <thead>
          <tr>
            <th>Namespace</th>
            {thElements}
          </tr>
        </thead>
        <tbody>{tbodyElements}</tbody>
      </table>
    </Layout>
  );
}

export default NamespacesPage;

export const Head: HeadFC = () => (
  <title>Namespaces | Chain Agnostic Improvement Proposals</title>
);

export const query = graphql`
  query {
    allNamespace(sort: { fields: name }) {
      edges {
        node {
          name
          caips {
            caip
          }
        }
      }
    }
  }
`;
