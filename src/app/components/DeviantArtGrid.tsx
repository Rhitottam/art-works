"use client";
import { Result, SearchPopularResults, TODO } from "@/types/deviantart";
import { useRouter, useSearchParams } from "next/navigation";
import React, { MutableRefObject, useEffect, useLayoutEffect } from "react";
import { KeyValuePair } from "tailwindcss/types/config";
import Pagination from "./Pagination";
import useSWR from "swr";
import Loading from "../loading";
import axios from "axios";
import { cn } from "@/src/lib/utils";

type Props = {
  results?: Result[];
  grid: number;
  term: string;
  token: string;
};
const colSpanClass: KeyValuePair = {
  [1]: "md:col-span-1",
  [2]: "md:col-span-2",
  [3]: "md:col-span-3",
  [4]: "md:col-span-4",
  [5]: "md:col-span-5",
  [6]: "md:col-span-6",
};
const rowSpanClass: KeyValuePair = {
  [1]: "md:row-span-1",
  [2]: "md:row-span-2",
  [3]: "md:row-span-3",
  [4]: "md:row-span-4",
  [5]: "md:row-span-5",
  [6]: "md:row-span-6",
};
export default function ImagesGrid({ results = [], grid, term, token }: Props) {
  const sum = React.useRef(0);
  const sections = React.useRef<number[]>([grid]);
  const nextSections = React.useRef<number[]>([0]);
  const searchParams = useSearchParams();
  const currentPage = React.useRef<number>(
    searchParams.get(term) ? Number(searchParams.get(term)) : 0,
  );
  const [pageIndex, setPageIndex] = React.useState<number>(currentPage.current);
  const { data, isLoading } = useSWR<Result[]>(
    [`/api/deviantArt/latest`, term, pageIndex, token],
    async ([url, term, pageIndex, token]: string[]) => {
      const requestUrl = `${url}?${new URLSearchParams({
        q: term ?? undefined,
        offset: (Number(pageIndex ?? 0) * 25).toString(),
        limit: "25",
        token,
      }).toString()}`;
      return await axios.get<any>(requestUrl).then((res) => {
        const params = new URLSearchParams(searchParams);
        params.set(term, pageIndex.toString());
        console.log("DeviantArt response", res.data.data.results);
        window.history.pushState({}, "", `?${params.toString()}`);
        return res.data.data.results;
      });
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );
  useEffect(() => {
    sum.current = 0;
    sections.current = [grid];
    nextSections.current = [0];
    return () => {
      sum.current = 0;
      sections.current = [grid];
      nextSections.current = [0];
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
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
            gridTemplateRows: "repeat(auto-fit, 16rem)",
            gridAutoFlow: "dense",
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
                sections={sections}
                nextSections={nextSections}
              />
            );
          })}
        </div>
      )}
      <Pagination
        currentPage={pageIndex}
        term={term}
        onChangePage={(change) => {
          setPageIndex((prev) => prev + change);
        }}
      />
    </>
  );
}

const ImageItem = ({
  result,
  grid,
  sum,
  sections,
  nextSections,
}: {
  result: Result;
  grid: number;
  sum: MutableRefObject<number>;
  sections?: MutableRefObject<number[]>;
  nextSections?: MutableRefObject<number[]>;
}) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [colSpan, setColSpan] = React.useState<number>(0);
  const [rowSpan, setRowSpan] = React.useState<number>(0);

  useEffect(() => {
    if (sections?.current) {
      const width = result.preview?.width ?? 0;
      const height = result.preview?.height ?? 0;
      const aspectRatio = height === 0 ? 1 : width / height;
      let row = aspectRatio < 0.75 ? 2 : 1;
      let col = aspectRatio > 1.5 ? 2 : 1;
      if (row === col && Math.floor(Math.random() * 10) % 2 === 0) {
        row = 2;
        col = 2;
      }
      setColSpan(col);
      setRowSpan(row);
    }
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
      key={result.deviationid}
      // key={result.deviationid}
      onClick={(e) => {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
      }}
      className={cn(
        `relative transition-all  duration-100  rounded-lg bg-opacity-50 bg-gradient-to-br from-amber-500 via-yellow-100 to-yellow-700 p-0.5 flex flex-col items-center overflow-hidden cursor-pointer ${isExpanded ? "md:col-span-8" : colSpanClass[colSpan]} ${isExpanded ? "md:row-span-2" : rowSpanClass[rowSpan]} sm:col-span-full`,
        {
          "animate-push-pull-once": isExpanded,
          "animate-pop-once": !isExpanded,
        },
      )}
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
            height: isExpanded ? "32rem" : "auto",
            objectPosition: isExpanded ? "top" : "center",
          }}
          loading="lazy"
          className={` bg-cover ${isExpanded ? "" : "bg-black"}  bg-opacity-60 object-contain rounded-lg min-h-32 min-w-0 w-full`}
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
