module.exports = async (reason, p) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch");
  console.log(reason, p);
};
