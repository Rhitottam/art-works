import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
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
      }
      return session;
    },
  },
};
