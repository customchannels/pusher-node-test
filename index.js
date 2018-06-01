const Pusher = require('pusher-js');

const APP_KEY = '';
const TOKEN = ''
const CHANNEL_NAME = '';

const Socket = new Pusher(APP_KEY, {
  cluster: 'mt1',
  authEndpoint: 'https://service.streamit.eu/livecom',
  authTransport: 'ajax', // ajax
  encrypted: false,
  auth: {
    params: {
      deviceToken: TOKEN
    }
  }
});

Socket.connection.bind('error', (err) => {
  console.log('ERROR', err); 
});

Socket.connection.bind('connected', (response) => {

  console.log('CONNECTED TO PUSHER', response);
  
  var channel = Socket.subscribe(CHANNEL_NAME);

  channel.bind('pusher:subscription_error', (status) => {
    console.log('SUBSCRIPTION ERROR', status);
  });

  channel.bind('pusher:subscription_succeeded', (members) => {
    console.log('CONNECTED TO DEVICE');

    // send a status command
    channel.trigger('client-new-command', {
      'command': 'status', 
      "correlationId": 123
    });

    channel.bind('client-new-response', (response) => {
      console.log('DEVICE RESPONSE', response);
    });

  });
});

