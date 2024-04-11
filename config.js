require('dotenv').config();

const DEFAULT_PORT = 3000;
const DEFAULT_MAX_RESULTS = 10;

const config = {
    port: process.env.PORT || DEFAULT_PORT,
    youtubeApi: {
        version: process.env.VERSION,
        auth: process.env.YOUTUBE_API_KEY
    },
    searchSettings: {
        textToSearch: process.env.TEXT_TO_SEARCH,
        maxResults: parseInt(process.env.SEARCH_MAX_RESULTS) || DEFAULT_MAX_RESULTS
    }
};

module.exports = config;