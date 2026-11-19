import { useState } from "react";
import {useNavigate, Link} from "react-router-dom";


function Login() {
    const navigate = useNavigate();

    const [nombreUsuario, setNombreUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setCargando(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre_usuario: nombreUsuario,
                        password: password,
                    }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                return;
            }
            console.log("Login exitoso:", data);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            console.log("Usuario guardado en localStorage:", data.usuario);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            setError("No se pudo conectar con el servidor");
        } finally {
            setCargando(false);
        }
    };
    return (
        <div  style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#0b0f19" }}>
            <div style={{ background: "#1f2937", padding: "2.5rem", borderRadius: "10px", border: "1px solid #374151", width: "100%", maxWidth: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                <h1 style={{ color: "#ffffff", marginBottom: "1.5rem", textAlign: "center" }}>Iniciar sesión</h1>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label htmlFor="username" style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "0.3rem" }}> Usuario </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Ingrese su usuario"
                            value={nombreUsuario}
                            onChange={(event) => setNombreUsuario(event.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#111827", border: "1px solid #374151", color: "#fff", outline: "none", boxSizing: "border-box" }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"  style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "0.3rem" }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#111827", border: "1px solid #374151", color: "#fff", outline: "none", boxSizing: "border-box" }}
                        />
                    </div>
                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}
                    <button type="submit" disabled={cargando}
                     style={{ 
                      marginTop: "1rem",
                      padding: "0.75rem",
                      background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                      cursor: cargando ? "not-allowed" : "pointer",
                      opacity: cargando ? 0.7 : 1
                  }}>
                        {cargando
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"}
                    </button>
                </form>
                <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
              ¿No tienes cuenta? <Link to="/register" style={{ color: "#60a5fa", textDecoration: "none" }}>Crea una cuenta</Link>
          </p>
            </div>
        </div>
    );
}

export default Login;