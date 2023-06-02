const liked = require("../models/likedSongs");

exports.addSongs = async ( userId, track ) => {
    let data = await liked.findOne({ userID : userId})

    if (data === null){
        let new_data = await liked.create({
            userID : userId ,
            liked : [track.raw],
            trackCount : 1
        })
        new_data.save();
        return 1;
    } else {
        const isLiked = data.liked.some((item) => item.url === track.raw.url)
        if(isLiked){
            return 0;
        } else {
        await liked.updateOne(
            { userID : userId },
            { 
                $push :  {liked : track.raw},
                $inc : { trackCount : +1}
            }
            )
        return 1;
        }
    }

}


exports.getLiked = async ( userId ) => {
    let data = await liked.findOne({ userID : userId })

    if (data === null ) {
        return data;
    } else {
      return data.liked;
    } 
}