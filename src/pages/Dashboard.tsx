import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
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
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "reports"),
      where("ownerUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];
      setReports(docs);
    });

    return unsubscribe;
  }, [user]);

  return (
    <div className="dashboard">
      <header>
        <h1>Meine Meldungen</h1>
        <Link to="/new-report" className="btn-primary">Neue Meldung</Link>
        <button onClick={() => auth.signOut()}>Abmelden</button>
      </header>

      <div className="report-list">
        {reports.length === 0 ? (
          <p>Keine Meldungen vorhanden.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-card">
              {report.photoUrls?.[0] && (
                <img src={report.photoUrls[0]} alt={report.title} className="thumbnail" />
              )}
              <div className="report-info">
                <h3>{report.title}</h3>
                <p>{report.location}</p>
                <p className="date">{new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
