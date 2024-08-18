const Maiden = require('../../schemas/Maiden');
const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });



client.on('interactionCreate', async (interaction) => {
    if (interaction.isAutocomplete()) {
        const focusedOption = interaction.options.getFocused(true);

        // Manejador de autocompletar para el comando 'ver-doncella'
        if (interaction.commandName === 'ver-doncella' && focusedOption.name === 'nombre') {
            const maidens = await Maiden.find();

            // Filtrar los resultados según lo que el usuario ha escrito
            const filtered = maidens
                .filter(maiden => maiden.name.toLowerCase().includes(focusedOption.value.toLowerCase()))
                .map(maiden => ({
                    name: maiden.name,
                    value: maiden.name // O cualquier otro identificador único
                }));

            await interaction.respond(filtered);
        }
    }
});



module.exports = {
    run: async ({ interaction }) => {
        try {
            
            const home = await Maiden.find()
            const MaidenName = interaction.options.getString('nombre');
            const userId = interaction.user.id;           

            const maiden = home.find(maiden => maiden.name === MaidenName);
            if (!maiden) {
                return interaction.reply({ 
                    content: (`La doncella ${MaidenName} no existe.`), 
                    ephemeral: true 
                });
            }

            const guild = interaction.guild || message.guild;
            let ownerNick = 'sin nombre';
            const owner = await guild.members.fetch(maiden.ownerId);
                if (owner) {
                    ownerNick = owner.nickname || owner.user.globalName;
                }

            const ViewMaidenEmbed = new EmbedBuilder()
                .setColor('#b0875f')
                .setTitle(`Doncella ${MaidenName}`)
                .setDescription(`Doncella de dedo al servicio del Sin Luz ${ownerNick}.`)
                .setImage(`${maiden.image}`)
                .addFields(
                    { name: 'Personalidad', value: `${maiden.personality}`, inline: true },                    
                    { name: 'Afecto', value: `${maiden.affect}`, inline: true },
                );

            return interaction.reply({ embeds: [ViewMaidenEmbed], ephemeral: false });
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);
            return interaction.reply({ 
                content: ('Error al usar el comando'), 
                ephemeral: true 
            });
        }
    },
    data: {
        name: 'ver-doncella',
        description: 'Ve información sobre la doncella de un Sin Luz.',
        options: [
            {
                name: 'nombre',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre de la doncella',
                required: true,
                autocomplete: true,
            },
        ]
    }
};
client.login(process.env.TOKEN);
