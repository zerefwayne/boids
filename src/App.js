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

  const [margin, setMargin] = useState(50);
  const [isMarginVisible, setIsMarginVisible] = useState(false);

  const [isSeperationEnabled, setIsSeperationEnabled] = useState(true);
  const [isAlignmentEnabled, setIsAlignmentEnabled] = useState(true);
  const [isCohesionEnabled, setIsCohesionEnabled] = useState(true);

  const [renderTrails, setRenderTrails] = useState(true);

  return (
    <div className="container">
      <P5Sketch
        {...{
          closeRadius,
          visibleRadius,
          avoidanceFactor,
          matchingFactor,
          centeringFactor,
          setFrameRate,
          isSeperationEnabled,
          isAlignmentEnabled,
          isCohesionEnabled,
          renderTrails,
          margin,
          isMarginVisible,
        }}
      />
      <div className="controls-container">
        <Controls
          {...{
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
          }}
        />
      </div>
    </div>
  );
}

export default App;
