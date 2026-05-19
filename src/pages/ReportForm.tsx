import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setUploading(true);
    try {
      const photoUrls: string[] = [];
      const ownerUid = auth.currentUser.uid;
      const reportId = Math.random().toString(36).substring(7); // Temporary ID for path

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const storageRef = ref(storage, `reports/${ownerUid}/${reportId}/${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          photoUrls.push(url);
        }
      }

      await addDoc(collection(db, "reports"), {
        title,
        description,
        location,
        photoUrls,
        ownerUid,
        createdAt: new Date().toISOString()
      });

      navigate("/");
    } catch (err) {
      console.error("Error creating report:", err);
      alert("Fehler beim Erstellen der Meldung.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card report-form-card">
        <h1 className="page-title">Neue Meldung erstellen</h1>
        <p className="subtitle mb-6">Bitte beschreiben Sie den Schaden möglichst genau und fügen Sie Fotos hinzu.</p>
        
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group">
            <label>Titel der Meldung</label>
            <input 
              type="text" 
              placeholder="z.B. Wasserschaden im Bad" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Beschreibung</label>
            <textarea 
              placeholder="Genaue Beschreibung des Schadens..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label>Ort / Adresse</label>
            <input 
              type="text" 
              placeholder="z.B. Musterstraße 1, 12345 Stadt" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Fotos (optional, mehrfach möglich)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => setFiles(e.target.files)} 
              className="file-input"
            />
          </div>

          <div className="form-actions mt-6">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/")} disabled={uploading}>
              Abbrechen
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? "Wird hochgeladen..." : "Meldung absenden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
