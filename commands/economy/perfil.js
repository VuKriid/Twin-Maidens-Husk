const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const Maiden = require('../../schemas/Maiden');
const Inventory = require('../../schemas/Inventory');

module.exports = {
    run: async ({ interaction }) => {
        try {
            if (!interaction.inGuild()) {
                interaction.reply({
                    content: "Este comando solo puede ser ejecutado en la Mesa Redonda.",
                    ephemeral: true,
                });
                return;
            }
    
            const targetUser = interaction.options.getUser('usuario') || interaction.user;
            const targetUserId = targetUser.id
            const maiden = await Maiden.findOne({ ownerId: targetUserId });
            const MaidenName = maiden ? (maiden.name ?? 'Sin Doncella') : 'Sin Doncella';
    
            const guild = interaction.guild || message.guild;
                let ownerNick = 'sin nombre';
                const owner = await guild.members.fetch(targetUserId);
                    if (owner) {
                        ownerNick = owner.nickname || owner.user.globalName;
                    }
            
            await interaction.deferReply();
            
            
            try {
                let userProfile = await UserProfile.findOne({ userId: targetUserId });
    
                if (!userProfile) {
                    userProfile = new UserProfile({ userId: targetUserId });
                }
                const stats = userProfile.stats
                const cost = Math.floor(Math.pow(stats.level, 1.5) * 500);

                let userInventory = await Inventory.findOne({ userId: targetUserId });

                if (!userInventory) {
                    userInventory = new Inventory({ userId: targetUserId });
                    await userInventory.save();
                }

                const getArmorLevel = (inventory) => {
                    let ArmorLevel = 'Sin Armadura';
                    if (!inventory) return ArmorLevel;
                    const armor = inventory.items.find(item => item.name.startsWith('Armadura'));
                    if (armor) {
                        if (armor.name === 'Armadura') ArmorLevel = 'Armadura (+15%)';
                        if (armor.name === 'Armadura +1') ArmorLevel = 'Armadura +1 (+30%)';
                        if (armor.name === 'Armadura +2') ArmorLevel = 'Armadura +2 (+45%)';
                        if (armor.name === 'Armadura +3') ArmorLevel = 'Armadura +3 (+60%)';
                    }
                    return ArmorLevel;
                };
                const neggateDamage = getArmorLevel(userInventory);

                const getSwordLevel = (inventory) => {
                    let SwordLevel = 'Sin Espada';
                    if (!inventory) return SwordLevel;
                    const sword = inventory.items.find(item => item.name.startsWith('Espada'));
                    if (sword) {
                        if (sword.name === 'Espada') SwordLevel = 'Espada (+10%)';
                        if (sword.name === 'Espada +1') SwordLevel = 'Espada +1 (+20%)';
                        if (sword.name === 'Espada +2') SwordLevel = 'Espada +2 (+30%)';
                        if (sword.name === 'Espada +3') SwordLevel = 'Espada +3 (+40%)';
                        if (sword.name === 'Espada +4') SwordLevel = 'Espada +4 (+50%)';
                    }
                    return SwordLevel;
                };
                const SwordPower = getSwordLevel(userInventory);
    
                const OtherBalanceEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setTitle(ownerNick)
                    .setThumbnail(targetUser.avatarURL())
                    .addFields(
                        { name: 'Runas', value: `<:Runa:1269384390614585416>${userProfile.balance}`, inline: true },
                        { name: 'Doncella', value: MaidenName, inline: true  },
                        { name: `Nivel: ${stats.level}`, value: `Ataque: ${stats.attack}\nVitalidad: ${stats.vitality}\nEvasión: ${stats.evasion}\nPrecisión: ${stats.accuracy}`},
                        { name: 'Equipo:', value: `${SwordPower}\n${neggateDamage}`, inline: true },
                        { name: `Siguiente Nivel:`, value: `<:Runa:1269384390614585416>${cost} runas.` }
                    )
                    .setDescription(`Sin Luz de la Mesa Redonda.`);
    
                interaction.editReply(
                    {embeds: [OtherBalanceEmbed]}
                )
            } catch (error) {
                console.error('Error al ejecutar el comando de saldo:', error);
                interaction.editReply({
                    content: 'Hubo un error al intentar obtener buscar el perfil. Por favor, inténtalo de nuevo más tarde.',
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.error(error)
        }
    },

    data: {
        name: 'perfil',
        description: 'Comprueba el perfil de un Sin Luz de la Mesa Redonda.',
        options: [
            {
                name: 'usuario',
                description: 'A quien le pertenece el perfil que se mostrará.',
                type: ApplicationCommandOptionType.User,
            }
            
        ]
    },
};
