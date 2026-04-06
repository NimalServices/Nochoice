import { createBrowserRouter,RouterProvider } from "react-router-dom";

import Login from "./Pages/Login"
import SignIn from "./Pages/SignIn"
import Carrier from "./Pages/Carrier"
import SearchCarrier from "./Pages/SearchCarrier"

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/carrier", element: <Carrier /> },
    { path: "/search-carrier", element: <SearchCarrier /> }
  ]);


  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App
