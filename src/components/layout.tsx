import React, { PropsWithChildren } from "react";
import { Link } from 'gatsby'
// @ts-ignore
import GithubIcon from "../assets/icons8-github-48.svg";

export function Layout(props: PropsWithChildren) {
  return (
    <>
      <div className={"w-full border-b border-slate-200 mb-4"}>
        <div
          className={
            "mx-auto max-w-screen-md md:flex py-2 justify-between md:flex-wrap px-4 sm:px-0"
          }
        >
          <div className={"text-2xl text-center text-neutral-600 flex justify-center flex-col"}>
            <Link to={"/"} className={"normal-like"}>
            Chain Agnostic Improvement Proposals
            </Link>
          </div>
          <div className={"flex flex-nowrap gap-x-4 my-2 justify-center"}>
            <div className={"flex flex-col h-full justify-center"}>
              <Link to={"/"} className={"menu-item"}>
                CAIPs
              </Link>
            </div>
            <div className={"flex flex-col h-full justify-center"}>
              <Link to={"/namespaces"} className={"menu-item"}>
                Namespaces
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={"container mx-auto max-w-screen-md px-4 md:px-0"}>
      {props.children}
      </div>

      <div className={"w-full border-t border-slate-200 mt-4"}>
        <div
          className={
            "mx-auto max-w-screen-md md:flex py-2 justify-between md:flex-wrap px-4 md:px-0"
          }
        >
          <div>
            <a
              href={"https://github.com/ChainAgnostic"}
              className={"no-underline leading-8"}
            >
              <GithubIcon width={"24"} className={"inline-block pb-0.5"} />{" "}
              ChainAgnostic
            </a>
          </div>
          <div className={"max-w-lg text-gray-400"}>
            Chain Agnostic Improvement Proposals (CAIPs) describe standards for
            blockchain projects that are not specific to a single chain.
          </div>
        </div>
      </div>
    </>
  );
}
