### 1. Link to my live API on Heroku
[youtubedesk](https://youtubedesk-66f232f38324.herokuapp.com/)


### 2. Usage
#### GET [Youtube API]
URL: /youtube

This endpoint return a list of 10 videos with Autodesk.

Each video item include:
- title
- length
- views


####  GET /health
URL: /health

This endpoint return:
- OS name
- Language/platform version
- Memory usage precentage of your machine
- CPU usage of precentage your machine


### 3. Local Setup with Docker
1. create .env file with:
- YOUTUBE_API_KEY - your youtube API key
- PORT - port to expose, example: 3000
- VERSION - version of the API, set it to 'v3'
- TEXT_TO_SEARCH - word by which the service searchs for, example: Autodesk 
- SEARCH_MAX_RESULTS - number of videos to return in /youtube, example: 10 

2. Build the Docker image: 

    docker build -t youtubedesk .

3. Run the Docker container:

    docker run -p 3000:3000 youtubedesk

4. Now you can reach the API using: http://localhost:3000
