import React from "react";
import { graphql, HeadFC, HeadProps, Link, PageProps } from "gatsby";
import { Layout } from "../../components/layout";
// @ts-ignore
import SourceIcon from "../../assets/source-icon.svg";
import { Authors } from "../../components/authors";
import { IsoDay } from "../../components/iso-day";
import { Discussions } from "../../components/discussions";
import { CaipsTr } from "../../components/caips-tr";

export default function CaipCaip(props: PageProps<any>) {
  const monthFormatDate = (date: Date): string => {
    return date.toLocaleDateString(`en-US`, { year: "numeric", month: "long" });
  };

  const caip = props.data.caip;
  return (
    <Layout>
      <h1>
        CAIP-{caip.caip}: {caip.meta.title}&nbsp;
        <Link to={caip.meta.source}>
          <SourceIcon className={"inline"} />
        </Link>
      </h1>
      <table className={"frontmatter"}>
        <tbody>
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
        </tbody>
      </table>

      <div dangerouslySetInnerHTML={{ __html: caip.markdowned }} />

      <h2>Citation</h2>
      <p>Please cite this document as:</p>
      <p>
        {caip.meta.authors.map((a: any) => a.name).join(", ")}, "CAIP-
        {caip.caip}: {caip.meta.title}",{" "}
        <em>Chain Agnostic Improvement Proposals</em>, no. {caip.caip},{" "}
        {monthFormatDate(new Date(caip.meta.created))}. [Online serial].
        Available: {caip.meta.source}
      </p>
    </Layout>
  );
}

export const query = graphql`
  query ($caip: Int) {
    caip(caip: { eq: $caip }) {
      caip
      meta {
        title
        source
        discussionsTo
        status
        type
        created
        updated
        requires
        authors {
          name
          link
        }
      }
      markdowned
    }
  }
`;

export const Head: HeadFC = (props: HeadProps<any>) => {
  const caipTitle = props.data.caip.meta.title;
  return <title>{caipTitle} | Chain Agnostic Improvement Proposals</title>;
};
