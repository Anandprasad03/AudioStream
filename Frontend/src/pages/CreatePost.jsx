import { useState } from "react";
import { api } from "../api";

const CreatePost = ({ user, userRole }) => {
  const [uploadTitle, setUploadTitle] = useState("");
  const [musicFile, setMusicFile] = useState(null);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumSongs, setAlbumSongs] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [albumLoading, setAlbumLoading] = useState(false);

  const resetStatus = () => {
    setMessage("");
    setError("");
  };

  // =============== UPLOAD MUSIC ===============
  const handleUploadMusic = async (event) => {
    event.preventDefault();
    resetStatus();

    if (!musicFile) {
      setError("Please choose an audio file");
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadTitle);
    formData.append("music", musicFile);

    setUploadLoading(true);
    try {
      const { data } = await api.post("/api/music/upload", formData);
      setMessage(data.message);
      setUploadTitle("");
      setMusicFile(null);
      event.target.reset();
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  // =============== CREATE ALBUM ===============
  const handleCreateAlbum = async (event) => {
    event.preventDefault();
    resetStatus();

    const musics = albumSongs
      .split(",")
      .map((song) => song.trim())
      .filter(Boolean);

    setAlbumLoading(true);
    try {
      const { data } = await api.post("/api/music/album", {
        title: albumTitle,
        musics,
      });
      setMessage(data.message);
      setAlbumTitle("");
      setAlbumSongs("");
    } catch (err) {
      setError(err?.response?.data?.message || "Album creation failed");
    } finally {
      setAlbumLoading(false);
    }
  };

  // =============== ROLE CHECK UI ===============
  if (!user) {
    return (
      <section className="page">
        <div className="card locked-card">
          <div className="locked-card-icon">🎙️</div>
          <h2>Artist Studio</h2>
          <p>Please sign in to access the studio.</p>
        </div>
      </section>
    );
  }

  if (userRole !== "artist") {
    return (
      <section className="page">
        <div className="card locked-card">
          <div className="locked-card-icon">🎤</div>
          <h2>Artist Studio</h2>
          <p>
            This space is reserved for <strong>artists</strong>. Register with
            the artist role to upload music and build albums.
          </p>
        </div>
      </section>
    );
  }

  // =============== MAIN UI ===============
  return (
    <section className="page">
      {/* Hero banner */}
      <div className="studio-hero animate-in">
        <div className="studio-hero-eyebrow">Artist Studio</div>
        <h1>Make your mark.</h1>
        <p>Upload tracks, build albums, and share your sound with the world.</p>
      </div>

      <div className="grid-two">
        {/* Upload Music */}
        <div className="card animate-in animate-in-delay-1">
          <h2>Upload a Track</h2>
          <form onSubmit={handleUploadMusic} className="stack">
            <div className="field-group">
              <label className="field-label">Song Title</label>
              <input
                type="text"
                placeholder="e.g. Midnight Drive"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Audio File</label>
              <div className={`upload-zone ${musicFile ? "has-file" : ""}`}>
                <input
                  type="file"
                  accept="audio/*"
                  required
                  onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
                />
                <div className="upload-zone-icon">
                  {musicFile ? "✓" : "🎵"}
                </div>
                <div className="upload-zone-text">
                  {musicFile ? (
                    <strong>{musicFile.name}</strong>
                  ) : (
                    <>
                      <strong>Click to browse</strong> or drag & drop
                      <br />
                      MP3, WAV, FLAC, AAC supported
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "4px" }}>
              <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={uploadLoading}>
                {uploadLoading ? (<><span className="spinner" /> Uploading…</>) : "Upload Track"}
              </button>
            </div>
          </form>
        </div>

        {/* Create Album */}
        <div className="card animate-in animate-in-delay-2">
          <h2>Create an Album</h2>
          <form onSubmit={handleCreateAlbum} className="stack">
            <div className="field-group">
              <label className="field-label">Album Title</label>
              <input
                type="text"
                placeholder="e.g. City of Stars"
                required
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Song Names</label>
              <textarea
                placeholder="Enter song names separated by commas&#10;e.g. Midnight Drive, Golden Hour, Fade Away"
                rows="5"
                required
                value={albumSongs}
                onChange={(e) => setAlbumSongs(e.target.value)}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                Separate each song name with a comma
              </span>
            </div>

            <div style={{ marginTop: "4px" }}>
              <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={albumLoading}>
                {albumLoading ? (<><span className="spinner" /> Creating…</>) : "Create Album"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {message && (
        <p className="message success" style={{ marginTop: "20px" }}>
          ✓ {message}
        </p>
      )}
      {error && (
        <p className="message error" style={{ marginTop: "20px" }}>
          ✕ {error}
        </p>
      )}
    </section>
  );
};

export default CreatePost;