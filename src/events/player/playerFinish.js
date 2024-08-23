//Track End
module.exports = async (queue) => {
  queue.metadata.playMessage?.delete().catch(console.error);
};
