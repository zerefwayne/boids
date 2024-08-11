import "./TogglePanel.css";

import IconButton from "@mui/material/IconButton";
import TuneIcon from "@mui/icons-material/Tune";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { Stack } from "@mui/material";

function TogglePanel({
  isControlPanelVisible,
  setIsControlPanelVisible,
  isStatsVisible,
  setIsStatsVisible,
}) {
  return (
    <div className="toggle-panel">
      <Stack direction="row" spacing={0.5}>
        <IconButton
          sx={{ color: isControlPanelVisible ? "white" : "gray" }}
          fontSize="small"
          onClick={() => {
            setIsControlPanelVisible((prev) => !prev);
          }}
        >
          <TuneIcon />
        </IconButton>
        <IconButton
          sx={{ color: isStatsVisible ? "white" : "gray" }}
          fontSize="small"
          onClick={() => {
            setIsStatsVisible((prev) => !prev);
          }}
        >
          <EqualizerIcon />
        </IconButton>
      </Stack>
    </div>
  );
}

export default TogglePanel;
