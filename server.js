const express = require('express');
const { searchByKeyword, getLyric } = require('nhaccuatui-api-full');
const cors = require('cors');

const app = express();
app.use(cors()); // Cho phép Flutter gọi API
app.use(express.json());

app.get('/search/:songName', async (req, res) => {
    try {
        const songName = req.params.songName;
        const searchResult = await searchByKeyword(songName);
        const songs = searchResult.search.song.song.filter(song => song.type === 'SONG');
        res.json({
            status: 'success',
            songs: songs.map(song => ({
                key: song.key,
                title: song.title,
                artists: song.artists.map(a => a.name).join(', '),
                duration: song.duration,
                thumbnail: song.thumbnail
            }))
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/lyric/:songKey', async (req, res) => {
    try {
        const songKey = req.params.songKey;
        const lyricResult = await getLyric(songKey);
        res.json({
            status: lyricResult.status,
            lyric: lyricResult.lyric ? {
                title: lyricResult.lyric.title,
                lyric: lyricResult.lyric.lyric,
                writer: lyricResult.lyric.writer,
                composer: lyricResult.lyric.composer
            } : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
app.get('/searchlyric/:songName', async (req, res) => {
    try {
        const songName = req.params.songName;

        // Tìm kiếm bài hát
        const searchResult = await searchByKeyword(songName);
        const songs = searchResult.search.song.song.filter(song => song.type === 'SONG');

        if (songs.length === 0) {
            return res.status(404).json({ status: 'not_found', message: 'Không tìm thấy bài hát nào' });
        }

        const firstSong = songs[0]; // Lấy bài đầu tiên
        const lyricResult = await getLyric(firstSong.key);

        res.json({
            status: 'success',
            song: {
                key: firstSong.key,
                title: firstSong.title,
                artists: firstSong.artists.map(a => a.name).join(', '),
                duration: firstSong.duration,
                thumbnail: firstSong.thumbnail
            },
            lyric: lyricResult.lyric ? {
                title: lyricResult.lyric.title,
                lyric: lyricResult.lyric.lyric,
                writer: lyricResult.lyric.writer,
                composer: lyricResult.lyric.composer
            } : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});