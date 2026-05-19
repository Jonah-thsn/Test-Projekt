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
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // Use a simple query and sort client-side to avoid Firestore composite index errors
    // which is often why lists remain silently empty for developers.
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

  return (
    <div className="dashboard page-container">
      <header className="dashboard-header">
        <div>
          <h1 className="page-title">Meine Meldungen</h1>
          <p className="subtitle">Übersicht aller erfassten Schäden</p>
        </div>
        <div className="header-actions">
          <Link to="/new-report" className="btn btn-primary">+ Neue Meldung</Link>
          <button className="btn btn-secondary" onClick={() => auth.signOut()}>Abmelden</button>
        </div>
      </header>

      {error && <div className="error-card">{error}</div>}

      <div className="report-list">
        {loading ? (
          <div className="loading-state">Lade Meldungen...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>Keine Meldungen vorhanden</h3>
            <p>Du hast noch keine Schadensmeldungen erstellt.</p>
            <Link to="/new-report" className="btn btn-primary mt-4">Erste Meldung erstellen</Link>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="card report-card">
              <div className="report-image-container">
                {report.photoUrls?.[0] ? (
                  <img src={report.photoUrls[0]} alt={report.title} className="thumbnail" />
                ) : (
                  <div className="thumbnail-placeholder">📷 Kein Bild</div>
                )}
              </div>
              <div className="report-content">
                <div className="report-header">
                  <h3 className="report-title">{report.title}</h3>
                  <span className="report-date">
                    {new Date(report.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
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
