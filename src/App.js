import { useState } from "react";
import "./App.css";
import Controls from "./Controls";
import P5Sketch from "./p5-sketch";

function App() {
  const [closeRadius, setCloseRadius] = useState(10);
  const [visibleRadius, setVisibleRadius] = useState(30);

  return (
    <div className="container">
      <P5Sketch closeRadius={closeRadius} visibleRadius={visibleRadius} />
      <div className="controls-container">
        <Controls
          closeRadius={closeRadius}
          setCloseRadius={setCloseRadius}
          visibleRadius={visibleRadius}
          setVisibleRadius={setVisibleRadius}
        />
      </div>
    </div>
  );
}

export default App;
