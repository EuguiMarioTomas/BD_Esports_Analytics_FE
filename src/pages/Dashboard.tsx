import {useNavigate} from "react-router-dom";


function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };
    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Esports Analytics</h1>
                <button onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </header>
            <main className="dashboard-content">
                <h2>Dashboard</h2>
                <p>
                    Bienvenido al panel de Esports Analytics.
                </p>
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h3>Torneos</h3>
                        <p>0</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Equipos</h3>
                        <p>0</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Jugadores</h3>
                        <p>0</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Partidos</h3>
                        <p>0</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;