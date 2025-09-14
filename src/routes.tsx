import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export const routes = createBrowserRouter([
    { path: "/", element: <Navigate to="/dashboard" replace /> },
    { path: "/login", element: <Login/> },
    { path: "/signup", element: <Signup/> },
    { 
        path: "/dashboard", 
        element: <ProtectedRoute/>,
        children: [
            {
                element: <DashboardLayout/>,
                children: [
                    { index: true, element: <Dashboard/>},
                    { path: "transactions", element: <Transactions/> },
                    { path: "settings", element: <Settings/> },
                ]
            }
        ]
    },
    { path: "*", element: <NotFound/>}
    

])
