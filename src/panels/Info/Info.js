import "./Info.css";

import SeparationIllustration from "../../assets/separation.svg";
import AlignmentIllustration from "../../assets/alignment.svg";
import CohesionIllustration from "../../assets/cohesion.svg";

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
          margin: "1rem",
          textAlign: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <p className="behaviour-heading">Separation</p>
          <img
            src={SeparationIllustration}
            height={200}
            width={200}
            alt="Separation"
          />
          <p className="behaviour-description">
            Maintain a safe distance from its close neighbors.
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p className="behaviour-heading">Alignment</p>
          <img
            src={AlignmentIllustration}
            height={200}
            width={200}
            alt="Alignment"
          />
          <p className="behaviour-description">
            Align with the average direction of its neighbors.
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p className="behaviour-heading">Cohesion</p>
          <img
            src={CohesionIllustration}
            height={200}
            width={200}
            alt="Cohesion"
          />
          <p className="behaviour-description">
            Move towards the average position of its neighbors.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Info;
