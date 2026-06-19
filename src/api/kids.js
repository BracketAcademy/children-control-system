import apiClient from "./client";

let kidsEtag = null;

export async function getKids() {
  const response = await apiClient.get("/kids", {
    headers: kidsEtag ? { "If-None-Match": kidsEtag } : {},
    validateStatus: (status) =>
      (status >= 200 && status < 300) || status === 304,
  });

  if (response.status === 304) {
    return { notModified: true };
  }

  if (response.headers.etag) {
    kidsEtag = response.headers.etag;
  }

  return { notModified: false, data: response.data };
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
