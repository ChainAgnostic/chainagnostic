import React from "react";
import { Link } from "gatsby";

export function CaipsTr(props: { requires: number[]; title: string }) {
  if (props.requires && props.requires.length > 0) {
    const requiredCAIPs: any = [];
    props.requires.forEach((r: number, index: number) => {
      requiredCAIPs.push(
        <Link key={`caip-${r}`} to={`/caips/${r}`}>
          CAIP-{r}
        </Link>
      );
      if (index < props.requires.length - 1) {
        requiredCAIPs.push(", ");
      }
    });
    return (
      <tr>
        <th>{props.title}</th>
        <td>{requiredCAIPs}</td>
      </tr>
    );
  }
  return null;
}
