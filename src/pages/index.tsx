import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import {graphql, Link} from "gatsby";
import { Layout } from "../components/layout";
import {Authors} from "../components/authors";

const IndexPage = (props: PageProps<any>) => {
  const entries = props.data.allCaip.edges.map((edge: any) => edge.node);

  const renderTable = (status: string) => {
    const entriesForStatus = entries.filter((entry: any) => {
      return entry.meta.status.toLowerCase() == status.toLowerCase();
    });

    const rows = entriesForStatus.map((entry: any) => {
      return (
        <tr key={entry.caip}>
          <td className={"number"}>
            <Link to={`/caips/${entry.caip}/`}>
            {entry.caip}
            </Link>
          </td>
          <td>
            <Link to={`/caips/${entry.caip}/`} className={"ordinary"}>
              {entry.meta.title}</Link></td>
          <td><Authors authors={entry.meta.authors} /></td>
        </tr>
      );
    });

    return (
      <section className={"pb-6"}>
        <h2 className={"text-2xl font-bold pb-2"}>{status}</h2>
        <table className={"caips-table"}>
          <thead>
            <tr>
              <th className={"number"}>Number</th>
              <th>Title</th>
              <th className={"author"}>Authors</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </section>
    );
  };

  return <Layout>
    {renderTable("Draft")}
    {renderTable("Final")}
    {renderTable("Active")}
  </Layout>;
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home | Chain Agnostic Improvement Proposals</title>;

export const query = graphql`
  query {
    allCaip(sort: { fields: caip }) {
      edges {
        node {
          caip
          meta {
            title
            type
            status
            updated
            authors {
              link
              name
            }
          }
        }
      }
    }
  }
`;
