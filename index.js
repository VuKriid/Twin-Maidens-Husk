require('dotenv/config');
require('./cronJobs');
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const mongoose = require('mongoose');
const keepAlive = require('./server')
const path = require('path');

const client = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

new CommandHandler({
    client,
    eventsPath: path.join(__dirname, 'events'),
    commandsPath: path.join(__dirname, 'commands'),
});
/*
client.once('ready', async () => {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        // Reemplaza 'YOUR_GUILD_ID' con el ID de tu servidor
        const guildId = '1266829535840571464';

        console.log('Eliminando comandos de servidor...');
        await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
            body: [], // Esto eliminará todos los comandos del servidor
        });
        console.log('Comandos del servidor eliminados exitosamente.');

        // Si también necesitas eliminar comandos globales, descomenta la siguiente sección:
        
        console.log('Eliminando comandos globales...');
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: [], // Esto eliminará todos los comandos globales
        });
        console.log('Comandos globales eliminados exitosamente.');
        
    } catch (error) {
        console.error('Error al eliminar comandos:', error);
    }
});
*/

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a la base de datos.");

    keepAlive()
    client.login(process.env.TOKEN);
})();