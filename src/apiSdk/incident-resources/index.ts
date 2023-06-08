import axios from 'axios';
import queryString from 'query-string';
import { IncidentResourceInterface, IncidentResourceGetQueryInterface } from 'interfaces/incident-resource';
import { GetQueryInterface } from '../../interfaces';

export const getIncidentResources = async (query?: IncidentResourceGetQueryInterface) => {
  const response = await axios.get(`/api/incident-resources${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createIncidentResource = async (incidentResource: IncidentResourceInterface) => {
  const response = await axios.post('/api/incident-resources', incidentResource);
  return response.data;
};

export const updateIncidentResourceById = async (id: string, incidentResource: IncidentResourceInterface) => {
  const response = await axios.put(`/api/incident-resources/${id}`, incidentResource);
  return response.data;
};

export const getIncidentResourceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/incident-resources/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteIncidentResourceById = async (id: string) => {
  const response = await axios.delete(`/api/incident-resources/${id}`);
  return response.data;
};
