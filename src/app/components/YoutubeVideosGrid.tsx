"use client";
import { Item } from "@/types/youtube";
import React, { useState } from "react";

type Props = {
  results: Item[];
};

export default function VideosGrid({ results }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-center"
    >
      {results.map((result: Item) => {
        return <VideoItem result={result} key={result.id.videoId} />;
      })}
    </div>
  );
}

const VideoItem = ({ result }: { result: Item }) => {
  const [isExpanded, setIsExpanded] = useState<boolean | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (containerRef.current && isExpanded !== null)
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [isExpanded]);
  return (
    <div
      className={`rounded-lg overflow-x-clip overflow-y-clip w-full ${isExpanded ? "lg:col-span-2" : "lg:col-span-1"}  col-span-1 bg-gradient-to-br from-amber-500 via-yellow-100 to-yellow-700 p-0.5`}
    >
      <div
        ref={containerRef}
        className={`bg-black w-full h-full flex gap-1 ${isExpanded ? "items-start" : "items-center"} rounded ${isExpanded ? "flex-row" : "flex-col"}`}
      >
        <img
          loading="lazy"
          src={result.snippet.thumbnails.high.url}
          className={`w-auto rounded-lg cursor-pointer thumbnail transition-all h-auto object-cover ${isExpanded ? "hidden" : ""}`}
          width="640"
          height="360"
          onClick={() => setIsExpanded((prev) => !prev)}
        />
        <iframe
          loading="lazy"
          className={`rounded-tl-lg rounded-bl-lg w-full ${isExpanded ? "" : "hidden"}`}
          src={`https://www.youtube.com/embed/${result.id.videoId}`}
          width="640"
          height="360"
          allow="autoplay; fullscreen; picture-in-picture"
        ></iframe>
        <div
          className={`p-4 mb-1 w-full flex flex-col ${isExpanded ? "gap-2" : "gap-1"} font-mono text-white ${isExpanded ? "basis-1/3" : ""}`}
        >
          <a
            className="text-sm text-ellipsis font-semibold capitalize"
            href={`https://www.youtube.com/watch?v=${result.id.videoId}`}
          >
            {result.snippet.title}
          </a>
          <div className="text-xs font-thin">{result.snippet.description}</div>
          {isExpanded && (
            <div
              onClick={() => setIsExpanded((prev) => !prev)}
              className=" hover:bg-emerald-300 hover:border-0 hover:text-gray-800 p-4 flex justify-center rounded border-white text-white border-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
