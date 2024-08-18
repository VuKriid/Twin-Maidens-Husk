const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

const dailyAmount = 500;

module.exports = {
    run: async ({ interaction }) => {
       if (!interaction.inGuild()) {
        interaction.reply({
            content: "Este comando solo puede ser ejecutado en la Mesa Redonda.",
            ephemeral: true,
        });
        return;
       }

       try {
        await interaction.deferReply();

        let userProfile = await UserProfile.findOne({
            userId: interaction.member.id,
        });

        if (userProfile) {
            const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
            const currentDate = new Date().toDateString();

            if (lastDailyDate === currentDate) {
                const alreadyCollectedEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription('Ya has cobrado hoy.')

                interaction.editReply({ embeds: [alreadyCollectedEmbed] });
                return;
            }
        } else {
            userProfile = new UserProfile({
                userId: interaction.member.id,
                balance: 0,
            });
        }

        userProfile.balance += dailyAmount;
        userProfile.lastDailyCollected = new Date();

        await userProfile.save();

        const DailyEmbed = new EmbedBuilder()
            .setColor('#b0875f')
            .setAuthor({
                name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
            })
            .setDescription(`Has cobrado <:Runa:1269384390614585416>${dailyAmount} runas por hoy.`)

        interaction.editReply({ embeds: [DailyEmbed] });
       } catch (error) {
        console.log(`Error handling /daily: ${error}`)
       }
    },

    data: {
        name: 'recompensa-diaria',
        description: 'Cobra tu recompensa diaria.',
    },
};
