export const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "https://airdriegujaratisamaj.ca/api/"
    : "https://airdriegujaratisamaj.ca/api/";

export async function apiGet(path) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API GET ERROR:", err);
    return null;
  }
}