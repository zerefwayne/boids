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

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Stats({ boids, populationHistory, setPopulationHistory }) {
  const [stats, setStats] = useState({});
  const [lastUpdatedAt, setLastUpdatedAt] = useState(0);

  const CHART_HISTORY_TIME = 120;

  const computePopulations = () => {
    let boidStats = {};

    if (Date.now() - lastUpdatedAt < 1000) {
      return;
    }
    setLastUpdatedAt(Date.now());

    boids.forEach((boid) => {
      if (!boidStats[boid.type]) boidStats[boid.type] = 0;
      boidStats[boid.type]++;
    });

    setStats({ ...boidStats });
    // Keep track of the population history, only store the last 300 entries
    setPopulationHistory((prev) => {
      const newHistory = [...prev, { ...boidStats }];
      return newHistory.slice(-1 * CHART_HISTORY_TIME); // Keep only the last 300 entries
    });
  };

  // Prepare data for the chart
  const chartData = {
    labels: populationHistory.map((_, index) => index), // X axis (time steps)
    datasets: Object.keys(stats).map((type, index) => ({
      label: type,
      data: populationHistory.map((entry) => entry[type] || 0),
      borderColor: populationHistory.map(
        (entry) => BoidTypes[type].boidColor || "black"
      ),
      borderWidth: 1,
      fill: false,
      tension: 0.4,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, // Disable initial load animation by setting duration to 0
    },
    scales: {
      x: { display: false }, // Hide X axis labels for minimal look
      y: {
        ticks: { color: "white" }, // Y axis labels in white
      },
    },
    plugins: {
      legend: { display: false }, // Hide the legend for a minimal look
    },
    elements: {
      point: { radius: 0 }, // No points on the lines
    },
  };

  const _prefillHistory = () => {
    const dummy = Object.fromEntries(
      Object.keys(BoidTypes).map((type) => [type, 0])
    );
    setPopulationHistory(Array(CHART_HISTORY_TIME).fill(dummy));
  };

  useEffect(() => {
    computePopulations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boids]);

  useEffect(() => {
    populationHistory.length === 0 && _prefillHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div style={{ height: "100px", marginTop: "20px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Stats;
