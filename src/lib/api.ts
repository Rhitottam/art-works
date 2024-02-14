import { SearchPopularResults } from "@/types/deviantart";
import { GoogleCustomSearchResponse } from "@/types/google";
import { ImgurGallerySearchResponse } from "@/types/imgur";
import { YoutubeSearchResponse } from "@/types/youtube";
import axios, { AxiosError } from "axios";

const baseUrl = "https://www.deviantart.com/api/v1/oauth2";

export async function getImagesFromDeviantArt(
  query: string,
  offset: number,
  limit: number,
  accessToken: string,
): Promise<SearchPopularResults> {
  const params = new URLSearchParams({
    q: query,
    offset: offset.toString(),
    limit: limit.toString(),
    access_token: accessToken,
  });
  try {
    const response = await axios.get(
      `${baseUrl}/browse/newest?${params.toString()}`,
    );
    console.log("DeviantArt responded with:", response.status);
    return response.data;
  } catch (e: any) {
    console.error("DeviantArt error:", e.response?.data ?? e.message);
    return { has_more: false, next_offset: 0, results: [] };
  }
}

export async function getYoutubeVideosByQuery(
  query: string,
  maxResults: number,
  key: string,
): Promise<Partial<YoutubeSearchResponse>> {
  const params = new URLSearchParams({
    part: "snippet",
    maxResults: maxResults.toString(),
    q: query,
    key,
  });
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    );
    console.log("Youtube responded with:", response.status);
    return response.data;
  } catch (e: any) {
    console.error("Youtube error:", e.response?.data ?? e.message);
    return { items: [] };
  }
}

export async function getImgurGalleriesByQuery(
  query: string,
  page: number,
): Promise<Partial<ImgurGallerySearchResponse>> {
  const params = new URLSearchParams({
    q: query,
    q_any: query,
  });
  try {
    const response = await axios.get(
      `https://api.imgur.com/3/gallery/search/time/all/${0}?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      },
    );
    console.log("Imgur responded with:", response.status);
    console.log(response.data.data.length, query, page, "results");
    return response.data;
  } catch (e: any) {
    console.error("Imgur error:", e.response?.data ?? e.message);
    return { data: [] };
  }
}

export async function getGoogleCustomImageSearch(
  query: string,
): Promise<Partial<GoogleCustomSearchResponse>> {
  const params = new URLSearchParams({
    q: query,
    key: process.env.GOOGLE_DATA_API_KEY ?? "",
    cx: process.env.GOOGLE_SEARCH_ENGINE_ID ?? "",
    searchType: "image",
    sort: "date",
  });
  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?${params.toString()}`,
    );
    console.log("Google responded with:", response.status);
    console.log(response.data.items, query, "results");
    return response.data;
  } catch (e: any) {
    console.error("Google error:", e.response?.data ?? e.message);
    return { items: [] };
  }
}

//"https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json"
