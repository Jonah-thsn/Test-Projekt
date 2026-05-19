import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Headline, Copy, Button, Spacer } from "../components/NEWComponents";

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
    <div className="login-wrapper" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <Headline variant="v1">{isSignup ? "Konto erstellen" : "Willkommen zurück"}</Headline>
            <Copy variant="intro">{isSignup ? "Registrieren Sie sich für Schadensmeldungen" : "Bitte melden Sie sich an, um fortzufahren"}</Copy>
          </div>
          
          <Spacer size={32} />
          
          <form onSubmit={handleSubmit} className="modern-form">
            {error && <div className="error-card mb-4" style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
            
            <div className="form-group">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>E-Mail Adresse</label>
              <input 
                type="email" 
                placeholder="ihre@email.de" 
                className="w-full"
                style={{ padding: '12px', border: '1px solid var(--new-neutral-300)', borderRadius: '8px' }}
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <Spacer size={16} />
            
            <div className="form-group">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Passwort</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full"
                style={{ padding: '12px', border: '1px solid var(--new-neutral-300)', borderRadius: '8px' }}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <Spacer size={24} />
            
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Wird geladen..." : (isSignup ? "Registrieren" : "Anmelden")}
            </Button>
          </form>
          
          <Spacer size={32} />
          
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--new-neutral-200)', paddingTop: '24px' }}>
            <Copy variant="small">
              {isSignup ? "Bereits ein Konto?" : "Noch kein Konto?"}
            </Copy>
            <Button variant="ghost" onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}>
              {isSignup ? "Hier anmelden" : "Hier registrieren"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
