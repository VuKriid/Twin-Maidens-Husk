const Maiden = require('../../schemas/Maiden');
const Inventory = require('../../schemas/Inventory');
const { Client, GatewayIntentBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });



  const nameLibrary = [
    'Ava', 'Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Evelyn', 'Abigail',
    'Ella', 'Harper', 'Scarlett', 'Grace', 'Chloe', 'Camila', 'Aria', 'Aurora', 'Riley', 'Zoey',
    'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Avery', 'Sofia', 'Camila', 'Stella',
    'Natalie', 'Zoe', 'Mila', 'Isla', 'Aubrey', 'Ellie', 'Aurora', 'Skylar', 'Luna', 'Nina',
    'Lucy', 'Paisley', 'Everly', 'Anna', 'Caroline', 'Nova', 'Genesis', 'Emilia', 'Maya', 'Gracie',
    'Delilah', 'Leah', 'Samantha', 'Hannah', 'Sarah', 'Sadie', 'Alexa', 'Ariana', 'Alice', 'Ruby',
    'Eva', 'Serenity', 'Willow', 'Ariana', 'Ivy', 'Naomi', 'Eliana', 'Piper', 'Riley', 'Mackenzie',
    'Eden', 'Kylie', 'Raelynn', 'Emery', 'Margaret', 'Lydia', 'Jasmine', 'Brielle', 'Serena', 'Adeline',
    'Cora', 'Mila', 'Ophelia', 'Cora', 'Gianna', 'Sophie', 'Maddison', 'Sienna', 'Arianna', 'Peyton',
    'Rosalie', 'Bailey', 'Kennedy', 'Ruby', 'Arianna', 'Quinn', 'London', 'Samantha', 'Jade', 'Addison',
    'Zara', 'Everly', 'Charley', 'Maggie', 'Macy', 'Mila', 'Layla', 'Emily', 'Violet', 'Josephine',
    'Alyssa', 'Jordyn', 'Isabella', 'Madeline', 'Delilah', 'Juliet', 'Sabrina', 'Elena', 'Melody', 'Amaya',
    'Daisy', 'Alaina', 'Brianna', 'Evelyn', 'Hazel', 'Elena', 'Jasmine', 'Juliana', 'Iris', 'Alexis',
    'Nora', 'Willow', 'Hazel', 'Kinsley', 'Laila', 'Leilani', 'Juliette', 'Evelyn', 'Clara', 'Ada',
    'Vivian', 'Mariana', 'Rosalyn', 'Natalia', 'Vivienne', 'Zoe', 'Sienna', 'Adeline', 'Reagan', 'Stella',
    'Athena', 'Eliza', 'Ariella', 'Alyssa', 'Kylie', 'Brooklyn', 'Alexandra', 'Rachel', 'Camila', 'Jasmine',
    'Lila', 'Callie', 'Fiona', 'Gianna', 'Alicia', 'Kate', 'Aurora', 'Brielle', 'Riley', 'Amara',
    'Sarah', 'Nora', 'Sophia', 'Ellie', 'Hazel', 'Mia', 'Aurora', 'Luna', 'Paisley', 'Ruby',
    'Reagan', 'Adeline', 'Kennedy', 'Stella', 'Willow', 'Madeline', 'Nina', 'Clara', 'Jade', 'Margaret',
    'Katherine', 'Sophie', 'Emilia', 'Emery', 'Anna', 'Maya', 'Kylie', 'Isabelle', 'Hannah', 'Charlotte',
    'Riley', 'Samantha', 'Mackenzie', 'Zoey', 'Brianna', 'Kinsley', 'Violet', 'Jordyn', 'Eleanor', 'Jasmine',
    'Sophie', 'Eliana', 'Lydia', 'Riley', 'Arianna', 'Vivian', 'Piper', 'Ruby', 'Lila', 'Rosalie',
    'Adalynn', 'Maeve', 'Savannah', 'Ivy', 'Gianna', 'Diana', 'Riley', 'Paige', 'Natalie', 'Peyton',
    'Alexis', 'Eliana', 'Zoe', 'Ariella', 'Skylar', 'Aubrey', 'Everly', 'Mila', 'Mackenzie', 'Nora',
    'Leah', 'Alyssa', 'Serenity', 'Raelynn', 'Autumn', 'Isabelle', 'Delilah', 'Juliette', 'Daisy', 'Sophie'
  ];

  const personalities = ['Seria', 'Formal', 'Enérgica', 'Fría', 'Amable', 'Lanzada', 'Tímida', 'Cariñosa']

  function getRandomName() {
    const randomIndex = Math.floor(Math.random() * nameLibrary.length);
    return nameLibrary[randomIndex];
  }

  function getRandomPersonality() {
    const randomIndex = Math.floor(Math.random() * personalities.length);
    return personalities[randomIndex];
  }

module.exports = {
    run: async ({ interaction }) => {
      try {
        const owner = interaction.user;
        const userId = owner.id;
        const ownerId = owner.id;
        const image = 'https://media.discordapp.net/attachments/1267599517142745269/1273869661200711700/FSxFX3TWYAAaIHi.png?ex=66c02f12&is=66bedd92&hm=f5c5e12eee9ef962aff5f82979330fdbbe2543539508ecc49685b2ec853cd436&=&format=webp&quality=lossless&width=348&height=437';
        

        const userInventory = await Inventory.findOne({ userId });
        if (!userInventory) {
            return interaction.reply({ content: 'No se encontró un inventario.', ephemeral: true });
        }
        if (userInventory.items.find(item => item.name === 'Imitación de la Gracia')) {
            
        } else {
            return interaction.reply({ content: 'No cuentas con una Imitación de Gracia para poder buscar a tu doncella', ephemeral: true })
        }

        const existingOwner = await Maiden.findOne({ ownerId });
        if (existingOwner) {
            return interaction.reply({ content: 'Actualmente ya tienes a una doncella de dedo a tu servicio.', ephemeral: true });
        }

        async function getUniqueName() {
            let Name;
            let isUnique = false;
          
            while (!isUnique) {
              Name = getRandomName();
              const existingMaiden = await Maiden.findOne({ Name });
          
              if (!existingMaiden) {
                isUnique = true;
              }
            }
          
            return Name;
          };

        const name = await getUniqueName();
        const personality = getRandomPersonality();
    
        const newMaiden = new Maiden({ 
            ownerId, 
            name, 
            personality, 
            image,
        });

        await newMaiden.save();

        const roleId = '1271589545825144843';
        const SroleId = '1267589562629226649';
        const member = interaction.guild.members.cache.get(owner.id); // Asegúrate de obtener el GuildMember

        if (member) {
            await member.roles.add(roleId);
            await member.roles.remove(SroleId);
        } else {
            console.error('El miembro no se pudo encontrar en la cache.');
        }
        
        const newMaidenEmbed = new EmbedBuilder()
            .setColor('#b0875f')
            .setAuthor({
                name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
            })
            .setTitle('Doncella de dedo encontrada')
            .setImage(`${image}`)
            .setDescription(`La guía de la Gracia te ha llevado hasta la doncella ${name}, quien te servirá y acompañará.`);
            
        interaction.reply( {embeds: [newMaidenEmbed]});
      } catch (error) {
        console.error(error)
      }
    },
    data: {
        name: 'encontrar-doncella',
        description: 'Sigue la guía de la Gracia para encontrar a tu Doncella de Dedo.',
        dm_permission: true,
    }
}
