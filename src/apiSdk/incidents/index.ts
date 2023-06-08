import axios from 'axios';
import queryString from 'query-string';
import { IncidentInterface, IncidentGetQueryInterface } from 'interfaces/incident';
import { GetQueryInterface } from '../../interfaces';

export const getIncidents = async (query?: IncidentGetQueryInterface) => {
  const response = await axios.get(`/api/incidents${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createIncident = async (incident: IncidentInterface) => {
  const response = await axios.post('/api/incidents', incident);
  return response.data;
};

export const updateIncidentById = async (id: string, incident: IncidentInterface) => {
  const response = await axios.put(`/api/incidents/${id}`, incident);
  return response.data;
};

export const getIncidentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/incidents/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteIncidentById = async (id: string) => {
  const response = await axios.delete(`/api/incidents/${id}`);
  return response.data;
};
