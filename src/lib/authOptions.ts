import { AuthOptions } from "next-auth";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any) {
  try {
    console.log(`Refreshing access token: `, token);
    const url = `https://www.deviantart.com/oauth2/token?${new URLSearchParams({
      client_id: process.env.DEVIANTART_CLIENT_ID ?? "",
      client_secret: process.env.DEVIANTART_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: token.refreshToken ?? "",
    }).toString()}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }
    console.log("Refreshed Tokens ", refreshedTokens);
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

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
        console.log(profile);
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
    async jwt({ token, user, account }) {
      if (account && user) {
        token = Object.assign({}, token, {
          accessToken: account.access_token,
          accessTokenExpires: Number(account.expires_at) * 1000,
          refreshToken: account.refresh_token,
        });
        // console.log(account, token, "jwt account");
        // const newtoken = {
        //   accessToken: account.access_token,
        //   accessTokenExpires:
        //     Date.now() + Number(account.expires_in ?? 1) * 1000,
        //   refreshToken: account.refresh_token,
        //   user,
        // };
        // console.log(newtoken);
        // return newtoken;
      }
      // return token;
      // Return previous token if the access token has not expired yet
      // console.log(token, "jwt token");
      // return token;
      if (Date.now() < Number(token.accessTokenExpires)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session && session.user?.name && token.accessToken) {
        session = Object.assign({}, session, {
          token: token.accessToken,
        });
      }
      console.log(session);
      return session;
    },
  },
};
