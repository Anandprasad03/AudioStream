import { useEffect, useRef, useState } from "react";
import { api } from "../api";

const Feed = ({ user }) => {
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");
  const [playingId, setPlayingId] = useState(null);
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const audioRef = useRef(null);

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
        setError(err?.response?.data?.message || "Unable to fetch library data");
      }
    };

    fetchLibrary();
  }, [user]);

  if (!user) {
    return (
      <section className="page">
        <div className="card locked-card">
          <div className="locked-card-icon">🔒</div>
          <h2>Library</h2>
          <p>Please sign in to access your music library and albums.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      {/* Page Header */}
      <div className="page-header animate-in">
        <div className="page-header-eyebrow">Your collection</div>
        <h1>Library</h1>
        <p>Every track, every album — curated for you.</p>
      </div>

      <div className="stack-gap">
        {/* Music Section */}
        <div className="card animate-in animate-in-delay-1">
          <h2 className="section-heading">Tracks</h2>

          {musics.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎵</div>
              <p>No tracks found yet. Artists are still uploading.</p>
            </div>
          ) : (
            <div className="music-grid">
              {musics.map((music, index) => {
                const isPlaying = playingId === music._id;
                return (
                  <div key={music._id} className={`music-item ${isPlaying ? "music-item-active" : ""}`}>
                    <div className="music-item-left">
                      <span className="music-index">{index + 1}</span>
                      <div className={`music-disc ${isPlaying ? "music-disc-playing" : ""}`}>♪</div>
                      <div className="music-info">
                        <div className="music-title">{music.name}</div>
                        <div className="music-artist">
                          {music.artist?.username || "Unknown artist"}
                        </div>
                      </div>
                    </div>
                    <button
                      className={`music-play-btn ${isPlaying ? "playing" : ""}`}
                      onClick={() => {
                        if (isPlaying) {
                          audioRef.current?.pause();
                          setPlayingId(null);
                        } else {
                          if (audioRef.current) {
                            audioRef.current.pause();
                          }
                          const audio = new Audio(music.uri);
                          audioRef.current = audio;
                          audio.play();
                          audio.onended = () => setPlayingId(null);
                          setPlayingId(music._id);
                        }
                      }}
                    >
                      {isPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Albums Section */}
        <div className="card animate-in animate-in-delay-2">
          <h2 className="section-heading">Albums</h2>

          {albums.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💿</div>
              <p>No albums yet. Check back soon.</p>
            </div>
          ) : (
            <div className="albums-grid">
              {albums.map((album) => {
                const isExpanded = expandedAlbum === album._id;
                return (
                  <div
                    key={album._id}
                    className={`album-card ${isExpanded ? "album-card-expanded" : ""}`}
                    onClick={() => setExpandedAlbum(isExpanded ? null : album._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="album-cover">💿</div>
                    <div className="album-name">{album.name}</div>
                    <div className="album-meta">
                      by {album.artist?.username || "Unknown artist"}
                    </div>
                    <div className="album-expand-hint">
                      {isExpanded ? "▲ Hide tracks" : "▼ View tracks"}
                    </div>
                    {isExpanded && (
                      <div className="album-songs-list album-songs-animated">
                        <span>Tracklist</span>
                        {(album.musics || []).length > 0
                          ? (album.musics || []).map((song, i) => (
                              <div key={song._id || i}>
                                {i + 1}. {song.name}
                              </div>
                            ))
                          : "No songs attached yet."}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {error && (
          <p className="message error">✕ {error}</p>
        )}
      </div>
    </section>
  );
};

export default Feed;