const mongoose = require("mongoose")
const uri = "mongodb+srv://SovietApe:SGLc4LdlblBJOR1o@sofovialdb.wyle1hg.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri)
.then(()=>{console.log("connected")})
.catch((error=> console.log(error)))


module.exports = mongoose 
