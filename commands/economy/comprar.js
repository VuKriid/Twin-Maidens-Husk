const ShopItem = require('../../schemas/ShopItem');
const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const UserProfile = require('../../schemas/UserProfile');
const Inventory = require('../../schemas/Inventory');

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isAutocomplete()) {
            const focusedOption = interaction.options.getFocused(true);

            // Manejador de autocompletar para el comando 'información-objeto'
            if (interaction.commandName === 'información-objeto' && focusedOption.name === 'nombre') {
                const searchTerm = focusedOption.value.toLowerCase();
                const items = await ShopItem.find().sort({ price: 1 }).exec();
                
                // Filtrar y limitar a 25 resultados
                const filteredItems = items
                    .filter(item => item.name.toLowerCase().includes(searchTerm))
                    .slice(0, 25)
                    .map(item => ({ name: item.name, value: item.name }));
                
                await interaction.respond(filteredItems);
            }

            // Manejador de autocompletar para otros comandos
            if (interaction.commandName === 'comprar' && focusedOption.name === 'nombre') {
                const searchTerm = focusedOption.value.toLowerCase();
                const items = await ShopItem.find({ stock: { $gt: 0 } }).sort({ price: 1 }).exec();
            
                // Filtrar y limitar a 25 resultados
                const filteredItems = items
                    .filter(item => item.name.toLowerCase().includes(searchTerm)) // Filtrar por el término de búsqueda
                    .slice(0, 25) // Limitar a 25 resultados
                    .map(item => ({ name: item.name, value: item.name }));
            
                await interaction.respond(filteredItems);
            }

            if (interaction.commandName === 'vender' && focusedOption.name === 'nombre') {
                const inventory = await Inventory.findOne({ userId: interaction.user.id });
            
                if (inventory && inventory.items && inventory.items.length > 0) {
                    const searchTerm = focusedOption.value.toLowerCase();
                    const filteredItems = inventory.items
                        .filter(item => item.name.toLowerCase().includes(searchTerm)) // Filtrar por el término de búsqueda
                        .slice(0, 25) // Limitar a 25 resultados
                        .map(item => ({
                            name: item.name,
                            value: item.name
                        }))
                        .filter(item => item.name && item.value); // Filtrar solo elementos válidos
            
                    if (filteredItems.length > 0) {
                        await interaction.respond(filteredItems);
                    } else {
                        await interaction.respond([{ name: 'No items found', value: 'no_items' }]);
                    }
                } else {
                    await interaction.respond([{ name: 'No items found', value: 'no_items' }]);
                }
            }

            if (interaction.commandName === 'dar-regalo' && focusedOption.name === 'nombre') {
                const inventory = await Inventory.findOne({ userId: interaction.user.id });
                
                if (inventory && inventory.items && inventory.items.length > 0) {
                    const filteredItems = inventory.items.map(item => ({
                        name: item.name,
                        value: item.name
                    })).filter(item => item.name && item.value); // Filtrar solo elementos válidos
            
                    if (filteredItems.length > 0) {
                        await interaction.respond(filteredItems);
                    } else {
                        await interaction.respond([{ name: 'No items found', value: 'no_items' }]);
                    }
                } else {
                    await interaction.respond([{ name: 'No items found', value: 'no_items' }]);
                }
            }

            if (interaction.commandName === 'crear-doncella' && focusedOption.name === 'personalidad') {
                // Lista de personalidades disponibles para autocompletar
                const personalidades = ['Seria', 'Formal', 'Enérgica', 'Fría', 'Amable', 'Lanzada', 'Tímida', 'Cariñosa'];
            
                const MaidenPersonality = personalidades.map(personalidad => ({
                    name: personalidad,
                    value: personalidad
                }));
            
                await interaction.respond(MaidenPersonality);
            }

            if (interaction.commandName === 'renacer-doncella' && focusedOption.name === 'personalidad') {
                // Lista de personalidades disponibles para autocompletar
                const personalidades = ['Seria', 'Formal', 'Enérgica', 'Fría', 'Amable', 'Lanzada', 'Tímida', 'Cariñosa'];
        
                const MaidenPersonality = personalidades.map(personalidad => ({
                    name: personalidad,
                    value: personalidad
                }));
            
                await interaction.respond(MaidenPersonality);
            }

            if (interaction.commandName === 'acción-doncella' && focusedOption.name === 'acción') {
                // Lista de personalidades disponibles para autocompletar
                const actions = ['Observar', 'Tomar de la Mano', 'Abrazar', 'Besar'];
        
                const MaidenAction = actions.map(action => ({
                    name: action,
                    value: action
                }));
            
                await interaction.respond(MaidenAction);
            }

            if (interaction.commandName === 'reparar-el-círculo' && focusedOption.name === 'era') {
                // Lista de personalidades disponibles para autocompletar
                const ages = ['Era de Fragilidad', 'Era del Orden Perfecto', 'Era de los Nacidos en la Oscuridad', 'Era de la Desesperación', 'Era del Caos', 'Era Estelar'];
        
                const AgeChoosen = ages.map(age => ({
                    name: age,
                    value: age
                }));
            
                await interaction.respond(AgeChoosen);
            }
            if (interaction.commandName === 'aumentar-atributo' && focusedOption.name === 'atributo') {
                // Lista de personalidades disponibles para autocompletar
                const stat = ['Ataque', 'Vitalidad', 'Precisión' , 'Evasión'];
        
                const statChoosen = stat.map(stat => ({
                    name: stat,
                    value: stat
                }));
            
                await interaction.respond(statChoosen);
            }
            // Añade más manejadores para otros comandos según sea necesario
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
    }
    });
