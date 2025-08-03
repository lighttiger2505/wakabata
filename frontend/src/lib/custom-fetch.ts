const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return c.json();
  }

  if (contentType?.includes("application/pdf")) {
    return c.blob() as Promise<T>;
  }

  return c.text() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_HOST ?? "http://0.0.0.0:8088";
  const url = new URL(contextUrl, baseUrl);
  console.info(url.toString());
  return url.toString();
};

const getHeaders = (headers?: HeadersInit): HeadersInit => {
  const baseHeaders: HeadersInit = {
    Authorization: "token",
  };
  if (!headers || !(headers instanceof Headers) || !headers.has("Content-Type")) {
    baseHeaders["Content-Type"] = "application/json";
  }
  return {
    ...baseHeaders,
    ...headers,
  };
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const requestUrl = getUrl(url);
  const requestHeaders = getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
  };

  const response = await fetch(requestUrl, requestInit);
  const data = await getBody<T>(response);

  return { status: response.status, data, headers: response.headers } as T;
};
