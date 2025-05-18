const { searchByKeyword } = require('nhaccuatui-api-full');

async function getSongIdByName(songName) {
    const result = await searchByKeyword(songName);
    console.log(JSON.stringify(result, null, 2));
}

// Ví dụ sử dụng
getSongIdByName('Lạc Trôi');