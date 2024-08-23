const db = require("../../../models/restrictSchema");

exports.checkRestricted = async (guildID, userID) => {
  const data = await db.findOne({ guildID: guildID, userID: userID });
  return data ? true : false;
};

exports.getRestricted = async (guildID, userID) => {
  const data = await db.findOne({ guildID: guildID, userID: userID });
  return data;
};

exports.addRestriction = async (
  guildID,
  userID,
  moderator,
  duration,
  reason,
) => {
  const newData = new db({
    guildID: guildID,
    userID: userID,
    moderator: moderator,
    reason: reason,
    expireAt: new Date(Date.now() + duration),
  });
  newData.save();
};

exports.removeRestriction = async (guildID, userID) => {
  await db.findOneAndDelete({ guildID: guildID, userID: userID });
};
