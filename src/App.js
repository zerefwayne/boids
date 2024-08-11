import { useState } from "react";
import "./App.css";
import Canvas from "./Canvas";

import Controls from "./panels/Controls/Controls";
import TogglePanel from "./panels/TogglePanel/TogglePanel";
import Stats from "./panels/Stats/Stats";

function App() {
  const [closeRadius, setCloseRadius] = useState(15);
  const [avoidanceFactor, setAvoidanceFactor] = useState(0.05);
  const [matchingFactor, setMatchingFactor] = useState(0.05);
  const [centeringFactor, setCenteringFactor] = useState(0.001);

  const [frameRate, setFrameRate] = useState(0);

  const [margin, setMargin] = useState(125);
  const [isMarginVisible, setIsMarginVisible] = useState(false);

  const [renderTrails, setRenderTrails] = useState(true);

  const [renderMouseInfluence, setRenderMouseInfluence] = useState(false);
  const [mouseInfluenceRadius, setMouseInfluenceRadius] = useState(150);
  const [mouseAttractionFactor, setMouseAttractionFactor] = useState(0.01);

  const [isControlPanelVisible, setIsControlPanelVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(true);

  const [boids, setBoids] = useState([]);

  return (
    <div className="container">
      <Canvas
        {...{
          boids,
          setBoids,
          closeRadius,
          avoidanceFactor,
          matchingFactor,
          centeringFactor,
          setFrameRate,
          renderTrails,
          margin,
          isMarginVisible,
          renderMouseInfluence,
          mouseInfluenceRadius,
          mouseAttractionFactor,
        }}
      />
      <div className="toggle-panel-container">
        <TogglePanel
          {...{
            isControlPanelVisible,
            setIsControlPanelVisible,
            isStatsVisible,
            setIsStatsVisible,
          }}
        />
      </div>
      {isControlPanelVisible && (
        <div className="controls-container">
          <Controls
            {...{
              closeRadius,
              setCloseRadius,
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
            }}
          />
        </div>
      )}
      {isStatsVisible && (
        <div className="stats-panel-container">
          <Stats {...{ boids }} />
        </div>
      )}
    </div>
  );
}

export default App;
