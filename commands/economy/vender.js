const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const ShopItem = require('../../schemas/ShopItem');
const Inventory = require('../../schemas/Inventory');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
    run: async ({ interaction }) => {
        const itemName = interaction.options.getString('nombre');
        const ItemQuantity = interaction.options.getString('cantidad') || 1;
        const userId = interaction.user.id;
        const inventory = await Inventory.findOne({ userId: interaction.user.id });
        const item = inventory.items.find(i => i.name === itemName);
        

        let userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            userProfile = new UserProfile({ userId, inventory: [] });
        }

        let userInventory;
        try {
            userInventory = await Inventory.findOne({ userId }).exec();
            if (!userInventory) {
                userInventory = new Inventory({ userId, items: [] });
            }
        } catch (error) {
            console.error('Error al buscar el inventario del usuario:', error);
            return interaction.reply({ content: 'Hubo un error al buscar tu inventario. Por favor, intenta de nuevo más tarde.', ephemeral: true });
        }
        
        let quantity = 0;
        if (ItemQuantity === 'todo') {
            quantity = item.quantity;
        } else {
            quantity = ItemQuantity
        }


        if (isNaN(quantity) || quantity <= 0) {
            return interaction.reply({ content: 'La cantidad debe ser un número positivo.', ephemeral: true });
        }

        try {
            // Obtener el precio del objeto en la tienda
            const shopItem = await ShopItem.findOne({ name: itemName });
            if (!shopItem) {
                return interaction.reply({ content: 'El objeto no existe.', ephemeral: true });
            }

            // Calcular el precio con descuento
            const discountedPrice = parseInt(shopItem.price * 0.85);

            const totalPrice = discountedPrice * quantity;

            // Obtener el inventario del usuario
            const inventory = await Inventory.findOne({ userId: interaction.user.id });
            if (!inventory) {
                return interaction.reply({ content: 'No tienes un inventario.', ephemeral: true });
            }

            // Encontrar el objeto en el inventario
            const item = inventory.items.find(i => i.name === itemName);
            if (!item || item.quantity < quantity) {
                return interaction.reply({ content: 'No tienes suficiente cantidad de ese objeto en tu inventario.', ephemeral: true });
            }

            // Eliminar la cantidad del inventario
            item.quantity -= quantity;
            if (item.quantity === 0) {
                inventory.items = inventory.items.filter(i => i.name !== itemName);
            }

            await inventory.save();

            userProfile.balance += totalPrice;
            await userProfile.save();

            // Crear un embed para confirmar la venta
            const embed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({
                    name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                })
                .setDescription(`Has vendido ${quantity} ${itemName}(s) por <:Runa:1269384390614585416>${totalPrice} runas.`);

            return interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error('Error al procesar la venta:', error);
            return interaction.reply({ content: 'Hubo un error al procesar la venta. Por favor, intenta de nuevo más tarde.', ephemeral: true });
        }
    },
    data: {
        name: 'vender',
        description: 'Vende un objeto del inventario.',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'nombre',
                description: 'Nombre del artículo se desea vender',
                required: true,
                autocomplete: true,
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'cantidad',
                description: 'Cantidad del artículo que deseas vender',
                required: false,
            },
        ],
    },
};
