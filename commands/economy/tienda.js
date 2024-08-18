const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const ShopItem = require('../../schemas/ShopItem');

module.exports = {
    run: async ({ interaction }) => {
        try {
            // Obtener todos los artículos de la tienda
            const items = await ShopItem.find();

            // Filtrar los artículos que tienen un stock mayor a 0
            const availableItems = items.filter(item => item.stock > 0);

            const sortedItems = availableItems.sort((a, b) => a.price - b.price);

            if (sortedItems.length === 0) {
                return interaction.reply({ content: 'No hay artículos disponibles en la tienda.', ephemeral: true });
            }

            // Crear el embed con los artículos disponibles
            const embed = new EmbedBuilder()
                .setColor('#b0875f')
                .setTitle('Artículos de la tienda')
                .setFooter({ text: 'Puedes utilizar el comando /información-objeto para ver más detalles.' })
                .setDescription(sortedItems.map(item => 
                    `<:Runa:1269384390614585416>${item.price} - ${item.name}` //\n${item.description}
                ).join('\n\n'));

            return interaction.reply({ embeds: [embed], ephemeral: false });

        } catch (error) {
            console.error('Error al mostrar la tienda:', error);
            return interaction.reply({ content: 'Hubo un error al abrir la tienda. Por favor, intenta de nuevo más tarde.', ephemeral: true });
        }
    },
    data: {
        name: 'tienda',
        description: 'Muestra los artículos disponibles en la tienda',
    },
};
