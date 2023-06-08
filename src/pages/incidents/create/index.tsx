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
import { createIncident } from 'apiSdk/incidents';
import { Error } from 'components/error';
import { incidentValidationSchema } from 'validationSchema/incidents';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { FireDepartmentInterface } from 'interfaces/fire-department';
import { getResources } from 'apiSdk/resources';
import { ResourceInterface } from 'interfaces/resource';
import { getFireDepartments } from 'apiSdk/fire-departments';
import { IncidentInterface } from 'interfaces/incident';

function IncidentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: IncidentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createIncident(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<IncidentInterface>({
    initialValues: {
      name: '',
      status: '',
      fire_department_id: (router.query.fire_department_id as string) ?? null,
      incident_resource: [],
    },
    validationSchema: incidentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Incident
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<FireDepartmentInterface>
            formik={formik}
            name={'fire_department_id'}
            label={'Select Fire Department'}
            placeholder={'Select Fire Department'}
            fetcher={getFireDepartments}
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
  entity: 'incident',
  operation: AccessOperationEnum.CREATE,
})(IncidentCreatePage);
