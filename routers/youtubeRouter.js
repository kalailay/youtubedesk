const { Router } = require('express');
const { google } = require('googleapis');
const config = require('../config');
const { searchTypes, videoAttributes } = require('../enums');
const { convertDuration } = require('../utilities');

const youtubeRouter = Router();

// Setting up the YouTube Data API client with the necessary configuration, version & authentication method
const youtube = google.youtube(config.youtubeApi);

youtubeRouter.get('/', async (req, res) => {
    console.log('Accessed /youtube endpoint');
    try {
        const searchResponse = await youtube.search.list({
            part: videoAttributes.snippet,
            q: config.searchSettings.textToSearch,
            maxResults: config.searchSettings.maxResults,
            type: searchTypes.video
        });

        // Ensure videoIds is defined in this scope and collect IDs
        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

        const videosResponse = await youtube.videos.list({
            part: `${videoAttributes.snippet},${videoAttributes.contentDetails},${videoAttributes.statistics}`,
            id: videoIds
        });
        const videosInfo = videosResponse.data.items.map(video => {
            const videoDetail = {
                title: video.snippet.title,
                length: convertDuration(video.contentDetails.duration),
                views: video.statistics.viewCount
            };

            // Log each video's details to the console for debugging
            // console.log(videoDetail);
            return videoDetail;
        });

        // Send videosInfo as the response
        res.json(videosInfo);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).send(error.toString());
    }
})

module.exports = youtubeRouter;