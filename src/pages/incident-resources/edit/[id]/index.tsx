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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getIncidentResourceById, updateIncidentResourceById } from 'apiSdk/incident-resources';
import { Error } from 'components/error';
import { incidentResourceValidationSchema } from 'validationSchema/incident-resources';
import { IncidentResourceInterface } from 'interfaces/incident-resource';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { IncidentInterface } from 'interfaces/incident';
import { ResourceInterface } from 'interfaces/resource';
import { getIncidents } from 'apiSdk/incidents';
import { getResources } from 'apiSdk/resources';

function IncidentResourceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<IncidentResourceInterface>(
    () => (id ? `/incident-resources/${id}` : null),
    () => getIncidentResourceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: IncidentResourceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateIncidentResourceById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<IncidentResourceInterface>({
    initialValues: data,
    validationSchema: incidentResourceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Incident Resource
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<IncidentInterface>
              formik={formik}
              name={'incident_id'}
              label={'Select Incident'}
              placeholder={'Select Incident'}
              fetcher={getIncidents}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<ResourceInterface>
              formik={formik}
              name={'resource_id'}
              label={'Select Resource'}
              placeholder={'Select Resource'}
              fetcher={getResources}
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'incident_resource',
  operation: AccessOperationEnum.UPDATE,
})(IncidentResourceEditPage);
