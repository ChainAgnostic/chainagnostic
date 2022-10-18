import React from "react";

const formatDay = (date: Date): string => {
  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export function IsoDay(props: { date: Date | string }) {
  const date = new Date(props.date);

  return <>{formatDay(date)}</>;
}
