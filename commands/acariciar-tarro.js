const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  run: async({ interaction }) => {
    // El ID del rol que quieres asignar
    const roleId = '1270938821160337428';

    // Obtén el miembro que ejecutó el comando
    const member = interaction.member;

    const PatJarEmbed = new EmbedBuilder()
        .setColor('#b0875f')
        .setAuthor({
            name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
        })
        .setDescription('Has acariciado a un pequeño tarro viviente.')
        .setImage('https://cdn.discordapp.com/attachments/1267565705654435840/1270931168329465886/bairn.png?ex=66b57e63&is=66b42ce3&hm=0fb7ea888c086d9999306359eb01e8133539b43ca93cf6c65ca7f7b55c6d57a7&')

    // Verifica si el miembro ya tiene el rol
    if (member.roles.cache.has(roleId)) {
      await interaction.reply({ embeds: [PatJarEmbed] });
    } else {
      try {
        // Asigna el rol al miembro
        await member.roles.add(roleId);
        // Envía el mensaje embed
        await interaction.reply({ embeds: [PatJarEmbed] });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Ocurrió un error al asignar el rol.', ephemeral: true });
      }
    }
  },
  data: {
    name: 'acariciar-tarro',
    description: 'Acaricia a un tarro viviente.'
  }
};
