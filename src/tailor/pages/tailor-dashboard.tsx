import Users from "../../authentication/pages/users";

const TailorDashboard = () => {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Tailor Dashboard</h1>
            <Users />
        </div>
    );
};

export default TailorDashboard;
