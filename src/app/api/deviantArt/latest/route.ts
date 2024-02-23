import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = "https://www.deviantart.com/api/v1/oauth2";
export const GET = async (req: NextRequest): Promise<Response> => {
  // const {query, offset, limit, token} = req. 1;
  const params = new URLSearchParams({
    q: req.nextUrl.searchParams.get("query") ?? "",
    offset: req.nextUrl.searchParams.get("offset") ?? "",
    limit: req.nextUrl.searchParams.get("limit") ?? "",
    access_token: req.nextUrl.searchParams.get("token") ?? "",
  });
  console.log("DeviantArt request:", params.toString());
  const response = await fetch(
    `${baseUrl}/browse/newest?${params.toString()}`,
    {
      method: "GET",
    },
  );
  const data = await response.json();
  console.log("DeviantArt responded with api :", response.status);
  return Response.json({ data });
  // const { code, state } = req.query;
  // const { data } = await axios.get("https://api.pinterest.com/v3/oauth/access_token/", qs.stringify({
  //   code,
  //   client_id: process.env.PINTEREST_CLIENT_ID,
  //   client_secret: process.env.PINTEREST_CLIENT_SECRET
  // }), {
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded"
  //   }
  // });
  // res.send(data);
};
