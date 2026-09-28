import api from "./client";

export async function createSnapshot(payload) {
  return api.post("/api/financial-snapshot", payload);
}
export async function getSnapshots() {
  return api.get("/api/financial-snapshot");
}
export async function updatePerception(snapshotId, perceivedCause) {
  return api.patch(`/api/financial-snapshot/${snapshotId}/perception`, { perceivedCause });
}
export async function getSnapshot(snapshotId) {
  return api.get(`/api/financial-snapshot/${snapshotId}`);
}
export async function getDiagnosis(snapshotId) {
  return api.get(`/api/financial-snapshot/${snapshotId}/diagnosis`);
}
export async function getAlerts(snapshotId) {
  return api.get(`/api/financial-snapshot/${snapshotId}/alerts`);
}
