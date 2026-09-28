import axios from 'axios';

const AlarmService = {
  getStatus: (locationId) => axios.get(`/api/alarm/${locationId}`),
  arm: (locationId) => axios.post(`/api/alarm/${locationId}/arm`),
  disarm: (locationId) => axios.post(`/api/alarm/${locationId}/disarm`),
  resumeSchedule: (locationId) => axios.post(`/api/alarm/${locationId}/resume`),
};

export { AlarmService };
