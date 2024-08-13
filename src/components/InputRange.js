import Slider from "@mui/material/Slider";

function InputRange({ value, defaultValue, setter, label, min, max, step }) {
  return (
    <>
      <p style={{ fontSize: ".8rem" }}>
        {label} {defaultValue && `(${defaultValue})`}
      </p>
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
