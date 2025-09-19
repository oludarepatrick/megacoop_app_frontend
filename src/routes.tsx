import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import PageLoader from "./components/PageLoader";

// Lazy load pages
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));



export const routes = createBrowserRouter([
    { path: "/", element: <Navigate to="/user/dashboard" replace /> },
    { 
        path: "/login", 
        element: (
            <Suspense fallback={<PageLoader/>}>
                <Login/>
            </Suspense>
        )
    },
    { 
        path: "/signup", 
        element: (
            <Suspense fallback={<PageLoader/>}>
                <Signup/>
            </Suspense>
        )
    },
    { 
        path: "/user", 
        element: <ProtectedRoute/>,
        children: [
            {
                element: <DashboardLayout/>,
                children: [
                    { 
                        path: "dashboard", 
                        element: (
                            <Suspense fallback={<PageLoader/>}>
                                <Dashboard/>
                            </Suspense>
                        )
                    },
                    { 
                        path: "transactions", 
                        element: (
                            <Suspense fallback={<PageLoader/>}>
                                <Transactions/>
                            </Suspense>
                        )
                    },
                    { 
                        path: "savings-loan", 
                        element: (
                            <Suspense fallback={<PageLoader/>}>
                                <Transactions/>
                            </Suspense>
                        )
                    },
                    { 
                        path: "settings", 
                        element: (
                            <Suspense fallback={<PageLoader/>}>
                                <Settings/>
                            </Suspense>
                        )
                    },
                ]
            }
        ]
    },
    { 
        path: "*", 
        element: (
            <Suspense fallback={<PageLoader/>}>
                <NotFound/>
            </Suspense>
        )
    }
]);

