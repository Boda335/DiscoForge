module.exports = {
  errorLogging: {
    enabled: false,
    errorLogs: 'WEBHOOK_URL',
  },
  presence: {
    enabled: true, // If you want to enable or disable the bot's presence
    status: 'idle', // You can choose between: online, idle, dnd and invisible
    interval: 10000, // The interval time in milliseconds for changing the activity
    type: 'Custom', // You can choose between: Playing, Watching, Listening, Competing, Custom and Streaming
    names: [
      'https://discord.gg/Wn6z6yD7n3',
      `Made by Foxy Code Team`,
      `Made by Boda3350`,
      `Powered by DiscoForge`,
      'discord.gg/AT6W2nHEVz',
    ], // The activities the bot will change between (You can put multiple activities in an array)
    // This is only for the STREAMING activity type
    streamingUrl: 'https://www.twitch.tv/example',
  },
};
