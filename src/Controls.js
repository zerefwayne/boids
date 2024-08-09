import "./Controls.css";

import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";

function Controls({
  closeRadius,
  setCloseRadius,
  visibleRadius,
  setVisibleRadius,
  avoidanceFactor,
  setAvoidanceFactor,
  matchingFactor,
  setMatchingFactor,
  centeringFactor,
  setCenteringFactor,
  frameRate
}) {
  return (
    <div className="controls">
      <Paper
        sx={{
          padding: "1rem",
          backgroundColor: "rgba(10, 10, 10, 0.7)",
          color: "white",
        }}
      >
        <p style={{ fontSize: ".8rem", marginBottom: "1rem"}}>Frame Rate: {frameRate}</p>
        <p style={{ fontSize: ".8rem" }}>Close Radius</p>
        <Slider
          value={closeRadius}
          onChange={(event, newValue) => {
            setCloseRadius(newValue);
          }}
          step={1}
          max={50}
          min={5}
          size="small"
          valueLabelDisplay="auto"
        />
        <p style={{ fontSize: ".8rem" }}>Visible Radius</p>
        <Slider
          value={visibleRadius}
          onChange={(event, newValue) => {
            setVisibleRadius(newValue);
          }}
          step={1}
          max={200}
          min={5}
          size="small"
          valueLabelDisplay="auto"
        />
        <p style={{ fontSize: ".8rem" }}>Avoidance Factor</p>
        <Slider
          value={avoidanceFactor}
          onChange={(event, newValue) => {
            setAvoidanceFactor(newValue);
          }}
          step={0.01}
          max={1}
          min={0}
          size="small"
          valueLabelDisplay="auto"
        />
        <p style={{ fontSize: ".8rem" }}>Matching Factor</p>
        <Slider
          value={matchingFactor}
          onChange={(event, newValue) => {
            setMatchingFactor(newValue);
          }}
          step={0.01}
          max={1}
          min={0}
          size="small"
          valueLabelDisplay="auto"
        />
        <p style={{ fontSize: ".8rem" }}>Centering Factor</p>
        <Slider
          value={centeringFactor}
          onChange={(event, newValue) => {
            setCenteringFactor(newValue);
          }}
          step={0.001}
          max={0.02}
          min={0}
          size="small"
          valueLabelDisplay="auto"
        />
      </Paper>
    </div>
  );
}

export default Controls;
