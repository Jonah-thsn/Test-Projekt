import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { Headline, Copy, Button, Spacer, Grid } from "../components/NEWComponents";

interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  createdAt: string;
  photoUrls: string[];
  category?: string;
  status?: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Alle");
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "reports"),
      where("ownerUid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Report[];
        
        // Client-side sort (newest first)
        docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setReports(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching reports: ", err);
        setError("Fehler beim Laden der Meldungen.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const filteredReports = reports.filter(r => filter === "Alle" || r.status === filter || (!r.status && filter === "Gemeldet"));

  const getStatusBadge = (status?: string) => {
    const s = status || "Gemeldet";
    let colorClass = "badge-new";
    if (s === "In Bearbeitung") colorClass = "badge-progress";
    if (s === "Abgeschlossen") colorClass = "badge-done";

    return <span className={`badge ${colorClass}`}>{s}</span>;
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Strom': return '⚡';
      case 'Wasser': return '💧';
      case 'Gas': return '🔥';
      case 'Wärme': return '♨️';
      case 'Beleuchtung': return '💡';
      default: return '📋';
    }
  };

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <Headline variant="v1"><span style={{ color: 'var(--new-primary)' }}>NEW</span> Schadensportal</Headline>
          <Copy variant="intro">Übersicht aller erfassten Schäden im Versorgungsgebiet.</Copy>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="primary" onClick={() => navigate("/new-report")}>
            + Neue Meldung
          </Button>
          <Button variant="ghost" onClick={() => auth.signOut()}>
            Abmelden
          </Button>
        </div>
      </div>

      <Spacer size={48} />

      {error && <div className="error-card mb-4" style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Headline variant="h3">Ihre Meldungen ({filteredReports.length})</Headline>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--new-neutral-200)' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Filter nach Status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontWeight: 500, cursor: 'pointer', outline: 'none' }}
          >
            <option value="Alle">Alle</option>
            <option value="Gemeldet">Gemeldet</option>
            <option value="In Bearbeitung">In Bearbeitung</option>
            <option value="Abgeschlossen">Abgeschlossen</option>
          </select>
        </div>
      </div>

      <div className="report-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {loading ? (
          <div className="loading-state">Lade Meldungen...</div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '64px', background: 'var(--new-neutral-50)', borderRadius: '16px', border: '2px dashed var(--new-neutral-200)' }}>
            <div className="empty-icon" style={{ fontSize: '4rem', marginBottom: '16px', color: 'var(--new-neutral-300)' }}>✓</div>
            <Headline variant="h3">Keine Meldungen vorhanden</Headline>
            <Copy>Es liegen keine Schadensmeldungen {filter !== "Alle" ? `mit dem Status "${filter}"` : ""} vor.</Copy>
            {filter === "Alle" && (
              <>
                <Spacer size={24} />
                <Button variant="primary" onClick={() => navigate("/new-report")}>Erste Meldung erstellen</Button>
              </>
            )}
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="card report-card" style={{ display: 'flex', gap: '24px', padding: '24px', transition: 'transform 0.2s' }}>
              <div className="report-image-container">
                {report.photoUrls?.[0] ? (
                  <img src={report.photoUrls[0]} alt={report.title} className="thumbnail" style={{ width: '160px', height: '160px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div className="thumbnail-placeholder" style={{ width: '160px', height: '160px', background: 'var(--new-neutral-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    {getCategoryIcon(report.category)}
                  </div>
                )}
              </div>
              <div className="report-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--new-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{report.category || 'Allgemein'}</span>
                    <Headline variant="h3" style={{ marginTop: '4px', marginBottom: '8px' }}>
                      <span style={{ marginRight: '8px' }}>{getCategoryIcon(report.category)}</span>
                      {report.title}
                    </Headline>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                <Copy variant="small" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📍 {report.location}</span>
                  <span>•</span>
                  <span>📅 {new Date(report.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</span>
                </Copy>
                <Copy style={{ marginBottom: '0' }}>{report.description}</Copy>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
