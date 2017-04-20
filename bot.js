var Botkit = require('botkit');

if (!process.env.token) {
  //console.log('Error: Specify token in environment');
  //process.exit(1);
}

var controller = Botkit.slackbot({
 debug: false
});

// Add the dashbot middleware
var dashbot = require('dashbot')(process.env.DASHBOT_API_KEY, {debug: false}).slack;
controller.middleware.receive.use(dashbot.receive);
controller.middleware.send.use(dashbot.send);

// Add botanalytics middleware
//var botanalytics = require('botanalytics')(process.env.BOTANALYTICS_TOKEN).slack;
//controller.middleware.receive.use(botanalytics.receive);
//controller.middleware.send.use(botanalytics.send);

var theBot = controller.spawn({
  token: process.env.SLACK_TOKEN
})

console.log('theBot', JSON.stringify(theBot, null, 2));

theBot.startRTM(function(err, bot, res) {
  if (err) {
    throw new Error(err);
  } else {
    //botanalytics.connect(res);
    console.log('the new bot', bot);
  }
});

controller.hears(['hello','hi'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"Hello there.");
});

controller.hears(['attach'],['direct_message','direct_mention'],function(bot,message) {

  var attachments = [];
  var attachment = {
    title: 'This is an attachment',
    color: '#FFCC99',
    fields: [],
  };

  attachment.fields.push({
    label: 'Field',
    value: 'A longish value',
    short: false,
  });

  attachment.fields.push({
    label: 'Field',
    value: 'Value',
    short: true,
  });

  attachment.fields.push({
    label: 'Field',
    value: 'Value',
    short: true,
  });

  attachments.push(attachment);

  bot.reply(message,{
    text: 'See below...',
    attachments: attachments,
  },function(err,resp) {
    console.log(err,resp);
  });
});

controller.hears(['dm me'],['direct_message','direct_mention'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.say('Heard ya');
  });

  bot.startPrivateConversation(message,function(err,dm) {
    dm.say('Private reply!');
  });

});

var myTeam = 'Txxxxx';

controller.storage.teams.get(myTeam, (err, team) => {
  console.log('storage teams get');
 if (err || !team) {
   controller.log.error('Error: could not load my team from storage system', err);
 } else {
   var botToken = team.bot.token;
   var channel = team.bot.createdBy;

   if (process.env.NODE_ENV === 'staging') {
     channel = 'Cxxxxx';
   }
   console.log('startupBot');
   var startupBot = controller.spawn({
     token: botToken,
   });
   //startupBot.say({ text: `started`, channel });
 }
});
