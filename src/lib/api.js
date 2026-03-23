const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('orvexa_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erreur serveur');
  }
  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request('/api/auth/me'),

  // Employees
  getEmployees: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/employees${qs ? `?${qs}` : ''}`);
  },

  getEmployeeStats: () => request('/api/employees/stats'),

  createEmployee: (data) =>
    request('/api/employees', { method: 'POST', body: JSON.stringify(data) }),

  deleteEmployee: (id) =>
    request(`/api/employees/${id}`, { method: 'DELETE' }),

  // Absences
  getMyAbsences: () => request('/api/absences/mine'),

  getAllAbsences: () => request('/api/absences'),

  createAbsence: (data) =>
    request('/api/absences', { method: 'POST', body: JSON.stringify(data) }),

  approveAbsence: (id) =>
    request(`/api/absences/${id}/approve`, { method: 'PUT' }),

  rejectAbsence: (id) =>
    request(`/api/absences/${id}/reject`, { method: 'PUT' }),

  // Documents
  getDocuments: () => request('/api/documents'),
};
