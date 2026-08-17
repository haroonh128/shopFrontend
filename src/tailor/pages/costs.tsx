import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import CostForm from "../components/costForm";
import { costFormValues, formatMoney, pendingAmount } from "../models/cost.model";
import {
    createCost,
    deleteCost,
    getCosts,
    updateCost,
} from "../services/cost.service";
import { getClientByModuleId } from "../../authentication/services/user.service";
import { getSelectedModuleId } from "../../authentication/utils/selectedModule";

type ClientOption = { label: string; value: string };

type CostLocationState = {
    clientId?: string;
    measurementId?: string;
    openForm?: boolean;
};

const emptyFormValues = (): Partial<costFormValues> => ({
    clientId: "",
    measurementId: "",
    totalCost: 0,
    advance: 0,
    notes: "",
});

const Costs = () => {
    const location = useLocation();
    const locationState = (location.state ?? {}) as CostLocationState;

    const [view, setView] = useState<"list" | "form">(locationState.openForm ? "form" : "list");
    const [costs, setCosts] = useState<costFormValues[]>([]);
    const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
    const [formInitialValues, setFormInitialValues] = useState<Partial<costFormValues>>(() =>
        locationState.openForm
            ? {
                  ...emptyFormValues(),
                  clientId: locationState.clientId ?? "",
                  measurementId: locationState.measurementId ?? "",
              }
            : emptyFormValues()
    );
    const [lockClient, setLockClient] = useState(Boolean(locationState.openForm && locationState.clientId));
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        const moduleId = getSelectedModuleId();
        try {
            const [costData, clientData] = await Promise.all([
                getCosts(),
                moduleId ? getClientByModuleId(moduleId) : Promise.resolve([]),
            ]);
            setCosts(Array.isArray(costData) ? costData : []);
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
            setCosts([]);
            setClientOptions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const openForm = (row?: costFormValues) => {
        setLockClient(false);
        setFormInitialValues(row ? { ...row } : emptyFormValues());
        setView("form");
    };

    const backToList = () => {
        setLockClient(false);
        setFormInitialValues(emptyFormValues());
        setView("list");
    };

    const handleSubmit = async (values: costFormValues) => {
        try {
            const { id, createdAt, updatedAt, updatedDate, pending, ...rest } = values as costFormValues & {
                createdAt?: string;
                updatedAt?: string;
                updatedDate?: string;
            };
            const payload = {
                ...rest,
                measurementId: rest.measurementId || null,
                totalCost: Number(rest.totalCost || 0),
                advance: Number(rest.advance || 0),
            };
            if (id) {
                await updateCost(id, payload);
            } else {
                await createCost(payload);
            }
            await loadData();
            backToList();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (row: costFormValues) => {
        if (!row.id) return;
        const client = clientOptions.find((c) => c.value === row.clientId)?.label ?? row.clientId;
        const confirmed = window.confirm(`Delete cost record for "${client}"?`);
        if (!confirmed) return;

        try {
            await deleteCost(row.id);
            await loadData();
        } catch (error) {
            console.error(error);
        }
    };

    if (view === "form") {
        return (
            <CostForm
                initialValues={formInitialValues}
                clientOptions={clientOptions}
                lockClient={lockClient}
                onSubmit={handleSubmit}
                onCancel={backToList}
            />
        );
    }

    return (
        <div className="card p-6 border-2 border-gray-300 rounded-md">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Costs</h1>
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
                            <th className="px-3 py-2 font-semibold">Total Cost</th>
                            <th className="px-3 py-2 font-semibold">Advance</th>
                            <th className="px-3 py-2 font-semibold">Pending</th>
                            <th className="px-3 py-2 font-semibold">Notes</th>
                            <th className="px-3 py-2 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                                    Loading costs...
                                </td>
                            </tr>
                        )}
                        {!loading && costs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                                    No costs found.
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            costs.map((row) => (
                                <tr
                                    key={row.id ?? `${row.clientId}-${row.totalCost}`}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-3 py-2">
                                        {clientOptions.find((c) => c.value === row.clientId)?.label ?? row.clientId ?? "—"}
                                    </td>
                                    <td className="px-3 py-2">{formatMoney(row.totalCost)}</td>
                                    <td className="px-3 py-2">{formatMoney(row.advance)}</td>
                                    <td className="px-3 py-2">
                                        {formatMoney(row.pending ?? pendingAmount(row.totalCost, row.advance))}
                                    </td>
                                    <td className="px-3 py-2">{row.notes || "—"}</td>
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

export default Costs;
