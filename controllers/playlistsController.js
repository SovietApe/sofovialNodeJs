const { response } = require("../app")
const playlistModel = require("../models/playlistModel")
const videosModel = require('../models/videosModel')

module.exports={
    getAll: async function(req, res , next){
        try {
            const playlists = await playlistModel.find()
            res.json(playlists)
        } catch (error) {
            next(error)
        }
    },
    getVideosById: async function(req,res,next){
        try {
            console.log(req.params.id)
            const document = await videosModel.find({"playlists.id": req.params.id})
            console.log(document)
            res.json(document)
        } catch (error) {
            next(error)
        }
   },
    selectPage: async function(req, res, next){
        try{
            console.log(req.query)
            const id = req.params.id
            const playlistid = id.split("&")[0]
            const nextPage = id.split("&")[1]
            const documents = await videosModel.find({"playlists.id": playlistid})
            const totalResults = documents.length
            const pages = Math.ceil(totalResults / 50)
            if(nextPage > 0 && nextPage <= pages){
                    console.log("hola")
                    let index1 = 50 * nextPage
                    const videos = documents.slice((index1 - 50),(index1))
                    console.log(videos)
                    res.json({videos: videos,
                    pages: pages})
            }else{
                res.json("la pagina no existe")
            }
        } catch(error){
            return res.status("error: ").json(error.message)
        }

    }
}