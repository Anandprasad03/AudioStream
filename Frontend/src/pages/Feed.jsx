import { useEffect, useState } from "react";
import { api } from "../api";

const Feed = ({ user }) => {
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchLibrary = async () => {
      setError("");

      try {
        const [musicRes, albumRes] = await Promise.all([
          api.get("/api/music"),
          api.get("/api/music/albums"),
        ]);

        setMusics(musicRes.data.musics || []);
        setAlbums(albumRes.data.albums || []);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Unable to fetch library data"
        );
      }
    };

    fetchLibrary();
  }, [user]);

  if (!user) {
    return (
      <section className="page">
        <div className="card">
          <h2>Library</h2>
          <p>Please login first to view music and albums.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page stack-gap">
      {/* MUSIC LIST */}
      <div className="card">
        <h2>Music Library</h2>

        {musics.length === 0 ? (
          <p>No music found yet.</p>
        ) : (
          <div className="list">
            {musics.map((music) => (
              <div key={music._id} className="list-item">
                <p>
                  <strong>{music.name}</strong> by{" "}
                  {music.artist?.username || "Unknown artist"}
                </p>
                <a href={music.uri} target="_blank" rel="noreferrer">
                  Open audio
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALBUM LIST */}
      <div className="card">
        <h2>Albums</h2>

        {albums.length === 0 ? (
          <p>No albums found yet.</p>
        ) : (
          <div className="list">
            {albums.map((album) => (
              <div key={album._id} className="list-item">
                <p>
                  <strong>{album.name}</strong> by{" "}
                  {album.artist?.username || "Unknown artist"}
                </p>
                <p>
                  Songs:{" "}
                  {(album.musics || [])
                    .map((song) => song.name)
                    .join(", ") || "No songs attached"}
                </p>
              </div>
            ))}
          </div>
        )}

        {error && <p className="message error">{error}</p>}
      </div>
    </section>
  );
};

export default Feed;