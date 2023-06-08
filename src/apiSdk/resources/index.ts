import axios from 'axios';
import queryString from 'query-string';
import { ResourceInterface, ResourceGetQueryInterface } from 'interfaces/resource';
import { GetQueryInterface } from '../../interfaces';

export const getResources = async (query?: ResourceGetQueryInterface) => {
  const response = await axios.get(`/api/resources${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createResource = async (resource: ResourceInterface) => {
  const response = await axios.post('/api/resources', resource);
  return response.data;
};

export const updateResourceById = async (id: string, resource: ResourceInterface) => {
  const response = await axios.put(`/api/resources/${id}`, resource);
  return response.data;
};

export const getResourceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/resources/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteResourceById = async (id: string) => {
  const response = await axios.delete(`/api/resources/${id}`);
  return response.data;
};
