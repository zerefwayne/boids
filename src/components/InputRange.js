import Slider from "@mui/material/Slider";
import { useRef } from "react";

function InputRange({ value, setter, label, min, max, step }) {
  const defaultValue = useRef(value);
  return (
    <>
      <p
        style={{ fontSize: ".8rem" }}
      >{`${label} (${defaultValue.current})`}</p>
      <Slider
        value={value}
        onChange={(event, newValue) => {
          setter(newValue);
        }}
        step={step}
        max={max}
        min={min}
        size="small"
        valueLabelDisplay="auto"
      />
    </>
  );
}

export default InputRange;
