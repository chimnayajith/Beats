const db = require("../../models/guildSettings");
const Patron = require("../../models/patrons");
const { EmbedBuilder } = require("discord.js");
exports.isDjCommand = async (guildID, commandName) => {
  const data = await db.findOne({ guildID: guildID });
  if (
    data &&
    data.dj.isEnabled &&
    data.dj.djCommands.map((data) => data.title).includes(commandName)
  ) {
    return { isEnabled: true, roleID: data.dj.djRoleId };
  } else return { isEnabled: false };
};

exports.djExistingUpdate = async (guildID, roleID) => {
  await db.findOneAndUpdate(
    {
      guildID: guildID,
    },
    {
      $set: {
        dj: {
          isEnabled: true,
          djRoleId: [roleID],
          djCommands: [
            { title: "volume" },
            { title: "skip" },
            { title: "seek" },
            { title: "removedupes" },
            { title: "disconnect" },
            { title: "remove" },
            { title: "clear-queue" },
            { title: "shuffle" },
            { title: "pause" },
            { title: "resume" },
            { title: "previous" },
            { title: "jump" },
            { title: "autoplay" },
            { title: "loop" },
          ],
        },
      },
    }
  );
};

exports.logExistingUpdate = async (guildID, channelID) => {
  await db.findOneAndUpdate(
    {
      guildID: guildID,
    },
    {
      $set: {
        logs: {
          isEnabled: true,
          logChannelId: channelID,
          restrictLogs: true,
          playLogs: true,
          controlLogs: true,
          playlistUpdateLogs: true,
          djSettingsUpdateLogs: true
        },
      },
    }
  );
};


// Creating new document to setup Logging
exports.logsNewSetup = async (guildID, channelID) => {
  const data = new db({
    guildID: guildID,
    logs: {
      isEnabled: true,
      logChannelId: channelID,
      restrictLogs: true,
      playLogs: true,
      controlLogs: true,
      playlistUpdateLogs: true,
      djSettingsUpdateLogs: true
    },
    dj: {
      isEnabled: null,
    },
  });

  data.save();
};


//Creating new document to setup DJ
exports.djNewSetup = async (guildID, roleID) => {
  const data = new db({
    guildID: guildID,
    logs: {
      isEnabled: null,
    },
    dj: {
      isEnabled: true,
      djRoleId: [roleID],
      djCommands: [
        { title: "volume" },
        { title: "skip" },
        { title: "seek" },
        { title: "removedupes" },
        { title: "disconnect" },
        { title: "remove" },
        { title: "clear-queue" },
        { title: "shuffle" },
        { title: "pause" },
        { title: "resume" },
        { title: "previous" },
        { title: "jump" },
        { title: "autoplay" },
        { title: "loop" },
      ],
    },
  });

  data.save();
};


//Updating Log settings for already existing guild settings
exports.logUpdate = async (guildID, channelID) => {
  const data = await db.findOne({ guildID: guildID });
  if (data) {
    await exports.logExistingUpdate(guildID, channelID);
  } else {
    await exports.logsNewSetup(guildID, channelID);
  }
};

//Updating DJ settings for already existing guild settings
exports.djUpdate = async (guildID, roleID) => {
  const data = await db.findOne({ guildID: guildID });
  if (data) {
    await exports.djExistingUpdate(guildID, roleID);
  } else {
    await exports.djNewSetup(guildID, roleID);
  }
};


//Add DJ Role
exports.djAddRole = async (guildID, roleID) => {
  const data = await db.findOneAndUpdate({ guildID: guildID },{
    $set : {
      "dj.isEnabled" : true
    },
    $addToSet : {
      "dj.djRoleId" : roleID
    }
  });
};


//Remove DJ role
exports.djRemoveRole = async (guildID, roleID) => {
  const data = await db.findOneAndUpdate({ guildID: guildID },{
    $pull : {
      "dj.djRoleId" : roleID
    }
  });
};

//Function to check existing log settings
exports.checkExistingLogs = async (guildID) => {
  const data = await db.findOne({ guildID: guildID });
  
  const currentLogData = data?.logs || null;

  const isEnabled = currentLogData ? data.logs.isEnabled : null;

  return { doesExist: !!currentLogData, isEnabled : isEnabled , currentLogData : currentLogData};
};

//Function to check existing DJ settings
exports.checkExistingDJ = async (guildID, roleID) => {
  const data = await db.findOne({ guildID: guildID });

  const currentDjData = data?.dj || null;

  const isEnabled = currentDjData ? data.dj.isEnabled : null;

  if (!currentDjData) {
    return { doesExist: false, isEnabled: null, currentDjData: null };
  }
  const isRoleInArray = currentDjData.djRoleId.includes(roleID);

  return { doesExist: true, isEnabled: isEnabled, currentDjData: currentDjData, isRoleInArray: isRoleInArray };

}

