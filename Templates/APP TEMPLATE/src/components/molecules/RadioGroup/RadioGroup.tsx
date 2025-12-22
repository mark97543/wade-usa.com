// services/main/src/components/molecules/RadioGroup/RadioGroup.tsx

import React, { useState } from 'react';
import { Radio } from '@/components/atoms/Radio/Radio';
import styles from '@/components/atoms/Radio/Radio.module.css'; // Reusing group styles

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  legend: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * A group of radio buttons that manages its own state and provides a clear legend.
 */
export const RadioGroup = ({ name, options, legend, defaultValue, onChange }: RadioGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    // Fieldset and Legend provide crucial accessibility (WAI-ARIA)
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      {options.map((option, index) => (
        <Radio
          key={option.value}
          id={`${name}-${index}`}
          name={name}
          label={option.label}
          value={option.value}
          checked={selectedValue === option.value}
          onChange={handleChange}
        />
      ))}
    </fieldset>
  );
};