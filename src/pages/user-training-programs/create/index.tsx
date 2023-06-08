import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createUserTrainingProgram } from 'apiSdk/user-training-programs';
import { Error } from 'components/error';
import { userTrainingProgramValidationSchema } from 'validationSchema/user-training-programs';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { TrainingProgramInterface } from 'interfaces/training-program';
import { getUsers } from 'apiSdk/users';
import { getTrainingPrograms } from 'apiSdk/training-programs';
import { UserTrainingProgramInterface } from 'interfaces/user-training-program';

function UserTrainingProgramCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UserTrainingProgramInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUserTrainingProgram(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UserTrainingProgramInterface>({
    initialValues: {
      user_id: (router.query.user_id as string) ?? null,
      training_program_id: (router.query.training_program_id as string) ?? null,
    },
    validationSchema: userTrainingProgramValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create User Training Program
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<TrainingProgramInterface>
            formik={formik}
            name={'training_program_id'}
            label={'Select Training Program'}
            placeholder={'Select Training Program'}
            fetcher={getTrainingPrograms}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'user_training_program',
  operation: AccessOperationEnum.CREATE,
})(UserTrainingProgramCreatePage);