exports.logEmbedTemplate = (action, data) => {
  const logEmbed = new EmbedBuilder()
    .setColor("#313338")
    .setTimestamp()
    .setURL(`https://dashboard.beatsbot.in/servers/${data.guildID}/settings`)
    .setThumbnail("https://cdn.beatsbot.in/Beats.png")
    .setFooter({text : data.guildName , iconURL : data.guildIcon})
  
  switch (action) {
    case "restrictUser":
      logEmbed
      .setTitle(`Beats⠀|⠀Restrict User`)
      .addFields(
        { name: "Restricted User⠀⠀⠀⠀", value: `<@${data.restrictedUserId}>` , inline : true},
        { name: "Duration⠀⠀⠀⠀", value: `\`${data.duration}\`` , inline : true},
        { name: "Moderator⠀⠀⠀⠀", value: `<@${data.moderator}>` , inline : true},
        { name: "Reason⠀⠀⠀⠀", value: `\`${data.reason}\`` , inline : true}
      );
      break;
    case "unrestrictUser":
      logEmbed
      .setTitle(`Beats⠀|⠀Un-restrict User`)
      .addFields(
        { name: "Un-restricted User⠀⠀⠀⠀", value: `<@${data.restrictedUserId}>` , inline : true},
        { name: "Moderator⠀⠀⠀⠀", value: `<@${data.moderator}>` , inline : true},
      );
      break;


    case "playLogs":
      logEmbed
      .setTitle(`Beats⠀|⠀Song Played`)
      .addFields(
        { name: "By User⠀⠀⠀⠀⠀⠀", value: `<@${data.userID}>` , inline : true},
        { name: "Track⠀⠀⠀⠀⠀⠀⠀⠀", value: `[${data.trackName}](${data.trackUrl})` , inline : true},
        { name: "Voice Channel⠀⠀⠀⠀", value: `<#${data.voiceChannel}>` , inline : true}
      );
      break;


    case "playlistSetup":
      logEmbed
      .setTitle(`Beats⠀|⠀Server Playlist Setup`)
      .addFields(
        { name: "Playlist Name⠀⠀⠀⠀", value: data.playlistName , inline : true},
        { name: "Manager Role⠀⠀⠀⠀⠀", value: `<@&${data.managerRole}>` , inline : true}
      );
      break;
    case "playlistAdd":
      logEmbed
      .setTitle(`Beats⠀|⠀Track Add to Server Playlist`)
      .addFields(
        { name: "User⠀⠀⠀⠀⠀", value: `<@${data.userID}>` , inline : true},
        { name: "Playlist Name⠀⠀⠀⠀", value: data.playlistName , inline : true},
        { name: "Track⠀⠀⠀⠀⠀", value: `[${data.trackName}](${data.trackUrl})` , inline : true}
      );
      break;
      
    case "addRole":
      logEmbed
      .setTitle(`Beats⠀|⠀DJ Role Added`)
      .addFields(
        { name: "Added DJ Role⠀⠀⠀⠀", value: `<@&${data.djRole}>` , inline : true},
        { name: "Added By⠀⠀⠀⠀", value: `<@${data.userID}>` , inline : true},
      );
      break;
    case "removeRole":
      logEmbed
      .setTitle(`Beats⠀|⠀DJ Role Removed`)
      .addFields(
        { name: "Removed DJ Role⠀⠀⠀⠀", value: `<@&${data.djRole}>` , inline : true},
        { name: "Removed By⠀⠀⠀⠀", value: `<@${data.userID}>` , inline : true},
      );
      break

    case "controlLogs":
      logEmbed
      .setTitle(`Beats⠀|⠀Control Logs`)
      .addFields(
        { name: "Command Used⠀⠀⠀⠀", value: `\`${data.command}\`` , inline : true},
        { name: "Used By⠀⠀⠀⠀⠀", value: `<@${data.userID}>` , inline : true},
        { name: "Text Channel", value: `<#${data.textChannel}>` , inline : true}
      );
      break;
    // Add more cases for other log actions if needed
  }

  return logEmbed;
};

exports.logIfRequired = async ( guildID , action , logData) => {
  const data = await db.findOne({guildID : guildID}, "logs -_id")
  const patron = await Patron.findOne({ _id: "patrons" });
  const guild_plus = patron.server_plus;
  if ( data.logs.isEnabled && data.logs[action.split(" ").shift()] && guild_plus.includes(guildID) ){
    const logChannel = await client.channels.fetch(data.logs.logChannelId);
    logChannel.send({embeds:[exports.logEmbedTemplate(action.split(" ").pop() , logData)]})
  }
}