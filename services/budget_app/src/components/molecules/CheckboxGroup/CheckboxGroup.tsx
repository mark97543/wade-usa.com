// services/main/src/components/molecules/CheckboxGroup/CheckboxGroup.tsx

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox/Checkbox';
import styles from '@/components/atoms/Checkbox/Checkbox.module.css'; // Reusing group styles

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  legend: string;
  initialValues?: string[];
  onChange?: (values: string[]) => void;
}

/**
 * A group of checkboxes that manages an array of selected values.
 */
export const CheckboxGroup = ({ name, options, legend, initialValues = [], onChange }: CheckboxGroupProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues);

  // Sync initial values only on first render
  useEffect(() => {
    setSelectedValues(initialValues);
  }, [initialValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    let newValues: string[];

    if (isChecked) {
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter((v) => v !== value);
    }
    
    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };

  return (
    // Fieldset and Legend provide crucial accessibility (WAI-ARIA)
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          id={`${name}-${option.value}`}
          name={name}
          label={option.label}
          value={option.value}
          checked={selectedValues.includes(option.value)}
          onChange={handleChange}
        />
      ))}
    </fieldset>
  );
};