type DropdownOptionInput = {
    name: string;
    sourceName: string;
}

type UseDropdownOptionsArgs<T extends DropdownOptionInput> = {
    options: T[];
    defaultValue: string;
    valueKey?: string;
}

type UseDropdownOptionsReturn = [
    { text: string; value: string }[],
    { text: string; value: string }
]

export function useDropdownOptions<T extends DropdownOptionInput>({options, defaultValue}: UseDropdownOptionsArgs<T>): UseDropdownOptionsReturn {
  const dropdownOptions = options.map(option => ({
    text: option.name,
    value: option.sourceName
  }));
  const defaultOption = dropdownOptions.find(option => option.value === defaultValue) || dropdownOptions[0];
    
  return [dropdownOptions, defaultOption];
}
