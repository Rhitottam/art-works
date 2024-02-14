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

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "deviantart",
      name: "DeviantArt",
      type: "oauth",
      version: "2.0",
      authorization: {
        params: {
          response_type: "code",
          scope: "basic browse",
        },
        url: "https://www.deviantart.com/oauth2/authorize",
      },
      token: "https://www.deviantart.com/oauth2/token",
      userinfo: "https://www.deviantart.com/api/v1/oauth2/user/whoami",
      profile: (profile: any) => {
        console.log("DeviantArt profile:", profile);
        return {
          id: profile.userid,
          name: profile.username,
          email: profile.email,
          image: profile.usericon,
        };
      },
      checks: ["state"],
      clientId: process.env.DEVIANTART_CLIENT_ID,
      clientSecret: process.env.DEVIANTART_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    },
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (session && session.user) {
        session = Object.assign({}, session, {
          token: token.access_token,
        });
        // session.user = { ...session.user, email: String(token.access_token) };
        // console.log(session);
      }
      return session;
    },
  },
};
function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
): Promise<(any & { token?: string }) | null> {
  return getServerSession(...args, authOptions);
}
export const handler = NextAuth(authOptions);
export { auth, handler as GET, handler as POST };
