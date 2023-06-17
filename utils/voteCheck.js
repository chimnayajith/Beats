const votes = require("../models/voters");
const axios = require('axios');

exports.checkVoted = async ( userId ) => {
    let data = await votes.findOne({
        discord_id : userId
    });

    return data === null ? false : true;
};


exports.apiCheck = async ( userId ) => {
    axios.get(`https://discordbotlist.com/api/v1/bots/886801342239211522/upvotes`, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6Ijg4NjgwMTM0MjIzOTIxMTUyMiIsImlhdCI6MTY4Njc0ODE0OH0.HMQfxiIqF-FNzZP9M4tCzdcr58xSwU7HwocOwz_95Q0`
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