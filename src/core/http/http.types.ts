export type HttpMethod="GET"|"POST"|"PUT"|"DELETE"|"PATCH"|"OPTIONS"|"HEAD";

export type { ApiError } from "../../shared/interfaces";
export { ApiResponse } from "../../shared/models";

export interface HttpsRequestOptions <TBody = unknown> {
    method?:HttpMethod;
    body?:TBody;
    headers?:HeadersInit;
    signal?:AbortSignal;
}