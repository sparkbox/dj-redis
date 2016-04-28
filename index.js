'use strict';

const redis = require('redis');
const client = redis.createClient();
const Sonos = require('sonos').Sonos;
const sonos = new Sonos(process.env.SONOS_IP);
const commands = {
  play: () => sendCommand('play'),
  pause: () => sendCommand('pause'),
  next: () => sendCommand('next'),
  previous: () => sendCommand('previous'),
  back: () => sendCommand('previous'),
  volumeUp: () => volumeUp(),
  volumeUp: () => volumeDown(),
};

function sendCommand(cmd) {
  sonos[cmd](function(err, playing) {
    console.log([err, playing]);
  });
}

function volumeUp() {
  let currentVolume = sonos.getVolume();
  sonos.volume(currentVolume + 5, function(err, playing) {
    console.log([err, playing]);
  });
}

function volumeDown() {
  let currentVolume = sonos.getVolume();
  sonos.volume(currentVolume - 5, function(err, playing) {
    console.log([err, playing]);
  });
}

client.on('ready', function() {
  client.subscribe('sonosCommands');
});

client.on('message', function(channel, message) {
  console.log('channel ' + channel + ': ' + message);

  try {
    commands[message]();
  } catch (e) {
    console.log(e);
  }
});
