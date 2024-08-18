const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const client = '1269114547109756980';
const UserProfile = require('../../schemas/UserProfile');


const choices = [
    { name: 'Roca', emoji: '🪨', beats: 'Navaja' },
    { name: 'Navaja', emoji: '🗡️', beats: 'Papiro' },
    { name: 'Papiro', emoji: '📜', beats: 'Roca' },
]

module.exports = {
    run: async ({ interaction }) => {
        try {
            const targetUser = interaction.options.getUser('usuario');
            const bot = client;
            const amount = interaction.options.getNumber('monto') || 0;

            let interactionUserProfile = await UserProfile.findOne({
                userId: interaction.user.id,
            });
            let targetUserProfile = await UserProfile.findOne({
                userId: targetUser.id,
            });

            if (!interactionUserProfile) {
                interactionUserProfile = new UserProfile({
                    userId: interaction.user.id,
                });
            }
            if (!targetUserProfile) {
                targetUserProfile = new UserProfile({
                    userId: targetUser.id,
                });
            }

            if(targetUser.id === bot) {
                if (amount > interactionUserProfile.balance) {
                    const OverBalanceEmbed = new EmbedBuilder()
                        .setColor('#b0875f')
                        .setAuthor({
                            name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                        })
                        .setDescription(`Las Doncellas Gemelas te juzgan con la mirada al no tener el dinero que intentas apostar.`)
                    interaction.reply({ embeds: [OverBalanceEmbed]});
                    return;
                }

                const TurnEmbed = new EmbedBuilder()
                    .setTitle('Roca Papiro Navaja')
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `Doncellas Gemelas Quiescentes`, iconURL: 'https://cdn.discordapp.com/app-icons/1269114547109756980/0a7b5008b0e8441f1245dc983e4511e1.png?size=512',
                    })
                    .setDescription(`Has retado a las Doncellas Gemelas Quiescentes a un juego de Roca Papiro Navaja, elige una de las siguientes opciones para continuar.\nApuesta: <:Runa:1269384390614585416>${amount} runas.`)
                    .addFields({name: 'Turno:', value: `Es el turno de ${interaction.user}.`});

                const buttons = choices.map((choice) => {
                    return new ButtonBuilder()
                        .setCustomId(choice.name)
                        .setLabel(choice.name)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(choice.emoji)
                });

                const row = new ActionRowBuilder().addComponents(buttons);

                const reply = await interaction.reply({
                    embeds: [TurnEmbed],
                    components: [row],
                });              
                
                const initialUserInteraction = await reply.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 60_000,
                }).catch(async (error) => {
                    embed.setDescription(`Juego terminado. ${interaction.user} no ha respondido a tiempo.`);
                    await reply.edit({ embeds: [TurnEmbed], components: [] });
                });

                if (!initialUserInteraction) return;

                    const initialUserChoice = choices.find(
                        (choice) => choice.name === initialUserInteraction.customId
                    );

                    const targetUserChoiceIndex = Math.floor(Math.random() * 3);
                    let targetUserChoice;

                    if (targetUserChoiceIndex === 0) {
                        targetUserChoice = choices[0];
                    } else if (targetUserChoiceIndex === 1) {
                        targetUserChoice = choices[1];
                    } else {
                        targetUserChoice = choices[2];
                    }

                    let result;

                    if (targetUserChoice.beats === initialUserChoice.name) {
                        result = `Ha ganado ${targetUser}.\n-<:Runa:1269384390614585416>${amount} runas.`;
                    }

                    if (targetUserChoice.name === initialUserChoice.name) {
                        result = `Ha habido un empate.`;
                    }

                    if (initialUserChoice.beats === targetUserChoice.name) {
                        result = `Ha ganado ${interaction.user}.\n+<:Runa:1269384390614585416>${amount} runas.`;
                    }

                TurnEmbed.setDescription(
                    `Las Doncellas Gemelas han elegido: ${targetUserChoice.name + targetUserChoice.emoji}.\n${interaction.user} ha elegido: ${initialUserChoice.name + initialUserChoice.emoji}.\n\n${result}.`
                );
                TurnEmbed.spliceFields(0, 1);

                reply.edit({ embeds: [TurnEmbed], components: [] });

                const Lose = (targetUserChoice.beats === initialUserChoice.name);
                const Tie = (targetUserChoice.name === initialUserChoice.name);
                const Win = (initialUserChoice.beats === targetUserChoice.name);

                if (Lose) {
                    interactionUserProfile.balance -= amount;
                    await interactionUserProfile.save();

                    return;
                }

                if (Win) {
                    interactionUserProfile.balance += amount;
                    await interactionUserProfile.save();

                    return;
                }
                return;
            }

                if (interaction.user.id === targetUser.id) {
                    interaction.reply({
                        content: 'Espero que no tengas esquizofrenia.',
                        ephemeral: true,
                    });

                    return;
                }

                if (targetUser.bot) {
                    interaction.reply({
                        content: 'Solo es posible jugar con un miembro o con las Doncellas Gemelas.',
                        ephemeral: true,
                    });

                    return;
                }

                if (amount > interactionUserProfile.balance) {
                    const OverBalanceEmbed = new EmbedBuilder()
                        .setColor('#b0875f')
                        .setAuthor({
                            name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                        })
                        .setDescription(`No tienes suficientes runas como para apostar.`)
                    interaction.reply({ embeds: [OverBalanceEmbed]});
                    return;
                }

                if (amount > targetUserProfile.balance) {
                    const OverBalanceTargetEmbed = new EmbedBuilder()
                        .setColor('#b0875f')
                        .setAuthor({
                            name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                        })
                        .setDescription(`${targetUser} no tiene suficientes runas como para apostar.`)
                    interaction.reply({ embeds: [OverBalanceTargetEmbed]});
                    return;
                }
                
                const TurnEmbed = new EmbedBuilder()
                    .setTitle('Roca Papiro Navaja')
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${targetUser.tag}`, iconURL: targetUser.avatarURL(),
                    })
                    .setDescription(`${targetUser}, ${interaction.user} te ha retado a un juego de Roca Papiro Navaja. Para jugar selecciona una de las opciones a continuación.\nApuesta: <:Runa:1269384390614585416>${amount} runas.`)
                    .addFields({name: 'Turno:', value: `Es el turno de ${targetUser}.`});

                const buttons = choices.map((choice) => {
                    return new ButtonBuilder()
                        .setCustomId(choice.name)
                        .setLabel(choice.name)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(choice.emoji)
                });

                const row = new ActionRowBuilder().addComponents(buttons);

                const reply = await interaction.reply({
                    content: `${targetUser}`,
                    embeds: [TurnEmbed],
                    components: [row],
                });

                const targetUserInteraction = await reply.awaitMessageComponent({
                    filter: (i) => i.user.id === targetUser.id,
                    time: 60_000,
                }).catch(async (error) => {
                    TurnEmbed.setDescription(`Juego terminado. ${targetUser} no ha respondido a tiempo.`);
                    await reply.edit({ embeds: [TurnEmbed], compontents: [] });
                });

                if (!targetUserInteraction) return;

                const targetUserChoice = choices.find(
                    (choice) => choice.name === targetUserInteraction.customId,
                );

                await targetUserInteraction.reply({
                    content: `Has elegido ${targetUserChoice.name + targetUserChoice.emoji}.`,
                    ephemeral: true,
                });

                //turno
                TurnEmbed.spliceFields(0, 1, {name: 'Turno:', value: `Ahora es el turno de ${interaction.user}.`});
                await reply.edit({
                    embeds: [TurnEmbed],
                });
                
                const initialUserInteraction = await reply.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id,
                    time: 60_000,
                }).catch(async (error) => {
                    TurnEmbed.setDescription(`Juego terminado. ${interaction.user} no ha respondido a tiempo.`);
                    await reply.edit({ embeds: [TurnEmbed], compontents: [] });
                });

                if (!initialUserInteraction) return;

                const initialUserChoice = choices.find(
                    (choice) => choice.name === initialUserInteraction.customId
                );

                let result;

                if (targetUserChoice.beats === initialUserChoice.name) {
                    result = `Ha ganado ${targetUser}.\n+<:Runa:1269384390614585416>${amount} runas.`;
                }

                if (targetUserChoice.name === initialUserChoice.name) {
                    result = `Ha habido un empate.`;
                }

                if (initialUserChoice.beats === targetUserChoice.name) {
                    result = `Ha ganado ${interaction.user}.\n+<:Runa:1269384390614585416>${amount} runas.`;
                }

                const Lose = (targetUserChoice.beats === initialUserChoice.name);
                const Win = (initialUserChoice.beats === targetUserChoice.name);

                if (Lose) {
                    try {
                        interactionUserProfile.balance -= amount;
                        await interactionUserProfile.save();
                
                        targetUserProfile.balance += amount;
                        await targetUserProfile.save();
                    } catch (error) {
                    };
                }
                
                if (Win) {
                    try {
                        interactionUserProfile.balance += amount;
                        await interactionUserProfile.save();
                
                        targetUserProfile.balance -= amount;
                        await targetUserProfile.save();
                    } catch (error) {
                        console.error('Error actualizando balances(Lose):', error);
                    };
                }

                TurnEmbed.setDescription(
                    `${targetUser} ha elegido: ${targetUserChoice.name + targetUserChoice.emoji}.\n${interaction.user} ha elegido: ${initialUserChoice.name + initialUserChoice.emoji}.\n\n${result}.`
                );
                TurnEmbed.spliceFields(0, 1);

                reply.edit({ embeds: [TurnEmbed], components: [] });
                
        } catch (error) {
            console.log('Error en roca-papiro-navaja.');
            console.error(error);
        }
    },

    data: {
        name: 'roca-papiro-navaja',
        description: 'Juega piedra-papel-tijeras con otro miembro.',
        dm_permission: false,
        options: [
            {
                name: 'usuario',
                description: 'Usuario con el que se jugará.',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'monto',
                description: 'Cantidad de runas que apostarás.',
                type: ApplicationCommandOptionType.Number,
                require: true,
            }
        ]
    }
}