import * as yup from 'yup';
import { incidentValidationSchema } from 'validationSchema/incidents';
import { resourceValidationSchema } from 'validationSchema/resources';
import { trainingProgramValidationSchema } from 'validationSchema/training-programs';

export const fireDepartmentValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  tenant_id: yup.string().required(),
  user_id: yup.string().nullable().required(),
  incident: yup.array().of(incidentValidationSchema),
  resource: yup.array().of(resourceValidationSchema),
  training_program: yup.array().of(trainingProgramValidationSchema),
});
