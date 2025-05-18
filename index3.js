const { searchByKeyword, getLyric } = require('nhaccuatui-api-full');

async function getLyricBySongName(songName) {
    try {
        // Tìm kiếm bài hát theo tên
        const searchResult = await searchByKeyword(songName);

        // Lọc danh sách bài hát có type là SONG
        const songs = searchResult.search.song.song.filter(song => song.type === 'SONG');

        if (songs.length === 0) {
            console.log(`Không tìm thấy bài hát "${songName}" với type là SONG.`);
            return;
        }

        // Lấy bài hát đầu tiên (hoặc bạn có thể thêm logic để chọn bài phù hợp)
        const song = songs[0];
        const songKey = song.key;
        const songTitle = song.title;

        // Lấy lời bài hát bằng key
        const lyricResult = await getLyric(songKey);

        if (lyricResult.status === 'success' && lyricResult.lyric) {
            console.log(`Lời bài hát: ${songTitle}`);
            console.log(lyricResult.lyric.lyric);
        } else {
            console.log(`Không tìm thấy lời bài hát cho "${songTitle}".`);
        }
    } catch (error) {
        console.error('Lỗi khi lấy lời bài hát:', error.message);
    }
}

// Ví dụ sử dụng
getLyricBySongName('Thê Lương');