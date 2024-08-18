const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "a",
                ephemeral: true,
            });

            return;
        }

        const amount = interaction.options.getNumber('monto');

        if (amount < 20) {
            const DenyEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Las Doncellas Gemelas se niegan a apostar por menos de <:Runa:1269384390614585416>20 runas.`)
            interaction.reply({ embeds: [DenyEmbed]});
            return;
        }

        let userProfile = await UserProfile.findOne({
            userId: interaction.user.id,
        });

        if (!userProfile) {
            userProfile = new UserProfile({
                userId: interaction.user.id,
            });
        }

        if (amount > userProfile.balance) {
            const OverBalanceEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Las Doncellas Gemelas te juzgan con la mirada al no tener el dinero que intentas apostar.`)
            interaction.reply({ embeds: [OverBalanceEmbed]});
            return;
        }

        const didWin = Math.random() > 0.5;

        if (!didWin) {
            userProfile.balance -= amount;
            await userProfile.save();

            const LoseEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Has perdido y las Doncellas Gemelas se quedaron con tus runas.`)
                    .setThumbnail('https://cdn.discordapp.com/app-icons/1269114547109756980/0a7b5008b0e8441f1245dc983e4511e1.png?size=512')
            interaction.reply({ embeds: [LoseEmbed]});
            return;
        }

        const amountWon = Number((amount * (Math.random() + 0.55)).toFixed(0));

        userProfile.balance += amountWon;
        await userProfile.save();

        const WinEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Has ganado y obtenido <:Runa:1269384390614585416>${amountWon} runas.`)
                    .setThumbnail(interaction.user.avatarURL())
            interaction.reply({ embeds: [WinEmbed]});
    },

    data: {
        name: 'runa-plateada',
        description: 'Apuesta runas con las Doncellas Gemelas lanzando una runa plateada al aire.',
        options: [
            {
                name: 'monto',
                description: 'Cantidad de runas que apostarás.',
                type: ApplicationCommandOptionType.Number,
                require: true,
            }
        ]
    }
}