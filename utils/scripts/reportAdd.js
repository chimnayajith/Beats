const report = require("../../models/reports");
const beats = require("../other/beatsCustomEvent")
exports.addReport = async ( user, message ) => {
    let newdata = await report.create({
        userID: user.id,
        username: user.tag,
        message : message,
      });
      newdata.save();

      const id = newdata._id;
      beats.emit('reportAdded' , user, message , id) 

}