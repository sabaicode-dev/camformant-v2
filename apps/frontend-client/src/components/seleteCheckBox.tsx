import Multiselect from "multiselect-react-dropdown";
import { useState } from "react";

// Define the prop types for SeleteCheckBox
interface SeleteCheckBoxProps {
  options: { name: string }[]; // Dropdown options passed as a prop
  selectedValue: string[]; // Selected values passed as a prop
  onSelect: (selected: string[]) => void; // Callback to handle selection
  onRemove: (selected: string[]) => void; // Callback to handle removal
}

const SeleteCheckBox = ({
  options,
  selectedValue,
  onSelect,
  onRemove,
}: SeleteCheckBoxProps) => {
  // Map selected values (strings) to option objects for display
  const selectedOptions = options.filter((opt) =>
    selectedValue.includes(opt.name)
  );

  // Handle selection changes
  const handleSelect = (selectedList: { name: string }[]) => {
    const updatedSelectedValues = selectedList.map((item) => item.name);
    console.log(updatedSelectedValues);
    onSelect(updatedSelectedValues);
  };

  // Handle removal changes
  const handleRemove = (selectedList: { name: string }[]) => {
    const updatedSelectedValues = selectedList.map((item) => item.name);
    onRemove(updatedSelectedValues);
  };
  return (
    <div className="text-[14px]">
      <Multiselect
        options={options} // Options to display
        selectedValues={selectedOptions} // Preselected values
        onSelect={handleSelect} // Triggered on selection
        onRemove={handleRemove} // Triggered on removal
        showCheckbox={true} // Enables checkboxes
        displayValue="name" // Property to display
      />
    </div>
  );
};

export default SeleteCheckBox;
