import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EquipoDetalle from "./pages/EquipoDetalle";
import TorneoDetalle from "./pages/TorneoDetalle";
import PartidoDetalle from "./pages/PartidoDetalle";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/equipo/:id" element={<EquipoDetalle />} />
                <Route path="/dashboard/torneo/:id" element={<TorneoDetalle />} />
                <Route path="/dashboard/partido/:id" element={<PartidoDetalle />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;