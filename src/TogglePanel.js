import "./TogglePanel.css";

import IconButton from "@mui/material/IconButton";
import TuneIcon from "@mui/icons-material/Tune";
import { Stack } from "@mui/material";

function TogglePanel({ isControlPanelVisible, setIsControlPanelVisible }) {
  return (
    <div className="toggle-panel">
      <Stack direction="row" spacing={1}>
        <IconButton
          sx={{ color: "white" }}
          fontSize="small"
          onClick={() => {
            setIsControlPanelVisible((prev) => !prev);
          }}
        >
          <TuneIcon />
        </IconButton>
      </Stack>
    </div>
  );
}

export default TogglePanel;
