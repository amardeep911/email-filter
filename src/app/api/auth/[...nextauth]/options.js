import GoogleProvider from "next-auth/providers/google";

export const options = {
  providers: [
    GoogleProvider({
      profile(profile) {
        let userRole = "google user";
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("user form here", user);

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || null; // Set role to null if not defined
      }

      return token;
    },
    async session({ session, token, user }) {
      if (token?.role) {
        session.user.role = token.role;
        session.user.id = token.sub;
      }

      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   // Redirect to dashboard if login is successful
    //   if (url === "/api/auth/signin" || url === baseUrl) {
    //     return `${baseUrl}/Dashboard`;
    //   }
    //   return url;
    // },
  },
};
