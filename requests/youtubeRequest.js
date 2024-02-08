const axios =  require('axios')
const  videosModel =  require('../models/videosModel')
const  playslistsModel = require('../models/playlistModel')

async function youtubeVideosRefresh(){
    async function getVideos(){
        var nextPageToken = true
        var token = ""
        while (nextPageToken) {
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDmbBznvlOCe8cI1pCfuZ__llk3hT1UB98&channelId=UC82zHIKX3OC02DiGBT68q3g&part=snippet,id&order=date&maxResults=50${token}`)
          let video = response.data.items
          console.log(response.data.nextPageToken)
          video.map( async (item)=>{
            const validation = await videosModel.findOne({id: item.id.videoId})
            if(validation !== null){
              console.log("ya taba wachita")
            }else{
              try{
                const video = new videosModel({
                  id: item.id.videoId,
                  etag: item.etag,
                  snippet: item.snippet
                })
                const document = await video.save()
                res.json(document)
              }catch(error){
                console.log(error.message)
              }
            }
          })
          if(typeof response.data.nextPageToken !== 'undefined'){
            token = `&pageToken=${response.data.nextPageToken}`
          }else if(typeof response.data.nextPageToken === 'undefined'){
            nextPageToken = false
          }
        }
      }
      await getVideos()

    async function getVideosByPlaylists(){
        const getplaylists = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cid%2Clocalizations%2Cplayer%2Csnippet%2Cstatus&channelId=UC82zHIKX3OC02DiGBT68q3g&maxResults=50&key=AIzaSyDmbBznvlOCe8cI1pCfuZ__llk3hT1UB98`)
        const playlists = getplaylists.data.items
        playlists.map((playlist)=>{
            getPlaylistItems(playlist)
        })
    }

    const getPlaylistItems = async (playlist)=>{
        const validatePlaylist = await playslistsModel.findOne({id:playlist.id})
        if(validatePlaylist === null){
        const newplaylist = new playslistsModel({
            id: playlist.id,
            snippet: playlist.snippet
        })
        const document = await newplaylist.save()
        document
        }
        var nextPageToken = true
        var token = ""
        let i = 0
        while(nextPageToken){
            i++
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDmbBznvlOCe8cI1pCfuZ__llk3hT1UB98&playlistId=${playlist.id}&part=snippet,id&maxResults=50${token}`)
            const playlistvideos = response.data.items
            playlistvideos.map(async (video)=>{
                const validation = await videosModel.findOne({id: video.snippet.resourceId.videoId})
                if(validation !== null){
                    try {
                        const findplaylist = validation.playlists.find((item) => item.id === playlist.id)
                        if(typeof findplaylist === "undefined"){
                            const modofiedplaylists = validation.playlists.push({id: playlist.id})
                            console.log(modofiedplaylists)
                            const document = await videosModel.updateOne({id: video.snippet.resourceId.videoId}, {playlists: validation.playlists})
                            console.log(document)
                            document
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }else{
                    try{
                        let newplaylist = [{id: playlist.id}]
                        const newvideo = new videosModel({
                            id:video.snippet.resourceId.videoId,
                            etag: video.etag,
                            snippet: video.snippet,
                            playlists: newplaylist
                        })
                        const document = await newvideo.save()
                        console.log(document)
                    }catch(error){
                        console.log(error.message)
                        }
                    }
                if(typeof response.data.nextPageToken !== 'undefined'){
                    token = `&pageToken=${response.data.nextPageToken}`
                }else if(typeof response.data.nextPageToken === 'undefined'){
                    nextPageToken = false
                }
            })
        }
        console.log(playlist.snippet.localized.title + " se itero: "+ i)
    }   

    await getVideosByPlaylists()

}

module.exports = youtubeVideosRefresh