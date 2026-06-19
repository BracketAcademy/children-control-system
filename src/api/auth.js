import apiClient from "./client";

export async function login(username, password) {
  const response = await apiClient.post("/token", { username, password });
  return response.data;
}
