const { EmbedBuilder } = require('discord.js');
const Maiden = require('../../schemas/Maiden');

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "Este comando solo puede ser ejecutado en la Mesa Redonda.",
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply();

        try {
            // Obtener todos los perfiles de usuario y ordenarlos por balance ascendente
            const Maidens = await Maiden.find().sort({ affect: -1 }).limit(10); // Limita a los 10 mejores

            // Si no hay usuarios en la base de datos
            if (!Maidens.length) {
                interaction.editReply({
                    content: 'No hay datos de clasificación disponibles en este momento.',
                    ephemeral: true,
                });
                return;
            }

            // Crear la descripción para el embed con la clasificación
            let description = '';
            Maidens.forEach((maiden, index) => {
                description += `${index + 1}. ${maiden.name} - :heart_decoration:${maiden.affect}\n`;
            });

            // Crear el embed
            const leaderboardEmbed = new EmbedBuilder()
                .setColor('#b0875f')
                .setTitle('Marcador de Afecto')
                .setDescription(description)
                .setTimestamp();

            interaction.editReply({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error('Error al obtener el marcador:', error);
            interaction.editReply({
                content: 'Hubo un error al intentar obtener el marcador. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        }
    },

    data: {
        name: 'marcador-de-afecto',
        description: 'Muestra un marcador con las doncellas de dedo con mayor afecto a su Sin Luz.',
    },
};
