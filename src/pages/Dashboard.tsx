import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";

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
    <div className="dashboard page-container">
      <header className="dashboard-header">
        <div>
          <h1 className="page-title"><span className="brand-new">NEW</span> Schadensportal</h1>
          <p className="subtitle">Übersicht aller erfassten Schäden im Versorgungsgebiet</p>
        </div>
        <div className="header-actions">
          <Link to="/new-report" className="btn btn-primary">+ Neue Meldung</Link>
          <button className="btn btn-secondary" onClick={() => auth.signOut()}>Abmelden</button>
        </div>
      </header>

      {error && <div className="error-card mb-4">{error}</div>}

      <div className="dashboard-controls mb-6">
        <label className="font-semibold mr-2">Filter nach Status: </label>
        <select 
          className="form-select w-auto inline-block" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Alle">Alle</option>
          <option value="Gemeldet">Gemeldet</option>
          <option value="In Bearbeitung">In Bearbeitung</option>
          <option value="Abgeschlossen">Abgeschlossen</option>
        </select>
      </div>

      <div className="report-list">
        {loading ? (
          <div className="loading-state">Lade Meldungen...</div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h3>Keine Meldungen vorhanden</h3>
            <p>Es liegen keine Schadensmeldungen {filter !== "Alle" ? `mit dem Status "${filter}"` : ""} vor.</p>
            {filter === "Alle" && (
              <Link to="/new-report" className="btn btn-primary mt-4">Erste Meldung erstellen</Link>
            )}
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="card report-card">
              <div className="report-image-container">
                {report.photoUrls?.[0] ? (
                  <img src={report.photoUrls[0]} alt={report.title} className="thumbnail" />
                ) : (
                  <div className="thumbnail-placeholder">
                    <span className="category-icon-large">{getCategoryIcon(report.category)}</span>
                  </div>
                )}
              </div>
              <div className="report-content">
                <div className="report-header">
                  <h3 className="report-title">
                    <span className="category-icon">{getCategoryIcon(report.category)}</span>
                    {report.title}
                  </h3>
                  {getStatusBadge(report.status)}
                </div>
                <p className="report-meta mb-2">
                  <span className="report-date">
                    {new Date(report.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  {' • '}
                  <span className="font-medium text-primary">{report.category || 'Allgemein'}</span>
                </p>
                <p className="report-location">📍 {report.location}</p>
                <p className="report-description">{report.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
