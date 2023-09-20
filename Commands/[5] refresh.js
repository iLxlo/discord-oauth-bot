const { SlashCommandBuilder } = require("@discordjs/builders");
const userSchema = require('../Schema/userSchema');
const auth = require('../Core/AuthClient');
const client = require('../Utils/client');
const { MessageEmbed } = require('discord.js');

const venusClient = new auth(client);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refresh")
    .setDescription("Refresh the access token for all users."),

  async execute(interaction) {
    const refreshInterval = 5; // Refresh interval in seconds

    // Send initial message stating the start of the refresh
    const initialMessage = await interaction.reply("Starting token refresh...");

    let users = await userSchema.find({}).lean().select("refreshToken expiresDate");
    let count = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        let refreshed = await venusClient.refreshToken(user.refreshToken);
        if (refreshed) {
          count++;
        }
      } catch (error) {
        // Handle the error here
        console.error(`Error refreshing token for user: ${user._id}`, error);
        errorCount++;
      }

      const progressMessage = `Refreshing access tokens: ${count} out of ${users.length} users.`;
      await initialMessage.edit(progressMessage);
      await new Promise(resolve => setTimeout(resolve, refreshInterval * 1000)); // Wait for the specified interval
    }

    const message = (count > 0) ?
      `Refreshed access tokens for ${count} out of ${users.length} users.` :
      `No access tokens needed to be refreshed.`;

    



    // Edit the initial message with the final result
    await initialMessage.edit(message + `${errorCount} users encountered errors during token refresh.`);
  }
};
//yo help a bit here pls
