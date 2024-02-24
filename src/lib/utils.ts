import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
): Promise<(any & { token?: string }) | null> {
  return getServerSession(...args, authOptions);
}

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
