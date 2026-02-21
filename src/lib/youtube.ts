import { google } from 'googleapis';

export function getYoutubeClient() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is missing in .env.local');
  }

  return google.youtube({
    version: 'v3',
    auth: apiKey,
  });
}
