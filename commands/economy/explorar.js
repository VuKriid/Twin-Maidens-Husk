const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const Inventory = require('../../schemas/Inventory');
const Cooldown = require('../../schemas/Cooldown');
const ShopItem = require('../../schemas/ShopItem');

function getRandomNumber(x, y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

const events = [
    {
        type: 'runas',
        chance: 15,
        min: 1,
        max: 500,
        messages: [
            'Has encontrado <:Runa:1269384390614585416>{amount} runas.',
            'Recoges <:Runa:1269384390614585416>{amount} runas del suelo.',
            'Encontraste <:Runa:1269384390614585416>{amount} en un árbol hueco.',
            'Estabas caminando por una charca cuando te tropezaste con <:Runa:1269384390614585416>{amount} runas.',
            'Ibas caminando cerca de un retoño del Ábol Áureo cuando comenzaron a caer runas desde sus ramas, lograste atrapar <:Runa:1269384390614585416>{amount} runas.',
            'Mataste a un grupo de enemigos menores en el camino y lograste hacerte con <:Runa:1269384390614585416>{amount} runas.'
        ]
    },
    {
        type: 'item',
        chance: 40,
        items: [
            'Piedra de Forja',
            'Piedra de Forja',
            'Piedra de Forja',
            'Piedra de Forja',
            'Piedra de Forja',
            'Piedra de Forja',
            'Piedra de Forja',
            'Piedra de Forja',
            'Piedra de Forja',
            'Piedra de Forja',
            'Espada',
            'Espada',
            'Vial de Lágrimas',
            'Vial de Lágrimas',
            'Vial de Lágrimas',
            'Vial de Lágrimas',
            'Vial de Lágrimas',
            'Vial de Lágrimas',
            'Piedra de Forja de Dragón',
            'Piedra de Forja de Dragón',
            'Armadura',
            'Runa Dorada',
            'Runa Dorada',
            'Runa Dorada',
            'Runa Dorada',
            'Runa Dorada',
            'Runa Dorada',
            'Flor Áurea',
            'Flor Áurea',
            'Flor Áurea',
            'Flor Áurea',
            'Flor Áurea',
            'Flor Áurea',
            'Flor Áurea',
            'Rosa Sangrienta',
            'Rosa Sangrienta',
            'Rosa Sangrienta',
            'Violeta Sepulcral',
            'Violeta Sepulcral',
            'Violeta Sepulcral',
            'Violeta Sepulcral',
            'Violeta Sepulcral',
            'Lirio de Trina',
            'Lirio de Trina',
            'Lirio de Trina',
            'Girasol Dorado',
            'Girasol Dorado',
            'Girasol Dorado',
            'Lágrima Larvaria',
            'Ojo del Dactilograma',
            'Uva de Shabriri',
            'Hoja Dactilocida',
            'Muñeca de Moira',
            'Anillo de la Luna Negra',
            'Maldición de Semillero',
            'Maldición de Semillero',
            'Maldición de Semillero',
            'Maldición de Semillero',
            'Sello Maldito de la Muerte',
            'Principios de la Orden'
        ],
        messages: [
            'Has encontrado un(a) {item}.',
            'Encontraste un(a) {item} mientras explorabas.',
            'Cuando abriste un cofre misterioso, encontraste un(a) {item} dentro.',
            'Encontraste un comerciante muerto en el camino, tras inspeccionarlo encontraste un(a) {item} entre sus manos.',
            'Tras explorar un pueblo abandonado, encontraste un(a) {item}.'
        ]
    },
    {
        type: 'enemy',
        chance: 85, // Ajusta la probabilidad según sea necesario
        damage: { min: 5, max: 100 },
        enemyName: [
            { name: 'Asesino de Augurios', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270863307191881850/er-omenkiller-concept.png?ex=66b53f2f&is=66b3edaf&hm=2388e6e68c42152500c0995ef33df47da525208241ee25af4408a0b845a169db&' },
            { name: 'Jefe Semihumano', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Cazador de Esferas', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866749935321252/image.png?ex=66b54264&is=66b3f0e4&hm=f2fe205d6102726967d68fa25ae57e46c65b445366bda85a0c4f33eaadefc57c&' },
            { name: 'Oso Rúnico', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Señor de Ónice', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Caballero Crisol', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Trol', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Caballero Trol', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Cuervo Monstruoso', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866382501838858/er-monstrous-crow-concept.png?ex=66b5420d&is=66b3f08d&hm=91808e13535258f525c822be244667e2202ecc8db26eb34186a4544d5cbfdba9&' },
            { name: 'Perro Monstruoso', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866398293397656/er-monstrous-dog-concept.png?ex=66b54210&is=66b3f090&hm=2eb2b5ff6d6bb4a99f42f41e8ceafbecf8640cdd0337e1ea37b4ad58dab84b9d&' },
            { name: 'Vástago Injertado', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866604682379275/er-grafted-scion-concept.png?ex=66b54242&is=66b3f0c2&hm=4c0b767034985b2fbe5f26299d9b78d74cf67bd9f4a7080e47cabcb31b3f1570&' },
            { name: 'Renacido Regio', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866635120447489/er-royal-revenant-concept.png?ex=66b54249&is=66b3f0c9&hm=ae098b8f1ec34ea824ba1c38089ff338b8ca0f5da21f0af28f286970a31e1d8a&' },
            { name: 'Caballero Putrefacto', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Duelista', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&N' },
            { name: 'Siervo de la Putrefacción', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Centinela Agreste', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866189484294224/er-tree-sentinel-and-steed.png?ex=66b541df&is=66b3f05f&hm=73aea920f99c982a241d62ba8b32526e8ade35d3519f53f6cfe281735ae41057&' },
            { name: 'Centinela Draconiano', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866620675264574/er-draconic-tree-sentinel-and-steed.png?ex=66b54245&is=66b3f0c5&hm=da1f2898790b3698a4d04ae3c3249a31a12dd45308c20154697d24c27313fbd5&' },
            { name: 'Bastardo Leonino', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Cuchillo Negro', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Héroe de Zamor', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Noble Sanguino', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Tarro Viviente', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Monje de la Llama Negra', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Prelado Ígneo', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Caballero Sabueso', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866415703818260/er-lesser-bloodhound-knight.png?ex=66b54215&is=66b3f095&hm=29553e970de1113e098839aca1b32a173e1bea1ea18aeb0101d78b02228e9c8f&' },
            { name: 'Cristaliano', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Perro Guardián Funerario', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866208983355422/er-erdtree-burial-watchdog.png?ex=66b541e3&is=66b3f063&hm=4c540b54b0662ca9aae4047469e757cd20be0dfef8d223c58e1ca547b3b8305b&' },
            { name: 'Caballería Nocturna', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' },
            { name: 'Golem de Piedra', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270866576291401818/er-golem-concept.png?ex=66b5423b&is=66b3f0bb&hm=3295257b1db8e3be92d54f05bd853485e07cea10c749d680f8aabc72fff95e76&' },
            { name: 'Caballero Proscrito', url: 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&' }
          ],
        dead: [
            'Moriste tras enfrentar a un {enemyName} y perdiste todas tus runas y los objetos que habías encontrado.',
            'No lograste sobrevivir a un {enemyName} y perdiste todo lo que habías encontrado en tu exploración.',
            'Fuiste destruido por un {enemyName} y todo lo que habías encontrado se perdió.',
            'Tropezaste con un tarro enterrado en el suelo mientras ibas por una colina y rodaste por la ladera golpeando muchos objetos en el suelo antes de morir.',
            'Te caíste de una gran altura y moriste.'
        ],
        messages: [
            'Encontraste a un {enemyName} y perdiste {damage} puntos de salud tras derrotarlo. Pero lograste conseguir <:Runa:1269384390614585416>{extraRunas} de su cadáver',
            'Un {enemyName} te asalta en un puente y para cuando ya lo derrotaste, te ha infligido {damage} puntos de daño. De su cuerpo recuperaste <:Runa:1269384390614585416>{extraRunas} runas.',
            'Estabas inspeccionando los restos de un cadáver cuando apareció un {enemyName} listo para luchar. Tras el enfrentamiento, perdiste {damage} puntos de salud. Pero sentiste que valió la pena cuando conseguiste <:Runa:1269384390614585416>{extraRunas} runas de su cuerpo.',
            'Te asomaste por un risco para ver mejor lo que había debajo y alguien te empujó, tras caer, perdiste {damage} puntos de salud.\n\n"Mejor suerte a la próxima."\n\nMirando a tu alrededor, pudiste ver una pila de <:Runa:1269384390614585416>{extraRunas} runas.',
            'Estabas caminando a través de un profundo bosque cuando un {enemyName} cayó desde las ramas y te atacó. Logró infligirte {damage} puntos de daño pero lograste eliminarlo y conseguir <:Runa:1269384390614585416>{extraRunas} runas.',
            'Estabas caminando por una colina cuando te tropezaste con algo en el suelo y rodaste hasta terminar frente a un {enemyName}. Tras enfrentarlo y derrotarlo, perdiste {damage} puntos de salud, pero conseguiste <:Runa:1269384390614585416>{extraRunas} runas.'
        ]
    },
    {
        type: 'nothing',
        chance: 100,
        messages: [
            'Estabas caminando por una llanura, pero no pudiste ver gran cosa.',
            'No encontraste nada interesante mientras explorabas los alrededores.',
            'Atravesaste un pantano y viste algunas criaturas extrañas y poco más.',
            'Levantaste una piedra del suelo, pero no había nada debajo.',
            'Llegaste a una playa, pero lo único que había era arena y mar.',
            'Llegaste a un burgo, pero la puerta principal estaba cerrada y no fuiste capaz de entrar.',
            'Caminaste a través de una charca, se te mojaron los pies y no encontraste nada útil.'
        ]
    }
];

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
            await interaction.deferReply();

            const commandName = 'explorar';
            const userId = interaction.user.id;

            let cooldown = await Cooldown.findOne({ userId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');
                const CDExploreEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Debes descansar antes de explorar de nuevo. Inténtalo en ${prettyMs(cooldown.endsAt - Date.now())}.`);
                await interaction.editReply({ embeds: [CDExploreEmbed] });
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

            let userProfile = await UserProfile.findOne({ userId });
            if (!userProfile) {
                userProfile = new UserProfile({ userId, balance: 0, health: 100, defeatedBosses: [], stats: [] });
                await userProfile.save();
            }

            const stats = userProfile.stats
            const level = stats.level;
            const vitality =  stats.vitality;
            const MaxHealth = Math.floor(100 * ( 5 - ( 36 / ( vitality + 8 ) ) ));
            const attack =  stats.attack;
            const evasionRaw =  stats.evasion;
            const accuracyRaw =  stats.accuracy;

            const userInventory = await Inventory.findOne({ userId });
            let ArmorLevel = 1;
            if (userInventory) {
                const armor = userInventory.items.find(item => item.name.startsWith('Armadura'));
                if (armor) {
                    if (armor.name === 'Armadura') ArmorLevel = 1.15;
                    else if (armor.name === 'Armadura +1') ArmorLevel = 1.3;
                    else if (armor.name === 'Armadura +2') ArmorLevel = 1.45;
                    else if (armor.name === 'Armadura +3') ArmorLevel = 1.60;
                }
            }
            let health = MaxHealth

            // Verifica el tipo de espada en el inventario
            let swordLevel = 1;
            if (userInventory) {
                const sword = userInventory.items.find(item => item.name.startsWith('Espada'));
                if (sword) {
                    // Extrae el nivel de la espada basado en el nombre
                    if (sword.name === 'Espada') swordLevel = 1.1;
                    else if (sword.name === 'Espada +1') swordLevel = 1.2;
                    else if (sword.name === 'Espada +2') swordLevel = 1.3;
                    else if (sword.name === 'Espada +3') swordLevel = 1.4;
                    else if (sword.name === 'Espada +4') swordLevel = 1.5;
                }
            }

            const power = (attack + evasionRaw + accuracyRaw)/3 * swordLevel * ArmorLevel;

            // Calcula el porcentaje de reducción del daño según el nivel de la espada
            const damageReductionPercentage = power * 4;
            const damageReductionMultiplier = 9/(damageReductionPercentage + 8 );

            const maxEvents = 20;
            let currentEvent = 0;
            let explorationOngoing = true;
            let totalRunas = 0;
            let foundItems = [];
            let deathMessage = ''; // Inicializa la variable

            while (explorationOngoing && currentEvent < maxEvents && health > 0) {
                currentEvent++;
                const eventRoll = getRandomNumber(1, 100);

                let eventResult = null;
                for (const event of events) {
                    if (eventRoll <= event.chance) {
                        eventResult = event;
                        break;
                    }
                }

                let eventDescription = 'Estabas caminando a través de una llanura, pero no encontraste nada relevante.';
                let runasAmount = 0;
                let item = '';
                let damage = 0;
                let enemyName = ''
                let EnemyUrl = 'https://cdn.discordapp.com/attachments/1267565705654435840/1270874970813366333/pngtree-no-image-available-icon-flatvector-illustration-picture-coming-creative-vector-png-image_40968940.png?ex=66b54a0c&is=66b3f88c&hm=30eb4ac169bc10a674abc674777c96918efb3f332dd7112c32844ac3c2ea0705&';

                if (eventResult) {
                    const message = eventResult.messages[getRandomNumber(0, eventResult.messages.length - 1)];
                    switch (eventResult.type) {
                        case 'runas':
                            runasAmount = getRandomNumber(eventResult.min, eventResult.max);
                            totalRunas += runasAmount;
                            eventDescription = message.replace('{amount}', runasAmount);
                            break;
                        case 'item':
                            item = eventResult.items[getRandomNumber(0, eventResult.items.length - 1)];
                            foundItems.push(item);
                            eventDescription = message.replace('{item}', item);
                            break;
                        case 'enemy':
                            let maxDamage = eventResult.damage.max;
                            damage = getRandomNumber(eventResult.damage.min, maxDamage);
                            // Aplica la reducción del daño si el usuario tiene una espada
                            damage = Math.floor(damage * damageReductionMultiplier);
                            enemyName = eventResult.enemyName[getRandomNumber(0, eventResult.enemyName.length - 1)];
                            health -= damage;
                            // Añadir runas por sobrevivir al enemigo
                            if (health > 0) {
                                
                                // Función para encontrar un enemigo por nombre
                                function findEnemyByName(name) {
                                    const event = events.find(e => e.type === 'enemy');
                                    if (event) {
                                        const enemy = event.enemyName.find(e => e.name === name);
                                        return enemy ? enemy.name : 'Enemigo no encontrado';
                                    }
                                    return 'Evento de tipo enemy no encontrado';
                                }

                                // Ejemplo de uso
                                const enemyNameT = findEnemyByName(enemyName.name);
                                //URL
                                function findEnemyUrlByName(name) {
                                    const event = events.find(e => e.type === 'enemy');
                                    if (event) {
                                        const enemy = event.enemyName.find(e => e.name === name);
                                        return enemy ? enemy.url : 'URL no encontrada';
                                    }
                                    return 'Evento de tipo enemy no encontrado';
                                }

                                // Ejemplo de uso
                                const enemyUrl = findEnemyUrlByName(enemyName.name);
                                EnemyUrl = enemyUrl

                                const extraRunas = getRandomNumber(25, 500) * 5;
                                totalRunas += extraRunas;
                                eventDescription = message.replace('{damage}', damage).replace('{enemyName}', enemyName.name).replace('{extraRunas}', extraRunas);
                            } else {
                                deathMessage = eventResult.dead[getRandomNumber(0, eventResult.dead.length - 1)].replace('{enemyName}', enemyName.name);
                                eventDescription = deathMessage;
                                explorationOngoing = false; // Termina la exploración
                            }
                            break;
                        case 'nothing':
                            eventDescription = message;
                            break;
                        default:
                            eventDescription = message;
                            break;
                    }
                }

                const explorationEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(eventDescription)
                    .addFields(
                        { name: 'Salud:', value: `${health}`, inline: true },
                        { name: 'Runas', value: `<:Runa:1269384390614585416>${totalRunas}`, inline: true },
                        { name: 'Etapa', value: `${currentEvent}/${maxEvents}`, inline: true },
                    );

                if (explorationOngoing) {
                    const buttons = [
                        new ButtonBuilder()
                            .setCustomId('continue')
                            .setLabel('Continuar')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('retire')
                            .setLabel('Retirarse')
                            .setStyle(ButtonStyle.Secondary)
                    ];

                    // Verifica si el usuario tiene un Vial de Lágrimas en su inventario
                    const vial = userInventory ? userInventory.items.find(item => item.name === 'Vial de Lágrimas') : null;
                    if (vial && vial.quantity > 0) {
                        buttons.push(
                            new ButtonBuilder()
                                .setCustomId('use_vial')
                                .setLabel('Usar Vial de Lágrimas')
                                .setStyle(ButtonStyle.Success)
                        );
                    }

                    const row = new ActionRowBuilder().addComponents(buttons);

                    const reply = await interaction.editReply({
                        embeds: [explorationEmbed],
                        components: [row]
                    });

                    const buttonInteraction = await reply.awaitMessageComponent({
                        filter: (i) => i.user.id === interaction.user.id,
                        time: 60_000,
                    }).catch(() => {
                        explorationOngoing = false;
                    });

                    if (!buttonInteraction) return;

                    if (buttonInteraction.customId === 'retire') {
                        explorationOngoing = false;
                    } else if (buttonInteraction.customId === 'use_vial') {
                        health += parseInt(getRandomNumber(15, 30) * MaxHealth/100);
                        // Elimina un vial del inventario
                        if (vial.quantity > 1) {
                            vial.quantity -= 1;
                        } else {
                            userInventory.items = userInventory.items.filter(item => item.name !== 'Vial de Lágrimas');
                        }
                        await userInventory.save();
                    }

                    await buttonInteraction.deferUpdate();
                }
            }

            if (health <= 0) {
                userProfile.balance = 0;
                userProfile.health = 100;
                await userProfile.save();

                const deathEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`${deathMessage}`);

                await interaction.editReply({ embeds: [deathEmbed], components: [] });
                return;
            }

            if (!userProfile) {
                userProfile = new UserProfile({ userId });
            }
            cooldown.endsAt = Date.now() + 3600_000;
            await Promise.all([cooldown.save(), userProfile.save()]);

            if (health > 0) {
                // Encuentra el inventario del usuario o crea uno si no existe
                const inventory = await Inventory.findOne({ userId });
                if (inventory) {
                    for (const item of foundItems) {
                        // Obtiene la descripción del ShopItem
                        const shopItem = await ShopItem.findOne({ name: item });
                        const description = shopItem ? shopItem.description : 'Descripción no disponible';
                        const usable = shopItem ? shopItem.usable : false;

                        // Si el objeto ya existe en el inventario, incrementa la cantidad
                        const existingItem = inventory.items.find(i => i.name === item);
                        if (existingItem) {
                            existingItem.quantity += 1;
                        } else {
                            // De lo contrario, añade el nuevo objeto
                            inventory.items.push({
                                name: item,
                                quantity: 1,
                                usable,
                                description
                            });
                        }
                    }
                    await inventory.save();
                } else {
                    // Si no existe un inventario, crea uno nuevo
                    const newInventory = new Inventory({
                        userId,
                        items: await Promise.all(foundItems.map(async (item) => {
                            const shopItem = await ShopItem.findOne({ name: item });
                            const description = shopItem ? shopItem.description : 'Descripción no disponible';
                            const usable = shopItem ? shopItem.usable : false;
                            return {
                                name: item,
                                quantity: 1,
                                usable,
                                description
                            };
                        })),
                    });
                    await newInventory.save();
                }
            }

            userProfile.balance += totalRunas;
            await userProfile.save();

            const resultEmbed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({
                    name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                })
                .setDescription(`Exploración terminada.\nHas encontrado un total de <:Runa:1269384390614585416>${totalRunas} runas y los siguientes objetos:\n- ${foundItems.join('\n- ') || 'ninguno'}.\nTu salud actual es de ${health}.`);

            await interaction.editReply({ embeds: [resultEmbed], components: [] });

        } catch (error) {
            console.error('Error al ejecutar el comando de explorar:', error);
            interaction.editReply({
                content: 'Hubo un error al intentar explorar. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        }
    },

    data: {
        name: 'explorar',
        description: 'Sal de exploración para encontrar runas, objetos y enemigos. ¡Decide si continuar o retirarte!',
    },
};