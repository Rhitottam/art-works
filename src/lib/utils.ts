import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
): Promise<(any & { token?: string }) | null> {
  return getServerSession(...args, authOptions);
}
