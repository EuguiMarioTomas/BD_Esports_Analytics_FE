import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface EquipoTorneo {
    id_equipo: number;
    nombre_equipo: string;
    nombre_region: string;
}

function TorneoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [equipos, setEquipos] = useState<EquipoTorneo[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEquiposTorneo = async () => {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            try {
                const res = await fetch(`${baseUrl}/api/equipos/torneo/${id}`);
                
                if (!res.ok) {
                    throw new Error("No se pudieron cargar los equipos del torneo");
                }

                const data = await res.json();
                setEquipos(data);
            } catch (err) {
                console.error("Error al obtener equipos del torneo:", err);
                setError("Error al cargar la información del torneo.");
            } finally {
                setCargando(false);
            }
        };

        if (id) {
            fetchEquiposTorneo();
        }
    }, [id]);

    return (
        <div className="esports-dashboard">
            <header className="dashboard-navbar">
                <div className="nav-brand">
                    <button className="btn-logout" onClick={() => navigate(-1)} style={{border: "1px solid #2b5aa0", backgroundColor: "#374151", marginRight: "1rem"}}> ⬅️Volver </button>
                    <h1>Esports Analytics | Equipos del Torneo</h1>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="dashboard-welcome">
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <h2 >Participantes del Torneo</h2>
                    <p>Selecciona un equipo para explorar su plantilla de jugadores y su historial de partidos.</p>
                  </div>
                </div>

                {error && <div className="alert-error">{error}</div>}

                {cargando ? (
                    <p className="loading-text">Cargando equipos participantes...</p>
                ) : (
                    <div className="teams-grid" style={{ marginTop: "1.5rem" }}>
                        {equipos.length > 0 ? (
                            equipos.map((eq) => (
                                <div key={eq.id_equipo} className="team-card-item">
                                    <div className="team-details">
                                        <h4>{eq.nombre_equipo}</h4>
                                        <span className="region-tag">Región: {eq.nombre_region}</span>
                                    </div>
                                    <button style={{width: "50%",
                        padding: "0.6rem 1rem",
                        background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "opacity 0.2s ease-in-out",
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)"}}className="btn-drilldown" onClick={() => navigate(`/dashboard/equipo/${eq.id_equipo}`)}> Ver Plantilla y Partidos ➡️ </button>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: "#9ca3af" }}>No hay equipos registrados en este torneo actualmente.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default TorneoDetalle;