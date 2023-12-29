const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postImage:String,
    title:String,
    users:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    description:String,

})

module.exports = mongoose.model("post" ,postSchema)