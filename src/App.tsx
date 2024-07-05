import { Route, Routes, useNavigate } from "react-router-dom"
import Login from "./components/Login"
import globalRouter from "./services/globalRouter.service";
import { setupInterceptorsTo } from "./interceptors/axios.interceptor";
import axios from "axios";
import { lazy } from "react";
import { PrivateRoute } from "./components/PrivateRoute";

setupInterceptorsTo(axios);

const Data = lazy(() => import("./pages/Data"))

function App() {

  const navigate = useNavigate();
  globalRouter.navigate = navigate;

  return (
    <>
      <Routes>
        <Route path="" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="data" element={<Data />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
