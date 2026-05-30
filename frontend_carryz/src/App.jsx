import { createBrowserRouter,RouterProvider } from "react-router-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Pages/Login"
import SignIn from "./Pages/SignIn"
import DashboardCareer from "./Pages/DashboardCareer";
import HomePage from "./Pages/HomePage";
import Carrier from "./Pages/Carrier"
import SearchCarrier from "./Pages/SearchCarrier";
import CarrierConfirm from "./Pages/CarrierConfirm";
import Notfound from "./Pages/NotFound";

import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/careerhome",element: <DashboardCareer/>},
    // { path: "/",element:<HomePage/>},
    // { path: "/carriers", element: <Carrier /> },
    { path: "/carriers", element: <CarrierConfirm /> },
    { path: "/", element: <SearchCarrier /> , errorElement: <Notfound />},
    { path: "/admin/login", element: <AdminLogin /> },
    { path: "/admin/dashboard", element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute> },
    
  ]);


  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App
