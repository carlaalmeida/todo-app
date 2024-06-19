import { useEffect, useState } from "react";
import "./Checkbox.scss";

export default function Checkbox({ id, readOnly, value, onCheck }) {
  const [isChecked, setIsChecked] = useState(value ? value : false);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  const handleChange = () => {
    setIsChecked((prevValue) => {
      const newValue = !prevValue;
      onCheck(newValue);
      return newValue;
    });
  };

  return (
    <label className="Checkbox">
      <input
        type="checkbox"
        defaultChecked={isChecked}
        readOnly={readOnly}
        onChange={handleChange}
      />
      <span className="circle" data-checked={isChecked}></span>
    </label>
  );
}
