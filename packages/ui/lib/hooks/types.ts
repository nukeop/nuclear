import { useForm } from './useForm';

export type FormValue = string | number | boolean;
export type FieldsPropsType = {
  [k: string]: {
    name: string;
    label: string;
    placeholder?: string;
    value: FormValue;
    error?: string;
    onChange: (value: FormValue, event?: React.ChangeEvent) => void;
    onBlur: React.FocusEventHandler;
  }
};

export type FormProps = Partial<ReturnType<typeof useForm>>;

export type InitialFormField = {
  name: string;
  label?: string;
  placeholder?: string;
  initialValue?: FormValue;
}

export type InitialFormFields = {
  [k: string]: InitialFormField;
}
