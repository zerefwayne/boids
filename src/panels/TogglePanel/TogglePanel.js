import "./TogglePanel.css";

import IconButton from "@mui/material/IconButton";
import TuneIcon from "@mui/icons-material/Tune";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import { Stack, Tooltip } from "@mui/material";

function TogglePanel({
  isControlPanelVisible,
  setIsControlPanelVisible,
  isStatsVisible,
  setIsStatsVisible,
  spawnSeedsOnClick,
  setSpawnSeedsOnClick,
}) {
  return (
    <div className="toggle-panel">
      <Stack direction="row" spacing={0.5}>
        <Tooltip
          title={`${isControlPanelVisible ? "Hide" : "Show"} controls`}
          arrow
        >
          <IconButton
            sx={{ color: isControlPanelVisible ? "white" : "gray" }}
            fontSize="small"
            onClick={() => {
              setIsControlPanelVisible((prev) => !prev);
            }}
          >
            <TuneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={`${isStatsVisible ? "Hide" : "Show"} statistics`} arrow>
          <IconButton
            sx={{ color: isStatsVisible ? "white" : "gray" }}
            fontSize="small"
            onClick={() => {
              setIsStatsVisible((prev) => !prev);
            }}
          >
            <EqualizerIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`${
            spawnSeedsOnClick ? "Disable" : "Enable"
          } seed spawning on mouse click`}
          arrow
        >
          <IconButton
            sx={{ color: spawnSeedsOnClick ? "white" : "gray" }}
            fontSize="small"
            onClick={() => {
              setSpawnSeedsOnClick((prev) => !prev);
            }}
          >
            <BubbleChartIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </div>
  );
}

export default TogglePanel;
