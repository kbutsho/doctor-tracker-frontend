import api from '@/lib/api';
import { cleanParams } from '@/lib/utils';

const unwrap = (res) => res.data.data;

export const authService = {
  login: (body) => api.post('/auth/login', body).then((r) => unwrap(r).user),
  me: () => api.get('/auth/me').then((r) => unwrap(r).user),
  logout: () => api.post('/auth/logout'),
  updateProfile: (body) => api.put('/auth/profile', body).then((r) => unwrap(r).user),
  changePassword: (body) => api.put('/auth/password', body).then((r) => unwrap(r).user),
};

export const doctorService = {
  list: (params) => api.get('/doctors', { params: cleanParams(params) }).then((r) => ({ items: r.data.data.doctors, meta: r.data.meta })),
  filters: () => api.get('/doctors/filters').then(unwrap),
  get: (id) => api.get(`/doctors/${id}`).then((r) => unwrap(r).doctor),
  create: (body) => api.post('/doctors', body).then(unwrap),
  update: ({ id, ...body }) => api.put(`/doctors/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/doctors/${id}`),
  patients: (id, params) =>
    api.get(`/doctors/${id}/patients`, { params: cleanParams(params) }).then((r) => ({ items: r.data.data.patients, meta: r.data.meta })),
  addPatient: ({ doctorId, ...body }) => api.post(`/doctors/${doctorId}/patients`, body).then(unwrap),
  removePatient: ({ doctorId, patientId }) => api.delete(`/doctors/${doctorId}/patients/${patientId}`),
};

export const patientService = {
  list: (params) => api.get('/patients', { params: cleanParams(params) }).then((r) => ({ items: r.data.data.patients, meta: r.data.meta })),
  conditions: () => api.get('/patients/conditions').then(unwrap),
  create: (body) => api.post('/patients', body).then(unwrap),
  update: ({ id, ...body }) => api.put(`/patients/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/patients/${id}`),
};

export const dashboardService = {
  stats: (params) => api.get('/dashboard/stats', { params }).then(unwrap),
};
