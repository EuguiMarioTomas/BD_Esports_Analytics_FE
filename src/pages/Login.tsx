import { useState } from "react";
import {useNavigate} from "react-router-dom";


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
        <div className="login-page">
            <div className="login-container">
                <h1>Esports Analytics</h1>
                <p>Iniciar sesión</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">
                            Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Ingrese su usuario"
                            value={nombreUsuario}
                            onChange={(event) =>
                                setNombreUsuario(event.target.value)
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </div>
                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}
                    <button type="submit" disabled={cargando}>
                        {cargando
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;