const notifSchema = require("../models/notifSchema");
const testnotifs = require("../models/testnotif")

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





//test notifs!!!!
exports.getTest = async (guildId) => {
    let data = await testnotifs.find();
    let arrToSend = []
    data.forEach((each)=> {
        if (each.read_bot.includes(guildId)){
            arrToSend.unshift(data)
        } else {
            arrToSend.push(data)
        }
    })  
    

    return arrToSend;
}

exports.addtestRead = async (id ,  guildId ) => {
    let data = await testnotifs.updateOne(
        {
            _id : id
        },
        {
            $addToSet: {
                read_bot : guildId
            }
        }
    )
} 