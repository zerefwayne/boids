import "./Controls.css";

import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";

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
  frameRate,
  isSeperationEnabled,
  setIsSeperationEnabled,
  isAlignmentEnabled,
  setIsAlignmentEnabled,
  isCohesionEnabled,
  setIsCohesionEnabled,
  renderTrails,
  setRenderTrails,
  margin,
  setMargin,
  isMarginVisible,
  setIsMarginVisible,
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
        <p style={{ fontSize: ".8rem", marginBottom: "1rem" }}>
          Frame Rate: {frameRate}
        </p>
        <p style={{ fontSize: ".8rem" }}>Margin</p>
        <Slider
          value={margin}
          onChange={(event, newValue) => {
            setMargin(newValue);
          }}
          step={1}
          max={300}
          min={0}
          size="small"
          valueLabelDisplay="auto"
        />
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: ".5rem",
          }}
        >
          <p style={{ fontSize: ".8rem" }}>Enable seperation</p>
          <Checkbox
            checked={isSeperationEnabled}
            size="small"
            onChange={(event) => {
              setIsSeperationEnabled(event.target.checked);
            }}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ margin: 0, padding: 0 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: ".5rem",
          }}
        >
          <p style={{ fontSize: ".8rem" }}>Enable alignment</p>
          <Checkbox
            checked={isAlignmentEnabled}
            size="small"
            onChange={(event) => {
              setIsAlignmentEnabled(event.target.checked);
            }}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ margin: 0, padding: 0 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: ".5rem",
          }}
        >
          <p style={{ fontSize: ".8rem" }}>Enable cohesion</p>
          <Checkbox
            checked={isCohesionEnabled}
            size="small"
            onChange={(event) => {
              setIsCohesionEnabled(event.target.checked);
            }}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ margin: 0, padding: 0 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: ".5rem",
          }}
        >
          <p style={{ fontSize: ".8rem" }}>Display trails</p>
          <Checkbox
            checked={renderTrails}
            size="small"
            onChange={(event) => {
              setRenderTrails(event.target.checked);
            }}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ margin: 0, padding: 0 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: ".8rem" }}>Display margin</p>
          <Checkbox
            checked={isMarginVisible}
            size="small"
            onChange={(event) => {
              setIsMarginVisible(event.target.checked);
            }}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ margin: 0, padding: 0 }}
          />
        </div>
      </Paper>
    </div>
  );
}

export default Controls;
