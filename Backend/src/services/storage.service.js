const {ImageKit} = require('@imagekit/nodejs');
require('dotenv').config()

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY
});

async function uploadFile(buffer) {
    const result=await imagekit.files.upload({
        file: buffer.toString("base64"),
        fileName:"music-"+Date.now(),
        folder: "Complete-Backend/Music"
    })
    return result
}

module.exports = uploadFile