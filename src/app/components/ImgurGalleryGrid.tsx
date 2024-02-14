import { Gallery } from "@/types/imgur";
import React, { MutableRefObject } from "react";

type Props = {
  results: Gallery[];
  grid: number;
};
const colSpanClass: Record<number, string> = {
  [1]: "md:col-span-1",
  [2]: "md:col-span-2",
  [3]: "md:col-span-3",
  [4]: "md:col-span-4",
  [5]: "md:col-span-5",
  [6]: "md:col-span-6",
};
export default function ImgurGalleryGrid({ results, grid }: Props) {
  let sum = React.useRef(0);
  React.useEffect(() => {
    sum.current = 0;
    return () => {
      sum.current = 0;
    };
  }, [results]);
  return (
    <div
      style={{
        display: "grid",
        // gridTemplateColumns: "repeat(5, minmax(128px, 1fr))",
        // gridAutoRows: "minmax(128px, auto)",
      }}
      className={` w-full gap-2 md:gap-1 md:grid-cols-6 sm:grid-cols-2`}
    >
      {results
        .filter((gallery) => Boolean(gallery.images_count))
        .map((result: Gallery) => {
          return (
            <GalleryItem
              result={result}
              sum={sum}
              key={result.id}
              grid={grid}
            />
          );
        })}
    </div>
  );
}

const GalleryItem = ({
  result,
  sum,
  grid,
}: {
  result: Gallery;
  sum: MutableRefObject<number>;
  grid: number;
}) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [colSpan, setColSpan] = React.useState<number>(0);
  React.useEffect(() => {
    // const num = Math.floor(Math.random() * 10) + 1;
    // let colSpan = (num % 3) + 1;
    // let colspan = num;
    // let colSpan = ((result.images_count ?? 0) % grid) + 1;
    let colSpan = Math.floor(((result.images_count ?? 0) * grid) / 10) + 1;
    sum.current += colSpan;

    // console.log(sum.current);
    if (sum.current >= grid) {
      colSpan = grid - sum.current + colSpan;
      sum.current = 0;
    }
    setColSpan(colSpan);
  }, []);

  React.useLayoutEffect(() => {
    if (containerRef.current && isExpanded !== null)
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
  }, [isExpanded]);
  return !colSpan ? (
    <div className="w-full h-32 animate-pulse">
      <div className="w-full h-full bg-gray-300 rounded-lg dark:bg-gray-600 p-2">
        <h1 className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
      </div>
    </div>
  ) : (
    <div
      key={result.id}
      onClick={(e) => {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
      }}
      className={`relative rounded-lg bg-opacity-50 bg-gradient-to-br from-amber-500 via-yellow-100 to-yellow-700 p-0.5 flex flex-col items-center overflow-hidden cursor-pointer ${isExpanded ? colSpanClass[grid] : colSpanClass[colSpan]} sm:col-span-full`}
    >
      <div
        ref={containerRef}
        className="bg-cover flex flex-row-reverse w-full h-full gap-0.5 rounded-lg bg-black"
      >
        <div
          className={`flex w-full h-full gap-0.5 rounded ${isExpanded ? "flex-col" : ""}`}
        >
          {(result.images ?? []).map((image, index) => {
            return !image.animated ? (
              <img
                style={{
                  height: isExpanded ? "640px" : "8rem",
                  objectPosition: isExpanded ? "right" : "center",
                }}
                loading="lazy"
                className={` bg-cover ${isExpanded ? "" : "bg-black"}  bg-opacity-60 object-contain rounded-lg ${isExpanded ? "" : "max-h-32"} min-h-32 min-w-0 w-full`}
                src={image.link}
                alt=""
              />
            ) : (
              <video
                title={image.title ?? ""}
                controls={true}
                src={image.link}
                className={`rounded-tl-lg rounded-bl-lg w-full`}
                style={{
                  height: isExpanded ? "auto" : "8rem",
                  objectPosition: isExpanded ? "right" : "center",
                }}
              />
            );
          })}
        </div>
        <div
          className={`rounded-lg basis-1/5 ${isExpanded ? "" : "hidden"} p-4 transition-all font-mono`}
        >
          <div className="space-x-1 text-xl font-bold text-gray-500">
            <span>{result.title}</span>
          </div>
          <span className="block mt-2 space-y-6 leading-6 text-neutral-600">
            <h3 className="text-xl font-semibold ">{result.description}</h3>
            <h3 className="text-emerald-300 mr-0.5 font-mono">
              {result.images_count} image{result.images_count === 1 ? "" : "s"}
            </h3>
          </span>
        </div>
      </div>
    </div>
  );
};
