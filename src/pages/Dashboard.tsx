import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Dashboard.css";

interface Equipo{
    id_equipo: number;
    nombre_equipo: string;
    id_region: number;
    nombre_region: string;
}
interface Torneo{
    id_torneo: number;
    nombre_torneo: string;
    fecha_inicio: string;
    fecha_fin: string;
}
interface Jugador{
    id_jugador: number;
    nickname: string;
    rol: string;
    id_equipo: number;
    nombre_equipo: string;
    asesinatos: number;
    muertes: number;
    asistencias: number;
}
interface Partido{
    id_partido: number;
    id_torneo: number;
    nombre_torneo: string;
    fecha_partido: string;
    nombre_equipo_1: string;
    nombre_equipo_2: string;
    nombre_equipo_ganador: string;
}

function Dashboard() {
    const navigate = useNavigate();

    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [torneos, setTorneos] = useState<Torneo[]>([]);
    const [jugadores, setJugadores] = useState<Jugador[]>([]);
    const [partidos, setPartidos] = useState<Partido[]>([]);

    const [seccionActiva, setSeccionActiva] = useState<"jugadores" | "equipos" | "torneos" | "partidos">("equipos");

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };
    useEffect(() => {
        const fetchAllData = async () => {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            try{
                const [equiposResponse, torneosResponse, jugadoresResponse, partidosResponse] = await Promise.all([
                    fetch(`${baseUrl}/api/equipos`),
                    fetch(`${baseUrl}/api/torneos`),
                    fetch(`${baseUrl}/api/jugadores`),
                    fetch(`${baseUrl}/api/partidos`)
                ]);
                
                if(!equiposResponse.ok || !torneosResponse.ok || !jugadoresResponse.ok || !partidosResponse.ok){
                    throw new Error("Error al obtener los datos desde el servidor");
                }
                const dataPartidos: Partido[] = await partidosResponse.json();
                dataPartidos.sort((a, b) => new Date(b.fecha_partido).getTime() - new Date(a.fecha_partido).getTime());
                const dataEquipos = await equiposResponse.json();
                const dataTorneos = await torneosResponse.json();
                const dataJugadores = await jugadoresResponse.json();
                setEquipos(dataEquipos);
                setTorneos(dataTorneos);
                setJugadores(dataJugadores);
                setPartidos(dataPartidos);
            }catch (error) {
            console.error("Error al conectar con el servidor:", error);
            setError("No se pudo conectar con el servidor. Por favor, inténtelo de nuevo más tarde.");
            }finally{
                setCargando(false);
            }
        };
        fetchAllData();
    },[]);
    return (
        <div className="esports-dashboard">
            <header className="dashboard-navbar">
                <div className="nav-brand">
                    <span className="brand-badge">PRO</span>
                    <h1>Esports Analytics</h1>
                </div>
                <div className="nav-user">
                    <span className="status-indicator"></span>
                    <button className="btn-logout" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="dashboard-welcome">
                    <h2>Panel de Control General</h2>
                    <p>Explora, visualiza y analiza información de torneos y equipos de Esports.</p>
                </div>
                {error && <div className="alert-error">{error}</div>}

                <div className="metrics-grid">
                    <div className="metric-card" onClick={() => setSeccionActiva("torneos")} style={{ cursor: "pointer" }}>
                        <div className="metric-info">
                            <h3>Torneos</h3>
                            <p className="metric-value">{cargando ? "..." : torneos.length}</p>
                            <span className="region-tag" style={{ marginTop: "0.5rem", display: "inline-block" }}>Ver Torneos </span>
                        </div>
                        <div className="metric-icon torneos">🏆</div>
                    </div>

                    <div className="metric-card" onClick={() => setSeccionActiva("equipos")} style={{ cursor: "pointer" }}>
                        <div className="metric-info">
                            <h3>Equipos</h3>
                            <p className="metric-value">{cargando ? "..." : equipos.length}</p>
                            <span className="region-tag" style={{ marginTop: "0.5rem", display: "inline-block" }}>Ver Equipos </span>
                        </div>
                        <div className="metric-icon equipos">🛡️</div>
                    </div>

                    <div className="metric-card" onClick={() => setSeccionActiva("jugadores")} style={{ cursor: "pointer" }}>
                        <div className="metric-info">
                            <h3>Jugadores</h3>
                            <p className="metric-value">{cargando ? "..." : jugadores.length}</p>
                            <span className="region-tag" style={{ marginTop: "0.5rem", display: "inline-block", opacity: 0.7 }}>Total Registrados</span>
                        </div>
                        <div className="metric-icon jugadores">🎮</div>
                    </div>

                    <div className="metric-card" onClick={() => setSeccionActiva("partidos")} style={{ cursor: "pointer" }}>
                        <div className="metric-info">
                            <h3>Partidos</h3>
                            <p className="metric-value">{cargando ? "..." : partidos.length}</p>
                            <span className="region-tag" style={{ marginTop: "0.5rem", display: "inline-block", opacity: 0.7 }}>Ver Recientes</span>
                        </div>
                        <div className="metric-icon partidos">⚔️</div>
                    </div>
                </div>
                <section className="analytics-section">
                    <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3>
                            {seccionActiva === "equipos" && "🛡️ Equipos Registrados (Haz clic para ver Plantilla y Partidos)"}
                            {seccionActiva === "torneos" && "🏆 Torneos Disponibles (Haz clic para ver Equipos)"}
                            {seccionActiva === "partidos" && "⚔️ Historial de Partidos (Del más reciente al más antiguo)"}
                            {seccionActiva === "jugadores" && "🎮 Jugadores Registrados (Haz clic para ver Detalles)"}
                        </h3>
                    </div>

                    {cargando ? (
                    <p className="loading-text">Cargando registros...</p>
                    ) : (
                        <div>
                         
                            {seccionActiva === "equipos" && (
                                <div className="teams-grid" style={{ marginTop: "1rem" }}>
                                    {equipos.map((eq) => (
                                        <div key={eq.id_equipo} className="team-card-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                            <div className="team-details">
                                                <h4>{eq.nombre_equipo}</h4>
                                                <span className="region-tag">Región: {eq.nombre_region}</span>
                                            </div>
                                            <button className="btn-drilldown" onClick={() => navigate(`/dashboard/equipo/${eq.id_equipo}`)} style={{marginTop: "1rem", width: "100%", border: "1px solid #2b5aa0", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s ease-in-out" }}>
                                                Ver Equipo
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            
                            {seccionActiva === "torneos" && (
                                <div className="teams-grid" style={{ marginTop: "1rem" }}>
                                   {torneos.map((t) => (
                                    <div key={t.id_torneo} className="team-card-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                        <span className="region-tag" style={{ marginBottom: "0.5rem" }}>{t.nombre_torneo}</span>
                                        <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{t.nombre_torneo}</h4>
                                        <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "1rem" }}>
                                            Del {new Date(t.fecha_inicio).toLocaleDateString()} al {new Date(t.fecha_fin).toLocaleDateString()}
                                        </p>
                                        <button className="btn-drilldown" onClick={() => navigate(`/dashboard/torneo/${t.id_torneo}`)} style={{width: "100%", border: "1px solid #2b5aa0", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s ease-in-out" }}> Ver Equipos </button>
                                    </div>
                                   ))}
                                </div>
                            )}
                           
                            {seccionActiva === "partidos" && (
                                <div className="teams-grid" style={{ marginTop: "1rem" }}>
                                    {partidos.map((p) => (
                                        <div key={p.id_partido} className="team-card-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "0.5rem" }}>
                                                <span className="region-tag" style={{ margin: "0.25rem 0.5rem", borderRadius: "0.25rem" }}> {p.nombre_torneo} </span>
                                                <span style={{ color: "#9ca3af", fontSize: "0.85rem", margin: "0.25rem 0.5rem" }}>
                                                    {new Date(p.fecha_partido).toLocaleString()}
                                                </span>
                                            </div>
                                            <h4 style={{ fontSize: "1.1rem", margin: "0.5rem 0" }}>
                                                {p.nombre_equipo_1} vs {p.nombre_equipo_2}
                                            </h4>
                                            <button className="btn-drilldown" onClick={() => navigate(`/dashboard/partido/${p.id_partido}`)} style={{width: "100%", border: "1px solid #2b5aa0", borderRadius: "6px", cursor: "pointer", transition: "all 0.2 ease-in-out" }}> Ver Detalles del Partido </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {seccionActiva === "jugadores" && (
                                <div className="teams-grid" style={{ marginTop: "1rem" }}>
                                    {jugadores.map((j) => (

                                        <div key={j.id_jugador} className="team-card-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                                            <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{j.nickname}</h4>
                                            <span className="region-tag" style={{ marginTop: "0.5rem" }}>Rol: {j.rol}</span>
                                            <span className="region-tag" style={{ marginTop: "0.5rem" }}>Equipo: {j.nombre_equipo}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;