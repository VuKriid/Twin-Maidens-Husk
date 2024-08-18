const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const Inventory = require('../../schemas/Inventory');

function getRandomNumber(x, y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

module.exports = {
    run: async({ interaction }) => {
        const userId = interaction.user.id;
        const opponentId = interaction.options.getUser('oponente').id;

        // Verifica si el usuario se ha elegido a sí mismo como oponente
        if (userId === opponentId) {
            return interaction.reply({
                content: 'No puedes luchar contigo mismo.',
                ephemeral: true
            });
        }

        // Usuario
        let userProfile = await UserProfile.findOne({ userId }).select('userId balance health defeatedBosses stats');
        if (!userProfile) {
            userProfile = new UserProfile({ userId, balance: 0, health: 100, defeatedBosses: [], stats: [] });
            await userProfile.save(); // Guardar inmediatamente si es nuevo
        }
        //Oponente
        let opponentProfile = await UserProfile.findOne({ userId: opponentId }).select('userId balance health defeatedBosses stats');
        if (!opponentProfile) {
            opponentProfile = new UserProfile({ userId: opponentId, balance: 0, health: 100, defeatedBosses: [], stats: [] });
            await opponentProfile.save(); // Guardar inmediatamente si es nuevo
        }

        // Usuario
            const userStats = userProfile.stats
            const userLevel = userStats.level;
            const userVitality =  userStats.vitality;
            const userHealth = Math.floor(100 * ( 5 - ( 36 / ( userVitality + 8 ) ) ));
            const userAttack =  userStats.attack;
            const userEvasionRaw =  userStats.evasion;
            const userEvasion = 13.5 / (userEvasionRaw + 12.5);
            const userAccuracyRaw =  userStats.accuracy;
            const userAccuracy = 2 - (9 / (userAccuracyRaw + 8));
            // Oponente
            const opponentStats = opponentProfile.stats
            const opponentLevel = opponentStats.level;
            const opponentVitality =  opponentStats.vitality;
            const opponentHealth = Math.floor(100 * ( 5 - ( 36 / ( opponentVitality + 8 ) ) ));
            const opponentAttack =  opponentStats.attack;
            const opponentEvasionRaw =  opponentStats.evasion;
            const opponentEvasion = 13.5 / (opponentEvasionRaw + 12.5);
            const opponentAccuracyRaw =  opponentStats.accuracy;
            const opponentAccuracy = 2 - (9 / (opponentAccuracyRaw + 8));

        // Inventario Usuario
        let userInventory = await Inventory.findOne({ userId });

        if (!userInventory) {
            userInventory = new Inventory({ userId });
            await userInventory.save();
        }
        // Inventario Oponente
        let opponentInventory = await Inventory.findOne({ userId: opponentId });

        if (!opponentInventory) {
            opponentInventory = new Inventory({ userId: opponentId });
            await opponentInventory.save();
        }

        const getArmorLevel = (inventory) => {
            let ArmorLevel = 1;
            if (!inventory) return ArmorLevel;
            const armor = inventory.items.find(item => item.name.startsWith('Armadura'));
            if (armor) {
                if (armor.name === 'Armadura') ArmorLevel = 0.85;
                if (armor.name === 'Armadura +1') ArmorLevel = 0.7;
                if (armor.name === 'Armadura +2') ArmorLevel = 0.55;
                if (armor.name === 'Armadura +3') ArmorLevel = 0.4;
            }
            return ArmorLevel;
        };

        // Armadura

        const UserNeggateDamage = getArmorLevel(userInventory)
        const OpponentNeggateDamage = getArmorLevel(opponentInventory)
        
        const MaxUserHealth = userHealth;
        let DynUserHealth = MaxUserHealth;
        const MaxOpponentHealth = opponentHealth;
        let DynOpponentHealth = MaxOpponentHealth;

        // Verifica el nivel de espada del usuario
        const getSwordLevel = (inventory) => {
            if (!inventory) return 0;
            const sword = inventory.items.find(item => item.name.startsWith('Espada'));
            if (sword) {
                if (sword.name === 'Espada') return 1;
                if (sword.name === 'Espada +1') return 2;
                if (sword.name === 'Espada +2') return 3;
                if (sword.name === 'Espada +3') return 4;
                if (sword.name === 'Espada +4') return 5;
            }
            return 0;
        };

        let currentTurn = 0;

        const userSwordLevel = getSwordLevel(userInventory);
        const opponentSwordLevel = getSwordLevel(opponentInventory);

       

        function getRandomDamage(attack, level) {
            const baseDamage = getRandomNumber(5, 20) * (Math.sqrt(attack));
            const swordMultiplier = 1 + (level * 0.1);
            return Math.floor(baseDamage * swordMultiplier);
        }

        const createCombatEmbed = (description) => {
            const turnUser = currentTurn === 0 ? interaction.user : interaction.options.getUser('oponente');
            const turnTag = currentTurn === 0 ? userId : opponentId;

            return new EmbedBuilder()
                .setColor('#b0875f')
                .setTitle(`Duelo`)
                .setDescription(description)
                .addFields(
                    { name: `${interaction.member.displayName}`, value: `${DynUserHealth}`, inline: true },
                    { name: `${interaction.guild.members.cache.get(opponentId).displayName}`, value: `${DynOpponentHealth}`, inline: true },
                    { name: 'Turno', value: `<@${turnTag}>`, inline: false }
                );
        };

        const confirmButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Iniciar Duelo')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Rechazar')
                .setStyle(ButtonStyle.Secondary)
        );

        const StartEmbed = new EmbedBuilder()
            .setTitle('Duelo')
            .setColor('#b0875f')
            .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.user.avatarURL() })
            .setDescription(`${interaction.guild.members.cache.get(opponentId).displayName}, has sido retado a un duelo por ${interaction.member.displayName}. ¿Deseas aceptar e iniciar el duelo?`);

        await interaction.reply({ content: `<@${opponentId}>`, embeds: [StartEmbed], components: [confirmButtons] });

        const confirmCollector = interaction.channel.createMessageComponentCollector({
            filter: i => i.user.id === userId || i.user.id === opponentId,
            max: 1,
            time: 120000
        });

        const createHealButton = (inventory, currentTurn) => {
            if (!inventory || !inventory.items.some(item => item.name === 'Vial de Lágrimas')) return null;
        
            return new ButtonBuilder()
                .setCustomId('heal')
                .setLabel('Curar')
                .setStyle(ButtonStyle.Secondary);
        };

        confirmCollector.on('collect', async i => {
            if (i.customId === 'confirm') {
                await i.update({ content: '', components: [] });

                const healButtonUser = createHealButton(userInventory, 0);
                const healButtonOpponent = createHealButton(opponentInventory, 1);

                const actionRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('attack')
                            .setLabel('Atacar')
                            .setStyle(ButtonStyle.Primary),
                            currentTurn === 0 ? healButtonUser : healButtonOpponent
                    )
                    .components
                    .filter(Boolean);

                // Si no hay botones, no creamos el ActionRow
                const buttons = actionRow.length > 0 ? new ActionRowBuilder().addComponents(actionRow) : null;

                await interaction.editReply({ embeds: [createCombatEmbed('El duelo ha comenzado.')], components: buttons ? [buttons] : [] });

                const collector = interaction.channel.createMessageComponentCollector({
                    filter: i => i.user.id === (currentTurn === 0 ? userId : opponentId),
                    time: 120000
                });

                collector.on('collect', async i => {
                    let description = '';
                    
                    if (i.customId === 'attack') {
                        const damage = getRandomDamage(currentTurn === 0 ? userAttack : opponentAttack, currentTurn === 0 ? userSwordLevel : opponentSwordLevel);
                        const hitChance = Math.random();
                        
                        if (currentTurn === 0) {
                            if (hitChance < 1 + -0.5/((opponentEvasion * userAccuracy)+0.5)) {
                                DynOpponentHealth -= damage;
                                description = `${interaction.member.displayName} ha lanzado un tajo hacia adelante y hecho ${damage} de daño a ${interaction.guild.members.cache.get(opponentId).displayName}!`;
                            } else {
                                description = `¡${interaction.member.displayName} ha fallado su ataque!`;
                            }
                        } else {
                            if (hitChance < 1 + -0.5/((userEvasion * opponentAccuracy)+0.5)) {
                                DynUserHealth -= damage;
                                description = `${interaction.guild.members.cache.get(opponentId).displayName} ha alcanzado a ${interaction.member.displayName} con su ataque y hecho ${damage} de daño!`;
                            } else {
                                description = `¡${interaction.guild.members.cache.get(opponentId).displayName} ha fallado su ataque!`;
                            }
                        }
                    } else if (i.customId === 'heal') {
                        let healAmount;
                        if (currentTurn === 0 && userInventory.items.some(item => item.name === 'Vial de Lágrimas')) {
                            healAmount = parseInt(getRandomNumber(15, 50) * MaxUserHealth / 100);
                            DynUserHealth = Math.min(DynUserHealth + healAmount);
                            description = `${interaction.member.displayName} se ha curado ${healAmount} puntos de salud.`;
                            const vialIndex = userInventory.items.findIndex(item => item.name === 'Vial de Lágrimas');
                            if (vialIndex > -1) {
                                if (userInventory.items[vialIndex].quantity > 1) {
                                    userInventory.items[vialIndex].quantity -= 1; // Disminuir la cantidad en 1
                                } else {
                                    userInventory.items.splice(vialIndex, 1); // Eliminar el objeto si solo queda uno
                                }
                                await userInventory.save(); // Guardar los cambios en la base de datos
                            }
                        } else if (currentTurn === 1 && opponentInventory.items.some(item => item.name === 'Vial de Lágrimas')) {
                            healAmount = parseInt(getRandomNumber(15, 50) * MaxOpponentHealth / 100);
                            DynOpponentHealth = Math.min(DynOpponentHealth + healAmount);
                            description = `${interaction.guild.members.cache.get(opponentId).displayName} se ha curado ${healAmount} puntos de salud.`;
                            const vialIndex = opponentInventory.items.findIndex(item => item.name === 'Vial de Lágrimas');

                            if (vialIndex > -1) {
                                if (opponentInventory.items[vialIndex].quantity > 1) {
                                    opponentInventory.items[vialIndex].quantity -= 1; // Disminuir la cantidad en 1
                                } else {
                                    opponentInventory.items.splice(vialIndex, 1); // Eliminar el objeto si solo queda uno
                                }
                                await opponentInventory.save(); // Guardar los cambios en la base de datos
                            }
                        } else {
                            description = 'No tienes viales de lágrimas para usar.';
                        }
                    }
                
                    // Cambia el turno después de realizar la acción
                    currentTurn = currentTurn === 0 ? 1 : 0;
                
                    // Reconstruye los botones basados en el estado actualizado
                    const healButtonUser = createHealButton(userInventory, 0);
                    const healButtonOpponent = createHealButton(opponentInventory, 1);
                
                    const actionRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('attack')
                                .setLabel('Atacar')
                                .setStyle(ButtonStyle.Primary),
                            currentTurn === 0 ? healButtonUser : healButtonOpponent
                        )
                        .components
                        .filter(Boolean);
                
                    const buttons = actionRow.length > 0 ? new ActionRowBuilder().addComponents(actionRow) : null;
                
                    await interaction.editReply({ embeds: [createCombatEmbed(description)], components: buttons ? [buttons] : [] });
                
                    if (DynUserHealth <= 0 || DynOpponentHealth <= 0) {
                        const winner = DynUserHealth > 0 ? interaction.member : interaction.guild.members.cache.get(opponentId);
                        const loser = DynUserHealth <= 0 ? interaction.member : interaction.guild.members.cache.get(opponentId);
                        await i.update({ content: `¡El duelo ha terminado! ${winner.displayName} ha derrotado a ${loser.displayName} y se ha quedado con todas sus runas.`, components: [] });
                        if (winner.id === interaction.user.id) {
                            userProfile.balance += opponentProfile.balance
                            opponentProfile.balance = 0
                        } else {
                            opponentProfile.balance += userProfile.balance
                            userProfile.balance = 0
                        }
                        await userProfile.save();
                        await opponentProfile.save();
                        collector.stop();
                    }
                });

                collector.on('end', async () => {
                    if (DynUserHealth > 0 && DynOpponentHealth > 0) {
                        await interaction.editReply({ content: 'El duelo ha terminado en empate por falta de actividad.', components: [] });
                    }
                });
            } else {
                await i.update({ content: 'El duelo ha sido cancelado.', components: [] });
            }
        });

        confirmCollector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ content: 'No se recibió respuesta, el duelo ha sido cancelado.', components: [] });
            }
        });
    },
    data: {
        name: 'luchar',
        description: 'Lucha con otro usuario.',
        options: [
            {
                name: 'oponente',
                description: 'El usuario con el que quieres luchar',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
        ],
    },
};
