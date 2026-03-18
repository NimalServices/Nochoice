import { createBrowserRouter,RouterProvider } from "react-router-dom";

import Login from "./Pages/Login"
import SignIn from "./Pages/SignIn"

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/signin", element: <SignIn /> }
  ]);


  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App
