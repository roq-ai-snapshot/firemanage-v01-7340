import axios from 'axios';
import queryString from 'query-string';
import { UserTrainingProgramInterface, UserTrainingProgramGetQueryInterface } from 'interfaces/user-training-program';
import { GetQueryInterface } from '../../interfaces';

export const getUserTrainingPrograms = async (query?: UserTrainingProgramGetQueryInterface) => {
  const response = await axios.get(`/api/user-training-programs${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserTrainingProgram = async (userTrainingProgram: UserTrainingProgramInterface) => {
  const response = await axios.post('/api/user-training-programs', userTrainingProgram);
  return response.data;
};

export const updateUserTrainingProgramById = async (id: string, userTrainingProgram: UserTrainingProgramInterface) => {
  const response = await axios.put(`/api/user-training-programs/${id}`, userTrainingProgram);
  return response.data;
};

export const getUserTrainingProgramById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/user-training-programs/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteUserTrainingProgramById = async (id: string) => {
  const response = await axios.delete(`/api/user-training-programs/${id}`);
  return response.data;
};
