import * as yup from 'yup';
import { incidentResourceValidationSchema } from 'validationSchema/incident-resources';

export const incidentValidationSchema = yup.object().shape({
  name: yup.string().required(),
  status: yup.string().required(),
  fire_department_id: yup.string().nullable().required(),
  incident_resource: yup.array().of(incidentResourceValidationSchema),
});
