import * as yup from 'yup';

export const userTrainingProgramValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  training_program_id: yup.string().nullable().required(),
});
