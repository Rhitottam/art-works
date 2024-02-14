import axios from "axios";
import qs from "qs";
import { NextAuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import PinterestProvider from "next-auth/providers/pinterest";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { authOptions } from "@/src/lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
