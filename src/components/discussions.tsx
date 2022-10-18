import React from "react";

export function Discussions(props: { discussions: string[] }) {
  const renderDiscussions = (discussions: string[]) => {
    const result: any[] = [];
    discussions.forEach((href, index) => {
      result.push(
        <a href={href} key={href}>
          {href}
        </a>
      );
      if (index !== discussions.length - 1) {
        result.push(<br key={Math.random()} />);
      }
    });
    return result;
  };
  return <>{renderDiscussions(props.discussions)}</>;
}
