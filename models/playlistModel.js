const mongoose = require("../config/mongodb")

const playlistSchema = new mongoose.Schema({
    id: String,
    snippet: Object,
    channelTitle: String,
    localized: Object,
});

const playlistsModel = mongoose.model("playlist", playlistSchema);

module.exports = playlistsModel
