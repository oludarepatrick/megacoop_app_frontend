import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import PageLoader from "./components/PageLoader";
import AuthProtectedRoute from "./components/layout/AuthProtectedRoute";


// Lazy load pages
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const SavingsLoan = lazy(() => import("./pages/SavingsLoan"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Investment = lazy(() => import("./pages/Investment"));
const NewPassword = lazy(() => import("./pages/auth/NewPassword"));
const KYCVerification = lazy(() => import("./pages/KYCPage"));



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
        path: "/forgot-password",
        element: (
            <Suspense fallback={<PageLoader/>}>
                <ForgotPassword/>
            </Suspense>
        )
    },
    {
        path: "/reset-password",
        element: (
            <Suspense fallback={<PageLoader/>}>
                <NewPassword/>
            </Suspense>
        )
    },
     {
        path: "/user",
        element: <AuthProtectedRoute/>,
        children: [
            {
                path: "kyc",
                element: (
                    <Suspense fallback={<PageLoader/>}>
                        <KYCVerification/>
                    </Suspense>
                )
            }
        ]
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
                                <SavingsLoan/>
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
                    {
                        path: "investment",
                        element: (
                            <Suspense fallback={<PageLoader/>}>
                                <Investment/>
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

