import { pOSTApiV1AuthLogin, pOSTApiV1AuthLogout, pOSTApiV1AuthRefresh } from "@/api/generated/fetch-client";
import { HTTPError, TokenPair } from "@/api/generated/model";
import { SessionData, defaultSession, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

function isHTTPError(data: unknown): data is HTTPError {
  return (
    typeof data === "object" &&
    data !== null &&
    ("status" in data || "title" in data || "detail" in data || "type" in data || "errors" in data || "instance" in data)
  );
}

// login
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  const { email, password } = (await request.json()) as {
    email: string;
    password: string;
  };
  const result = await pOSTApiV1AuthLogin({
    email: email,
    password: password,
  });

  if (!result.data || isHTTPError(result.data)) {
    session.isLoggedIn = false;
    session.token = null;
    await session.save();
    return Response.json(
      {
        error: true,
        message: "Authentication failed",
      },
      { status: 401 },
    );
  }

  session.isLoggedIn = true;
  session.token = result.data as TokenPair;
  await session.save();

  return Response.json(session);
}

// refresh token
export async function PUT() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (session.isLoggedIn !== true) {
    return Response.json(defaultSession);
  }
  const result = await pOSTApiV1AuthRefresh({
    refresh_token: session.token?.refresh_token ?? "",
  });

  if (!result.data || isHTTPError(result.data)) {
    session.isLoggedIn = false;
    session.token = null;
    await session.save();
    return Response.json(
      {
        error: true,
        message: "Authentication failed",
      },
      { status: 401 },
    );
  }

  session.isLoggedIn = true;
  session.token = result.data as TokenPair;
  await session.save();

  return Response.json(session);
}

// read session
export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (session.isLoggedIn !== true) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}

// logout
export async function DELETE() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  await pOSTApiV1AuthLogout();
  session.destroy();

  return Response.json(defaultSession);
}
