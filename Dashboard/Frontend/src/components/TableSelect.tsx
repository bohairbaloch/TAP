import React, { ChangeEvent } from "react";
import Select from "react-select";

type Props = {
  options: { value: string; label: string }[];
  onChange: (selectedOption: { value: string; label: string } | null) => void;
};

const TableSelect: React.FC<Props> = ({ options, onChange }) => {
  const defaultValue = options[0];

  return (
    <Select options={options} onChange={onChange} defaultValue={defaultValue} />
  );
};

export default TableSelect;
