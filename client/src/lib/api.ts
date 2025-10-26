// API utility with typed requests and response handling

const API_BASE = "http://localhost:5127/api/v1";

export interface Reading {
  id: number;
  temperatureC: number;
  createdAtUtc: string;
  location?: string;
  notes?: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export async function fetchReadings(
  page: number = 1,
  pageSize: number = 20
): Promise<PagedResult<Reading>> {
  const res = await fetch(
    `${API_BASE}/readings?page=${page}&pageSize=${pageSize}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch readings: ${res.status}`);
  }
  return res.json();
}

export async function createReading(temperatureC: number): Promise<Reading> {
  const res = await fetch(`${API_BASE}/readings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temperatureC }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create reading: ${res.status}`);
  }
  return res.json();
}
