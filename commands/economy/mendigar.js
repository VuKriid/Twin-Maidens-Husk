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
            interaction.reply({
                content: "Este comando solo puede ser ejecutado en la Mesa Redonda.",
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            const commandName = 'mendigar';
            const userId = interaction.user.id;

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');
                const CDBegEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Ya has mendigado, inténtalo de nuevo en ${prettyMs(cooldown.endsAt - Date.now())}.`)
                await interaction.editReply({ embeds: [CDBegEmbed] })
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

            let userProfile = await UserProfile.findOne({ userId }).select('userid balance');
            const rich = (userProfile.balance > 10000) ? 100 : (userProfile.balance / 100) ;
            const chance = getRandomNumber(0, 100);
            
            if (chance < rich) {
                const FailBegEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Todos te ignoran y no has conseguido ni una sola runa.`)
                await interaction.editReply({ embeds: [FailBegEmbed] });

                cooldown.endsAt = Date.now() + 20_000;
                await cooldown.save();
                return;
            }

            const amount = getRandomNumber(1, 30);

            

            if (!userProfile) {
                userProfile = new UserProfile({ userId });
            }

            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 30_000;

            await Promise.all([cooldown.save(), userProfile.save()]);

            const BegEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Has conseguido <:Runa:1269384390614585416>${amount} runas.`)
                await interaction.editReply({ embeds: [BegEmbed] });
        } catch (error) {
            console.error('Error al ejecutar el comando de mendigar:', error);
            interaction.editReply({
                content: 'Hubo un error al intentar mendigar. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        }
    },
    
    data: {
        name: 'mendigar',
        description: 'Mendiga para conseguir un par de runas.',
    },
}