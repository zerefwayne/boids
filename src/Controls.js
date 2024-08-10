import "./Controls.css";

import Paper from "@mui/material/Paper";

import InputBoolean from "./components/InputBoolean";
import InputRange from "./components/InputRange";
import { Divider } from "@mui/material";

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
  renderTrails,
  setRenderTrails,
  margin,
  setMargin,
  isMarginVisible,
  setIsMarginVisible,
  renderMouseInfluence,
  setRenderMouseInfluence,
  mouseInfluenceRadius,
  setMouseInfluenceRadius,
  mouseAttractionFactor,
  setMouseAttractionFactor,
}) {
  return (
    <div className="controls">
      <Paper
        sx={{
          padding: "1rem",
          paddingBottom: "0.5rem",
          backgroundColor: "rgba(10, 10, 10, 0.7)",
          color: "white",
        }}
      >
        <p style={{ fontSize: ".8rem", marginBottom: "1rem" }}>
          Frame Rate: {frameRate}
        </p>
        <InputRange
          label="Margin"
          value={margin}
          setter={setMargin}
          step={1}
          max={300}
          min={0}
        />
        <InputRange
          label="Close Radius"
          value={closeRadius}
          setter={setCloseRadius}
          step={1}
          max={50}
          min={5}
        />
        <InputRange
          label="Visible Radius"
          value={visibleRadius}
          setter={setVisibleRadius}
          step={1}
          max={200}
          min={5}
        />
        <InputRange
          label="Avoidance Factor"
          value={avoidanceFactor}
          setter={setAvoidanceFactor}
          step={0.01}
          max={1}
          min={0}
        />
        <InputRange
          label="Matching Factor"
          value={matchingFactor}
          setter={setMatchingFactor}
          step={0.01}
          max={1}
          min={0}
        />
        <InputRange
          label="Centering Factor"
          value={centeringFactor}
          setter={setCenteringFactor}
          step={0.001}
          max={0.02}
          min={0}
        />
        <InputRange
          label="Mouse Influence Radius"
          value={mouseInfluenceRadius}
          setter={setMouseInfluenceRadius}
          step={10}
          max={300}
          min={10}
        />
        <InputRange
          label="Mouse Attraction Factor"
          value={mouseAttractionFactor}
          setter={setMouseAttractionFactor}
          step={0.001}
          max={0.1}
          min={0}
        />
        <InputBoolean
          value={renderTrails}
          setter={setRenderTrails}
          label="Display trails"
        />
        <InputBoolean
          value={renderMouseInfluence}
          setter={setRenderMouseInfluence}
          label="Display mouse influence"
        />
        <InputBoolean
          value={isMarginVisible}
          setter={setIsMarginVisible}
          label="Display margin"
        />
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} variant="fullWidth" />
        <p style={{ fontSize: ".8rem", margin: ".5rem", color: "#AAA" }}>
          Click & Drag mouse to attract boids!
        </p>
      </Paper>
    </div>
  );
}

export default Controls;
