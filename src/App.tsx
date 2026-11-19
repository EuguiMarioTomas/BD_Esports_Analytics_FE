import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EquipoDetalle from "./pages/EquipoDetalle";
import TorneoDetalle from "./pages/TorneoDetalle";
import PartidoDetalle from "./pages/PartidoDetalle";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register/>}/>
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/equipo/:id" element={<EquipoDetalle />} />
                    <Route path="/dashboard/torneo/:id" element={<TorneoDetalle />} />
                    <Route path="/dashboard/partido/:id" element={<PartidoDetalle />} />
                </Route>
                <Route path="*" element={
                    <div style={{ textAlign: "center", padding: "5rem", color: "#fff", backgroundColor: "#0b0f19", height: "100vh" }}>
                        <h1 style={{ fontSize: "3rem", color: "#f87171" }}>404</h1>
                        <p style={{ fontSize: "1.2rem", color: "#9ca3af" }}>Página no encontrada</p>
                        <a href="/" style={{ color: "#60a5fa", textDecoration: "none", marginTop: "1rem", display: "inline-block" }}>
                            Volver al inicio
                        </a>
                    </div>
                }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;