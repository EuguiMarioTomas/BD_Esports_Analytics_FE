import { Navigate, Outlet } from "react-router-dom";

export default function Protected_Route(){
  const usuario_logueado = localStorage.getItem("usuario")
  if(!usuario_logueado){
    return <Navigate to="/" replace/>
  }
  return <Outlet/>
}

