import { HttpsRequestOptions } from "./http.types";
import NProgress from "nprogress";
import toastr from "toastr";
import type { ApiResponse } from "../../shared";
import { getItem } from "../../shared";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:7482/api/v1";

const AUTH_STORAGE_KEY = "auth";

NProgress.configure({ showSpinner: true, trickleSpeed: 120 });
toastr.options = {
  closeButton: true,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  timeOut: 5000
};

let activeRequests = 0;
const SUCCESS_TOAST_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function startLoading(): void {
  activeRequests += 1;
  if (activeRequests === 1) {
    NProgress.start();
  }
}

function stopLoading(): void {
  activeRequests = Math.max(activeRequests - 1, 0);
  if (activeRequests === 0) {
    NProgress.done();
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return res.statusText || "Request failed";

    try {
      const json = JSON.parse(text) as {
        message?: unknown;
        errors?: unknown;
      };
      if (typeof json.message === "string" && json.message.trim()) {
        return json.message;
      }
      if (Array.isArray(json.errors) && json.errors.length > 0) {
        return json.errors.filter((e) => typeof e === "string").join(", ") || text;
      }
    } catch {
      // Response was not JSON; use raw text.
    }

    return text;
  } catch {
    return res.statusText || "Request failed";
  }
}

function maybeShowSuccessToast(method: string, payload: unknown): void {
  const normalizedMethod = method.toUpperCase();
  if (!SUCCESS_TOAST_METHODS.has(normalizedMethod)) {
    return;
  }

  const message =
    payload && typeof payload === "object" && "message" in payload
      ? (payload as { message?: unknown }).message
      : undefined;

  if (typeof message === "string" && message.trim().length > 0) {
    toastr.success(message, "Success");
  }
}

function unwrapApiPayload<TResponse>(payload: unknown): TResponse {
  if (!payload || typeof payload !== "object") {
    return payload as TResponse;
  }

  const apiPayload = payload as Partial<ApiResponse<TResponse>>;

  if (apiPayload.success === false) {
    const errorMessage =
      typeof apiPayload.message === "string" && apiPayload.message.trim().length > 0
        ? apiPayload.message
        : "Request failed";
    throw new Error(errorMessage);
  }

  if ("data" in apiPayload) {
    return apiPayload.data as TResponse;
  }

  return payload as TResponse;
}

function getAuthHeaders(): Record<string, string> {
  const token = getItem(AUTH_STORAGE_KEY)?.trim();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

function getHashPath(): string {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return hash.split("?")[0] || "/";
}

function isOnPublicAuthPage(): boolean {
  const path = getHashPath();
  return (
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/otp" ||
    path === "/forgot-password"
  );
}

function handleUnauthorized(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  // HashRouter keeps the SPA path in the hash; pathname alone is usually "/".
  if (!isOnPublicAuthPage()) {
    window.location.assign("/#/login");
  }
}

async function request<TResponse, TBody = unknown>(
  url: string,
  options: HttpsRequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, headers, signal } = options;
  startLoading();
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      credentials: "include", // REQUIRED for ASP.NET cookies
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      signal
    });

    if (!res.ok) {
      const errorMessage = await parseErrorMessage(res);
      if (res.status === 401) {
        handleUnauthorized();
      }
      throw new Error(errorMessage);
    }

    // 204 No Content
    if (res.status === 204) {
      return undefined as TResponse;
    }
    
    let payload: unknown;
    try {
      payload = await res.json();
    } catch {
      payload = undefined;
    }

    maybeShowSuccessToast(method, payload);

    return unwrapApiPayload<TResponse>(payload);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    if (error instanceof Error) {
      const message = error.message || "Something went wrong";
      const title = /subscription has expired/i.test(message)
        ? "Subscription expired"
        : "Request failed";
      toastr.error(message, title);
      throw error;
    }

    toastr.error("Something went wrong", "Request failed");
    throw new Error("Something went wrong");
  } finally {
    stopLoading();
  }
}

export const http = {
    get:<TResponse>(url:string,signal?:AbortSignal):Promise<TResponse> => request<TResponse>(url,{method:"GET",signal}),
    post:<TResponse,TBody = unknown>(url:string,body:TBody):Promise<TResponse> => request<TResponse>(url,{method:"POST",body}),
    put:<TResponse,TBody = unknown>(url:string, body:TBody):Promise<TResponse> => request<TResponse>(url,{method:"PUT",body}),
    delete:<TResponse>(url:string):Promise<TResponse> => request<TResponse>(url,{method:"DELETE"}),
    patch:<TResponse,TBody = unknown>(url:string, body:TBody):Promise<TResponse> => request<TResponse>(url,{method:"PATCH",body}),
    options:<TResponse>(url:string):Promise<TResponse> => request<TResponse>(url,{method:"OPTIONS"}),
    head:<TResponse>(url:string):Promise<TResponse> => request<TResponse>(url,{method:"HEAD"}),
};