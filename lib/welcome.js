const fs = require('fs');
const canvafy = require("canvafy")
const { getRandom, smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, delay, sleep } = require('./myfunc');
const { isSetWelcome, getTextSetWelcome } = require('./setwelcome');
const { isSetLeft, getTextSetLeft } = require('./setleft');
const moment = require('moment-timezone');
const { proto, jidDecode, jidNormalizedUser, generateForwardMessageContent, generateWAMessageFromContent, downloadContentFromMessage } = require('@whiskeysockets/baileys');
let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let setting = JSON.parse(fs.readFileSync('./config.json'));
const welcome2 = setting.auto_welcomeMsg;
const leave2 = setting.auto_leaveMsg;
module.exports.welcome = async (iswel, isleft, NanoBotz, anu) => {
  try {
      const metadata = await NanoBotz.groupMetadata(anu.id);
      const participants = anu.participants;
      const groupName = metadata.subject;
      const groupDesc = metadata.desc || "No description available";
      const memberCount = metadata.participants.length;

      for (let num of participants) {
          let pp_user, ppgroup;
          try {
              pp_user = await NanoBotz.profilePictureUrl(num, 'image');
          } catch {
              pp_user = 'https://tse4.mm.bing.net/th?id=OIP.JjURR9U0gcrqneGYVyG27wHaEn&pid=Api&P=0&h=180';
          }
          try {
              ppgroup = await NanoBotz.profilePictureUrl(anu.id, 'image');
          } catch {
              ppgroup = 'https://tse4.mm.bing.net/th?id=OIP.JjURR9U0gcrqneGYVyG27wHaEn&pid=Api&P=0&h=180';
          }

          const participantName = num.split('@')[0];

          if (anu.action === 'add' && (iswel || setting.auto_welcomeMsg)) {
              const welcomeText = `HALO @${participantName} selamat datang di grup ${groupName} semoga betah dan jangan lupa patuhi DESKRIPSI\n\nDESKRIPSI:\n${groupDesc}\n\nHELLO @${participantName} welcome to the group ${groupName} hope you feel at home and don't forget to follow the DESCRIPTION`;
              
              const welcomeImageUrl = `https://api.popcat.xyz/welcomecard?background=https://cdn.popcat.xyz/welcome-bg.png&text1=${encodeURIComponent(participantName)}&text2=Welcome+To+${encodeURIComponent(groupName)}&text3=Member+${encodeURIComponent(memberCount)}&avatar=${encodeURIComponent(pp_user)}`;
              
              await NanoBotz.sendMessage(anu.id, {
                  image: { url: welcomeImageUrl },
                  caption: welcomeText,
                  mentions: [num]
              });
          }
          else if (anu.action === 'remove' && (isleft || setting.auto_leaveMsg)) {
              const goodbyeText = `Selamat tinggal @${participantName}, semoga ilmu dari grup ${groupName} bermanfaat!`;
              
              const goodbyeImageUrl = `https://api.popcat.xyz/goodbyecard?background=https://cdn.popcat.xyz/goodbye-bg.png&text1=${encodeURIComponent(participantName)}&text2=Goodbye+From+${encodeURIComponent(groupName)}&text3=We+Will+Miss+You&avatar=${encodeURIComponent(pp_user)}`;
              
              await NanoBotz.sendMessage(anu.id, {
                  image: { url: goodbyeImageUrl },
                  caption: goodbyeText,
                  mentions: [num]
              });
          }
          else if (anu.action === 'promote') {
              await NanoBotz.sendMessage(anu.id, {
                  text: `Selamat @${participantName}, kamu telah dipromosikan di ${groupName}!`,
                  mentions: [num]
              });
          }
          else if (anu.action === 'demote') {
              await NanoBotz.sendMessage(anu.id, {
                  text: `@${participantName}, kamu telah didemote di ${groupName}.`,
                  mentions: [num]
              });
          }
      }
  } catch (err) {
      console.error('Error in welcome/goodbye feature:', err);
  }
};
