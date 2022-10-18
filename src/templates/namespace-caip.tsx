import React from "react";
import { Layout } from "../components/layout";
import { Link } from "gatsby";
import { Authors } from "../components/authors";
import { Discussions } from "../components/discussions";
import { IsoDay } from "../components/iso-day";
import { CaipsTr } from "../components/caips-tr";

export default function NamespaceCaip(props: any) {
  const pageContext = props.pageContext;
  const caip = props.pageContext.caip;
  return (
    <Layout>
      <table className={"frontmatter"}>
        <tbody>
          <tr>
            <th>Namespace</th>
            <td>
              <Link to={`/namespaces/${pageContext.namespace.name}`}>
                {pageContext.namespace.name}
              </Link>
            </td>
          </tr>
          <tr>
            <th>Identifier</th>
            <td>{caip.meta.namespace_identifier}</td>
          </tr>
          <tr>
            <th>Title</th>
            <td>{caip.meta.title}</td>
          </tr>
          <tr>
            <th>Authors</th>
            <td>
              <Authors authors={caip.meta.authors} />
            </td>
          </tr>
          <tr>
            <th>Discussions</th>
            <td>
              <Discussions discussions={caip.meta.discussionsTo} />
            </td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{caip.meta.status}</td>
          </tr>
          <tr>
            <th>Type</th>
            <td>{caip.meta.type}</td>
          </tr>
          <tr>
            <th>Created</th>
            <td>
              <IsoDay date={caip.meta.created} />
            </td>
          </tr>
          <tr>
            <th>Updated</th>
            <td>
              <IsoDay date={caip.meta.updated} />
            </td>
          </tr>
          <CaipsTr requires={caip.meta.requires} title={"Requires"} />
          <CaipsTr requires={caip.meta.replaces} title={"Replaces"} />
        </tbody>
      </table>
      <div dangerouslySetInnerHTML={{ __html: caip.markdowned }} />
    </Layout>
  );
}
