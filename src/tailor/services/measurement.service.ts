import { http } from "../../core/http";

export const createMeasurement = (data: any) =>
    http.post<any, any>("/Measurement", data);

export const getMeasurements = () =>
    http.get<any>("/Measurement");

export const getMeasurementById = (id: string) =>
    http.get<any>(`/Measurement/${id}`);

export const getMeasurementsByClientId = (clientId: string) =>
    http.get<[any]>(`/Measurement/by-client/${clientId}`);

export const updateMeasurement = (id: string, data: any) =>
    http.put<any, any>(`/Measurement/${id}`, data);

export const deleteMeasurement = (id: string) =>
    http.delete<any>(`/Measurement/${id}`);
