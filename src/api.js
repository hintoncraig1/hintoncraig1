import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE;
const API_BASE =
  typeof rawBase === 'string' && rawBase.trim()
    ? rawBase.trim().replace(/\/+$/, '')
    : 'http://localhost:8000';

const PIOS_PREFIX = '/api/v1/pios';

function extractErrorMessage(error) {
  if (axios.isCancel?.(error) || error?.code === 'ERR_CANCELED') {
    return 'Request cancelled';
  }

  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out';
  }

  const status = error?.response?.status;
  const data = error?.response?.data;

  const serverMessage =
    data?.detail ||
    data?.message ||
    data?.error ||
    (Array.isArray(data?.errors) ? data.errors.join(', ') : null);

  if (serverMessage) {
    return String(serverMessage);
  }

  if (status === 400) return 'Bad request';
  if (status === 401) return 'Unauthorized';
  if (status === 403) return 'Forbidden';
  if (status === 404) return 'Endpoint not found';
  if (status === 409) return 'Conflict';
  if (status === 422) return 'Validation failed';
  if (status === 429) return 'Rate limited';
  if (typeof status === 'number' && status >= 500) return 'Server error';

  return error?.message || 'Network request failed';
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(extractErrorMessage(error)))
);

function ensureObject(value, fallback = {}) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : fallback;
}

function toEntryPayload(payload) {
  if (typeof payload === 'string') {
    const text = payload.trim();
    return {
      entryType: 'text',
      title: text.slice(0, 80) || 'Problem statement',
      content: text,
      sourceUri: null,
    };
  }

  const input = ensureObject(payload);
  if (typeof input.entryType === 'string' && typeof input.content === 'string') {
    return {
      entryType: input.entryType,
      title:
        typeof input.title === 'string' && input.title.trim()
          ? input.title.trim()
          : input.content.trim().slice(0, 80) || 'Problem statement',
      content: input.content,
      sourceUri: input.sourceUri ?? null,
    };
  }

  const description =
    typeof input.description === 'string' ? input.description.trim() : '';

  return {
    entryType: 'text',
    title: description.slice(0, 80) || 'Problem statement',
    content: description,
    sourceUri: null,
  };
}

export async function checkHealth(signal) {
  const response = await api.get('/health', { signal });
  return response.data;
}

export async function submitProblem(payload, signal) {
  const response = await api.post(`${PIOS_PREFIX}/entries`, toEntryPayload(payload), {
    signal,
  });

  return response.data;
}

export async function fetchTimeline(signal) {
  const response = await api.get(`${PIOS_PREFIX}/timeline`, { signal });
  return response.data;
}

export async function fetchPatterns(signal) {
  const response = await api.get('/patterns', { signal });
  return response.data;
}

export async function runSimulation(payload, signal) {
  const response = await api.post('/simulation', ensureObject(payload), {
    signal,
  });
  return response.data;
}

export async function executeAction(actionId, signal) {
  const response = await api.post(
    '/action',
    { action_id: actionId },
    { signal }
  );
  return response.data;
}

export async function logResult(payload, signal) {
  const response = await api.post('/result', ensureObject(payload), { signal });
  return response.data;
}

export function getApiBase() {
  return API_BASE;
}

export default api;
