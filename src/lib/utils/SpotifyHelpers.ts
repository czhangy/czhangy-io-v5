import { SpotifyTrack } from './shared/types';

export default class SpotifyHelpers {
    // -------------------------------------------------------------------------
    // PRIVATE
    // -------------------------------------------------------------------------

    private static async getAccessToken(): Promise<string> {
        const basic = Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64');

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
            }),
            cache: 'no-store',
        });

        const data = (await response.json()) as { access_token: string };
        return data.access_token;
    }

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static async getRecentlyPlayed(): Promise<SpotifyTrack | null> {
        const accessToken = await SpotifyHelpers.getAccessToken();

        const response = await fetch(
            'https://api.spotify.com/v1/me/player/recently-played?limit=1',
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                cache: 'no-store',
            }
        );

        if (!response.ok) return null;

        const data = (await response.json()) as {
            items: {
                track: {
                    name: string;
                    artists: { name: string }[];
                    album: { images: { url: string }[] };
                    external_urls: { spotify: string };
                };
            }[];
        };

        const track = data.items?.[0]?.track;
        if (!track) return null;

        return {
            name: track.name,
            artist: track.artists.map((a) => a.name).join(', '),
            albumArt: track.album.images[1]?.url ?? track.album.images[0]?.url,
            url: track.external_urls.spotify,
        };
    }
}
