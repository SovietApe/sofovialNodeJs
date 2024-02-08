var express = require("express");
const playlistsController = require("../controllers/playlistsController");

var router = express.Router()
router.get("/", playlistsController.getAll);

// pedido de objeto por su ID
router.get("/:id", playlistsController.selectPage)

module.exports = router; 
