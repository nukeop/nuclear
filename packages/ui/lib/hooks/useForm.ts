import { FormikConfig, FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';

import { FieldsPropsType, InitialFormFields } from './types';

type UseFormArgs<Values extends FormikValues> = {
  onSubmit: FormikConfig<Values>['onSubmit'];
  initialFields: InitialFormFields;
  validationSchema?: Yup.AnySchema;
  enableReinitialize?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
}

export const useForm = <Values extends FormikValues>({
  onSubmit,
  initialFields,
  validationSchema,
  enableReinitialize = false,
  validateOnBlur = true,
  validateOnSubmit = false
}: UseFormArgs<Values>) => {
  const formik = useFormik({
    initialValues: _.chain(initialFields)
      .map((field, key) => [key, field.initialValue ?? ''])
      .fromPairs()
      .value(),
    onSubmit,
    validationSchema,
    enableReinitialize,
    validateOnBlur: validateOnBlur && !validateOnSubmit,
    validateOnChange: !validateOnBlur && !validateOnSubmit
  });

  return {
    onSubmit: () => formik.handleSubmit(),
    onFormSubmit: (e: React.FormEvent) => {
      e.preventDefault();
      formik.handleSubmit();
    },
    isSubmitting: formik.isSubmitting,
    hasErrors: !formik.isValid,
    setFieldError: formik.setFieldError,
    status: formik.status,
    fieldsProps: _.chain(initialFields)
      .map((field, key) => [
        key, {
          name: field.name,
          dataTestId: field.name,
          label: field.label,
          placeholder: field.placeholder,
          value: formik.values[key],
          error: formik.errors[key],
          onChange: (value: string) => formik.handleChange({
            target: {
              value,
              name: field.name
            }
          }),
          onBlur: formik.handleBlur
        }
      ])
      .fromPairs()
      .value() as FieldsPropsType
  };
};

export type UseFormProps = ReturnType<typeof useForm>;
