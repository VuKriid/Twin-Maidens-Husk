const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Inventory = require('../../schemas/Inventory');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
  run: async({ interaction }) => {

    const userId = interaction.user.id;

    const userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            return "a";
        }
        const boss25Defeated = userProfile.defeatedBosses.includes(25);
        if (!boss25Defeated) {
            return interaction.reply({ content: 'Aun no has derrotado a la Bestia de Elden y no puedes ascender a Señor.', ephemeral: true });
        }

    const AgeChoosen = interaction.options.getString('era');

    let AgeReply = 'Tras reparar el Círculo de Elden con las esquirlas de los Semidioses recuperadas, lograste ascender a Señor del Círculo, trayendo consigo una Era de Fragilidad.';
    let roleId = '1269106036761952257';
    let item = [
      'Gran Runa de Godrick',
      'Gran Runa de los Nonatos',
      'Gran Runa de Morgott',
      'Gran Runa de Radahn',
      'Gran Runa de Mohg',
      'Gran Runa de Malenia',
      'Gran Runa de Rykard'
    ];

    if (AgeChoosen === 'Era del Orden Perfecto') {
      roleId = '1269107513337315338';
      item = [
        'Gran Runa de Godrick',
        'Gran Runa de los Nonatos',
        'Gran Runa de Morgott',
        'Gran Runa de Radahn',
        'Gran Runa de Mohg',
        'Gran Runa de Malenia',
        'Gran Runa de Rykard',
        'Runa Reparadora del Orden Perfecto'
      ];
      AgeReply = 'Tras reparar el Círculo de Elden con las esquirlas de los Semidioses recuperadas y la Runa Reparadora del Orden Perfecto, lograste ascender a Señor del Círculo, trayendo consigo una Era de Orden.';
    } else if (AgeChoosen === 'Era de los Nacidos en la Oscuridad') {
      roleId = '1269107094422814742';
      item = [
        'Gran Runa de Godrick',
        'Gran Runa de los Nonatos',
        'Gran Runa de Morgott',
        'Gran Runa de Radahn',
        'Gran Runa de Mohg',
        'Gran Runa de Malenia',
        'Gran Runa de Rykard',
        'Runa Reparadora del Príncipe de la Muerte'
      ];
      AgeReply = 'Tras reparar el Círculo de Elden con las esquirlas de los Semidioses recuperadas y la Runa Reparadora del Príncipe de la Muerte, lograste ascender a Señor del Círculo, trayendo consigo una Era del Crepusculo.';
    } else if (AgeChoosen === 'Era de la Desesperación') {
      roleId = '1269107367774257164';
      item = [
        'Gran Runa de Godrick',
        'Gran Runa de los Nonatos',
        'Gran Runa de Morgott',
        'Gran Runa de Radahn',
        'Gran Runa de Mohg',
        'Gran Runa de Malenia',
        'Gran Runa de Rykard',
        'Runa Reparadora de la Maldición de los Caídos'
      ];
      AgeReply = 'Tras reparar el Círculo de Elden con las esquirlas de los Semidioses recuperadas y la Runa Reparadora de la Maldición de los Caídos, lograste ascender a Señor del Círculo, trayendo consigo una Era de Desesperación.';
    } else if (AgeChoosen === 'Era del Caos') {
      roleId = '1269106319885864971';
      item = [
        'Marca de la Llama Frenética'
      ];
      AgeReply = 'Tras abrazar el poder de la Llama Frenética y quemar el Árbol Áureo, ascendiste como Señor de la Llama Frenética, trayendo contigo una Era de Caos.';
    } else if (AgeChoosen === 'Era Estelar') {
      roleId = '1269106747528712242';
      item = [
        'Promesa de Ranni'
      ];
      AgeReply = 'Tras invocar a Ranni frente al Círculo de Elden, esta emprendió un viaje de mil años, volviéndote Señor y trayendo consigo una Era Estelar.';
    }

    
    let userInventory;
    try {
      userInventory = await Inventory.findOne({ userId }).exec();
      if (!userInventory) {
        userInventory = new Inventory({ userId, items: [] });
      }
    } catch (error) {
      console.error('Error al buscar el inventario del usuario:', error);
      return interaction.reply({ content: 'Hubo un error al buscar tu inventario. Por favor, intenta de nuevo más tarde.', ephemeral: true });
    }

    const requirements = item || [];

    for (const req of requirements) {
      const userItem = userInventory.items.find(i => i.name === req);
      if (!userItem) {
        return interaction.reply({ 
          content: `No tienes el objeto necesario para elegir el final ${AgeChoosen}.`, 
          ephemeral: true 
        });
      }
    }

    // Elimina los objetos necesarios del inventario
    userInventory.items = userInventory.items.filter(i => !requirements.includes(i.name));
    await userInventory.save();

    const member = interaction.member;

    const FixRingEmbed = new EmbedBuilder()
      .setColor('#b0875f')
      .setAuthor({
        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
      })
      .setDescription(AgeReply);

    // Verifica si el miembro ya tiene el rol
    if (member.roles.cache.has(roleId)) {
      await interaction.reply({ embeds: [FixRingEmbed] });
    } else {
      try {
        // Asigna el rol al miembro
        await member.roles.add(roleId);
        // Envía el mensaje embed
        await interaction.reply({ embeds: [FixRingEmbed] });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: `Ocurrió un error al ascender a Señor: ${error.message}`, ephemeral: true });
      }
    }
  },
  data: new SlashCommandBuilder()
    .setName('reparar-el-círculo')
    .setDescription('Repara el Círculo de Elden y conviértete en señor.')
    .addStringOption(option => 
      option.setName('era')
        .setDescription('Era que escoges para ascender a Señor.')
        .setRequired(true)
        .setAutocomplete(true)
    )
};
