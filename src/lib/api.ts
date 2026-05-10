export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`/${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.json().then((data) => data.message || data.error);
    throw new Error(text || res.statusText);
  }

  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const response = await res.json();
    return response?.data;
  }

  return res as unknown as T;
}
