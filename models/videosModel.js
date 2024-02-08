const mongoose = require("../config/mongodb");
const {v4} = require('uuid')

const videosSchema = mongoose.Schema({
    id: {
        type: String,
    },
    etag:{
        type: String,
    },
    snippet: {
        type: Object,
    },
    playlists:{
        type: Array
    }
});

videosSchema.set("toJSON", {getters: true, setters: true, virtual: true})
const videosModel = mongoose.model("Videos", videosSchema)
module.exports = videosModel