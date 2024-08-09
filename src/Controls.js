import "./Controls.css";

import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";

function Controls({ closeRadius, setCloseRadius, visibleRadius, setVisibleRadius }) {
  return (
    <div className="controls">
      <Paper sx={{ padding: "1rem", backgroundColor: "rgba(10, 10, 10, 0.7)", color: "white" }}>
        <p style={{fontSize: '.8rem'}}>Close Radius</p>
        <Slider
          value={closeRadius}
          onChange={(event, newValue) => {setCloseRadius(newValue)}}
          step={1}
          max={50}
          min={5}
          size="small"
          valueLabelDisplay="auto"
        />
        <p style={{fontSize: '.8rem'}}>Visible Radius</p>
        <Slider
          value={visibleRadius}
          onChange={(event, newValue) => {setVisibleRadius(newValue)}}
          step={1}
          max={200}
          min={5}
          size="small"
          valueLabelDisplay="auto"
        />
      </Paper>
      
    </div>
  );
}

export default Controls;
