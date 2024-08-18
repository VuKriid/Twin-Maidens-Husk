const Cooldown = require('../../schemas/Cooldown');
const { EmbedBuilder } = require('discord.js');
const Inventory = require('../../schemas/Inventory');
const ShopItem = require('../../schemas/ShopItem');

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

            const commandName = 'descansar';
            const userId = interaction.user.id;

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');
                const FailRestEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Ya has descansado, inténtalo de nuevo en ${prettyMs(cooldown.endsAt - Date.now())}.`)
                interaction.reply({ embeds: [FailRestEmbed] });
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

            const availableItems = await ShopItem.find({ stock: { $gt: 0 } }).sort({ price: 1 });
            const item = availableItems.find(item => item.name === 'Vial de Lágrimas');
            const userInventory = await Inventory.findOne({ userId });
            const existingItem = userInventory.items.find(i => i.name === 'Vial de Lágrimas');
            if (existingItem) {
                if (existingItem.quantity < 4) {
                    existingItem.quantity = 4;  // Ajusta a 4 si es menor
                }
            } else {
                userInventory.items.push({ name: 'Vial de Lágrimas', quantity: 3, description: item.description, usable: item.usable });
            }
            await userInventory.save();
            cooldown.endsAt = Date.now() + 10800_000;

            await Promise.all([cooldown.save()]);

            const RestEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Has descansado y se restablecieron tus Viales de Lágrimas.`)
                interaction.reply({ embeds: [RestEmbed] });

        } catch (error) {
            console.error(error)
        }
    },
    data: {
        name: 'descansar',
        description: 'Descansa frente a la Gracia para recuperar Viales de Lágrimas y restablecer los tiempos de recarga.'
    },
}