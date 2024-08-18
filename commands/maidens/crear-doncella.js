const Maiden = require('../../schemas/Maiden');
const { Client, GatewayIntentBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

module.exports = {
    run: async ({ interaction }) => {
        const owner = interaction.options.getUser('dueño');
        const ownerId = owner.id
        const name = interaction.options.getString('nombre');
        const MaidPersonality = interaction.options.getString('personalidad');
        const image = interaction.options.getString('imagen') || '-';
        
        const personality = MaidPersonality || 'Non';

        try {
            const existingMaiden = await Maiden.findOne({ name });
            if (existingMaiden) {
                return interaction.reply({ content: `La doncella con el nombre "${name}" ya existe en posesión de otro Sin Luz.`, ephemeral: true });
            }
        
            const newMaiden = new Maiden({ 
                ownerId, 
                name, 
                personality, 
                image,
            });

            await newMaiden.save();

            const roleId = '1271589545825144843';
            const SroleId = '1267589562629226649';
            const member = owner;
            await member.roles.add(roleId);
            await member.roles.remove(SroleId);
            
            const newMaidenEmbed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({
                    name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                })
                .setTitle('Nueva doncella de dedo')
                .setImage(`${image}`)
                .setDescription(`La doncella ${name} ha sido creada para servir al Sin Luz ${owner.globalName}.`);
                
            interaction.reply( {embeds: [newMaidenEmbed]});
        } catch (error) {
            console.error('Error al ejecutar el comando de crear doncella:', error);
            interaction.reply({
                content: 'Hubo un error al intentar crear la doncella. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        }
    },
    data: {
        name: 'crear-doncella',
        description: 'Crea una doncella para un Sin Luz.',
        dm_permission: true,
        
        options: [
            {
                name: 'dueño',
                type: ApplicationCommandOptionType.User,
                description: 'Nombre del usuario a quien pertenecerá la doncella.',
                required: true,
            },
            {
                name: 'nombre',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre de la doncella.',
                required: true,
            },
            {
                name: 'personalidad',
                type: ApplicationCommandOptionType.String,
                description: 'Personalidad de la doncella.',
                required: true,
            },
            {
                name: 'imagen',
                type: ApplicationCommandOptionType.String,
                description: 'Imagen de la doncella.',
                required: true,
            },
        ]
    }
}
