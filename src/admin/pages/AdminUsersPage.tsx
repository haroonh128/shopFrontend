import { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import AdminUserForm from "../components/AdminUserForm";
import type { AdminUser, AdminUserFormValues } from "../models/admin.models";
import { findModuleById } from "../../authentication/config/modules";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  setAdminUserActive,
  updateAdminUser,
  updateAdminUserSubscription,
} from "../services/adminUser.service";

function toDateInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function moduleLabel(moduleId?: string | null) {
  if (!moduleId) return "—";
  return findModuleById(moduleId)?.title ?? moduleId.slice(0, 8) + "…";
}

function formatDisplayDate(value?: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

export default function AdminUsersPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [formInitial, setFormInitial] = useState<Partial<AdminUserFormValues>>({});
  const [subscriptionUser, setSubscriptionUser] = useState<AdminUser | null>(null);
  const [subscriptionDate, setSubscriptionDate] = useState("");

  const load = useCallback(async (term?: string) => {
    setLoading(true);
    try {
      const data = await getAdminUsers(term);
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setFormInitial({
      subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    });
    setView("form");
  };

  const openEdit = (user: AdminUser) => {
    setFormInitial({
      id: user.id,
      phoneNumber: user.phoneNumber,
      pin: "",
      confirmPin: "",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cnic: user.cnic,
      appType: user.appType,
      moduleId: user.moduleId ?? "",
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      subscriptionValidUntil: toDateInput(user.subscriptionValidUntil),
    });
    setView("form");
  };

  const handleSubmit = async (values: AdminUserFormValues) => {
    const subscriptionValidUntil = values.subscriptionValidUntil
      ? new Date(`${values.subscriptionValidUntil}T00:00:00.000Z`).toISOString()
      : null;
    const moduleId = values.moduleId || null;

    if (values.id) {
      await updateAdminUser(values.id, {
        phoneNumber: values.phoneNumber,
        pin: values.pin || null,
        confirmPin: values.confirmPin || null,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        cnic: values.cnic,
        appType: values.appType,
        moduleId,
        isTwoFactorEnabled: values.isTwoFactorEnabled,
        isActive: values.isActive,
        isAdmin: values.isAdmin,
        subscriptionValidUntil,
      });
    } else {
      await createAdminUser({
        phoneNumber: values.phoneNumber,
        pin: values.pin,
        confirmPin: values.confirmPin,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        cnic: values.cnic,
        appType: values.appType,
        moduleId,
        isTwoFactorEnabled: values.isTwoFactorEnabled,
        isActive: values.isActive,
        isAdmin: values.isAdmin,
        subscriptionValidUntil,
      });
    }

    setView("list");
    await load(search);
  };

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Delete user "${user.firstName} ${user.lastName}"?`)) return;
    await deleteAdminUser(user.id);
    await load(search);
  };

  const handleToggleActive = async (user: AdminUser) => {
    await setAdminUserActive(user.id, !user.isActive);
    await load(search);
  };

  const openSubscription = (user: AdminUser) => {
    setSubscriptionUser(user);
    setSubscriptionDate(toDateInput(user.subscriptionValidUntil) || new Date().toISOString().slice(0, 10));
  };

  const saveSubscription = async () => {
    if (!subscriptionUser || !subscriptionDate) return;
    const iso = new Date(`${subscriptionDate}T00:00:00.000Z`).toISOString();
    await updateAdminUserSubscription(subscriptionUser.id, iso);
    setSubscriptionUser(null);
    await load(search);
  };

  if (view === "form") {
    return (
      <AdminUserForm
        initialValues={formInitial}
        onSubmit={handleSubmit}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <div className="card p-6 border-2 border-gray-300 rounded-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button type="button" className="pi pi-plus icon-action" title="Create user" onClick={openCreate} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <InputText
          placeholder="Search name, phone, email, CNIC"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input w-full"
        />
        <Button
          label="Search"
          className="form-button-primary"
          onClick={() => void load(search)}
        />
        <Button
          label="Clear"
          className="form-button-secondary"
          onClick={() => {
            setSearch("");
            void load();
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Module</th>
              <th className="p-2">Status</th>
              <th className="p-2">Subscription</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  Loading users...
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-slate-50">
                <td className="p-2">
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                  {user.isAdmin && (
                    <span className="text-xs text-indigo-600 font-medium">Admin</span>
                  )}
                </td>
                <td className="p-2">{user.phoneNumber}</td>
                <td className="p-2">{moduleLabel(user.moduleId)}</td>
                <td className="p-2">
                  <span className={user.isActive ? "text-green-700" : "text-red-600"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-2">
                  <div>{formatDisplayDate(user.subscriptionValidUntil)}</div>
                  {user.isSubscriptionExpired && (
                    <span className="text-xs text-red-600">Expired</span>
                  )}
                </td>
                <td className="p-2 whitespace-nowrap">
                  <button
                    type="button"
                    className="pi pi-pencil icon-action mr-3"
                    title="Edit"
                    onClick={() => openEdit(user)}
                  />
                  <button
                    type="button"
                    className="pi pi-calendar icon-action mr-3"
                    title="Update subscription"
                    onClick={() => openSubscription(user)}
                  />
                  <button
                    type="button"
                    className={`icon-action mr-3 ${user.isActive ? "pi pi-ban icon-action-warning" : "pi pi-check icon-action-success"}`}
                    title={user.isActive ? "Inactivate" : "Activate"}
                    onClick={() => void handleToggleActive(user)}
                  />
                  <button
                    type="button"
                    className="pi pi-trash icon-action icon-action-danger"
                    title="Delete"
                    onClick={() => void handleDelete(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        header="Update subscription validity"
        visible={Boolean(subscriptionUser)}
        style={{ width: "28rem" }}
        onHide={() => setSubscriptionUser(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              className="form-button-secondary"
              onClick={() => setSubscriptionUser(null)}
            />
            <Button label="Save" className="form-button-primary" onClick={() => void saveSubscription()} />
          </div>
        }
      >
        {subscriptionUser && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Set login validity for{" "}
              <strong>
                {subscriptionUser.firstName} {subscriptionUser.lastName}
              </strong>{" "}
              after monthly payment.
            </p>
            <div>
              <label className="form-input-label">Valid until</label>
              <InputText
                type="date"
                value={subscriptionDate}
                onChange={(e) => setSubscriptionDate(e.target.value)}
                className="form-input w-full"
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
