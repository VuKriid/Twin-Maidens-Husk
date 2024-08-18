const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const Maiden = require('../../schemas/Maiden');
const Inventory = require('../../schemas/Inventory');

const giftableItems = [
    { name: 'Flor Áurea', affectIncrease: 3 },
    { name: 'Rosa Sangrienta', affectIncrease: 12 },
    { name: 'Girasol Dorado', affectIncrease: 7 },
    { name: 'Violeta Sepulcral', affectIncrease: 5 },
    { name: 'Lirio de Trina', affectIncrease: 10 },
    { name: 'Pasas', affectIncrease: 1 },
    { name: 'Carne Excelsa', affectIncrease: 7 },
];

function getRandomNumber(x, y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

const MaidenReplies = [
    {
        personality: 'Seria',
        FirstAffect: [
            { response: '"No era necesario esto, pero lo agradezco."' },
            { response: '"No hacía falta, Sin Luz, pero gracias."' },
            { response: '"¿Es para mi? No lo entiendo... Gracias."' },
            { response: '"No sé porqué querrías darme esto a mi, pero gracias, Sin Luz."' }
        ],
        SecondAffect: [
            { response: '"Umm, gracias Sin Luz, lo guardaré."' },
            { response: '"¿Otro regalo? Ya veo, lo guardaré, gracias."' },
            { response: 'Pudiste ver a {MaidenName} dudar mientras recibía tu regalo.\n\n"Gracias, Sin Luz."' },
            { response: '"¿Es para mi? Ya veo, gracias, Sin Luz."' },
        ],
        ThirdAffect: [
            { response: '"Por lo visto te gusta mucho regalarme cosas, está bien, gracias."' },
            { response: '"Tal vez debería comenzar a obsequiarte cosas yo también..."' },
            { response: '"Gracias, {OwnerName}, lo guardaré."' },
            { response: '"¿En donde consigues todo esto? Gracias, {OwnerName}"' },
        ],
        FourthAffect: [
            { response: '{MaidenName} se ríe.\n\n"Gracias, {OwnerName}, lo atesoraré."' },
            { response: '"Gracias, {OwnerName}, lo aprecio."' },
            { response: 'En cuanto le obsequiaste una {Gift} a {MaidenName}, ella la miró con una sonrisa antes de besar tu mejilla de forma discreta a modo de agradecimiento.' },
            { response: '"Nunca olvidaré lo que haces por mi, gracias, {OwnerName}."' },
        ]
    },
    {
        personality: 'Cariñosa',
        FirstAffect: [
            { response: '"¡Oh, esto es tan dulce! Gracias de corazón."' },
            { response: '"Eres tan considerado, Sin Luz. ¡Gracias!"' },
            { response: '"¿Para mí? ¡Qué detalle tan hermoso! Muchas gracias."' },
            { response: '"No puedo creer que hayas pensado en mí. ¡Gracias, Sin Luz!"' }
        ],
        SecondAffect: [
            { response: '"Esto significa mucho para mí, Sin Luz. ¡Gracias!"' },
            { response: '"¡Otro regalo! Eres un verdadero encanto, muchas gracias."' },
            { response: '{MaidenName} te miró con ternura mientras aceptaba tu regalo.\n\n"Gracias, Sin Luz, lo aprecio mucho."' },
            { response: '"¿De verdad es para mí? ¡Qué lindo! Muchas gracias, Sin Luz."' }
        ],
        ThirdAffect: [
            { response: '"Parece que disfrutas haciéndome sonreír. ¡Gracias, eres el mejor!"' },
            { response: '"Tal vez debería empezar a mimarte yo también... ¡Gracias!"' },
            { response: '"Gracias, {OwnerName}, lo guardaré con cariño."' },
            { response: '"¡Me sorprendes cada vez más! Muchas gracias, {OwnerName}."' }
        ],
        FourthAffect: [
            { response: '{MaidenName} sonrió ampliamente.\n\n"Gracias, {OwnerName}, siempre te recordaré, eres el mejor."' },
            { response: '"Gracias, {OwnerName}, me haces muy feliz."' },
            { response: '{MaidenName} aceptó tu {Gift} con una sonrisa radiante y, con suavidad, te dio un beso en la mejilla.\n\n"Gracias, esto significa mucho para mí."' },
            { response: '"¿Te he dicho lo mucho que te quiero? Gracias, {OwnerName}, de todo corazón."' }
        ]
    },
    {
        personality: 'Enérgica',
        FirstAffect: [
            { response: '"¡Wow! ¡Esto es increíble! ¡Gracias!"' },
            { response: '"¡No me lo esperaba! ¡Eres genial, Sin Luz!"' },
            { response: '"¡Esto es para mí? ¡Qué emoción! ¡Gracias!"' },
            { response: '"¡No puedo creer que me hayas dado esto! ¡Gracias, Sin Luz!"' }
        ],
        SecondAffect: [
            { response: '"¡Esto me encanta, Sin Luz! ¡Mil gracias!"' },
            { response: '"¡Otro regalo! ¡Eres imparable! ¡Gracias!"' },
            { response: '{MaidenName} te miró con una gran sonrisa mientras aceptaba tu regalo.\n\n"¡Gracias, Sin Luz! ¡Esto es genial!"' },
            { response: '"¿De verdad es para mí? ¡Qué genial! ¡Gracias, Sin Luz!"' }
        ],
        ThirdAffect: [
            { response: '"¡No paras de sorprenderme! ¡Esto es increíble, gracias!"' },
            { response: '"¡Voy a tener que devolverte el favor algún día! ¡Gracias, esto es fantástico!"' },
            { response: '"¡Gracias, {OwnerName}! ¡Me gusta mucho esto!"' },
            { response: '"¡Dónde conseguiste esto? ¡Es increíble! ¡Gracias, {OwnerName}!"' }
        ],
        FourthAffect: [
            { response: '{MaidenName} rió con entusiasmo.\n\n"¡Gracias, {OwnerName}! ¡Lo guardaré como un tesoro!"' },
            { response: '"¡Gracias, {OwnerName}! ¡Eres el mejor!"' },
            { response: '{MaidenName} aceptó tu {Gift} con una sonrisa llena de energía y te dio un fuerte abrazo.\n\n"¡Gracias, esto es increíble!"' },
            { response: '"¡Nunca olvidaré esto, {OwnerName}! ¡Mil gracias!"' }
        ]
    },
    {
        personality: 'Formal',
        FirstAffect: [
            { response: '"Le agradezco profundamente este gesto, mi Señor."' },
            { response: '"Este obsequio es muy considerado. Muchas gracias, mi Señor."' },
            { response: '"¿Es para mí? Aprecio mucho su amabilidad. Gracias."' },
            { response: '"No era necesario, pero lo aprecio. Gracias, mi Señor."' }
        ],
        SecondAffect: [
            { response: '"Su generosidad no pasa desapercibida, mi Señor. Le agradezco."' },
            { response: '"Otro obsequio. Le estoy muy agradecida por su consideración."' },
            { response: '{MaidenName} asintió con respeto mientras aceptaba tu regalo.\n\n"Gracias, mi Señor. Lo tendré en alta estima."' },
            { response: '"¿De verdad es para mí? Le agradezco mucho, mi Señor."' }
        ],
        ThirdAffect: [
            { response: '"Su generosidad parece no tener límites. Le estoy verdaderamente agradecida."' },
            { response: '"Tal vez debería considerar corresponder su amabilidad... Gracias."' },
            { response: '"Gracias, {OwnerName}. Guardaré esto con sumo cuidado."' },
            { response: '"¿Dónde adquirió esto? Es un gesto muy considerado. Gracias, {OwnerName}."' }
        ],
        FourthAffect: [
            { response: '{MaidenName} te dirigió una leve inclinación de cabeza.\n\n"Gracias, {OwnerName}. Lo valoraré mucho."' },
            { response: '"Le agradezco sinceramente, {OwnerName}. Su gesto es muy apreciado."' },
            { response: '{MaidenName} aceptó tu {Gift} con una expresión de gratitud serena, y te ofreció una sonrisa discreta.\n\n"Gracias, lo guardaré con aprecio."' },
            { response: '"Usted es una persona sumamente importante para mi, lo sabe, ¿no?"' }
        ]
    },
    {
        personality: 'Fría',
        FirstAffect: [
            { response: '"No era necesario, pero gracias."' },
            { response: '"No esperaba esto de ti, Sin Luz, pero lo acepto."' },
            { response: '"¿Es para mí? Bien, gracias."' },
            { response: '"No sé por qué te molestaste, pero está bien. Gracias, Sin Luz."' }
        ],
        SecondAffect: [
            { response: '"Lo tomaré, Sin Luz. Gracias."' },
            { response: '"¿Otro regalo? Bien, lo tomaré, gracias."' },
            { response: '{MaidenName} te miró con frialdad antes de aceptar tu regalo.\n\n"Gracias, Sin Luz."' },
            { response: '"Si es para mí, lo acepto. Gracias, Sin Luz."' }
        ],
        ThirdAffect: [
            { response: '"Pareces disfrutar dándome cosas. Bien, lo acepto. Gracias."' },
            { response: '"¿Por qué eres tan bueno conmigo...? Gracias..."' },
            { response: '"Gracias, {OwnerName}. Lo guardaré."' },
            { response: '"¿Por qué sigues dándome esto? Bueno, gracias, {OwnerName}."' }
        ],
        FourthAffect: [
            { response: '{MaidenName} mostró una leve sonrisa.\n\n"Gracias, {OwnerName}, lo guardaré."' },
            { response: '"Gracias, {OwnerName}, lo aprecio, supongo."\n\n{MaidenName} sostuvo el regalo entre sus manos sonriendo con un ligero rubor en sus mejillas.' },
            { response: 'Después de que le diste {Gift}, {MaidenName} la miró por un momento antes de darte un asentimiento.\n\n"Gracias, {OwnerName}."' },
            { response: '"Tal vez te he juzgado mal. Gracias, {OwnerName}, te quiero..."' }
        ]
    },
    {
        personality: 'Amable',
        FirstAffect: [
            { response: '"¡Qué detalle tan considerado! Muchas gracias."' },
            { response: '"Eres muy amable, Sin Luz. Aprecio mucho esto."' },
            { response: '"¿Esto es para mí? Qué lindo gesto, gracias."' },
            { response: '"No era necesario, pero lo agradezco de corazón, Sin Luz."' }
        ],
        SecondAffect: [
            { response: '"Tu amabilidad no tiene límites, Sin Luz. Gracias."' },
            { response: '"Otro regalo. Realmente eres muy generoso, gracias."' },
            { response: '{MaidenName} te sonrió con calidez mientras aceptaba tu regalo.\n\n"Gracias, Sin Luz. Eres muy amable."' },
            { response: '"Es un gesto muy considerado, Sin Luz. Muchas gracias."' }
        ],
        ThirdAffect: [
            { response: '"Parece que disfrutas dándome cosas. Gracias, lo aprecio mucho."' },
            { response: '"Me siento afortunada de recibir tanto de ti. Gracias."' },
            { response: '"Gracias, {OwnerName}. Lo guardaré con aprecio."' },
            { response: '"¿Dónde conseguiste esto? Eres muy generoso, gracias, {OwnerName}."' }
        ],
        FourthAffect: [
            { response: '{MaidenName} te dedicó una sonrisa genuina.\n\n"Gracias, {OwnerName}. Esto significa mucho para mí."' },
            { response: '"Gracias, {OwnerName}. Lo valoro mucho, de verdad."' },
            { response: '{MaidenName} aceptó tu {Gift} con una sonrisa cálida y te dio las gracias de manera afectuosa.\n\n"Gracias, esto es muy especial para mí."' },
            { response: '{MaidenName} se inclinó para darte un beso en la mejilla con bastante cariño.\n\n" Gracias, de corazón."' }
        ]
    },
    {
        personality: 'Lanzada',
        FirstAffect: [
            { response: '"¡Vaya, esto es genial! Gracias, me gusta que seas tan directo."' },
            { response: '"¡No esperaba esto! Me encanta que tomes la iniciativa, Sin Luz."' },
            { response: '"¿Para mí? ¡Qué detalle! Gracias."' },
            { response: '"¡Te atreviste a sorprenderme! Me gusta, gracias, Sin Luz."' }
        ],
        SecondAffect: [
            { response: '"¡Sabes cómo captar mi atención, Sin Luz! Gracias."' },
            { response: '"Otro regalo, ¿eh? Me gusta cómo piensas. Gracias."' },
            { response: '{MaidenName} te sonrió de manera audaz mientras tomaba el regalo.\n\n"Gracias, Sin Luz. Me gusta tu estilo."' },
            { response: '"Esto es para mí... ¡Qué osado de tu parte! Gracias, Sin Luz."' }
        ],
        ThirdAffect: [
            { response: '"Parece que no te asusta hacer un gesto tan atrevido. ¡Me encanta! Gracias."' },
            { response: '"Tal vez debería empezar a corresponder de una manera diferente... Gracias."' },
            { response: '"Gracias, {OwnerName}. ¡Guardaré esto y recordaré cuanto me quieres!"' },
            { response: '"¿Dónde consigues cosas tan sorprendentes? Me tienes intrigada, {OwnerName}. ¡Gracias!"' }
        ],
        FourthAffect: [
            { response: '{MaidenName} te guiñó un ojo con complicidad.\n\n"Gracias, {OwnerName}. Lo guardaré y pensaré en ti."' },
            { response: '"Gracias, {OwnerName}. Me encanta que seas así de atrevido conmigo, pero espero que no le des regalos a nadie más. ¡Ja, ja, ja!"' },
            { response: '{MaidenName} aceptó tu {Gift} con una sonrisa pícara y te dio un beso en la mejilla.\n\n"Gracias, {OwnerName}. Esto es muy especial."' },
            { response: '"¿Qué te parece si más tarde hacemos algo?{OwnerName}, no tienes idea de cuanto te quiero."' }
        ]
    },
    {
        personality: 'Tímida',
        FirstAffect: [
            { response: '"Oh... esto es para mí... Muchas gracias."' },
            { response: '"No tenías que hacerlo, pero... gracias, Sin Luz."' },
            { response: '"¿De verdad es para mí? Qué lindo... gracias."' },
            { response: '"No sé qué decir... Gracias, Sin Luz."' }
        ],
        SecondAffect: [
            { response: '"Gracias... no estoy acostumbrada a recibir regalos, pero lo aprecio mucho."' },
            { response: '"Otro regalo... eres muy amable, gracias."' },
            { response: '{MaidenName} se sonrojó ligeramente al aceptar tu regalo.\n\n"Gracias, Sin Luz... es muy bonito."' },
            { response: '"Es muy considerado de tu parte... gracias, Sin Luz."' }
        ],
        ThirdAffect: [
            { response: '"Me hace feliz que pienses en mí... gracias, de verdad."' },
            { response: '"Tal vez debería encontrar una manera de devolverte el gesto... gracias."' },
            { response: '"Gracias, {OwnerName}, lo guardaré con mucho cariño."' },
            { response: '"¿Cómo sabías que me gustaría? Eres muy atento, gracias, {OwnerName}."' }
        ],
        FourthAffect: [
            { response: '{MaidenName} te sonrió tímidamente.\n\n"Gracias, {OwnerName}, esto significa mucho para mí."' },
            { response: '"Gracias, {OwnerName}, aprecio mucho tu amabilidad."' },
            { response: '{MaidenName} aceptó tu {Gift} con un rubor en las mejillas, mirándote con timidez.\n\n"Gracias, {OwnerName}, esto es muy especial para mí."' },
            { response: '"Nunca olvidaré tu consideración, {OwnerName}. Gracias, de corazón."' }
        ]
    }     
];

function getMaidenReply(personality, affectLevel) {
    const replies = MaidenReplies.find(reply => reply.personality === personality);
    if (replies) {
        switch (true) {
            case affectLevel < 50:
                return replies.FirstAffect[getRandomNumber(0, replies.FirstAffect.length - 1)].response;
            case affectLevel < 125:
                return replies.SecondAffect[getRandomNumber(0, replies.SecondAffect.length - 1)].response;
            case affectLevel < 275:
                return replies.ThirdAffect[getRandomNumber(0, replies.ThirdAffect.length - 1)].response;
            default:
                return replies.FourthAffect[getRandomNumber(0, replies.FourthAffect.length - 1)].response;
        }
    }
    return '"Gracias, {OwnerName}."';
}

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: "Este comando solo puede ser ejecutado en la Mesa Redonda.",
                ephemeral: true,
            });
            return;
        }
        try {
            const userId = interaction.user.id;
            const giftName = interaction.options.getString('nombre');
            const quantity = interaction.options.getInteger('cantidad') || 1;

            // Buscar la Maiden correspondiente
            const maiden = await Maiden.findOne({ ownerId: userId });
            if (!maiden) {
                interaction.reply({
                    content: "No eres dueño de ninguna Maiden.",
                    ephemeral: true,
                });
                return;
            }

            const guild = interaction.guild || message.guild;
            let ownerNick = 'sin nombre';
            const owner = await guild.members.fetch(maiden.ownerId);
                if (owner) {
                    ownerNick = owner.nickname || owner.user.globalName;
                }

            // Verificar el inventario del usuario
            const inventory = await Inventory.findOne({ userId });
            const item = inventory.items.find(i => i.name === giftName);
            if (!item || item.quantity < quantity) {
                interaction.reply({
                    content: "No tienes suficientes objetos en tu inventario para regalar.",
                    ephemeral: true,
                });
                return;
            }

            // Verificar si el objeto puede ser regalado
            const gift = giftableItems.find(g => g.name === giftName);
            if (!gift) {
                interaction.reply({
                    content: "Este objeto no se puede regalar.",
                    ephemeral: true,
                });
                return;
            }

            // Actualizar el inventario y el afecto de la Maiden
            item.quantity -= quantity;
            if (item.quantity === 0) {
                inventory.items = inventory.items.filter(i => i.name !== giftName);
            }
            await inventory.save();
            maiden.lastModified = new Date(); // Actualiza la fecha de la última modificación
            await maiden.save(); // Guarda los cambios

            maiden.affect += gift.affectIncrease * quantity;
            await maiden.save();

            // Generar la respuesta de la Maiden
            const reply = getMaidenReply(maiden.personality, maiden.affect)
                .replace('{MaidenName}', maiden.name)
                .replace('{OwnerName}', ownerNick)
                .replace('{Gift}', giftName);

            // Crear el embed
            const embed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setThumbnail(maiden.image)
                .setDescription(reply);

            // Enviar respuesta como embed
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al ejecutar el comando de explorar:', error);
            interaction.reply({
                content: 'Hubo un error al intentar dar un regalo. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        }
    },
    data: {
        name: 'dar-regalo',
        description: 'Obsequia un objeto de tu inventario a tu doncella de dedo.',
        options: [
            {
                name: 'nombre',
                type: ApplicationCommandOptionType.String,
                description: 'Nombre del regalo',
                required: true,
                autocomplete: true,
            },
            {
                name: 'cantidad',
                type: ApplicationCommandOptionType.Integer,
                description: 'Cantidad a regalar',
                required: false,
            }
        ]
    },
}