module.exports = {
    run: async ({ interaction }) => {

        // Buscar el artículo en la tienda
        const availableItems = await ShopItem.find({ stock: { $gt: 0 } }).sort({ price: 1 });

        const itemName = interaction.options.getString('nombre');
        const quantity = interaction.options.getInteger('cantidad') || 1;
        const userId = interaction.user.id;

        // Buscar el artículo específico
        const item = availableItems.find(item => item.name === itemName);
        if (!item) {
            return interaction.reply({ 
                embeds: [createErrorEmbed('Fallo', `El artículo ${itemName} no existe en la tienda.`)], 
                ephemeral: true 
            });
        }

        // Verificar si hay suficiente stock
        if (item.stock < quantity) {
            return interaction.reply({ 
                embeds: [createErrorEmbed('Fallo', `No hay suficientes existencias de ${itemName}. Solo quedan ${item.stock} unidades.`)], 
                ephemeral: true 
            });
        }

        // Buscar el perfil del usuario
        let userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            userProfile = new UserProfile({ userId, inventory: [] });
        }

        // Verificar si el usuario tiene suficiente dinero
        const totalPrice = item.price * quantity;
        if (userProfile.balance < totalPrice) {
            return interaction.reply({ 
                embeds: [createErrorEmbed('Fallo', `No tienes suficientes runas para comprar ${quantity} unidades de ${itemName}. Necesitas <:Runa:1269384390614585416>${totalPrice} runas.`)], 
                ephemeral: true 
            });
        }

        // Buscar el inventario del usuario
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

        // Asegurarse de que el inventario del usuario esté inicializado correctamente
        if (!Array.isArray(userInventory.items)) {
            userInventory.items = [];
        }

        if (!item.stockable) {
            const existingItem = userInventory.items.find(i => i.name === itemName);
            if (existingItem) {
                return interaction.reply({ 
                    embeds: [createErrorEmbed('Fallo', `No puedes comprar más de un ${itemName} porque no es un artículo acumulable y ya tienes uno en tu inventario.`)], 
                    ephemeral: true 
                });
            }
            if (quantity > 1) {
                return interaction.reply({ 
                    embeds: [createErrorEmbed('Fallo', `Solo puedes comprar una unidad de ${itemName} porque no es un artículo acumulable.`)], 
                    ephemeral: true 
                });
            }
        }

        const requirements = item.requirements || [];

        for (const req of requirements) {
            const userItem = userInventory.items.find(i => i.name === req.itemName);
            if (!userItem || userItem.quantity < req.quantity * quantity) {
                return interaction.reply({ 
                    embeds: [createErrorEmbed('Fallo', `No tienes los objetos requeridos para comprar ${quantity} unidades de ${itemName}. Necesitas ${req.quantity * quantity} unidades de ${req.itemName}.`)], 
                    ephemeral: true 
                });
            }
        }

        // Consumir los requisitos del inventario del usuario
        for (const req of requirements) {
            const userItem = userInventory.items.find(i => i.name === req.itemName);
            if (userItem) {
                userItem.quantity -= req.quantity * quantity;
                if (userItem.quantity <= 0) {
                    userInventory.items = userInventory.items.filter(i => i.name !== req.itemName);
                }
            }
        }

        // Actualizar el stock del artículo
        item.stock -= quantity;
        await item.save();

        // Actualizar el balance del usuario
        userProfile.balance -= totalPrice;

        // Añadir el artículo al inventario del usuario
        const existingItem = userInventory.items.find(i => i.name === itemName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            userInventory.items.push({ name: itemName, quantity, description: item.description, usable: item.usable });
        }

        await userProfile.save();
        await userInventory.save();

        return interaction.reply({ 
            embeds: [createSuccessEmbed(interaction.user.tag, interaction.user.avatarURL(), quantity, itemName, totalPrice)], 
            ephemeral: false 
        });
    },

    data: {
        name: 'comprar',
        description: 'Compra un artículo de la tienda',
        options: [
            {
                name: 'nombre',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre del artículo',
                required: true,
                autocomplete: true,
            },
            {
                name: 'cantidad',
                type: ApplicationCommandOptionType.Integer,
                description: 'Cantidad a comprar',
                required: false,
            }
        ]
    }
};

// Funciones auxiliares para crear embeds
function createErrorEmbed(title, description) {
    return new EmbedBuilder()
        .setColor('#b0875f')
        .setTitle(title)
        .setDescription(description);
}

function createSuccessEmbed(userTag, userAvatarURL, quantity, itemName, totalPrice) {
    return new EmbedBuilder()
        .setColor('#b0875f')
        .setAuthor({
            name: userTag, iconURL: userAvatarURL,
        })
        .setDescription(`Has comprado ${quantity} unidades de ${itemName} por <:Runa:1269384390614585416>${totalPrice} runas.`);
}

// Inicia el cliente de Discord
client.login(process.env.TOKEN);
