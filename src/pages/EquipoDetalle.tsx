import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface Jugador {
    id_jugador: number;
    nickname: string;
    rol: string;
}

interface Partido {
    id_partido: number;
    nombre_torneo: string;
    nombre_equipo_1: string;
    nombre_equipo_2: string;
    id_equipo_ganador: number | null;
    fecha_partido: string;
}

function EquipoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [jugadores, setJugadores] = useState<Jugador[]>([]);
    const [partidos, setPartidos] = useState<Partido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDatosEquipo = async () => {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            try {
                const [resJugadores, resPartidos] = await Promise.all([
                    fetch(`${baseUrl}/api/jugadores/equipo/${id}`),
                    fetch(`${baseUrl}/api/partidos/equipo/${id}`)
                ]);

                if (!resJugadores.ok || !resPartidos.ok) {
                    throw new Error("Error al obtener la información del equipo");
                }

                const dataJugadores = await resJugadores.json();
                const dataPartidos = await resPartidos.json();

                const ordenRoles: { [key: string]: number } = {
                    "Top": 1,
                    "Jungle": 2,
                    "Mid": 3,
                    "ADC": 4,
                    "Support": 5,
                };
                dataJugadores.sort((a: Jugador, b: Jugador) => {
                    const ordenA = ordenRoles[a.rol] || 99;
                    const ordenB = ordenRoles[b.rol] || 99;
                    return ordenA - ordenB;
                });

                setJugadores(dataJugadores);
                setPartidos(dataPartidos);
            } catch (err) {
                console.error("Error:", err);
                setError("No se pudo cargar la información del equipo.");
            } finally {
                setCargando(false);
            }
        };

        if (id) {
            fetchDatosEquipo();
        }
    }, [id]);

    return (
        <div className="esports-dashboard">
            <header className="dashboard-navbar">
                <div className="nav-brand">
                    <button className="btn-logout" onClick={() => navigate(-1)} style={{ backgroundColor: "#374151", marginRight: "1rem" }}>⬅️ Volver</button>
                    <h1>Esports Analytics | Detalle del Equipo</h1>
                </div>
            </header>

            <main className="dashboard-content">
                {error && <div className="alert-error">{error}</div>}

                {cargando ? (
                    <p className="loading-text">Cargando datos del equipo...</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <div style={{ background: "#1f2937", padding: "1.5rem", borderRadius: "8px", border: "1px solid #374151" }}>
                            <h3 style={{ marginBottom: "1rem", color: "#60a5fa", borderBottom: "2px solid #374151", paddingBottom: "0.5rem" }}>👥 Plantilla de Jugadores</h3>
                            <div className="teams-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                                {jugadores.length > 0 ? (
                                    jugadores.map((j) => (
                                        <div key={j.id_jugador} style={{ background: "#111827", padding: "1rem", borderRadius: "6px", border: "1px solid #374151" }}>
                                            <span style={{ fontSize: "0.85rem", color: "#9ca3af", display: "block" }}>{j.rol}</span>
                                            <h4 style={{ color: "#ffffff", marginTop: "0.25rem" }}>{j.nickname}</h4>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: "#9ca3af" }}>No hay jugadores registrados en este equipo.</p>
                                )}
                            </div>
                        </div>
                        <div style={{ background: "#1f2937", padding: "1.5rem", borderRadius: "8px", border: "1px solid #374151" }}>
                            <h3 style={{ marginBottom: "1rem", color: "#60a5fa", borderBottom: "2px solid #374151", paddingBottom: "0.5rem" }}>⚔️ Historial de Partidos</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {partidos.length > 0 ? (
                                    partidos.map((p) => (
                                        <div key={p.id_partido} style={{ background: "#111827", padding: "1rem 1.5rem", borderRadius: "6px", border: "1px solid #374151",display: "flex",justifyContent: "space-between",alignItems: "center",flexWrap: "wrap",gap: "1rem"}}>
                                            <div>
                                                <span style={{ fontSize: "0.8rem", color: "#9ca3af", display: "block" }}>{p.nombre_torneo}</span>
                                                <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#ffffff" }}>
                                                    {p.nombre_equipo_1} vs {p.nombre_equipo_2}
                                                </span>
                                                <span style={{ fontSize: "0.8rem", color: "#6b7280", display: "block", marginTop: "0.2rem" }}>
                                                    Fecha: {new Date(p.fecha_partido).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <button className="btn-drilldown" onClick={() => navigate(`/dashboard/partido/${p.id_partido}`)} style={{width: "30%",
                                              padding: "0.6rem",
                                              background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                                              color: "#ffffff",
                                              border: "none",
                                              borderRadius: "6px",
                                              fontWeight: "600",
                                              cursor: "pointer",
                                              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)"}}>
                                                Ver Estadísticas y KDA ➡️
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: "#9ca3af" }}>Este equipo aún no registra partidos jugados.</p>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}

export default EquipoDetalle;