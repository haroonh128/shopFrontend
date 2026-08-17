import TailorDashboard from "./pages/tailor-dashboard";
import Measurements from "./pages/measurements";
import Costs from "./pages/costs";

const tailorRoutes = [
    {
        path: '/',
        element: <TailorDashboard />
    },
    {
        path: '/measurements',
        element: <Measurements />
    },
    {
        path: '/costs',
        element: <Costs />
    },
    // {
    //     path: '/tailor-dashboard/orders',
    //     element: <TailorOrders />
    // },
    // {
    //     path: '/tailor-dashboard/orders/order-details',
    //     element: <TailorOrderDetails />
    // }
]

export default tailorRoutes;