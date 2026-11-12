import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface EstadisticaJugador {
    id_jugador: number;
    nickname: string;
    rol: string;
    id_equipo: number;
    nombre_equipo: string;
    asesinatos: number;
    muertes: number;
    asistencias: number;
    id_equipo_ganador: number | null;
}

const ordenRoles: { [key: string]: number } = {
    "Top": 1,
    "Jungle": 2,
    "Mid": 3,
    "ADC": 4,
    "Support": 5,
};

function PartidoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [jugadoresPorEquipo, setJugadoresPorEquipo] = useState<{ [key: string]: EstadisticaJugador[] }>({});
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

useEffect(() => {
        const fetchEstadisticasPartido = async () => {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            try {
                const res = await fetch(`${baseUrl}/api/partidos/${id}/estadisticas`);
                if (!res.ok) throw new Error("Error al obtener las estadísticas del partido");

                const data: EstadisticaJugador[] = await res.json();

               data.sort((a, b) => {
                    const ordenA = ordenRoles[a.rol] || 99;
                    const ordenB = ordenRoles[b.rol] || 99;
                    console.log(`Jugador: ${a.nickname} | Rol original: "${a.rol}" | Rol normalizado: "${a.rol}" | Prioridad numérica: ${ordenA}`);
                    console.log(`Jugador: ${b.nickname} | Rol en BD: "${b.rol}" | Normalizado: "${b.rol}" | Prioridad numérica: ${ordenB}`);

                    return ordenA - ordenB;
                });

                const agrupados = data.reduce((acc: { [key: string]: EstadisticaJugador[] }, jugador) => {
                    if (!acc[jugador.nombre_equipo]) {
                        acc[jugador.nombre_equipo] = [];
                    }
                    acc[jugador.nombre_equipo].push(jugador);
                    return acc;
                }, {});

                setJugadoresPorEquipo(agrupados);
            } catch (err) {
                console.error("Error:", err);
                setError("No se pudieron cargar las estadísticas de este partido.");
            } finally {
                setCargando(false);
            }
        };

        if (id) fetchEstadisticasPartido();
    }, [id]);

    // Función auxiliar opcional para dar color al KDA (Semáforo analítico)
    const obtenerClaseKDA = (asesinatos: number, muertes: number, asistencias: number) => {
        const kda = muertes === 0 ? (asesinatos + asistencias) : (asesinatos + asistencias) / muertes;
        if (kda >= 3.5) return { color: "#34d399", fontWeight: "bold" }; // Verde (Excelente)
        if (kda >= 2.0) return { color: "#fbbf24", fontWeight: "bold" }; // Amarillo (Estándar)
        return { color: "#f87171", fontWeight: "bold" }; // Rojo (Bajo rendimiento)
    };

    return (
        <div className="esports-dashboard">
            <header className="dashboard-navbar">
                <div className="nav-brand">
                    <button className="btn-logout" onClick={() => navigate(-1)} style={{ backgroundColor: "#374151", marginRight: "1rem" }}>⬅️ Volver</button>
                    <h1>Esports Analytics | Detalle de Partido y KDA</h1>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="dashboard-welcome">
                    <h2>Estadísticas de Jugadores por Partido</h2>
                    <p>Rendimiento individual ordenado por rol (Top, Jungle, Mid, ADC, Support).</p>
                </div>

                {error && <div className="alert-error">{error}</div>}

                {cargando ? (
                    <p className="loading-text">Cargando rendimiento de la partida...</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "1rem" }}>
                        {Object.keys(jugadoresPorEquipo).length > 0 ? (
                            Object.entries(jugadoresPorEquipo).map(([nombreEquipo, jugadores]) => { 
                              const idGanador = jugadores.length > 0 ? jugadores[0].id_equipo_ganador : null;
                              const idEquipoActual = jugadores.length > 0 ? jugadores[0].id_equipo : null;
                              const esGanador = idGanador != null && idEquipoActual != null && Number(idEquipoActual) === Number(idGanador);
                              return(
                                <div key={nombreEquipo} style={{ background: "#1f2937", padding: "1.5rem", borderRadius: "8px", border: "1px solid #374151" }}>
                                    <h3 style={{ marginBottom: "1rem", color: "#60a5fa", borderBottom: "2px solid #374151", paddingBottom: "0.5rem" }}>
                                        🛡️ {nombreEquipo}
                                    </h3>
                                    <span style={{
                                      padding: "0.3rem 0.8rem",
                                      borderRadius: "6px",
                                      fontSize: "0.85rem",
                                      fontWeight: "bold",
                                      backgroundColor: esGanador ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
                                      color: esGanador ? "#34d399" : "#f87171",
                                      border: `1px solid ${esGanador ? "#34d399" : "#f87171"}`
                                    }}>{esGanador ? "🏆Ganador" : "Perdedor"}
                                    </span>
                                <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                            <thead>
                                                <tr style={{ color: "#9ca3af", borderBottom: "1px solid #374151", fontSize: "0.9rem" }}>
                                                    <th style={{ padding: "0.75rem" }}>Rol</th>
                                                    <th style={{ padding: "0.75rem" }}>Nickname</th>
                                                    <th style={{ padding: "0.75rem", textAlign: "center" }}>Asesinatos (K)</th>
                                                    <th style={{ padding: "0.75rem", textAlign: "center" }}>Muertes (D)</th>
                                                    <th style={{ padding: "0.75rem", textAlign: "center" }}>Asistencias (A)</th>
                                                    <th style={{ padding: "0.75rem", textAlign: "center" }}>KDA Ratio</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jugadores.map((j) => {
                                                    const kdaVal = j.muertes === 0 ? (j.asesinatos + j.asistencias) : Number(((j.asesinatos + j.asistencias) / j.muertes).toFixed(2));
                                                    return (
                                                        <tr key={j.id_jugador} style={{ borderBottom: "1px solid #374151", fontSize: "0.95rem" }}>
                                                            <td style={{ padding: "0.75rem", fontWeight: "bold", color: "#e5e7eb" }}>{j.rol}</td>
                                                            <td style={{ padding: "0.75rem", color: "#ffffff" }}>{j.nickname}</td>
                                                            <td style={{ padding: "0.75rem", textAlign: "center", color: "#34d399" }}>{j.asesinatos}</td>
                                                            <td style={{ padding: "0.75rem", textAlign: "center", color: "#f87171" }}>{j.muertes}</td>
                                                            <td style={{ padding: "0.75rem", textAlign: "center", color: "#60a5fa" }}>{j.asistencias}</td>
                                                            <td style={{ padding: "0.75rem", textAlign: "center", ...obtenerClaseKDA(j.asesinatos, j.muertes, j.asistencias) }}>
                                                                {kdaVal}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                          })
                        ) : (
                            <p style={{ color: "#9ca3af" }}>No hay estadísticas registradas para este partido.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default PartidoDetalle;