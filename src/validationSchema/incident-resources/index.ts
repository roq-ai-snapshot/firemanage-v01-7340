import * as yup from 'yup';

export const incidentResourceValidationSchema = yup.object().shape({
  incident_id: yup.string().nullable().required(),
  resource_id: yup.string().nullable().required(),
});
