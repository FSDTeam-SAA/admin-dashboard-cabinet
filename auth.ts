import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authApi } from "@/lib/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const response = await authApi.login({ email: String(credentials.email), password: String(credentials.password) });
        const user = response.data;
        return {
          id: user._id,
          _id: user._id,
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
          image: typeof user.profileImage === "object" ? user.profileImage?.url : user.profileImage,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) Object.assign(token, { accessToken: user.accessToken, refreshToken: user.refreshToken, role: user.role, _id: user._id, firstName: user.firstName, lastName: user.lastName });
      return token;
    },
    session({ session, token }) {
      session.accessToken = String(token.accessToken || "");
      session.refreshToken = token.refreshToken ? String(token.refreshToken) : undefined;
      session.role = String(token.role || "");
      session._id = String(token._id || "");
      session.user.firstName = token.firstName ? String(token.firstName) : undefined;
      session.user.lastName = token.lastName ? String(token.lastName) : undefined;
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const isProtected = ["/dashboard", "/jobs", "/products", "/staff", "/settings"].some(path => request.nextUrl.pathname.startsWith(path));
      if (isProtected) return isLoggedIn;
      if (isLoggedIn && request.nextUrl.pathname === "/login") return Response.redirect(new URL("/dashboard", request.nextUrl));
      return true;
    },
  },
});
