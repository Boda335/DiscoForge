
/**
 * @type {import("../../Base/baseComponent")}
 */
module.exports = {
  name: "btn_info", 
  enabled: true,
  botPermissions: [],
  userPermissions: [],

  action: async (client, interaction, parts) => {
    await interaction.deferUpdate();
    let member = interaction.member;
   
    try {
      // Code
    } catch (error) {
      console.error(`Error in autoplay BTN: ${this.name}`, error);
      await interaction.followUp({
        content:
          "😓 i am sorry, it seems like i am having some issues right now, please try again later.",
        ephemeral: true,
      });
    }
  },
};
