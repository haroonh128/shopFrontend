import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import MeasurementsForm from "../components/measurementsForm";
import {
    dressTypeLabel,
    measurementFormValues,
} from "../models/measurement.model";
import {
    createMeasurement,
    deleteMeasurement,
    getMeasurements,
    updateMeasurement,
} from "../services/measurement.service";
import { getClientByModuleId } from "../../authentication/services/user.service";
import { getSelectedModuleId } from "../../authentication/utils/selectedModule";

type ClientOption = { label: string; value: string };

const emptyFormValues = (): Partial<measurementFormValues> => ({
    clientId: "",
    type: "",
});

const Measurements = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<"list" | "form">("list");
    const [measurements, setMeasurements] = useState<measurementFormValues[]>([]);
    const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
    const [formInitialValues, setFormInitialValues] = useState<Partial<measurementFormValues>>(emptyFormValues);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        const moduleId = getSelectedModuleId();
        try {
            const [measurementData, clientData] = await Promise.all([
                getMeasurements(),
                moduleId ? getClientByModuleId(moduleId) : Promise.resolve([]),
            ]);
            setMeasurements(Array.isArray(measurementData) ? measurementData : []);
            setClientOptions(
                (Array.isArray(clientData) ? clientData : [])
                    .filter((c: { id?: string }) => c.id)
                    .map((c: { id: string; name?: string; phone?: string }) => ({
                        label: c.name ? `${c.name}${c.phone ? ` (${c.phone})` : ""}` : c.id,
                        value: c.id,
                    }))
            );
        } catch (error) {
            console.error(error);
            setMeasurements([]);
            setClientOptions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const openForm = (row?: measurementFormValues) => {
        setFormInitialValues(row ? { ...row } : emptyFormValues());
        setView("form");
    };

    const backToList = () => {
        setFormInitialValues(emptyFormValues());
        setView("list");
    };

    const handleSubmit = async (values: measurementFormValues) => {
        try {
            const { id, createdAt, updatedAt, updatedDate, ...rest } = values as measurementFormValues & {
                createdAt?: string;
                updatedAt?: string;
                updatedDate?: string;
            };
            if (id) {
                await updateMeasurement(id, rest);
                await loadData();
                backToList();
                return;
            }

            const created = await createMeasurement(rest);
            navigate("/costs", {
                state: {
                    openForm: true,
                    clientId: created?.clientId ?? rest.clientId,
                    measurementId: created?.id,
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (row: measurementFormValues) => {
        if (!row.id) return;
        const client = clientOptions.find((c) => c.value === row.clientId)?.label ?? row.clientId;
        const confirmed = window.confirm(
            `Delete measurement for "${client} — ${dressTypeLabel(row.type)}"?`
        );
        if (!confirmed) return;

        try {
            await deleteMeasurement(row.id);
            await loadData();
        } catch (error) {
            console.error(error);
        }
    };

    if (view === "form") {
        return (
            <MeasurementsForm
                initialValues={formInitialValues}
                clientOptions={clientOptions}
                onSubmit={handleSubmit}
                onCancel={backToList}
            />
        );
    }

    return (
        <div className="card p-6 border-2 border-gray-300 rounded-md">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Measurements</h1>
                <Button
                    type="button"
                    label="Add"
                    icon="pi pi-plus"
                    className="form-button-primary"
                    onClick={() => openForm()}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                            <th className="px-3 py-2 font-semibold">Client</th>
                            <th className="px-3 py-2 font-semibold">Dress Type</th>
                            <th className="px-3 py-2 font-semibold">Chest / Bust</th>
                            <th className="px-3 py-2 font-semibold">Waist</th>
                            <th className="px-3 py-2 font-semibold">Length</th>
                            <th className="px-3 py-2 font-semibold">Fit</th>
                            <th className="px-3 py-2 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                                    Loading measurements...
                                </td>
                            </tr>
                        )}
                        {!loading && measurements.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                                    No measurements found.
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            measurements.map((row) => (
                                <tr
                                    key={row.id ?? `${row.clientId}-${row.type}`}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-3 py-2">
                                        {clientOptions.find((c) => c.value === row.clientId)?.label ?? row.clientId ?? "—"}
                                    </td>
                                    <td className="px-3 py-2">{dressTypeLabel(row.type)}</td>
                                    <td className="px-3 py-2">
                                        {row.bust || row.chest || "—"}
                                    </td>
                                    <td className="px-3 py-2">{row.waist || "—"}</td>
                                    <td className="px-3 py-2">
                                        {row.length || row.trouserLength || "—"}
                                    </td>
                                    <td className="px-3 py-2">{row.fitType || "—"}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-2">
                                            <i
                                                className="pi pi-pencil cursor-pointer text-blue-500"
                                                onClick={() => openForm(row)}
                                            />
                                            <i
                                                className="pi pi-trash cursor-pointer text-red-500"
                                                onClick={() => void handleDelete(row)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Measurements;
