import "./Info.css";

import SeparationIllustration from "../../assets/separation.svg";
import AlignmentIllustration from "../../assets/alignment.svg";

function Info() {
  return (
    <div className="info-panel">
      <p>
        The flocking algorithm simulates the collective behavior of groups, such
        as birds in a flock or fish in a school. This algorithm is inspired by
        nature and is governed by three main principles:
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3>Separation</h3>
          <img
            src={SeparationIllustration}
            height={200}
            width={200}
            alt="Separation"
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Alignment</h3>
          <img
            src={AlignmentIllustration}
            height={200}
            width={200}
            alt="Alignment"
          />
        </div>
        <div style={{ flex: 1 }}>Cohesion</div>
      </div>
    </div>
  );
}

export default Info;
