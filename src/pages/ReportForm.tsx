import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Headline, Copy, Button, Spacer } from "../components/NEWComponents";

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Strom");
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
        category,
        status: "Gemeldet", // Default status
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
    <div className="container" style={{ padding: '48px 24px' }}>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Headline variant="v1">Schaden melden</Headline>
        <Copy variant="intro">Bitte beschreiben Sie den Vorfall für die NEW AG detailliert, damit wir schnell handeln können.</Copy>
        
        <Spacer size={32} />
        
        <form onSubmit={handleSubmit} className="modern-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Kategorie</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid var(--new-neutral-300)', borderRadius: '8px' }}
              >
                <option value="Strom">Strom</option>
                <option value="Gas">Gas</option>
                <option value="Wasser">Wasser</option>
                <option value="Wärme">Wärme</option>
                <option value="Beleuchtung">Straßenbeleuchtung</option>
                <option value="Sonstiges">Sonstiges</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Titel der Meldung</label>
              <input 
                type="text" 
                placeholder="Kurze Zusammenfassung" 
                style={{ width: '100%', padding: '12px', border: '1px solid var(--new-neutral-300)', borderRadius: '8px' }}
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <Spacer size={24} />

          <div className="form-group">
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Beschreibung</label>
            <textarea 
              placeholder="Genaue Beschreibung des Schadens..." 
              style={{ width: '100%', padding: '12px', border: '1px solid var(--new-neutral-300)', borderRadius: '8px' }}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows={4}
            />
          </div>
          
          <Spacer size={24} />

          <div className="form-group">
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Ort / Adresse</label>
            <input 
              type="text" 
              placeholder="Straße, Hausnummer, PLZ Ort" 
              style={{ width: '100%', padding: '12px', border: '1px solid var(--new-neutral-300)', borderRadius: '8px' }}
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
            />
          </div>
          
          <Spacer size={24} />

          <div className="form-group">
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Fotos (optional)</label>
            <div style={{ border: '2px dashed var(--new-neutral-200)', padding: '24px', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--new-neutral-50)' }}>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => setFiles(e.target.files)} 
                id="file-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📸</div>
                <Copy variant="medium" style={{ fontWeight: 600, marginBottom: '4px' }}>Dateien auswählen</Copy>
                <Copy variant="small">Bilder helfen unseren Technikern, die Situation besser einzuschätzen.</Copy>
              </label>
              {files && files.length > 0 && (
                <div style={{ marginTop: '16px', fontWeight: 600, color: 'var(--new-primary)' }}>
                  {files.length} Datei(en) ausgewählt
                </div>
              )}
            </div>
          </div>

          <Spacer size={48} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--new-neutral-200)', paddingTop: '32px' }}>
            <Button variant="ghost" onClick={() => navigate("/")} disabled={uploading}>
              Abbrechen
            </Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? "Wird gesendet..." : "Meldung einreichen"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
