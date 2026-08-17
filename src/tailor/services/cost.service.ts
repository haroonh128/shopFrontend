import { http } from "../../core/http";

export const createCost = (data: any) =>
    http.post<any, any>("/Cost", data);

export const getCosts = () =>
    http.get<any>("/Cost");

export const getCostById = (id: string) =>
    http.get<any>(`/Cost/${id}`);

export const getCostsByClientId = (clientId: string) =>
    http.get<any>(`/Cost/client/${clientId}`);

export const updateCost = (id: string, data: any) =>
    http.put<any, any>(`/Cost/${id}`, data);

export const deleteCost = (id: string) =>
    http.delete<any>(`/Cost/${id}`);
