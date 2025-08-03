import { pOSTApiV1AuthLogin, pOSTApiV1AuthLogout, pOSTApiV1AuthRefresh } from "@/api/generated/client";
import { SessionData, defaultSession, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

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

  session.isLoggedIn = true;
  session.token = result;
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

  session.isLoggedIn = true;
  session.token = result;
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
