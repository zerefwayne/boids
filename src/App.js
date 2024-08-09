import { useState } from "react";
import "./App.css";
import Controls from "./Controls";
import P5Sketch from "./p5-sketch";

function App() {
  const [closeRadius, setCloseRadius] = useState(10);
  const [visibleRadius, setVisibleRadius] = useState(30);
  const [avoidanceFactor, setAvoidanceFactor] = useState(0.05);
  const [matchingFactor, setMatchingFactor] = useState(0.05);
  const [centeringFactor, setCenteringFactor] = useState(0.001);

  const [frameRate, setFrameRate] = useState(0);

  return (
    <div className="container">
      <P5Sketch
        closeRadius={closeRadius}
        visibleRadius={visibleRadius}
        avoidanceFactor={avoidanceFactor}
        matchingFactor={matchingFactor}
        centeringFactor={centeringFactor}
        setFrameRate={setFrameRate}
      />
      <div className="controls-container">
        <Controls
          closeRadius={closeRadius}
          setCloseRadius={setCloseRadius}
          visibleRadius={visibleRadius}
          setVisibleRadius={setVisibleRadius}
          avoidanceFactor={avoidanceFactor}
          setAvoidanceFactor={setAvoidanceFactor}
          matchingFactor={matchingFactor}
          setMatchingFactor={setMatchingFactor}
          centeringFactor={centeringFactor}
          setCenteringFactor={setCenteringFactor}
          frameRate={frameRate}
        />
      </div>
    </div>
  );
}

export default App;
