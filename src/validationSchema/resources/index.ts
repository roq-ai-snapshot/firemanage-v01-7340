import * as yup from 'yup';
import { incidentResourceValidationSchema } from 'validationSchema/incident-resources';

export const resourceValidationSchema = yup.object().shape({
  name: yup.string().required(),
  fire_department_id: yup.string().nullable().required(),
  incident_resource: yup.array().of(incidentResourceValidationSchema),
});
