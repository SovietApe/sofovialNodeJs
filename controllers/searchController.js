const { Router } = require("express");
const VideosModel = require("../models/videosModel");
const Fuse = require('fuse.js')


const search = async (query,data,limit=5)=>{
    const fuse = new Fuse(data, {
      keys: ['snippet.description','snippet.title'],
      threshold: 0.4
  
    })
    const result = fuse.search(query, {limit: limit})
    return result
  }


const searchByQuery = async function(req, res, next) {
    const query = req.query.query
    const limit = parseInt(req.query.limit)
    const ip = req.query.userip
    if(query && limit){
      console.log(query)
      console.log(limit)
      console.log(ip)
      let match = query.match(/^[a-zA-Z ]*/)
      let match2 = query.match(/\s*/)
      if(match2[0] === query){
          res.json([])
          return;
      }
          try {
              console.log("bien")
              const data = await VideosModel.find()
              const response = await search(query,data,limit)
              console.log(response)
              res.json(response)
          } catch (error) {
              console.log(error)
              res.json(error)
          }
      return;
    }else{
      console.log("no llego nada")
      res.json([])
    }
  };

  module.exports = {
    searchByQuery,
  };