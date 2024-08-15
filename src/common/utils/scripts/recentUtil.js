const recents = require("../../../models/recentSongs");

exports.addRecents = async (  userId , guildId , track ) => {
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

    const newData = new recents({
        userID : userId,
        guildID : guildId,
        track : trackData
    })

    newData.save()
}
