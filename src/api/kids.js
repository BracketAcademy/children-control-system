import apiClient from "./client";

export async function getKids() {
  const response = await apiClient.get("/kids");
  return response.data;
}

export async function entry(url, payload) {
  const response = await apiClient.post(url, payload);
  return response.data;
}

export async function deliver(url, id) {
  const response = await apiClient.post(url, { id });
  return response.data;
}

export async function undo(id, status) {
  const response = await apiClient.post("/undo", { id, status });
  return response.data;
}

export async function addKid(values) {
  const response = await apiClient.post("/addkid", values);
  return response.data;
}
