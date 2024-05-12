const axios =  require('axios')
const  videosModel =  require('../models/videosModel')
const  playlistsModel = require('../models/playlistModel')

async function youtubeVideosRefresh(){
  // get videos
  async function getVideosAndUpload(){
    var token = ""
    var cuantosestaban = 0
    var videosubidos = 0
    var nextPageToken = true
    while(nextPageToken) {
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyC7DgRXTLLqmvXQvOJ7wpGSPdwF5SHiIKE&channelId=UC82zHIKX3OC02DiGBT68q3g&part=snippet,id&order=date&maxResults=50${token}`)
          const videoItem = response.data.items
          console.log(response.data.nextPageToken)
          async function upload(){
            for(var x = 0; x < videoItem.length; x++){
                const validation = await videosModel.findOne({id: videoItem[x].id.videoId})
                if(validation !== null){
                  cuantosestaban = (cuantosestaban + 1)
                }else{
                  try{
                    const video = new videosModel({
                      id: videoItem[x].id.videoId,
                      etag: videoItem[x].etag,
                      snippet: videoItem[x].snippet
                    })
                    const document = await video.save()
                    document
                    videosubidos = (videosubidos + 1)
                  }catch(error){
                    console.log(error.message)
                  }
                }
              }
          }
          await upload()
          if(typeof response.data.nextPageToken !== 'undefined'){
            token = `&pageToken=${response.data.nextPageToken}`
          }else if(typeof response.data.nextPageToken === 'undefined'){
            nextPageToken = false
          }
        }
        console.log("coincidencias: "+cuantosestaban+"   /    subidos: "+videosubidos)
  } 
  await getVideosAndUpload()
  // get playlists and items
  async function getVideosByPlaylists(){
    const getplaylists = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cid%2Clocalizations%2Cplayer%2Csnippet%2Cstatus&channelId=UC82zHIKX3OC02DiGBT68q3g&maxResults=50&key=AIzaSyC7DgRXTLLqmvXQvOJ7wpGSPdwF5SHiIKE`)
    const playlists = getplaylists.data.items
    for(var i = 0; i < playlists.length; i++){
        await getPlaylistItems(playlists[i])
    }
  }
  const getPlaylistItems = async (playlist)=>{
      const validatePlaylist = await playlistsModel.findOne({id:playlist.id})
      if(validatePlaylist === null){
      const newplaylist = new playlistsModel({
          id: playlist.id,
          snippet: playlist.snippet
      })
      const document = await newplaylist.save()
      document
      }
      var token = ""
      let i = 0
      for(var nextPageToken = true; nextPageToken === true;){
          i++
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyC7DgRXTLLqmvXQvOJ7wpGSPdwF5SHiIKE&playlistId=${playlist.id}&part=snippet,id&maxResults=50${token}`)
          console.log("llamada api")
          const playlistvideos = response.data.items
          for(let x = 0; x < playlistvideos.length; x++){
              const validation = await videosModel.findOne({id: playlistvideos[x].snippet.resourceId.videoId})
              if(validation !== null){
                  try {
                      const findplaylist = validation.playlists.find((item) => item.id === playlist.id)
                      if(typeof findplaylist === "undefined"){
                          const modofiedplaylists = validation.playlists.push({id: playlist.id})
                          modofiedplaylists
                          const document = await videosModel.updateOne({id: playlistvideos[x].snippet.resourceId.videoId}, {playlists: validation.playlists})
                          document
                      }
                  } catch (error) {
                      console.log(error)
                  }
              }else{
                  try{
                      let newplaylist = [{id: playlist.id}]
                      const newvideo = new videosModel({
                          id:playlistvideos[x].snippet.resourceId.videoId,
                          etag: playlistvideos[x].etag,
                          snippet: playlistvideos[x].snippet,
                          playlists: newplaylist
                      })
                      const document = await newvideo.save()
                      document
                  }catch(error){
                      console.log(error.message)
                      }
                  }
              if(typeof response.data.nextPageToken !== 'undefined'){
                  token = `&pageToken=${response.data.nextPageToken}`
              }else if(typeof response.data.nextPageToken === 'undefined'){
                  nextPageToken = false
              }
          }
        }
      console.log(playlist.snippet.localized.title + " se itero: "+ i)
  }
  await getVideosByPlaylists()

}

module.exports = youtubeVideosRefresh