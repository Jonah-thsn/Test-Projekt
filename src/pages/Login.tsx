import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err: any) {
      let errorMsg = "Ein Fehler ist aufgetreten.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMsg = "Ungültige E-Mail oder falsches Passwort.";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = "Diese E-Mail-Adresse wird bereits verwendet.";
      } else if (err.code === 'auth/weak-password') {
        errorMsg = "Das Passwort ist zu schwach.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="card login-card">
        <div className="login-header">
          <div className="login-logo">📋</div>
          <h1 className="page-title">{isSignup ? "Konto erstellen" : "Willkommen zurück"}</h1>
          <p className="subtitle">{isSignup ? "Registrieren Sie sich für Schadensmeldungen" : "Bitte melden Sie sich an, um fortzufahren"}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="modern-form">
          {error && <div className="error-card mb-4">{error}</div>}
          
          <div className="form-group">
            <label>E-Mail Adresse</label>
            <input 
              type="email" 
              placeholder="ihre@email.de" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Passwort</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? "Wird geladen..." : (isSignup ? "Registrieren" : "Anmelden")}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="subtitle">
            {isSignup ? "Bereits ein Konto?" : "Noch kein Konto?"}
          </p>
          <button className="btn-text" onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}>
            {isSignup ? "Hier anmelden" : "Hier registrieren"}
          </button>
        </div>
      </div>
    </div>
  );
}
