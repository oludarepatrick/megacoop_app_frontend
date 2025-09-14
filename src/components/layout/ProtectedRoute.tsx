import { useAuthStore } from "@/store/authStore"
import {Navigate, Outlet} from "react-router-dom"


const ProtectedRoute = () =>{
    const { isAuthenticated, isLoading } = useAuthStore()

    if(isLoading){
        return <div>Loading..</div>
    }

    if(!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet/>

}

export default ProtectedRoute;