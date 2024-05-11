const VideosModel = require("../models/videosModel");


async function getAndSort(order){
    customSortByRecent = (a,b)=>{
        const dateA = new Date(a.snippet.publishedAt)
        const dateB = new Date(b.snippet.publishedAt)
            if(dateA > dateB) return -1;
            else if(dateA < dateB) return 1
            return 0;
        }
    customSortByOldest = (a,b)=>{
        const dateA = new Date(a.snippet.publishedAt)
        const dateB = new Date(b.snippet.publishedAt)
            if(dateA > dateB) return 1;
            else if(dateA < dateB) return -1
            return 0;
        }

    
    const getdocument = await VideosModel.find()
    if(order === "1"){
        const documents = await getdocument.sort(customSortByRecent)
        return documents
    }else {
        const documents = await getdocument.sort(customSortByOldest)
        return documents
    }
    
}

const getAllVideos = async function(req,res,next){
    try{
        const documents = await VideosModel.find()
        res.json(documents)
    } catch(error){
        return res.status("error: ").json(error.message)
    }
}

const selectPage = async function(req, res, next){
    try{
        console.log(req.query)
        const id = req.params.id
        const nextPage = id.split("")[0]
        const order = id.split("")[1]
        console.log(nextPage, order)
        const documents = await getAndSort(order)
        const totalResults = documents.length
        const pages = Math.ceil(totalResults / 50)
        if(nextPage > 0 && nextPage <= pages){
                console.log("hola")
                let index1 = 50 * nextPage
                const videos = documents.slice((index1 - 50),(index1))
                console.log(videos)
                res.json({videos: videos,
                pages: pages,
                totalResults: totalResults})
        }else{
            res.json("la pagina no existe")
        }
    } catch(error){
        return res.status("error: ").json(error.message)
    }

};

const create = async function(req, res, next) {
    try {
      const video = new VideosModel({
        id: req.body.id,
        etag: req.body.etag,
        snippet: req.body.snippet,
        playlists: req.body.playlists
      })
      const document = await video.save()
      res.json(document)
    } catch (error) {
      return res.json(error.message)
    }
  };


module.exports = {
    selectPage,
    create,
    getAllVideos
}