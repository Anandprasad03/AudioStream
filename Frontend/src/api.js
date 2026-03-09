const API_ROOT = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    credentials: "include",
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function logoutUser() {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function getAllMusics() {
  return request("/music");
}

export function getAllAlbums() {
  return request("/music/albums");
}

export function getAlbumById(albumId) {
  return request(`/music/albums/${albumId}`);
}

export function uploadMusic({ title, file }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("music", file);

  return request("/music/upload", {
    method: "POST",
    body: formData,
  });
}

export function createAlbum(payload) {
  return request("/music/album", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
