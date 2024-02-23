"use client";
import { Result, SearchPopularResults, TODO } from "@/types/deviantart";
import { useRouter, useSearchParams } from "next/navigation";
import React, { MutableRefObject, useEffect, useLayoutEffect } from "react";
import { KeyValuePair } from "tailwindcss/types/config";
import Pagination from "./Pagination";
import useSWR from "swr";
import Loading from "../loading";
import axios from "axios";

type Props = TODO;
const colSpanClass: KeyValuePair = {
  [1]: "md:col-span-1",
  [2]: "md:col-span-2",
  [3]: "md:col-span-3",
  [4]: "md:col-span-4",
  [5]: "md:col-span-5",
  [6]: "md:col-span-6",
};
export default function ImagesGrid({ results = [], grid, term, token }: Props) {
  let sum = React.useRef(0);

  const [dataResults, setDataResults] = React.useState<Result[]>(results);

  const searchParams = useSearchParams();
  const currentPage = searchParams.get(term)
    ? Number(searchParams.get(term))
    : 0;
  const [pageIndex, setPageIndex] = React.useState<number>(currentPage);
  const { data, isLoading } = useSWR<Result[]>(
    `/api/deviantArt/latest?${new URLSearchParams({
      q: term,
      offset: (pageIndex * 25).toString(),
      limit: "25",
      token,
    }).toString()}`,
    (results: any) => {
      // console.log("DeviantArt responded with:", results);
      // return results.results;
      return axios.get<any>(results).then((res) => {
        const params = new URLSearchParams(searchParams);
        params.set(term, pageIndex.toString());
        console.log("DeviantArt response", res.data.data.results);
        window.history.pushState({}, "", `?${params.toString()}`);
        return res.data.data.results;
      });
    },
    {},
  );
  useEffect(() => {
    sum.current = 0;
    return () => {
      sum.current = 0;
    };
  }, [data]);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          style={{
            display: "grid",
            // gridTemplateColumns: "repeat(5, minmax(128px, 1fr))",
            // gridAutoRows: "minmax(128px, auto)",
          }}
          className={` w-full gap-2 md:gap-1 md:grid-cols-8 sm:grid-cols-2`}
        >
          {(data ?? []).map((result: Result) => {
            return (
              <ImageItem
                result={result}
                grid={grid}
                sum={sum}
                key={result.deviationid}
              />
            );
          })}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        term={term}
        onChangePage={(change) => {
          setPageIndex(pageIndex + change);
        }}
        // changePage={(change) => {
        //   redirect(
        //     `/?${new URLSearchParams({
        //       ...searchParams,
        //       [term]: (currentPage + change).toString(),
        //     }).toString()}`,
        //     RedirectType.push,
        //   );
        // }}
      />
    </>
  );
}

const ImageItem = ({
  result,
  grid,
  sum,
}: {
  result: Result;
  grid: number;
  sum: MutableRefObject<number>;
}) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [colSpan, setColSpan] = React.useState<number>(0);
  useEffect(() => {
    const num = Math.floor(Math.random() * 10) + 1;
    let colSpan = (num % 3) + 1;
    // let colspan = num;
    sum.current += colSpan;
    if (sum.current >= grid) {
      colSpan = grid - sum.current + colSpan;
      sum.current = 0;
    }
    setColSpan(colSpan);
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current && isExpanded !== null)
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
  }, [isExpanded]);

  const ref = React.useRef<HTMLDivElement>(null);
  return !colSpan ? (
    <div className="w-full h-32 animate-pulse">
      <div className="w-full h-full bg-gray-300 rounded-lg dark:bg-gray-600 p-2">
        <h1 className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
      </div>
    </div>
  ) : (
    <div
      ref={ref}
      key={Math.random()}
      // key={result.deviationid}
      onClick={(e) => {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
      }}
      className={`relative transition-all animate-push-pull duration-100  rounded-lg bg-opacity-50 bg-gradient-to-br from-amber-500 via-yellow-100 to-yellow-700 p-0.5 flex flex-col items-center overflow-hidden cursor-pointer ${isExpanded ? "md:col-span-8" : colSpanClass[colSpan]} sm:col-span-full`}
    >
      <div
        // href={result.url}
        ref={containerRef}
        style={{
          backgroundImage: isExpanded ? "" : `url(${result.preview?.src})`,
          backgroundRepeat: "no-repeat",
        }}
        className="bg-cover flex flex-row-reverse w-full h-full gap-0.5 rounded-lg bg-black"
      >
        <img
          style={{
            height: isExpanded ? "640px" : "8rem",
            objectPosition: isExpanded ? "right" : "center",
          }}
          loading="lazy"
          className={` bg-cover ${isExpanded ? "" : "bg-black"}  bg-opacity-60 object-contain rounded-lg ${isExpanded ? "" : "max-h-32"} min-h-32 min-w-0 w-full`}
          src={result.preview?.src}
          alt=""
        />
        <div
          className={`rounded-lg basis-1/5 ${isExpanded ? "" : "hidden"} p-4 transition-all font-mono`}
        >
          <div className="space-x-1 text-xl font-bold text-gray-500">
            <span>{result.author.username}</span>
          </div>
          <span className="block mt-2 space-y-6">
            <h3 className="text-xl font-semibold leading-6 text-neutral-600">
              {result.title}
            </h3>
          </span>
        </div>
      </div>
    </div>
  );
};
