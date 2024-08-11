import React, { useEffect, useState } from "react";
import "./Stats.css";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BoidTypes from "../../BoidTypes";

function Stats({ boids }) {
  const [stats, setStats] = useState({});

  const computePopulations = () => {
    let boidStats = {};

    boids.forEach((boid) => {
      if (!boidStats[boid.type]) boidStats[boid.type] = 0;
      boidStats[boid.type]++;
    });

    setStats({ ...boidStats });
  };

  useEffect(() => {
    computePopulations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boids]);

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "rgba(1, 1, 1, 0.5)", color: "white" }}
      >
        <Table size="small" sx={{ background: "none" }}>
          <TableBody>
            {Object.keys(stats)
              .sort((a, b) => stats[b] - stats[a])
              .map((type) => (
                <TableRow
                  key={type}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ color: "white" }}
                    align="center"
                  >
                    <PlayArrowIcon sx={{ color: BoidTypes[type].boidColor }} />
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    {stats[type] || 0}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>{`${(
                    (stats[type] / boids.length) *
                    100
                  ).toFixed(0)}%`}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Stats;
