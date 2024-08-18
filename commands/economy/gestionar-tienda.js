const ShopItem = require('../../schemas/ShopItem');
const { Client, GatewayIntentBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });



module.exports = {
    run: async ({ interaction }) => {
        const name = interaction.options.getString('nombre');
        const price = interaction.options.getNumber('precio');
        const stock = interaction.options.getInteger('existencias');
        const description = interaction.options.getString('descripción') || '-';
        const image = interaction.options.getString('imagen') || '-';
        const usable = interaction.options.getBoolean('usable');
        const stockable = interaction.options.getBoolean('stockable');
        const requirements1 = {
            itemName: interaction.options.getString('requisito_nombre_1'),
            quantity: interaction.options.getInteger('requisito_cantidad_1')
        };
        const requirements2 = {
            itemName: interaction.options.getString('requisito_nombre_2'),
            quantity: interaction.options.getInteger('requisito_cantidad_2')
        };
        const requirements3 = {
            itemName: interaction.options.getString('requisito_nombre_3'),
            quantity: interaction.options.getInteger('requisito_cantidad_3')
        };

        const existingItem = await ShopItem.findOne({ name });
        if (existingItem) {
            return interaction.reply({ content: `El artículo con el nombre "${name}" ya existe en la tienda.`, ephemeral: true });
        }
    
        const requirements = [requirements1, requirements2, requirements3].filter(req => req.itemName && req.quantity !== null);
        const newItem = new ShopItem({ 
            name, 
            price, 
            stock, 
            description, 
            image,
            usable,
            stockable,
            requirements
        });

        await newItem.save();

        // Ordenar los artículos por precio
        const items = await ShopItem.find().sort({ price: 1 });

        // Sobrescribir la colección con los artículos ordenados
        for (let i = 0; i < items.length; i++) {
            await ShopItem.updateOne({ _id: items[i]._id }, { $set: { order: i + 1 } });
        }

        const successEmbed = new EmbedBuilder()
            .setColor('#b0875f')
            .setAuthor({
                name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
            })
            .setDescription(`${stock} ${name} añadidos a la tienda con un precio de <:Runa:1269384390614585416>${price} runas.`);
        interaction.reply( {embeds: [successEmbed]});
    },
    data: {
        name: 'añadir-articulo',
        description: 'Añade un artículo a la tienda',
        dm_permission: true,
        options: [
            {
                name: 'nombre',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre del artículo',
                required: true,
            },
            {
                name: 'precio',
                type: ApplicationCommandOptionType.Number,
                description: 'Precio del artículo',
                required: true,
            },
            {
                name: 'existencias',
                type: ApplicationCommandOptionType.Integer,
                description: 'Cantidad en existencia',
                required: true,
            },
            {
                name: 'usable',
                type: ApplicationCommandOptionType.Boolean,
                description: 'Determina si se puede usar o no',
                required: true,
            },
            {
                name: 'stockable',
                type: ApplicationCommandOptionType.Boolean,
                description: 'Determina si se puede acumular en el inventario o no',
                required: true,
            },
            {
                name: 'descripción',
                type: ApplicationCommandOptionType.String,
                description: 'Descripción del articulo',
                required: false,
            },
            {
                name: 'imagen',
                type: ApplicationCommandOptionType.String,
                description: 'Imagen del articulo',
                required: false,
            },
            {
                name: 'requisito_nombre_1',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre del artículo requerido',
                autocomplete: true,
                required: false,
            },
            {
                name: 'requisito_cantidad_1',
                type: ApplicationCommandOptionType.Integer,
                description: 'Cantidad del artículo requerido',
                required: false,
            },
            {
                name: 'requisito_nombre_2',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre del artículo requerido',
                autocomplete: true,
                required: false,
            },
            {
                name: 'requisito_cantidad_2',
                type: ApplicationCommandOptionType.Integer,
                description: 'Cantidad del artículo requerido',
                required: false,
            },
            {
                name: 'requisito_nombre_3',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre del artículo requerido',
                autocomplete: true,
                required: false,
            },
            {
                name: 'requisito_cantidad_3',
                type: ApplicationCommandOptionType.Integer,
                description: 'Cantidad del artículo requerido',
                required: false,
            }
        ]
    }
}

client.login(process.env.TOKEN);
