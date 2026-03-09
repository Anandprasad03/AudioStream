import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createAlbum,
  getAlbumById,
  getAllAlbums,
  getAllMusics,
  loginUser,
  logoutUser,
  registerUser,
  uploadMusic,
} from "./api";

/* ─── ICONS ─── */
const IconMusic = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);

const IconAlbum = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconUpload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const IconPlay = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconPause = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
  </svg>
);

const IconVol = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconSun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconMoon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

/* ─── THEME HOOK ─── */
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("sw_theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sw_theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}

/* ─── APP ─── */
function App() {
  useTheme(); // initialises theme from localStorage on mount

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("spotify_user");
    return saved ? JSON.parse(saved) : null;
  });

  const auth = useMemo(
    () => ({
      user,
      setUser(nextUser) {
        setUser(nextUser);
        if (nextUser) {
          localStorage.setItem("spotify_user", JSON.stringify(nextUser));
        } else {
          localStorage.removeItem("spotify_user");
        }
      },
    }),
    [user]
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "artist" ? "/artist" : "/user"} replace />
          ) : (
            <AuthPage auth={auth} />
          )
        }
      />
      <Route
        path="/user"
        element={
          user?.role === "user" ? <UserDashboard auth={auth} /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/artist"
        element={
          user?.role === "artist" ? (
            <ArtistDashboard auth={auth} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ─── AUTH PAGE ─── */
function AuthPage({ auth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [busy, setBusy] = useState(false);
  const { theme, toggle } = useTheme();

  const isRegister = mode === "register";

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const payload = isRegister
        ? { username: form.username.trim(), email: form.email.trim(), password: form.password, role: form.role }
        : { email: form.email.trim(), password: form.password };

      const response = isRegister ? await registerUser(payload) : await loginUser(payload);
      auth.setUser(response.user);
      setMessage(response.message || "Welcome back.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell auth-shell">
      <section className="card auth-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="eyebrow">Soundwave Platform</p>
          <button className="theme-toggle" onClick={toggle} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
        </div>
        <h1 className="hero-title">Your Stage Awaits</h1>
        <p className="subtitle">
          {isRegister
            ? "Join as a listener or artist — and make the world hear you."
            : "Sign in to explore music, upload tracks, and build your catalog."}
        </p>

        <div className="mode-toggle">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }}>
            Sign In
          </button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setMessage(""); }}>
            Register
          </button>
        </div>

        <form onSubmit={submit} className="stack">
          {isRegister && (
            <label className="field">
              Username
              <input
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="your_artist_name"
                autoComplete="username"
              />
            </label>
          )}

          <label className="field">
            Email Address
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="field">
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </label>

          {isRegister && (
            <label className="field">
              I am a…
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="user">Listener — explore & discover music</option>
                <option value="artist">Artist — upload & publish tracks</option>
              </select>
            </label>
          )}

          <button type="submit" className="primary-btn" disabled={busy} style={{ marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            {busy && <span className="spinner" />}
            {busy ? "Just a moment…" : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        {message && (
          <p className="notice" style={{ marginTop: "1rem", color: messageType === "success" ? "var(--green)" : messageType === "error" ? "var(--red)" : "var(--ink-3)" }}>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}

/* ─── USER DASHBOARD ─── */
function UserDashboard({ auth }) {
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [albumDetail, setAlbumDetail] = useState(null);
  const [message, setMessage] = useState("Hit refresh to load your music feed.");
  const [busy, setBusy] = useState(false);

  async function refreshData() {
    setBusy(true);
    setMessage("Syncing your library…");

    try {
      const [musicResponse, albumResponse] = await Promise.all([getAllMusics(), getAllAlbums()]);
      setMusics(musicResponse.musics || []);
      setAlbums(albumResponse.albums || []);
      setMessage(`${(musicResponse.musics || []).length} tracks · ${(albumResponse.albums || []).length} albums loaded.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function loadAlbum(albumId) {
    setBusy(true);
    setMessage("Fetching album details…");

    try {
      const response = await getAlbumById(albumId);
      setAlbumDetail(response.album);
      setMessage("Album loaded.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try { await logoutUser(); } finally { auth.setUser(null); }
  }

  return (
    <DashboardLayout title="Listener Hub" subtitle="Explore tracks and dive into albums" auth={auth} onLogout={logout} message={message}>
      <div className="toolbar">
        <button className="primary-btn" onClick={refreshData} disabled={busy} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {busy ? <span className="spinner" /> : <IconRefresh />}
          {busy ? "Syncing…" : "Refresh Feed"}
        </button>
      </div>

      <div className="grid two-col">
        {/* Tracks */}
        <article className="panel">
          <h2><IconMusic /> All Tracks</h2>
          {musics.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>🎵</div>
              No tracks yet — refresh to load the catalog.
            </div>
          ) : (
            <ul className="list">
              {musics.map((track) => (
                <li key={track._id}>
                  <div className="track-meta">
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {track.name}
                      {track.artist?.username && (
                        <span style={{ color: "var(--ink-3)", fontWeight: 400, fontSize: "0.8rem" }}> · {track.artist.username}</span>
                      )}
                    </span>
                    <AudioPlayer src={track.uri} id={track._id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* Albums */}
        <article className="panel">
          <h2><IconAlbum /> Albums</h2>
          {albums.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>💿</div>
              No albums found yet.
            </div>
          ) : (
            <ul className="list">
              {albums.map((album) => (
                <li key={album._id}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                      {album.name || album.title || "Untitled Album"}
                    </div>
                    {album.artist?.username && (
                      <div style={{ fontSize: "0.75rem", color: "var(--ink-3)", marginTop: "0.15rem" }}>
                        by {album.artist.username}
                      </div>
                    )}
                  </div>
                  <button className="inline-action" onClick={() => loadAlbum(album._id)}>
                    View →
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      {/* Album Detail */}
      <article className="panel">
        <h2><IconAlbum /> Album Detail</h2>
        {!albumDetail ? (
          <div className="empty-state">Select an album above to inspect its tracks.</div>
        ) : (
          <div className="stack compact">
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{albumDetail.name || "Untitled"}</span>
              {albumDetail.artist?.username && (
                <code style={{ alignSelf: "center" }}>by {albumDetail.artist.username}</code>
              )}
            </div>
            <h3>Tracklist</h3>
            {albumDetail.musics?.length ? (
              <ul className="list">
                {albumDetail.musics.map((track, i) => (
                  <li key={track._id}>
                    <div className="track-meta">
                      <span style={{ fontWeight: 500, fontSize: "0.88rem" }}>
                        <span style={{ color: "var(--ink-3)", fontFamily: "DM Mono, monospace", fontSize: "0.72rem", marginRight: "0.5rem" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {track.name}
                      </span>
                      <AudioPlayer src={track.uri} id={track._id} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">No tracks in this album.</div>
            )}
          </div>
        )}
      </article>
    </DashboardLayout>
  );
}

/* ─── ARTIST DASHBOARD ─── */
function ArtistDashboard({ auth }) {
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [albumTitle, setAlbumTitle] = useState("");
  const [songNames, setSongNames] = useState("");
  const [uploadedMusics, setUploadedMusics] = useState([]);
  const [artistMusics, setArtistMusics] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [message, setMessage] = useState("Upload tracks, then compile them into an album.");
  const [busy, setBusy] = useState(false);

  function getArtistId(item) {
    if (typeof item?.artist === "string") return item.artist;
    return item?.artist?._id || "";
  }

  async function refreshArtistLibrary() {
    setBusy(true);
    setMessage("Syncing your catalog…");

    try {
      const [musicResponse, albumResponse] = await Promise.all([getAllMusics(), getAllAlbums()]);
      const ownMusics = (musicResponse.musics || []).filter((t) => getArtistId(t) === auth.user.id);
      const ownAlbums = (albumResponse.albums || []).filter((a) => getArtistId(a) === auth.user.id);
      setArtistMusics(ownMusics);
      setArtistAlbums(ownAlbums);
      setMessage(`${ownMusics.length} tracks · ${ownAlbums.length} albums in your catalog.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { refreshArtistLibrary(); }, []);

  async function handleUpload(event) {
    event.preventDefault();
    if (!uploadFile) { setMessage("Please select an audio file first."); return; }
    setBusy(true);
    setMessage("Uploading track…");

    try {
      const response = await uploadMusic({ title: uploadTitle.trim(), file: uploadFile });
      const created = response.music;
      setUploadedMusics((prev) => [created, ...prev]);
      setSongNames((prev) => (prev ? `${created.name}, ${prev}` : created.name));
      setUploadTitle("");
      setUploadFile(null);
      setMessage(response.message || "Track uploaded successfully.");
      await refreshArtistLibrary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateAlbum(event) {
    event.preventDefault();
    const parsedNames = songNames.split(",").map((name) => name.trim()).filter(Boolean);
    if (!parsedNames.length) { setMessage("Add at least one song name to create an album."); return; }
    setBusy(true);
    setMessage("Creating album…");

    try {
      const response = await createAlbum({ title: albumTitle.trim(), musics: parsedNames });
      setMessage(`${response.message} · ID: ${response.album._id}`);
      setAlbumTitle("");
      setSongNames("");
      await refreshArtistLibrary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try { await logoutUser(); } finally { auth.setUser(null); }
  }

  return (
    <DashboardLayout title="Artist Studio" subtitle="Upload tracks and build your discography" auth={auth} onLogout={logout} message={message}>
      <div className="toolbar">
        <button className="primary-btn" onClick={refreshArtistLibrary} disabled={busy} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {busy ? <span className="spinner" /> : <IconRefresh />}
          {busy ? "Syncing…" : "Refresh Library"}
        </button>
      </div>

      {/* Upload + Create Album */}
      <div className="grid two-col">
        <article className="panel">
          <h2><IconUpload /> Upload a Track</h2>
          <form className="stack" onSubmit={handleUpload} style={{ marginTop: "1rem" }}>
            <label className="field">
              Track Title
              <input
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Midnight Drift"
              />
            </label>
            <label className="field">
              Audio File
              <input
                required
                type="file"
                accept="audio/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </label>
            <button className="primary-btn" disabled={busy} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              {busy && <span className="spinner" />}
              {busy ? "Uploading…" : "Upload Track"}
            </button>
          </form>
        </article>

        <article className="panel">
          <h2><IconAlbum /> Create Album</h2>
          <form className="stack" onSubmit={handleCreateAlbum} style={{ marginTop: "1rem" }}>
            <label className="field">
              Album Title
              <input
                required
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="e.g. Neon Echoes"
              />
            </label>
            <label className="field">
              Song Names <span style={{ opacity: 0.6, textTransform: "none", letterSpacing: 0 }}>(comma-separated)</span>
              <textarea
                rows="3"
                value={songNames}
                onChange={(e) => setSongNames(e.target.value)}
                placeholder="Midnight Drift, Neon Echo"
              />
            </label>
            <button className="primary-btn" disabled={busy} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              {busy && <span className="spinner" />}
              {busy ? "Creating…" : "Create Album"}
            </button>
          </form>
        </article>
      </div>

      {/* Session Uploads */}
      {uploadedMusics.length > 0 && (
        <article className="panel">
          <h2><IconMusic /> This Session's Uploads</h2>
          <ul className="list" style={{ marginTop: "0.9rem" }}>
            {uploadedMusics.map((track) => (
              <li key={track._id}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{track.name}</span>
                <code>{track._id}</code>
              </li>
            ))}
          </ul>
        </article>
      )}

      {/* My Songs + Albums */}
      <div className="grid two-col">
        <article className="panel">
          <h2><IconMusic /> My Songs</h2>
          {artistMusics.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>🎙️</div>
              No songs uploaded yet. Drop your first track above.
            </div>
          ) : (
            <ul className="list">
              {artistMusics.map((track) => (
                <li key={track._id}>
                  <div className="track-meta">
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{track.name}</span>
                    <AudioPlayer src={track.uri} id={track._id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <h2><IconAlbum /> My Albums</h2>
          {artistAlbums.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>💿</div>
              No albums yet. Create your first above.
            </div>
          ) : (
            <ul className="list">
              {artistAlbums.map((album) => (
                <li key={album._id}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{album.name || album.title || "Untitled"}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ink-3)", marginTop: "0.1rem" }}>
                      {album.musics?.length || 0} track{album.musics?.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <code>{album.musics?.length || 0} trks</code>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </DashboardLayout>
  );
}

/* ─── AUDIO PLAYER ─── */
function AudioPlayer({ src, id }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  function formatTime(value) {
    if (!Number.isFinite(value)) return "0:00";
    const m = Math.floor(value / 60);
    const s = Math.floor(value % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play(); setIsPlaying(true); }
  }

  function onSeek(e) {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  }

  function onVolumeChange(e) {
    const v = Number(e.target.value);
    if (audioRef.current) audioRef.current.volume = v;
    setVolume(v);
  }

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="audio-controls-row">
        <button
          type="button"
          onClick={togglePlayback}
          style={{
            background: isPlaying ? "rgba(124,92,252,0.15)" : "var(--accent)",
            border: isPlaying ? "1px solid var(--accent)" : "none",
            color: isPlaying ? "var(--accent)" : "white",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.18s",
          }}
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>
        <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={onSeek} />
        <span className="time-label">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
      <div className="audio-controls-row" style={{ paddingLeft: "36px" }}>
        <label className="volume-wrap">
          <IconVol />
          <input key={`vol-${id}`} type="range" min="0" max="1" step="0.01" value={volume} onChange={onVolumeChange} />
        </label>
      </div>
    </div>
  );
}

/* ─── DASHBOARD LAYOUT ─── */
function DashboardLayout({ title, subtitle, auth, onLogout, children, message }) {
  const { theme, toggle } = useTheme();

  return (
    <main className="app-shell">
      <section className="card dashboard-shell">
        <header className="dash-header">
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "var(--green)",
                  boxShadow: "0 0 8px var(--green)", display: "inline-block", animation: "pulse 2s ease infinite"
                }} />
                {auth.user.username}
              </span>
            </p>
            <h1 className="dash-title" style={{
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}>
              {title}
            </h1>
            <p className="subtitle" style={{ marginTop: "0.35rem" }}>{subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", alignSelf: "flex-start", flexShrink: 0 }}>
            <button className="theme-toggle" onClick={toggle} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>
            <button className="ghost-btn" onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconLogout />
              Sign Out
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
          {message && (
            <p className="notice" style={{ marginTop: "0.25rem" }}>{message}</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;