var express = require('express');
var router = express.Router();
const videosController = require("../controllers/videosController")

/* GET productos listing. */ 
router.get("/:id", videosController.selectPage);

router.post("/", videosController.create);

router.get("/", videosController.getAllVideos);


module.exports = router