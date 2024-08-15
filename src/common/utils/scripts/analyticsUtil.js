const analytics = require("../../../models/analytics");

exports.addData =  (serverCount , userCount ) => {
    const data = new analytics({
        serverCount: serverCount,
        userCount:userCount
    })

    data.save()
}