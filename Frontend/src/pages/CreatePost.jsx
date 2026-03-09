import { useState } from "react";
import { api } from "../api";

const CreatePost = ({ user, userRole }) => {
  const [uploadTitle, setUploadTitle] = useState("");
  const [musicFile, setMusicFile] = useState(null);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumSongs, setAlbumSongs] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    try {
      const { data } = await api.post("/api/music/upload", formData);

      setMessage(data.message);
      setUploadTitle("");
      setMusicFile(null);
      event.target.reset();
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed");
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
    }
  };

  // =============== ROLE CHECK UI ===============
  if (!user) {
    return (
      <section className="page">
        <div className="card">
          <h2>Artist Studio</h2>
          <p>Please login first.</p>
        </div>
      </section>
    );
  }

  if (userRole !== "artist") {
    return (
      <section className="page">
        <div className="card">
          <h2>Artist Studio</h2>
          <p>
            Only users with role <strong>artist</strong> can upload music and
            create albums.
          </p>
        </div>
      </section>
    );
  }

  // =============== MAIN UI ===============
  return (
    <section className="page stack-gap">
      <div className="card">
        <h2>Upload Music</h2>
        <form onSubmit={handleUploadMusic} className="stack">
          <input
            type="text"
            placeholder="Song title"
            required
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
          />

          <input
            type="file"
            accept="audio/*"
            required
            onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
          />

          <button type="submit">Upload</button>
        </form>
      </div>

      <div className="card">
        <h2>Create Album</h2>
        <form onSubmit={handleCreateAlbum} className="stack">
          <input
            type="text"
            placeholder="Album title"
            required
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
          />

          <textarea
            placeholder="Song names separated by commas"
            rows="4"
            required
            value={albumSongs}
            onChange={(e) => setAlbumSongs(e.target.value)}
          />

          <button type="submit">Create Album</button>
        </form>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </section>
  );
};

export default CreatePost;