const notifSchema = require("../../../models/notifSchema");

//get avaiable notifications
exports.getNotifs = async () => {
    let data = await notifSchema.findById({_id : "notifs"});
    return data.notification;
}

//whether to show notification popup in play command!
exports.showNotif = async ( guildId ) => {
    let data = await notifSchema.findById({ _id : "notifs"})

    if ( data.notification.length != 0 && data.read.includes(guildId)){
        return true;
    } else {
        return false;
    }
}

//add guildid to read array
exports.addRead = async ( guildId ) => {
    let data = await notifSchema.updateOne(
        {
            _id : "notifs"
        },
        {
            $addToSet: {
                read : guildId
            }
        }
    )
}