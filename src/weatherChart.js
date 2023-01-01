import { Chart } from "chart.js/auto";

export function chart(data) {
    new Chart(document.getElementById("weatherChart"), {
        type: "line",
        data: {
            labels: data.map((row) => row.timeStamp),
            datasets: [
                {
                    label: "Temperature",
                    data: data.map((row) => row.temp),
                    color: "hsl(0, 0%, 100%)",
                    backgroundColor: "hsl(191, 21%, 50%)",
                    borderColor: "hsl(191, 21%, 80%)",
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    ticks: {
                        color: "hsl(0, 0%, 100%)",
                        stepSize: 4,
                    },
                    grid: {
                        display: false,
                    },
                },
                x: {
                    ticks: {
                        color: "hsl(0, 0%, 100%)",
                        stepSize: 4,
                    },
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}
