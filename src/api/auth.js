import api from "./client";

export async function registerUser({ name, email, password }) {
  return api.post("/api/auth/register", { name, email, password });
}

export async function loginUser({ email, password }) {
  return api.post("/api/auth/login", { email, password });
}

export async function getProfile() {
  return api.get("/api/auth/profile");
}
