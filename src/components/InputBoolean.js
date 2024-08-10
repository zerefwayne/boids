import Checkbox from "@mui/material/Checkbox";

function InputBoolean({ value, setter, label }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: ".5rem",
      }}
    >
      <p style={{ fontSize: ".8rem" }}>{label}</p>
      <Checkbox
        checked={value}
        size="small"
        onChange={(event) => {
          setter(event.target.checked);
        }}
        inputProps={{ "aria-label": "controlled" }}
        sx={{ margin: 0, padding: 0 }}
      />
    </div>
  );
}

export default InputBoolean;
