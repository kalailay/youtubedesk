// express for creating a server
// googleapis for interacting with Youtube API

const express = require('express');
const os = require('os');
const config = require('./config');
const { youtubeRouter } = require('./routers');

// Initalizing an express app
const app = express();
const port = config.port; // Use the PORT environment variable or default to 3000

function getCpuUsage() {
    const cpus = os.cpus();
    let idleTime = 0;
    let totalTime = 0;

    cpus.forEach(cpu => {
        for (let type in cpu.times) {
            totalTime += cpu.times[type];
            if (type == 'idle') {
                idleTime += cpu.times[type];
            }
        }
    });

    // Calculate CPU usage precentage
    const idlePrecentage = idleTime / cpus.length;
    const totalPrecentage = totalTime / cpus.length;
    const usagePrecentage = 100 - (100 * idlePrecentage / totalPrecentage);

    return usagePrecentage.toFixed(2);

}

app.use('/youtube', youtubeRouter);

// Health check route
app.get('/health', (req, res) => {
    res.json({
        os: os.type(),
        languageVersion: process.version,
        memoryUsage: `${(process.memoryUsage().rss / 1024 / 1024 / 1024 * 100).toFixed(2)}%`,
        cpuUsage: `${getCpuUsage()}%`
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});