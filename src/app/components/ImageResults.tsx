import { getImagesFromDeviantArt } from "@/src/lib/api";
import { GRID_SIZE, PAGE_SIZE } from "@/src/lib/constants";
import { auth } from "@/src/lib/utils";
import fs from "fs";
import React from "react";
import ImagesGrid from "./DeviantArtGrid";
import Pagination from "./Pagination";
import { RedirectType, redirect } from "next/navigation";
import { SearchPopularResults } from "@/types/deviantart";
import Authenticate from "./Authenticate";

type ImageResultsProps = {
  term: string;
  page?: number;
  grid?: number;
  token?: string;
  searchParams: Record<string, string>;
};

export default async function ImageResults({
  term,
  page,
  grid,
  searchParams,
}: ImageResultsProps) {
  const session = await auth();
  const token = session?.token ?? "";
  const isLoggedIn = Boolean(session?.user?.name);
  const useApiD = isLoggedIn;
  let resultsString;
  const currentPage = page ?? Number(searchParams[term] ?? 0);
  try {
    resultsString = fs.readFileSync("results.json", "utf-8");
  } catch (e) {
    resultsString = !resultsString ? "" : resultsString;
  }

  const results: SearchPopularResults = useApiD
    ? await getImagesFromDeviantArt(
        term,
        currentPage * PAGE_SIZE,
        PAGE_SIZE,
        token,
      )
    : resultsString?.length
      ? JSON.parse(resultsString)
      : [];
  if (useApiD)
    fs.writeFileSync("results.json", JSON.stringify(results, null, 2));
  return token.length ? (
    <ImagesGrid
      token={token}
      results={results?.results ?? []}
      grid={grid ?? GRID_SIZE}
      key={`${term}_deviantart`}
      term={term}
    />
  ) : (
    <Authenticate />
  );
}
