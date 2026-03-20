import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { UserNavbar } from "../components/user/UserNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { CarList } from "../components/user/CarList";
import { CarDetail } from "../components/user/CarDetail";
import { AllUserList } from "../components/admin/AllUserList";
import { GetApiDemo } from "../components/user/GetApiDemo";
import { UseEffectDemo } from "../components/user/UseEffectDemo";
import { CreateProductComponent } from "../components/admin/CreateProductComponent";
import ProtectedRoutes from "../components/ProtectedRoutes";
import { ProductList } from "../components/user/ProductList";

const router = createBrowserRouter([
    {path:"/",element:<Login/>},
    {path:"/signup",element:<Signup/>},

    
    {path:"/user",element:
        <ProtectedRoutes userRoles={["user"]}>
            <UserNavbar/>,
        </ProtectedRoutes>,
        children:[
            {path:"carlist",element:<CarList/>},
            {path:"cardetail",element:<CarDetail/>},
            {path:"getapidemo1",element:<GetApiDemo/>},
            {path:"useeffectdemo",element:<UseEffectDemo/>},
            {path:"products",element:<ProductList/>}

        ]
    },
    {
        path:"/admin",element:
        <ProtectedRoutes userRoles={["admin"]}>
        <AdminSidebar/>,
        </ProtectedRoutes>,
        children:[
            {path:"allusers",element:<AllUserList/>},
            {path:"createproduct",element:<CreateProductComponent/>}
        ]
    }
])

const AppRouter = ()=>{
    return <RouterProvider router={router}></RouterProvider>
}
export default AppRouter