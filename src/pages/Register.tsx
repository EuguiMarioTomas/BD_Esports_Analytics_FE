import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";

function Register(){
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cargando, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async(e: React.FormEvent) =>{
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    try{
      const res = await fetch(`${baseUrl}/api/auth/register`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json" },
          body: JSON.stringify({nombre_usuario: nombreUsuario, password})
        });
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.message || "Error al registrarse"); 
        }
        setSuccess("¡Cuenta creada con éxito! Redirigiendo al login..."); 
        setTimeout(() => {navigate("/"); }, 2000);
    }catch(err: any){
      setError(err.message || "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };
  return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#0b0f19" }}>
        <div style={{ background: "#1f2937", padding: "2.5rem", borderRadius: "10px", border: "1px solid #374151", width: "100%", maxWidth: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          <h1 style={{ color: "#ffffff", marginBottom: "1.5rem", textAlign: "center" }}>Crear Cuenta 🎮</h1>
          
          {error && <div style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem", border: "1px solid #f87171" }}>{error}</div>}
          {success && <div style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", padding: "0.75rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem", border: "1px solid #34d399" }}>{success}</div>}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                  <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "0.3rem" }}>Usuario</label>
                  <input 
                      type="text" 
                      value={nombreUsuario} 
                      onChange={(e) => setNombreUsuario(e.target.value)} 
                      required
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#111827", border: "1px solid #374151", color: "#fff", outline: "none", boxSizing: "border-box" }}
                  />
              </div>
              <div>
                  <label style={{ color: "#9ca3af", fontSize: "0.85rem", display: "block", marginBottom: "0.3rem" }}>Contraseña</label>
                  <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#111827", border: "1px solid #374151", color: "#fff", outline: "none", boxSizing: "border-box" }}
                  />
              </div>
              <button 
                  type="submit"
                  disabled={cargando}
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
                  }}
              >
                  {cargando ? "Registrando..." : "Registrarse"}
              </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
              ¿Ya tienes cuenta? <Link to="/" style={{ color: "#60a5fa", textDecoration: "none" }}>Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    );
}
export default Register;