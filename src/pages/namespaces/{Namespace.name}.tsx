import React from "react";
import { graphql, HeadFC, HeadProps, Link, PageProps } from "gatsby";
import { Layout } from "../../components/layout";
import { Authors } from "../../components/authors";
import { IsoDay } from "../../components/iso-day";

function ReplacesCAIPs(props: { replaces: number[] }) {
  const elements: any = [];
  props.replaces.forEach((caipNumber, index) => {
    elements.push(
      <Link key={caipNumber} to={`/caips/${caipNumber}/`}>
        CAIP-{caipNumber}
      </Link>
    );
    if (index < props.replaces.length - 1) {
      elements.push(", ");
    }
  });

  return <>{elements}</>;
}

function CaipsAvailableTable(props: { caips: any[] }) {
  const sorted = props.caips.sort((a, b) => a.caip - b.caip);
  const rows = sorted.map((entry) => {
    return (
      <tr key={entry.caip}>
        <th>CAIP-{entry.caip}</th>
        <td>
          <Link to={`./caips/${entry.caip}/`}>{entry.meta.title}</Link>
        </td>
      </tr>
    );
  });
  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
}

export function NamespaceNamePage(props: PageProps<any>) {
  const data = props.data.namespace;
  return (
    <Layout>
      <table className={"frontmatter"}>
        <tbody>
          <tr>
            <th>Identifier</th>
            <td>{data.readme.meta.namespace_identifier}</td>
          </tr>
          <tr>
            <th>Title</th>
            <td>{data.readme.meta.title}</td>
          </tr>
          <tr>
            <th>Authors</th>
            <td>
              <Authors authors={data.readme.meta.authors} />
            </td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{data.readme.meta.status}</td>
          </tr>
          <tr>
            <th>Type</th>
            <td>{data.readme.meta.type}</td>
          </tr>
          <tr>
            <th>Created</th>
            <td>
              <IsoDay date={data.readme.meta.created} />
            </td>
          </tr>
          <tr>
            <th>Updated</th>
            <td>
              <IsoDay date={data.readme.meta.updated} />
            </td>
          </tr>
          <tr>
            <th>Replaces</th>
            <td>
              <ReplacesCAIPs replaces={data.readme.meta.replaces} />
            </td>
          </tr>
        </tbody>
      </table>

      <div dangerouslySetInnerHTML={{ __html: data.readme.markdowned }} />

      <section>
        <h1>CAIPs Available</h1>
        <CaipsAvailableTable caips={data.caips} />
      </section>
    </Layout>
  );
}

export default NamespaceNamePage;

export const Head: HeadFC = (props: HeadProps<any>) => {
  const namespaceName = props.data.namespace.name;
  return <title>{namespaceName} | Chain Agnostic Improvement Proposals</title>;
};

export const query = graphql`
  query ($name: String) {
    namespace(name: { eq: $name }) {
      name
      readme {
        meta {
          title
          namespace_identifier
          status
          type
          created
          updated
          replaces
          authors {
            name
            link
          }
        }
        markdowned
      }
      caips {
        caip
        meta {
          title
        }
      }
    }
  }
`;
