const votes = require("../../../models/voters");
const axios = require('axios');

exports.checkVoted = async ( userId ) => {
    let data = await votes.findOne({
        discord_id : userId
    });
    const voted = data ? true : false;
    return voted;
};


exports.apiCheck = async ( userId ) => {
    axios.get(`https://discordbotlist.com/api/v1/bots/886801342239211522/upvotes`, {
        headers: {
          Authorization: process.env.DBL_API
        }
      })
        .then((response) => {
            const data = response.data.upvotes;
            const hasVoted = data.some(item => item.user_id === userId);
            console.log(data.some(item => item.user_id === userId))
            return hasVoted;
        })
        .catch(error => {
          // Handle any errors
          console.error('Error:', error);
        });
}