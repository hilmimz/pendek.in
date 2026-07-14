const BASE_API_URL = import.meta.env.VITE_SERVICE_URL;

function capitalizeFirst(text) {
  if (typeof text !== "string" || text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeErrors(errors) {
  if (!errors || typeof errors !== "object") return {};
  return Object.entries(errors).reduce((acc, [key, value]) => {
    acc[key] = typeof value === "string" ? capitalizeFirst(value) : value;
    return acc;
  }, {});
}

async function handle(res) {
  let data;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = capitalizeFirst(data?.message || `HTTP ${res.status}`);
    const error = new Error(message);
    error.code = data?.code || res.status;
    error.errors = normalizeErrors(data?.errors);
    throw error;
  }

  return data;
}

async function request(url, { method = "GET", payload } = {}) {
  const option = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload) {
    option.body = JSON.stringify(payload);
  }

  const res = await fetch(`${BASE_API_URL}${url}`, option);
  return handle(res);
}

export async function login(payload) {
  return request("/api/auth/login", { method: "POST", payload });
}

export async function register(payload) {
  return request("/api/auth/register", { method: "POST", payload });
}

export async function logout() {
  return request("/api/auth/logout", { method: "POST" });
}

export async function fetchMe() {
  return request("/api/auth/me");
}

export async function shorten(payload) {
  return request("/api/short-urls/create", { method: "POST", payload });
}

export async function getUrl() {
  return request("/api/short-urls", { method: "GET"});
}

export async function getStats() {
  return request("/api/short-urls/stats", { method: "GET"});
}
