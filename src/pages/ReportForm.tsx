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
    <div className="report-form">
      <h1>Neue Meldung erstellen</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Titel" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Beschreibung" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Ort" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required 
        />
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={(e) => setFiles(e.target.files)} 
        />
        <div className="form-actions">
          <button type="submit" disabled={uploading}>
            {uploading ? "Wird hochgeladen..." : "Meldung senden"}
          </button>
          <button type="button" onClick={() => navigate("/")} disabled={uploading}>Abbrechen</button>
        </div>
      </form>
    </div>
  );
}
