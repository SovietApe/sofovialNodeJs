const mongoose = require("../config/mongodb")

const playlistSchema = new mongoose.Schema({
    id: String,
    snippet: Object,
    channelTitle: String,
    localized: Object,
});

const playslistsModel = mongoose.model("playlist", playlistSchema);

module.exports = playslistsModel
