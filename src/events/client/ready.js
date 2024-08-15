const postStats = require("../../common/startup/postStats");

module.exports = async (client) => {
    console.log(`Logged to the client ${client.user.username}`);
    
   // process.env.NODE_ENV ==="production" ? 
    await postStats()
};