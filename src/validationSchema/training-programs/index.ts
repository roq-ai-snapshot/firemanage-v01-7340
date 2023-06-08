import * as yup from 'yup';
import { userTrainingProgramValidationSchema } from 'validationSchema/user-training-programs';

export const trainingProgramValidationSchema = yup.object().shape({
  name: yup.string().required(),
  status: yup.string().required(),
  fire_department_id: yup.string().nullable().required(),
  user_training_program: yup.array().of(userTrainingProgramValidationSchema),
});
