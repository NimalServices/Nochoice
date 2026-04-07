import { createBrowserRouter,RouterProvider } from "react-router-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Pages/Login"
import SignIn from "./Pages/SignIn"
import DashboardCareer from "./Pages/DashboardCareer";
import HomePage from "./Pages/HomePage";

function App() {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/careerhome",element: <DashboardCareer/>},
    { path: "/",element:<HomePage/>}
  ]);


  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App
