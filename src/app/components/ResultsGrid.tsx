"use client";
import { Result } from "@/types/deviantart";
import { Item } from "@/types/youtube";
import { Item as GoogleSearchItem } from "@/types/google";
import React from "react";
import ImagesGrid from "./DeviantArtGrid";
import VideosGrid from "./YoutubeVideosGrid";
import { Gallery } from "@/types/imgur";
import ImgurGalleryGrid from "./ImgurGalleryGrid";
import Google from "next-auth/providers/google";
import GoogleImageSearchGrid from "./GoogleImageSearchGrid";

type Props = {
  results?: Result[];
  videoResults?: Item[];
  galleryResults?: Gallery[];
  googleResults?: GoogleSearchItem[];
  term: string;
  grid: number;
};

export default function ResultsGrid({
  results,
  videoResults,
  galleryResults,
  googleResults,
  term,
  grid,
}: Props) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  return (
    <div className="flex flex-col border-emerald-200 border-2 bg-black bg-opacity-30 rounded-lg p-2 mb-2">
      <div
        onClick={(e) => {
          setIsExpanded((prev) => !prev);
          // const content = document.getElementById(
          //   `${term.split(" ").join("_")}_content`,
          // );
          // if (content) {
          //   content.classList.toggle("grid-rows-1");
          //   content.classList.toggle("grid-rows-none");
          // }
        }}
        id={`${term.split(" ").join("_")}_title`}
        className="cursor-pointer font-2xl font-semibold  flex justify-between items-center"
      >
        <div className="bg-gradient-to-br from-amber-500 via-yellow-100 to-yellow-700 p-4 text-transparent bg-clip-text capitalize">
          {term}
        </div>
        <div
          className={`${
            isExpanded ? "transform rotate-180" : "transform rotate-0"
          } text-emerald-200 transition-transform duration-500 ease-in-out p-2`}
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
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
      <div
        style={{
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          transition:
            "grid-template-rows 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        }}
        className="grid transition-all w-full"
        id={`${term.split(" ").join("_")}_content`}
      >
        <div className=" overflow-hidden flex flex-col gap-2">
          <ImagesGrid
            results={results ?? []}
            grid={grid}
            key={`${term}_deviantart`}
          />
          {/* <ImgurGalleryGrid
            results={galleryResults ?? []}
            grid={6}
            key={`${term}_imgur`}
          /> */}
          <GoogleImageSearchGrid
            results={googleResults ?? []}
            key={`${term}_google`}
            grid={grid}
          />
          <VideosGrid
            results={(videoResults ?? []).slice(0, 10)}
            key={`${term}_youtube`}
          />
        </div>
      </div>
    </div>
  );
}
