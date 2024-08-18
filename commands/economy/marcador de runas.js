const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

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
            const userProfiles = await UserProfile.find().sort({ balance: -1 }).limit(10); // Limita a los 10 mejores

            // Si no hay usuarios en la base de datos
            if (!userProfiles.length) {
                interaction.editReply({
                    content: 'No hay datos de marcador disponibles en este momento.',
                    ephemeral: true,
                });
                return;
            }

            // Crear la descripción para el embed con la clasificación
            let description = '';
            userProfiles.forEach((profile, index) => {
                description += `${index + 1}. <@${profile.userId}> - <:Runa:1269384390614585416>${profile.balance}\n`;
            });

            // Crear el embed
            const leaderboardEmbed = new EmbedBuilder()
                .setColor('#b0875f')
                .setTitle('Marcador de Runas')
                .setDescription(description)
                .setTimestamp();

            interaction.editReply({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error('Error al obtener la clasificación:', error);
            interaction.editReply({
                content: 'Hubo un error al intentar obtener el marcador. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        }
    },

    data: {
        name: 'marcados-de-runas',
        description: 'Muestra el marcador de runas de los Sin Luz.',
    },
};
