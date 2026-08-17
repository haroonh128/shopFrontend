import { http } from "../../core/http";

export const createClient = (data: any) =>
    http.post<any, any>("/Client", data);

export const getClient = () =>
    http.get<any>("/Client");

export const getClientByModuleId = (id: string) => http.get<[any]>(`/Client/by-module/${id}`);

export const getClientById = (id: string) => http.get<any>(`/Client/${id}`);

export const updateClient = (id: string, data: any) => http.put<any, any>(`/Client/${id}`, data);

export const deleteClient = (id: string) => http.delete<any>(`/Client/${id}`);