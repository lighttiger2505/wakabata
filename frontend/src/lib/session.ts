import { TokenPair, User } from "@/api/generated/model";
import { SessionOptions } from "iron-session";

export interface SessionData {
  user: User | null;
  token: TokenPair | null;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  user: null,
  token: null,
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "auth-session",
  cookieOptions: {
    secure: true,
  },
};
