import React, { useEffect, useState } from "react";

const DevicesGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
    backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"], // Old colors
  });

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await fetch("https://crmdemo.vimubds5.a2hosted.com/api/devices-data");
        const data = await response.json();

        // Process the data to format it for the chart
        const labels = data.map((item) => item.device_type);
        const dataCounts = data.map((item) => item.count);

        setChartData({
          labels: labels,
          data: dataCounts,
        });
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchDeviceData();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.async = true;
    script.onload = () => {
      const ctx = document.getElementById("devicesChart").getContext("2d");
      new window.Chart(ctx, {
        type: "pie",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.data,
              backgroundColor: chartData.backgroundColor, // Use old colors
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow the chart to resize based on container
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    };
    document.body.appendChild(script);

    // Cleanup script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [chartData]); // Re-run effect when chartData changes

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">Used Devices</h3>
      <div className="relative w-full h-64">
        <canvas
          id="devicesChart"
          className="absolute top-0 left-0 w-full h-full"
        ></canvas>
      </div>
    </div>
  );
};

export default DevicesGraph;
