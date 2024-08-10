import { useState } from "react";
import "./App.css";
import Controls from "./Controls";
import P5Sketch from "./p5-sketch";

function App() {
  const [closeRadius, setCloseRadius] = useState(15);
  const [visibleRadius, setVisibleRadius] = useState(60);
  const [avoidanceFactor, setAvoidanceFactor] = useState(0.05);
  const [matchingFactor, setMatchingFactor] = useState(0.05);
  const [centeringFactor, setCenteringFactor] = useState(0.001);

  const [frameRate, setFrameRate] = useState(0);

  const [margin, setMargin] = useState(125);
  const [isMarginVisible, setIsMarginVisible] = useState(false);

  const [renderTrails, setRenderTrails] = useState(true);

  const [renderMouseInfluence, setRenderMouseInfluence] = useState(true);
  const [mouseInfluenceRadius, setMouseInfluenceRadius] = useState(150);
  const [mouseAttractionFactor, setMouseAttractionFactor] = useState(0.01);

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
          renderTrails,
          margin,
          isMarginVisible,
          renderMouseInfluence,
          mouseInfluenceRadius,
          mouseAttractionFactor,
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
    </div>
  );
}

export default App;
