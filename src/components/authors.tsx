import React from "react";

export function Authors(props: {authors: any[]}) {
    const renderAuthor = (author: any) => {
        if (author.link) {
            return (
                <a href={author.link} key={author.name}>
                    {author.name}
                </a>
            );
        } else {
            return <span key={author.name}>{author.name}</span>;
        }
    };

    const renderAuthors = (authors: any[]) => {
        let result: any[] = [];
        authors.forEach((author, index) => {
            result.push(renderAuthor(author));
            if (index !== (authors.length - 1)) {
                result.push(", ");
            }
        });
        return result;
    };
    return <>{renderAuthors(props.authors)}</>
}
