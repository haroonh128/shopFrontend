export type HttpMethod="GET"|"POST"|"PUT"|"DELETE"|"PATCH"|"OPTIONS"|"HEAD";

export interface ApiError {
    code?: string;
    message: string;
    details?: unknown;
}

export interface ApiResponse<TData = unknown> {
    message: string;
    status: number;
    data: TData;
    error?: ApiError | null;
}

export interface HttpsRequestOptions <TBody = unknown> {
    method?:HttpMethod;
    body?:TBody;
    headers?:HeadersInit;
    signal?:AbortSignal;
}