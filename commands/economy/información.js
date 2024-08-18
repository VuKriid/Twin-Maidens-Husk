const ShopItem = require('../../schemas/ShopItem');
const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

module.exports = {
    run: async ({ interaction }) => {
        try {
            const availableItems = await ShopItem.find();
            const itemName = interaction.options.getString('nombre');
            const userId = interaction.user.id;

            const item = availableItems.find(item => item.name === itemName);
            if (!item) {
                return interaction.reply({ 
                    embeds: [createErrorEmbed('Fallo', `El artículo ${itemName} no existe.`)], 
                    ephemeral: true 
                });
            }

            const stockable = item.stockable === true ? 'Sí' : 'No';
            let requirements = 'Ninguno';
            if (Array.isArray(item.requirements) && item.requirements.length > 0) {
                requirements = item.requirements.map(req => `${req.itemName} x${req.quantity}`).join('\n');
            }

            const embed = new EmbedBuilder()
                .setColor('#b0875f')
                .setTitle(`${item.name}`)
                .setDescription(`${item.description}`)
                .setThumbnail(`${item.image}`)
                .addFields(
                    { name: 'Precio', value: `<:Runa:1269384390614585416>${item.price}`, inline: true },                    
                    { name: 'Acumulable', value: `${stockable}`, inline: true },
                    { name: 'Existencias en tienda', value: `${item.stock}`, inline: true },
                    { name: 'Requisitos para comprar', value: `${requirements}` },
                );

            return interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);
            return interaction.reply({ 
                content: ('Error', 'Hubo un problema al ejecutar el comando.'), 
                ephemeral: true 
            });
        }
    },
    data: {
        name: 'información-objeto',
        description: 'Ve información sobre un articulo.',
        options: [
            {
                name: 'nombre',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre del artículo',
                required: true,
                autocomplete: true,
            },
        ]
    }
};
