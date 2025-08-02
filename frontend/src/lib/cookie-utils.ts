export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  path?: string;
}

const defaultOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export const getCookieValue = (name: string): string | null => {
  if (typeof window === "undefined") {
    // サーバーサイドでは直接cookies()を呼べないため、
    // middlewareやサーバーコンポーネントで使用する
    console.warn("getCookieValue should not be called on server side. Use middleware instead.");
    return null;
  }

  // クライアントサイド
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1")}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

export const setCookieValue = (name: string, value: string, options: CookieOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };

  if (typeof window === "undefined") {
    // サーバーサイドでは直接Cookieを設定できないため、
    // レスポンスヘッダーで設定する必要がある
    console.warn("setCookieValue should not be called on server side. Use response headers instead.");
    return;
  }

  // クライアントサイド
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.maxAge !== undefined) {
    cookieString += `; Max-Age=${opts.maxAge}`;
  }

  if (opts.path) {
    cookieString += `; Path=${opts.path}`;
  }

  if (opts.secure) {
    cookieString += "; Secure";
  }

  if (opts.sameSite) {
    cookieString += `; SameSite=${opts.sameSite}`;
  }

  // HttpOnly フラグはクライアントサイドでは設定できない
  if (opts.httpOnly && typeof window !== "undefined") {
    console.warn("HttpOnly cookies cannot be set from client side JavaScript");
  }

  document.cookie = cookieString;
};

export const removeCookieValue = (name: string, path = "/"): void => {
  if (typeof window === "undefined") {
    console.warn("removeCookieValue should not be called on server side.");
    return;
  }

  // クライアントサイド
  document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const createAuthStorageInterface = () => {
  return {
    getItem: (name: string) => {
      const value = getCookieValue(name);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: unknown) => {
      setCookieValue(name, JSON.stringify(value), {
        httpOnly: false, // Zustandからアクセスするためfalseにする
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    },
    removeItem: (name: string) => {
      removeCookieValue(name);
    },
  };
};
