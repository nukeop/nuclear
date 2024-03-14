import React from 'react';
import _ from 'lodash';

export const withDropdownOptions = ({options, defaultValue, mappings}) => BaseComponent => {
  return props => {
    const optionsInstance = options(props);
    const defaultValueInstance = defaultValue(props);

    const dropdownOptions = optionsInstance.map(option => ({
      text: option.name,
      value: option.sourceName
    }));
    const defaultOption = _.defaultTo(
      _.find(dropdownOptions, { value: defaultValueInstance }),
      _.head(dropdownOptions)
    );

    return (
      <BaseComponent
        {...{
          [mappings[0]]: dropdownOptions,
          [mappings[1]]: defaultOption
        }}
        {...props}
      />
    );
  };
};
