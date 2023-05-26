module.exports = {
  var: {
    yt_cookie:
      "GPS=1; YSC=iqvCh6hel7o; VISITOR_INFO1_LIVE=PV_FMLIzJr4; PREF=f6=40000000&tz=Asia.Calcutta; CONSISTENCY=ACeCFAXrgHQnNLmsRkmJsEjvgSHIFUqD-Q4Nq3lkQeieYyN4wjhhUAYPxRuR51K7JOwqUaSA7gOqjLrsANQ7xUsUDdvFTmBysTiTHx_vSUBPGUbMXTX3_e18BfyDuDaIZYV9iSJi7i6_p0FUJ0SxLVE",
  },
  opt: {
    maxVol: 200,
    discordPlayer: {
      volume: 50,
      selfDeaf: true,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 10000,
      leaveOnEnd: true,
      leaveOnEndCooldown: 10000,
      ytdlOptions: {
      quality: "highest",
      filter: "audioonly",
      highWaterMark: 1 << 25,
      dlChunkSize: 0,
      requestOptions: {
        headers: {
          cookie:"GPS=1; YSC=iqvCh6hel7o; VISITOR_INFO1_LIVE=PV_FMLIzJr4; PREF=f6=40000000&tz=Asia.Calcutta; CONSISTENCY=ACeCFAXrgHQnNLmsRkmJsEjvgSHIFUqD-Q4Nq3lkQeieYyN4wjhhUAYPxRuR51K7JOwqUaSA7gOqjLrsANQ7xUsUDdvFTmBysTiTHx_vSUBPGUbMXTX3_e18BfyDuDaIZYV9iSJi7i6_p0FUJ0SxLVE" ,
        },
      },
    },
    },
  },
};
