const report = require("../models/reports");

exports.addReport = async ( user, message ) => {
    let newdata = await report.create({
        userID: user.id,
        username: user.tag,
        message : message,
      });
      newdata.save();

      const id = newdata._id;
      client.emit('reportAdded' , user, message , id)

}