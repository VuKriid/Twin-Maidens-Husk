const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const Maiden = require('../../schemas/Maiden');
const statsAvailable = [
    { name: 'Ataque', key: 'attack' },
    { name: 'Vitalidad', key: 'vitality' },
    { name: 'Evasión', key: 'evasion' },
    { name: 'Precisión', key: 'accuracy' },
];
module.exports = {
    run: async ({ interaction }) => {
        try {
            const userId = interaction.user.id;
            const statName = interaction.options.getString('atributo');
            const statAmount = interaction.options.getInteger('cantidad') || 1;
            const statChoosen = statsAvailable.find(a => a.name === statName);
            if (!statChoosen) {
                interaction.reply({
                    content: "Atributo no válida.",
                    ephemeral: true,
                });
                return;
            }

            const maiden = await Maiden.findOne({ ownerId: userId });
            if (!maiden) {
                interaction.reply({
                    content: "Solo puedes aumentar tus atributos con la ayuda de una Doncella de Dedo.",
                    ephemeral: true,
                });
                return;
            }

            let userProfile = await UserProfile.findOne({ userId }).select('userId balance health defeatedBosses stats');
            if (!userProfile) {
                userProfile = new UserProfile({
                    userId,
                    balance: 0,
                    health: 100,
                    defeatedBosses: [],
                    stats: {
                        level: 1,
                        vitality: 1,
                        attack: 1,
                        evasion: 1,
                        accuracy: 1,
                    },
                });
                await userProfile.save();
            } else if (!userProfile.defeatedBosses) {
                userProfile.defeatedBosses = [];
                await userProfile.save(); // Guardar inmediatamente si defeatedBosses estaba undefined
            }

            const currentLevel = (userProfile.stats && userProfile.stats.level) ? userProfile.stats.level : 1;
            const level = currentLevel

            
            function calculateTotalCost(currentLevel, statAmount) {
                let totalCost = 0;
                for (let i = 0; i < statAmount; i++) {
                    let level = currentLevel + i;
                    let cost = Math.floor(Math.pow(level, 1.5) * 500);
                    totalCost += cost;
                }
                return totalCost;
            }
            const cost = calculateTotalCost(currentLevel, statAmount);

            if (userProfile.balance < cost) {
                interaction.reply({
                    content: `No cuentas con las runas necesarias para aumentar tus atributos, necesitas <:Runa:1269384390614585416>${cost}`,
                    ephemeral: true,
                });
                return;
            }

            userProfile.stats[statChoosen.key] += statAmount;
            userProfile.stats.level += statAmount; 
            userProfile.balance -= cost;
            userProfile.markModified('stats'); 
            await userProfile.save();

            const LevelUpEmbed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`Has aumentado tu ${statChoosen.name} en ${statAmount} utilizando <:Runa:1269384390614585416>${cost} runas.`);

            interaction.reply({ embeds: [LevelUpEmbed] });
        } catch (error) {
            console.error('Error en el comando aumentar-atributo:', error.stack);
            await interaction.reply({
                content: 'Ocurrió un error al intentar aumentar el atributo. Por favor, intenta nuevamente más tarde.',
                ephemeral: true,
            });
        }
    },

    data: {
        name: 'aumentar-atributo',
        description: 'Aumenta alguno de tus atributos a cambio de runas y con la ayuda de tu Doncella de Dedo.',
        options: [
            {
                name: 'atributo',
                type: ApplicationCommandOptionType.String,
                description: 'Atributo que se aumentará',
                required: true,
                autocomplete: true,
            },
            {
                name: 'cantidad',
                type: ApplicationCommandOptionType.Integer,
                description: 'Numero de veces que aumentas el atributo.',
                required: false
            }
        ]
    },
};