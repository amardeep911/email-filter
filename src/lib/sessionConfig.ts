import withSession from "next-session";

export const sessionOptions = {
  cookieName: "userSession",
  secret: process.env.SESSION_SECRET || "default-secret",
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
};

export const session = withSession(sessionOptions);
