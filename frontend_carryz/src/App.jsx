import { createBrowserRouter,RouterProvider } from "react-router-dom";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Pages/Login"
import SignIn from "./Pages/SignIn"
import DashboardCareer from "./Pages/DashboardCareer";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/home",element: <DashboardCareer/>}
  ]);


  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App
