import { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import UsersForm from "../components/usersForm";
import { userFormValues } from "../models/user.model";
import {
    createClient,
    deleteClient,
    getClientByModuleId,
    updateClient,
} from "../services/user.service";
import { getSelectedModuleId } from "../utils/selectedModule";

const genderLabel = (value?: string) => {
    switch (String(value ?? "")) {
        case "0":
            return "Male";
        case "1":
            return "Female";
        case "2":
            return "Other";
        default:
            return value || "—";
    }
};

const emptyFormValues = (): Partial<userFormValues> => ({
    moduleId: getSelectedModuleId() ?? "",
});

const Users = () => {
    const [view, setView] = useState<"list" | "form">("list");
    const [users, setUsers] = useState<userFormValues[]>([]);
    const [formInitialValues, setFormInitialValues] = useState<Partial<userFormValues>>(emptyFormValues);
    const [loading, setLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        const moduleId = getSelectedModuleId();
        if (!moduleId) {
            setUsers([]);
            return;
        }

        setLoading(true);
        try {
            const data = await getClientByModuleId(moduleId);
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    const openForm = (user?: userFormValues) => {
        setFormInitialValues(
            user
                ? { ...user, moduleId: getSelectedModuleId() ?? user.moduleId }
                : emptyFormValues()
        );
        setView("form");
    };

    const backToList = () => {
        setFormInitialValues(emptyFormValues());
        setView("list");
    };

    const handleSubmit = async (values: userFormValues) => {
        try {
            const { id, createdAt, updatedAt, updatedDate, ...rest } = values as userFormValues & {
                createdAt?: string;
                updatedAt?: string;
                updatedDate?: string;
            };
            const payload = {
                ...rest,
                gender: values.gender ?? "",
                moduleId: getSelectedModuleId() ?? values.moduleId,
            };
            if (id) {
                await updateClient(id, payload);
            } else {
                await createClient(payload);
            }
            await loadUsers();
            backToList();
        } catch (error) {
            // Request errors are already handled by the shared HTTP client.
            console.error(error);
        }
    };

    const handleDelete = async (user: userFormValues) => {
        if (!user.id) return;
        const confirmed = window.confirm(`Delete user "${user.name}"?`);
        if (!confirmed) return;

        try {
            await deleteClient(user.id);
            await loadUsers();
        } catch (error) {
            console.error(error);
        }
    };

    if (view === "form") {
        return (
            <UsersForm
                initialValues={formInitialValues}
                onSubmit={handleSubmit}
                onCancel={backToList}
            />
        );
    }

    return (
        <div className="card p-6 border-2 border-gray-300 rounded-md">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Users</h1>
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
                            <th className="px-3 py-2 font-semibold">Name</th>
                            <th className="px-3 py-2 font-semibold">Phone</th>
                            <th className="px-3 py-2 font-semibold">Address</th>
                            <th className="px-3 py-2 font-semibold">Gender</th>
                            <th className="px-3 py-2 font-semibold">Active</th>
                            <th className="px-3 py-2 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                                    Loading users...
                                </td>
                            </tr>
                        )}
                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            users.map((user) => (
                                <tr
                                    key={user.id ?? `${user.name}-${user.phone}`}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-3 py-2">{user.name}</td>
                                    <td className="px-3 py-2">{user.phone}</td>
                                    <td className="px-3 py-2">{user.address}</td>
                                    <td className="px-3 py-2">{genderLabel(user.gender)}</td>
                                    <td className="px-3 py-2">{user.active ? "Yes" : "No"}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-2">
                                            <i
                                                className="pi pi-pencil cursor-pointer text-blue-500"
                                                onClick={() => openForm(user)}
                                            />
                                            <i
                                                className="pi pi-trash cursor-pointer text-red-500"
                                                onClick={() => void handleDelete(user)}
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

export default Users;
