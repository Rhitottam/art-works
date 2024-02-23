import { getServerSession } from "next-auth";
import {
  getGoogleCustomImageSearch,
  getImagesFromDeviantArt,
  getImgurGalleriesByQuery,
  getYoutubeVideosByQuery,
} from "@/src/lib/api";
import { getToken } from "next-auth/jwt";
import fs from "fs";
import ResultsGrid from "./components/ResultsGrid";
import { auth } from "@/src/lib/utils";
import { PAGE_SIZE, TERMS } from "@/src/lib/constants";
import ImagesGrid from "./components/DeviantArtGrid";
import ImageResults from "./components/ImageResults";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string>;
}) {
  // const session = await auth();
  // const useApiD = true,
  //   useApiI = false,
  //   useApiY = false,
  //   useApiG = false;
  // let resultsString,
  //   videoResultsString,
  //   imgurResultsString,
  //   googleResultsString;
  // try {
  //   resultsString = fs.readFileSync("results.json", "utf-8");
  //   videoResultsString = fs.readFileSync("videoResults.json", "utf-8");
  //   imgurResultsString = fs.readFileSync("imgurResults.json", "utf-8");
  //   googleResultsString = fs.readFileSync("googleResults.json", "utf-8");
  // } catch (e) {
  //   resultsString = !resultsString ? "" : resultsString;
  //   videoResultsString = !videoResultsString ? "" : videoResultsString;
  //   imgurResultsString = !imgurResultsString ? "" : imgurResultsString;
  //   googleResultsString = !googleResultsString ? "" : googleResultsString;
  // }

  // const results =
  //   session?.user?.name && useApiD
  //     ? await Promise.all(
  //         TERMS.map((term) =>
  //           getImagesFromDeviantArt(
  //             term,
  //             Number(searchParams[term] ?? 0) * PAGE_SIZE,
  //             PAGE_SIZE,
  //             session.token ?? "",
  //           ),
  //         ),
  //       )
  //     : resultsString?.length
  //       ? JSON.parse(resultsString)
  //       : [];
  // // const results = resultsString?.length ? JSON.parse(resultsString) : [];
  // if (useApiD)
  //   fs.writeFileSync("results.json", JSON.stringify(results, null, 2));

  // const imgurResults =
  //   session?.user?.name && useApiI
  //     ? await Promise.all(
  //         TERMS.map((term) => getImgurGalleriesByQuery(term, 0)),
  //       )
  //     : imgurResultsString?.length
  //       ? JSON.parse(imgurResultsString)
  //       : [];
  // if (useApiI)
  //   fs.writeFileSync(
  //     "imgurResults.json",
  //     JSON.stringify(imgurResults, null, 2),
  //   );
  // const videoResults = useApiY
  //   ? await Promise.all(
  //       TERMS.map((term) =>
  //         getYoutubeVideosByQuery(
  //           term,
  //           25,
  //           process.env.GOOGLE_DATA_API_KEY ?? "",
  //         ),
  //       ),
  //     )
  //   : videoResultsString?.length
  //     ? JSON.parse(videoResultsString)
  //     : [];
  // // const videoResults = videoResultsString?.length
  // //   ? JSON.parse(videoResultsString)
  // //   : [];
  // if (useApiY)
  //   fs.writeFileSync(
  //     "videoResults.json",
  //     JSON.stringify(videoResults, null, 2),
  //   );

  // const googleResults = useApiG
  //   ? await Promise.all(TERMS.map((term) => getGoogleCustomImageSearch(term)))
  //   : googleResultsString?.length
  //     ? JSON.parse(googleResultsString)
  //     : [];
  // if (useApiG)
  //   fs.writeFileSync(
  //     "googleResults.json",
  //     JSON.stringify(googleResults, null, 2),
  //   );
  const grid = 8;
  return (
    <main className="min-h-full flex-1 bg-gradient-to-br from-amber-500 via-violet-900 to-amber-500 relative ">
      <div className="flex flex-wrap gap-2 mb-4 p-4 border-b-2 border-y-emerald-400 text-sm z-10 bg-black bg-opacity-80">
        {TERMS.map((term, index) => (
          <span
            key={term}
            className="block font-semibold bg-gradient-to-br from-amber-500 via-yellow-100 to-yellow-700 p-0.5 rounded-lg"
          >
            <div className="bg-emerald-900 rounded-lg">
              <div className="bg-gradient-to-br from-amber-500 via-yellow-100 to-yellow-700 p-4 text-transparent bg-clip-text">
                {term}
              </div>
            </div>
          </span>
        ))}
      </div>
      <div className="lg:p-8 p-4">
        {(TERMS ?? []).map(
          (term, index) => (
            <ResultsGrid
              key={term.split(" ").join("_")}
              term={term}
              grid={grid}
              searchParams={searchParams}
            >
              {/* <Loading /> */}
              <Suspense fallback={<Loading />}>
                <ImageResults
                  term={term}
                  grid={grid}
                  searchParams={searchParams}
                />
              </Suspense>
            </ResultsGrid>
          ),
          // results[index]?.results?.length ? (
          //   <ResultsGrid
          //     term={term}
          //     key={term.split(" ").join("_")}
          //     grid={grid}
          //     // results={results[index]?.results}
          //     // videoResults={(videoResults[index]?.items ?? []).slice(0, 10)}
          //     searchParams={searchParams}
          //     // galleryResults={imgurResults[index]?.data ?? []}
          //     //googleResults={googleResults[index]?.items ?? []}
          //   />
        )}
      </div>
    </main>
  );
}
