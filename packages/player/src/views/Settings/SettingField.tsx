import { FC } from 'react';

import type {
  EnumSettingDefinition,
  NumberWidget,
  SettingDefinition,
  SettingValue,
} from '@nuclearplayer/plugin-sdk';

import { InfoField } from './InfoField';
import { NumberInputField } from './NumberInputField';
import { SelectField } from './SelectField';
import { SliderField } from './SliderField';
import { TextField } from './TextField';
import { ToggleField } from './ToggleField';
import { useSettingTranslation } from './useSettingTranslation';

type SettingFieldProps = {
  definition: SettingDefinition;
  value: SettingValue | undefined;
  setValue: (v: SettingValue) => void;
};

export const SettingField: FC<SettingFieldProps> = ({
  definition,
  value,
  setValue,
}) => {
  const { title: label, description } = useSettingTranslation(definition);
  const widgetType = definition.widget?.type;

  const renderers: Record<string, () => JSX.Element> = {
    toggle: () => (
      <ToggleField
        label={label}
        description={description}
        value={Boolean(value)}
        setValue={(v) => setValue(v)}
      />
    ),
    'number-input': () => (
      <NumberInputField
        label={label}
        description={description}
        value={value as number | string | undefined}
        setValue={(v) => setValue(v)}
      />
    ),
    slider: () => {
      const DEFAULT_MIN = 0;
      const DEFAULT_MAX = 100;
      const DEFAULT_STEP = 1;
      const widget = definition.widget as NumberWidget;
      const min = widget?.min ?? DEFAULT_MIN;
      const max = widget?.max ?? DEFAULT_MAX;
      const step = widget?.step ?? DEFAULT_STEP;
      const unit = widget?.unit;
      return (
        <SliderField
          label={label}
          value={Number(value ?? 0)}
          setValue={(v) => setValue(v)}
          min={min}
          max={max}
          step={step}
          unit={unit}
        />
      );
    },
    select: () => (
      <SelectField
        label={label}
        description={description}
        value={String(value ?? '')}
        setValue={(v) => setValue(v)}
        options={
          isEnumDefinition(definition)
            ? definition.options.map((o) => ({ id: o.value, label: o.label }))
            : []
        }
      />
    ),
    radio: () => (
      <SelectField
        label={label}
        description={description}
        value={String(value ?? '')}
        setValue={(v) => setValue(v)}
        options={
          isEnumDefinition(definition)
            ? definition.options.map((o) => ({ id: o.value, label: o.label }))
            : []
        }
      />
    ),
    password: () => (
      <TextField
        label={label}
        description={description}
        value={String(value ?? '')}
        setValue={(v) => setValue(v)}
        variant="password"
      />
    ),
    text: () => (
      <TextField
        label={label}
        description={description}
        value={String(value ?? '')}
        setValue={(v) => setValue(v)}
        variant="text"
      />
    ),
    textarea: () => (
      <TextField
        label={label}
        description={description}
        value={String(value ?? '')}
        setValue={(v) => setValue(v)}
        variant="text"
      />
    ),
    info: () => (
      <InfoField
        label={label}
        description={description}
        value={String(value ?? '')}
      />
    ),
  };

  const renderer = widgetType ? renderers[widgetType] : renderers.text;
  return renderer ? renderer() : null;
};

const isEnumDefinition = (
  def: SettingDefinition,
): def is EnumSettingDefinition => def.kind === 'enum';
