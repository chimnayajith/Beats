const liked = require("../../../models/likedSongs");

exports.addSongs = async ( userId, track ) => {
    let data = await liked.findOne({ userID : userId})
    const trackData = {
        source : track.raw.source,
        title : track.title,
        description : track.raw.description,
        author : track.author,
        url : track.raw.url || track.url,
        thumbnail : track.thumbnail,
        duration : track.duration,
        views : track.views,
        requestedBy:track.requestedBy.id,
        queryType: track.queryType
    }
    if (data === null){
        let new_data = await liked.create({
            userID : userId ,
            liked : [trackData],
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
                $push: { liked: { $each: [trackData], $position: 0 } },
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