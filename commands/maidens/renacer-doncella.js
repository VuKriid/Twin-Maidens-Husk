const Maiden = require('../../schemas/Maiden');
const Inventory = require('../../schemas/Inventory');
const { Client, GatewayIntentBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

module.exports = {
    run: async ({ interaction }) => {
        const owner = interaction.user;
        const userId = owner.id;
        const ownerId = owner.id;
        const name = interaction.options.getString('nombre');
        const MaidPersonality = interaction.options.getString('personalidad');
        const image = interaction.options.getString('imagen') || '-';
        
        const personality = MaidPersonality || 'Non';

        const userInventory = await Inventory.findOne({ userId });
        if (!userInventory) {
            return interaction.reply({ content: 'No se encontró un inventario.', ephemeral: true });
        }
        if (userInventory.items.find(item => item.name === 'Gran Runa de los Nonatos')) {
            
        } else {
            return interaction.reply({ content: 'No cuentas con la Gran Runa de los Nonatos como para renacer a tu doncella', ephemeral: true })
        }
        if (userInventory.items.find(item => item.name === 'Lágrima Larvaria')) {
            
        } else {
            return interaction.reply({ content: 'No cuentas con una Lágrima Larvaria como para renacer a tu doncella', ephemeral: true })
        }

        const existingOwner = await Maiden.findOne({ ownerId });
        if (!existingOwner) {
            return interaction.reply({ content: 'Actualmente no cuentas con una Doncella de Dedo.', ephemeral: true });
        }

        const existingMaiden = await Maiden.findOne({ name });
        if (existingMaiden) {
            return interaction.reply({ content: `La doncella con el nombre "${name}" ya existe en posesión de otro Sin Luz.`, ephemeral: true });
        }

        if (name) {
            Maiden.name = name
        }
        if (MaidPersonality) {
            Maiden.personality = MaidPersonality
        }
        if (image) {
            Maiden.image = image
        }

        inventory.items = inventory.items.filter(i => i.name !== 'Lágrima Larvaria');
        await Inventory.save();

        await Maiden.save();
        
        const newMaidenEmbed = new EmbedBuilder()
            .setColor('#b0875f')
            .setAuthor({
                name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
            })
            .setTitle('Doncella de Dedo renacida')
            .setImage(`${image}`)
            .setDescription(`${name} ha renacido gracias al poder de la Gran Runa de los Nonatos.`);
            
        interaction.reply( {embeds: [newMaidenEmbed]});
    },
    data: {
        name: 'renacer-doncella',
        description: 'Utiliza la Gran Runa de los Nonatos para hacer renacer a tu Doncella de Dedo.',
        dm_permission: true,
        
        options: [
            {
                name: 'nombre',
                type: ApplicationCommandOptionType.String,
                description: 'Nuevo nombre de la doncella.',
                required: false,
            },
            {
                name: 'personalidad',
                type: ApplicationCommandOptionType.String,
                description: 'Nueva personalidad de la doncella. Elige una de las opciones.',
                required: false,
                autocomplete: true,
            },
            {
                name: 'imagen',
                type: ApplicationCommandOptionType.String,
                description: 'Nueva imagen URL de la doncella.',
                required: false,
            },
        ]
    }
}
