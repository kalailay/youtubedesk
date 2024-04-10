require('dotenv').config();

//express for creating a server
//googleapis for interacting with Youtube API

const express = require('express');
const { google } = require('googleapis');
const os = require('os');

//initalizing an express app
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

//setting up the YouTube Data API client with the necessary configuration, version & authentication method
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
});

function getCpuUsage(){
    const cpus = os.cpus();
    let idleTime = 0;
    let totalTime = 0;

    cpus.forEach(cpu => {
        for (let type in cpu.times) {
            totalTime += cpu.times[type];
            if(type == 'idle') {
                idleTime +=cpu.times[type];
            }
        }
    });

    //Calculate CPU usage precentage
    const idlePrecentage = idleTime / cpus.length;
    const totalPrecentage = totalTime / cpus.length;
    const usagePrecentage = 100 - (100 * idlePrecentage / totalPrecentage);

    return usagePrecentage.toFixed(2);

}

function convertDuration(duration) {
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = (parseInt(match[1]) || 0);
    let minutes = (parseInt(match[2]) || 0);
    let seconds = (parseInt(match[3]) || 0);

    // Ensure two digits by adding leading zeros if needed
    let hoursFormatted = hours < 10 ? `0${hours}` : hours;
    let minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    let secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;

    // Constructing HH:MM:SS format
    return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
}

// Route for fetching YouTube videos
app.get('/youtube', async (req, res) => {
    console.log('Accessed /youtube endpoint');
    try {
        const searchResponse = await youtube.search.list({
            part: 'snippet',
            q: 'Autodesk', // Search for videos related to Autodesk
            maxResults: 10,
            type: 'video'
        });
        // Ensure videoIds is defined in this scope and collect IDs
        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

        const videosResponse = await youtube.videos.list({
            part: 'snippet,contentDetails,statistics',
            id: videoIds
        });
        const videosInfo = videosResponse.data.items.map(video => {
            const videoDetail = {
                title: video.snippet.title,
                length: convertDuration(video.contentDetails.duration),
                views: video.statistics.viewCount
            };

            // Log each video's details to the console fro debugging
            console.log(videoDetail);
            return videoDetail;
        });

        //Send videosInfo as the response
        res.json(videosInfo);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).send(error.toString());
    }
});

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

