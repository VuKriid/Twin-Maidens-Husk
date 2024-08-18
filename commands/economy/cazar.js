const Cooldown = require('../../schemas/Cooldown');
const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const Inventory = require('../../schemas/Inventory');

function getRandomNumber(x, y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const events = [
    {
        type: 'lessEnemy',
        chance: 70,
        enemyName: [
            'Espadachinas de Nox',
            'Caballeros de Leyndell',
            'Siervos de la Putrefacción',
            'Caballeros Imputrescibles',
            'Caballeros Carianos',
            'Caballeros Cucos',
            'Magos de Batalla',
            'Cristalianos',
            'Bastardos con hacha',
            'Albináuricas de Primera Generación',
            'Albináuricos de Segunda Generación',
            'Augurios',
            'Hombres Bestia de Farum Azula',
            'Tarros Vivientes',
            'Cornamentados',
            'Ascetas',
            'Cangrejos Gigantes',
            'Escorpiones Gigantes',
            'Aves Tumulares',
            'Sanguinemigos',
            'Langostas Gigantes',
            
        ],
        dead: [
            'Moriste tras enfrentar a {count} {enemyName} y terminaste derrotado, perdiste todas tus runas.',
            'Te encontraste a {count} {enemyName} y moriste tras intentar enfrentarlos, perdiendo todas tus runas en el proceso.'
        ],
        messages: [
            'Derrotaste a {count} {enemyName} y regresaste con <:Runa:1269384390614585416>{amount} runas.'
        ],
    },
    {
        type: 'boss',
        chance: 100,
        enemyName: [
            'Avatar del Árbol Áureo',
            'Dragón Volador',
            'Dragón de Magma',
            'Espíritu del Árbol Áureo',
            'Centinela Agreste',
            'Centinela Draconiano',
            'Reina Semihumana',
            'Gárgola Denodada'
        ],
        dead: [
            'Moriste tras enfrentar a un(a) {enemyName} y perdiste todas tus runas.',
            'No lograste sobrevivir a un(a) {enemyName} y perdiste todo las runas que tenías.',
            'Fuiste destruido por un(a) {enemyName} y todas tus runas se perdieron.',
            'Te caíste de una gran altura y moriste, perdiendo tus runas.'
        ],
        messages: [
            'Encontraste a un(a) {enemyName} y lograste conseguir <:Runa:1269384390614585416>{extraRunas} de su cadáver tras cazarlo.',
            'Estuviste persiguiendo la pista de un(a) {enemyName}, hasta que finalmente lo encontraste y aniquilaste, consiguiendo <:Runa:1269384390614585416>{extraRunas} runas de su cadáver.',
            'Estabas inspeccionando los restos de un cadáver cuando apareció un(a) {enemyName} listo para luchar. Tras el enfrentamiento, conseguiste <:Runa:1269384390614585416>{extraRunas} runas de su cuerpo.',
            'Estabas caminando a través de un profundo bosque cuando un(a) {enemyName} cayó desde las ramas y te atacó. Lograste eliminarlo y conseguir <:Runa:1269384390614585416>{extraRunas} runas.'
        ]
    }
];

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

            const commandName = 'cazar';
            const userId = interaction.user.id;

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');
                const CDHuntEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`No hay ningún enemigo cerca al cual cazar, inténtalo de nuevo en ${prettyMs(cooldown.endsAt - Date.now())}.`)
                interaction.editReply({ embeds: [CDHuntEmbed] });
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

            let userProfile = await UserProfile.findOne({ userId });
            if (!userProfile) {
                userProfile = new UserProfile({ userId, balance: 0, health: 100 });
            }
            
            const chance = getRandomNumber(0, 100);
            const selectedEvent = events.find(event => chance <= event.chance);

            if (!selectedEvent) {
                const FailHuntEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`No encontraste enemigos para cazar esta vez.`)
                await interaction.reply({ embeds: [FailHuntEmbed] });

                cooldown.endsAt = Date.now() + 1800_000;
                await cooldown.save();
                return;
            }

            const userInventory = await Inventory.findOne({ userId });
            const stats = userProfile.stats
            const level = stats.level;
            const vitality =  stats.vitality;
            const MaxHealth = 100 * ( 5 - ( 36 / ( vitality + 8 ) ) );
            const attack =  stats.attack;
            const evasionRaw =  stats.evasion;
            const accuracyRaw =  stats.accuracy;

            let ArmorLevel = 1;
            if (userInventory) {
                const armor = userInventory.items.find(item => item.name.startsWith('Armadura'));
                if (armor) {
                    if (armor.name === 'Armadura') ArmorLevel = 1.15;
                    else if (armor.name === 'Armadura +1') ArmorLevel = 1.3;
                    else if (armor.name === 'Armadura +2') ArmorLevel = 1.45;
                    else if (armor.name === 'Armadura +3') ArmorLevel = 1.60;
                }
            }
            let health = MaxHealth

            // Verifica el tipo de espada en el inventario
            let swordLevel = 1;
            if (userInventory) {
                const sword = userInventory.items.find(item => item.name.startsWith('Espada'));
                if (sword) {
                    // Extrae el nivel de la espada basado en el nombre
                    if (sword.name === 'Espada') swordLevel = 1.1;
                    else if (sword.name === 'Espada +1') swordLevel = 1.2;
                    else if (sword.name === 'Espada +2') swordLevel = 1.3;
                    else if (sword.name === 'Espada +3') swordLevel = 1.4;
                    else if (sword.name === 'Espada +4') swordLevel = 1.5;
                }
            }

            const power = (attack + evasionRaw + accuracyRaw)/3 * swordLevel * ArmorLevel * 12;

            const balance = userProfile.balance;

            if (chance > power) {
                const FailHuntEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Fuiste derrotado por el enemigo y regresaste a la Mesa Redonda sin ni una sola runa.\n-<:Runa:1269384390614585416>${balance} runas.`)
                await interaction.editReply({ embeds: [FailHuntEmbed] });

                cooldown.endsAt = Date.now() + 1800_000;
                await cooldown.save();
                userProfile.balance -= balance;
                await Promise.all([cooldown.save(), userProfile.save()]);

                return;
            }

            let count, amount, message, enemyName;
            if (selectedEvent.type === 'lessEnemy') {
                count = getRandomNumber(2, 10);
                amount = getRandomNumber(50, 400) * count;
                enemyName = getRandomElement(selectedEvent.enemyName);
                message = selectedEvent.messages[0].replace('{count}', count).replace('{enemyName}', enemyName).replace('{amount}', amount);
            } else if (selectedEvent.type === 'boss') {
                count = 1;
                amount = getRandomNumber(500, 6000);
                enemyName = getRandomElement(selectedEvent.enemyName);
                message = selectedEvent.messages[0].replace('{enemyName}', enemyName).replace('{extraRunas}', amount);
            }

            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 1800_000;

            await Promise.all([cooldown.save(), userProfile.save()]);

            const SuccessHuntEmbed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({
                    name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                })
                .setDescription(message)
            await interaction.editReply({ embeds: [SuccessHuntEmbed] });
        } catch (error) {
            console.error('Error al ejecutar el comando de cazar:', error);
        }
    },

    data: {
        name: 'cazar',
        description: 'Sal de cacería para derrotar enemigos y conseguir una gran cantidad de runas.',
    },
}
