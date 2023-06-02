const notifSchema = require("../models/notifSchema");


exports.getNotifs = async () => {
    let data = await notifSchema.findById({_id : "notifs"});
    return data.notification;
}


exports.showNotif = async ( guildId ) => {
    let data = await notifSchema.findById({ _id : "notifs"})

    if ( data.notification.length != 0 && data.read.includes(guildId)){
        return true;
    } else {
        return false;
    }
}

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