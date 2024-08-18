const Cooldown = require('../../schemas/Cooldown');
const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

function getRandomNumber(x, y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "Este comando solo puede ser ejecutado en la Mesa Redonda.",
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply(); // Asegúrate de diferir la respuesta lo antes posible

            const commandName = 'trabajar';
            const userId = interaction.user.id;

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');
                const CDBegEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`No hay trabajos disponibles ahora, inténtalo de nuevo en ${prettyMs(cooldown.endsAt - Date.now())}.`);
                await interaction.editReply({ embeds: [CDBegEmbed] });
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

            const chance = getRandomNumber(0, 100);

            if (chance < 2) {
                const AKamount = getRandomNumber(1, 100) * 200;
                const AllKnowingBegEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Hiciste un trabajo tan esplendido que el Omnisciente te pagó <:Runa:1269384390614585416>${AKamount} runas.`);
                await interaction.editReply({ embeds: [AllKnowingBegEmbed] });

                let userProfile = await UserProfile.findOne({ userId }).select('balance');
                if (!userProfile) {
                    userProfile = new UserProfile({ userId });
                }

                userProfile.balance += AKamount;
                cooldown.endsAt = Date.now() + 300_000;
                await Promise.all([cooldown.save(), userProfile.save()]);
                return;
            }

            const amount = getRandomNumber(25, 100) * 10;

            let userProfile = await UserProfile.findOne({ userId }).select('balance');

            if (!userProfile) {
                userProfile = new UserProfile({ userId });
            }

            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 300_000;

            await Promise.all([cooldown.save(), userProfile.save()]);

            const BegEmbed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({
                    name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                })
                .setDescription(`Trabajaste duro y conseguiste <:Runa:1269384390614585416>${amount} runas.`);
            await interaction.editReply({ embeds: [BegEmbed] });
        } catch (error) {
            console.error('Error al ejecutar el comando de trabajar:', error);
        }
    },
    
    data: {
        name: 'trabajar',
        description: 'Trabaja en la Mesa Redonda a cambio de una suma de runas.',
    },
}
