import axios from 'axios';
import queryString from 'query-string';
import { FireDepartmentInterface, FireDepartmentGetQueryInterface } from 'interfaces/fire-department';
import { GetQueryInterface } from '../../interfaces';

export const getFireDepartments = async (query?: FireDepartmentGetQueryInterface) => {
  const response = await axios.get(`/api/fire-departments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFireDepartment = async (fireDepartment: FireDepartmentInterface) => {
  const response = await axios.post('/api/fire-departments', fireDepartment);
  return response.data;
};

export const updateFireDepartmentById = async (id: string, fireDepartment: FireDepartmentInterface) => {
  const response = await axios.put(`/api/fire-departments/${id}`, fireDepartment);
  return response.data;
};

export const getFireDepartmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/fire-departments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFireDepartmentById = async (id: string) => {
  const response = await axios.delete(`/api/fire-departments/${id}`);
  return response.data;
};
