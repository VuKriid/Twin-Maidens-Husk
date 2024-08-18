const Inventory = require('../../schemas/Inventory');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    run: async ({ interaction }) => {
        await interaction.deferReply();

        const user = interaction.options.getUser('usuario') || interaction.user;
        const userId = user.id;
        let userInventory = await Inventory.findOne({ userId });

        if (!userInventory) {
            userInventory = new Inventory({ userId });
            await userInventory.save();
        }

        const InventoryEmbed = new EmbedBuilder()
            .setColor('#b0875f')
            .setTitle('Inventario')
            .setAuthor({
                name: `${user.tag}`, iconURL: user.avatarURL(),
            });

        if (userInventory.items.length > 0) {
            const fields = userInventory.items.map(item => ({
                name: `${item.quantity} - ${item.name}`,
                value: `${item.description}`, // Esto añade un espacio en blanco como valor
                inline: false
            }));
            InventoryEmbed.addFields(fields);
        } else {
            InventoryEmbed.setDescription('Vacío');
        }

        await interaction.editReply({ embeds: [InventoryEmbed] });
    },

    data: {
        name: 'inventario',
        description: 'Muestra tu inventario.',
        options: [
            {
                name: 'usuario',
                description: 'A quien le pertenece el inventario que se mostrará.',
                type: ApplicationCommandOptionType.User,
            }
        ]
    },
};
