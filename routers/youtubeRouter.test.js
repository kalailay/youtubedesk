const express = require('express');
const request = require('supertest');
const youtubeRouter = require('./youtubeRouter');


jest.mock('googleapis', () => {
    return {
        google: {
            youtube: () => ({
                search: {
                    list: jest.fn().mockResolvedValue({
                        data: {
                            items: [{ id: { videoId: "12345" } }]
                        }
                    })
                },
                videos: {
                    list: jest.fn().mockResolvedValue({
                        data: {
                            items: [
                                {
                                    snippet: { title: 'AutoCad, BIM and Revit' },
                                    contentDetails: { duration: 'PT10H2M54S' },
                                    statistics: { viewCount: 450 }
                                }
                            ]
                        }
                    })
                }
            })
        }
    };
});


describe('YouTube Router', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/youtube', youtubeRouter);
    });

    it('should return correct video details', async () => {
        const response = await request(app).get('/youtube');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            {
                title: 'AutoCad, BIM and Revit',
                length: '10:02:54', // Ensure your convertDuration function handles this correctly
                views: 450
            }
        ]);
    });
});