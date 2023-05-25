const votes = require("../models/voters");

exports.checkVoted = async ( userId ) => {
    let data = await votes.findOne({
        discord_id : userId
    });

    return data === null ? false : true
}