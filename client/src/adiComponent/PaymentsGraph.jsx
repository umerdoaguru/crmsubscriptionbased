import React, { useEffect, useState } from "react";

const PaymentsGraph = () => {
  const [chartData, setChartData] = useState({
    received: [],
    due: [],
    labels: [],
  });

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("https://crmdemo.vimubds5.a2hosted.com/api/payments");
        const data = await response.json();

        data.forEach((item) => {
          const month = new Date(item.created_at).toLocaleString("default", {
            month: "short",
          });
          // Check if month already exists in labels
          if (!labels.includes(month)) {
            labels.push(month);
            receivedAmounts.push(item.received_amount);
            dueAmounts.push(item.due_amount);
          } else {
            // Update amounts if the month already exists
            const index = labels.indexOf(month);
            receivedAmounts[index] += item.received_amount;
            dueAmounts[index] += item.due_amount;
          }
        });

        setChartData({
          received: receivedAmounts,
          due: dueAmounts,
          labels: labels,
        });
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.async = true;
    script.onload = () => {
      const ctx = document.getElementById("paymentsChart").getContext("2d");
      new window.Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Received Amount",
              data: chartData.received,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              fill: true,
            },
            {
              label: "Due Amount",
              data: chartData.due,
              borderColor: "#F44336",
              backgroundColor: "rgba(244, 67, 54, 0.2)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [2],
              },
            },
          },
        },
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [chartData]); // Re-run effect when chartData changes

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">Payments Overview</h3>
      <div className="relative w-full h-64">
        <canvas
          id="paymentsChart"
          className="absolute top-0 left-0 w-full h-full"
        ></canvas>
      </div>
    </div>
  );
};

export default PaymentsGraph;
