const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const Inventory = require('../../schemas/Inventory');
const ShopItem = require('../../schemas/ShopItem');

const bosses = [
    {
        level: 1,
        name: 'Godrick, el Injertado',
        health: 210,
        power: { min: 20, max: 50 },
        accurate: 0.4,
        evasion: 0.0,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272324751968178327/Remembrance_of_the_Grafted.png?ex=66ba9043&is=66b93ec3&hm=b09d6d0aab09489d0e48b44bbcc2430d2de7220ea8f269ea01ba67d53ab97782&',
        award: 3000,
        introduction: 'Tras atravesar el castillo de Velo Tormentoso, te encontraste frente a Godrick el Injertado, listo para comenzar el enfrentamiento',
        dialogue: 'Vaya... Un mísero Sin Luz jugando a ser alta nobleza. ¡Te ordeno que te arrodilles! ¡Soy señor de todo cuanto es dorado!',
        item: 'Gran Runa de Godrick'
    },
    {
        level: 2,
        name: 'Espíritu Ancestral Majestuoso',
        health: 230,
        power: { min: 10, max: 50 },
        accurate: 0.6,
        evasion: 0.2,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272384135956140054/Remembrance_of_the_Regal_Ancestor.png?ex=66bac791&is=66b97611&hm=f0f68714b4e9a21a0034f3af7e2da0f6969a7bd2b92c793814c5193cf20edbad&',
        award: 3400,
        introduction: 'Tras atravesar el río Siofra, encender las velas de los obeliscos de los Seguidores Ancestrales y acceder a los terrenos carnosacros, te encontraste con la impresionante imagen de un Espíritu Ancestral Majestuoso, listo para iniciar un enfrentamiento.',
        dialogue: '...',
        item: ''
    },
    {
        level: 3,
        name: 'Rennala, Reina de la Luna Llena',
        health: 130,
        power: { min: 30, max: 90 },
        accurate: 0.7,
        evasion: 0.4,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272384136446869624/Remembrance_of_the_Full_Moon_Queen.png?ex=66bac791&is=66b97611&hm=ef7189fbc994c8897b866b2d9b05fcf040b3755ed90c68462f681473c6b85069&',
        award: 4200,
        introduction: 'Tras atravesar la Academía de Hechicería, Raya Lucaria y adentrarte hasta la Gran Biblioteca, te encontraste a la Reina Cariana sosteniendo un huevo ambar, en cuanto te acercaste, caíste en la ilusión de la bruja Ranni y en un impresionante paisaje con una gran luna llena, tenías delante a la Imagen Ilusoria de Rennala, Reina de la Luna Llena, lista para iniciar un enfrentamiento.',
        dialogue: 'Yo, Ranni la Bruja. Juro que no perturbarás el santuoso letargo de madre. Maldito intruso. Haz que corra la voz. De la última reina de Caria, Rennala de la Luna Llena. Y de la magnificiencia de la noche que conjuró.',
        item: 'Gran Runa de los Nonatos'
    },
    {
        level: 4,
        name: 'Morgott, Rey de los Augurios',
        health: 210,
        power: { min: 25, max: 50 },
        accurate: 0.8,
        evasion: 0.4,
        image: 'https://media.discordapp.net/attachments/1267599517142745269/1272384117379694622/Remembrance_of_the_Omen_King.png?ex=66bac78d&is=66b9760d&hm=2abba9208312d76550a35c7de27d51944a16b7af71a8d8b2b3908f18efb751f6&=&format=webp&quality=lossless&width=662&height=662',
        award: 4800,
        introduction: 'Tras atravesar la capital dorada de Leyndell y llegar hasta el pie del Árbol Áureo, entonces apareció el Rey Augurio y actual regente de las Tierras Intermedias; Morgott, listo para iniciar la afrenta.',
        dialogue: 'Sois todos de la misma calaña. Saqueadores, envalentonados por la llama del a ambición. Que lo escriban en tu patética tumba. Derrotado por el rey Morgott, el último de todos los reyes.',
        item: 'Gran Runa de Morgott'
    },
    {
        level: 5,
        name: 'Radahn, Azote de las Estrellas',
        health: 250,
        power: { min: 30, max: 60 },
        accurate: 0.7,
        evasion: 0.3,
        image: 'https://media.discordapp.net/attachments/1267599517142745269/1272384117929152603/Remembrance_of_the_Starscourge.png?ex=66bac78d&is=66b9760d&hm=684b76988d5933284c5cce2fda55bd1f9d13e08d2f38322be3a4fb68f89da5cb&=&format=webp&quality=lossless&width=662&height=662',
        award: 10600,
        introduction: 'Tras encontrar la costa Este de Caelid, te encontraste a un debilitado y enloquecido General Radahn, listo para atacar.',
        dialogue: '...',
        item: 'Gran Runa de Radahn'
    },
    {
        level: 6,
        name: 'Astel, Innato del Vacío',
        health: 270,
        power: { min: 30, max: 50 },
        accurate: 0.7,
        evasion: 0.1,
        image: 'https://media.discordapp.net/attachments/1267599517142745269/1272384135041777685/Remembrance_of_the_Naturalborn.png?ex=66bac791&is=66b97611&hm=1370c3297d0ce202e6303cd8ff511c164d1242352d98c478bd15d0253d8f0b62&=&format=webp&quality=lossless&width=662&height=662',
        award: 8000,
        introduction: 'Tras seguir el curso del Río Ainsel y atravesar el Lago de Putrefacción, te encontraste en una caverna con una estrella fugaz completamente desarrollada y lista para combatir.',
        dialogue: '...',
        item: ''
    },
    {
        level: 7,
        name: 'Dragón Liche Fortissax',
        health: 300,
        power: { min: 30, max: 60 },
        accurate: 0.7,
        evasion: 0.2,
        image: 'https://media.discordapp.net/attachments/1267599517142745269/1272384137373683734/Remembrance_of_the_Lichdragon.png?ex=66bac792&is=66b97612&hm=b23548b4887c9fd99bc674aedf646faed07df543f0d637711972505775fb1013&=&format=webp&quality=lossless&width=662&height=662',
        award: 11600,
        introduction: 'Tras encontrar camino a través del Río Siofra hasta las Raíces Profundas del Árbol dorado, lograste encontrar una de las ciudades eternas de Nox, y más adelante, el cuerpo sin alma del semidiós Godwyn, el dorado. En cuanto quisiste acercarte más, un gran dragón antiguo de escamas oscuras hizo presencia, listo para desafiarte.',
        dialogue: '...',
        item: ''
    },
    {
        level: 8,
        name: 'Mohg, Señor de la Sangre',
        health: 220,
        power: { min: 30, max: 50 },
        accurate: 0.8,
        evasion: 0.2,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272384115903299708/Remembrance_of_the_Blood_Lord.png?ex=66bac78c&is=66b9760c&hm=8ee7690163b1f2ebfdd38dae4b854dd2239b7b706dbd331a67ca4ea95d680eea&',
        award: 10000,
        introduction: 'Tras encontrar camino hasta unas ruinas Nox al Este del Río Siofra, te encontraste con un gran palacio de sangre, en la cima, estaba Mohg, el Augurio, listo para comenzar un enfrentamiento.',
        dialogue: 'Demos la bienvenida a nuestro invitado de honor. ¡Al lugar de origen de nuestra dinastía!',
        item: 'Gran Runa de Mohg'
    },
    {
        level: 9,
        name: 'Rellana, Caballera de Luna Gemela',
        health: 160,
        power: { min: 30, max: 60 },
        accurate: 0.9,
        evasion: 0.5,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272569869342085140/remembrance_of_the_twin_moon_knight_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb748c&is=66ba230c&hm=8c36809b34a0c3321f58c131ed31a05979f0d368662606af7e54fc1d22258469&',
        award: 8800,
        introduction: 'Tras llegar al Reino de las Sombras y atravesar el Castillo de Esnsis, en la parte más alta, pudiste encontrar a la Caballera Rellana blandiendo dos espadas, lista para comenzar el enfrentamiento.',
        dialogue: '...',
        item: ''
    },
    {
        level: 10,
        name: 'Bestia Divina, León Danzante',
        health: 230,
        power: { min: 30, max: 60 },
        accurate: 0.7,
        evasion: 0.2,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272569956248191079/remembrance_of_the_dancing_lion_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb74a0&is=66ba2320&hm=5c23a24dcedabdb2d0e76eac97107b7e1d7b73df3341a15ef9edd4c0cc9a27e3&',
        award: 9200,
        introduction: 'Tras atravesar el asentamiento de Belurat y subir hasta lo más alto, una Bestia Divina con cabeza de león te cortó el paso, invocando una tormenta, listo para combatir.',
        dialogue: 'Oh, bestia cubierta de cuernos, nacida en lo más alto. Echa raices en los guardianes esculpidos de la torre. Y, atrincherada en el interior, te rogamos que te alces. Baila, retoza y púrgalo todo a tu paso. Libranos de la crueldad y la miseria de los que plagan la torre. Deshazte la ruin progenie de la más inmunda ramera.',
        item: ''
    },
    {
        level: 11,
        name: 'Caballero Putrefacto',
        health: 210,
        power: { min: 30, max: 60 },
        accurate: 0.8,
        evasion: 0.4,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272572598710046780/remembrance_of_putrescence_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb7716&is=66ba2596&hm=85ed22436f491b90069546dbd9a96d9328fcc12cbe93c74f517740ac0e880430&',
        award: 10800,
        introduction: 'Tras llegar hasta lo más profundo de la Fisura, un jinete esquelético con un gran machete apareció para atacarte.',
        dialogue: '...',
        item: ''
    },
    {
        level: 12,
        name: 'Avatar del Árbol Umbrío',
        health: 400,
        power: { min: 30, max: 60 },
        accurate: 0.7,
        evasion: 0.2,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272572691685052428/remembrance_of_the_shadow_sunflower_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb772c&is=66ba25ac&hm=2b4ea57a1c4517243e2f4b12f4006ae198efad8c25166ca0e5e55cf57fc5c637&',
        award: 9600,
        introduction: 'Tras bajar hasta lo más profundo del Castillo Sombrío por un camino oculto y llegar hasta el pie del Árbol Umbrío, un gran girasol sombrío te atacó.',
        dialogue: '...',
        item: ''
    },
    {
        level: 13,
        name: 'Comandante Gaius',
        health: 200,
        power: { min: 30, max: 70 },
        accurate: 0.7,
        evasion: 0.3,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272572902486835291/remembrance_of_the_wild_boar_rider_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb775f&is=66ba25df&hm=cf72f614d4d63f79b09e677246a50103227349468da573f4764ffdae7bca633f&',
        award: 10800,
        introduction: 'Tras encontrar el camino hasta la puerta Norte del Castillo Sombrío, una armadura a lomos de un jabalí acorazado te atacó, blandiendo una lanza espada imbuida en poder gravitatorio.',
        dialogue: '...',
        item: ''
    },
    {
        level: 14,
        name: 'Metyr, Madre de los Dedos',
        health: 180,
        power: { min: 30, max: 90 },
        accurate: 0.2,
        evasion: 0.1,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272573073190551593/remembrance_of_the_mother_of_fingers_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb7787&is=66ba2607&hm=452d3f799af32e503082fa00270aea0d1ebcb59f55c5162eea6ce499020e9534&',
        award: 8000,
        introduction: 'Tras hacer sonar las tres campanas de dedos, lograste llegar ante una figura espeluznante, compuesta de dedos y con una gran laceración en su cuerpo, en cuanto te vio, atacó a uno de sus propios hijos, aparentemente de forma accidental y se acercó para atacarte.',
        dialogue: '...',
        item: ''
    },
    {
        level: 15,
        name: 'Midra, Señor de la Llama Frenética',
        health: 170,
        power: { min: 30, max: 80 },
        accurate: 0.9,
        evasion: 0.5,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272573282498904064/remembrance_of_the_lord_of_frenzied_flame_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb77b9&is=66ba2639&hm=f4caa522cfc0a2bc3c8cbeb1cb5b46e7fece9772fc42f8f45f49cd9286efbc01&',
        award: 16800,
        introduction: 'Tras adentrarte en lo más profundo del enfermo Abismo y llegar hasta la Casa Parroquial, en la última cámara, te espero un ser esbelto y enfermo, con una cabeza de llamas frenéticas, listo para desafiarte.',
        dialogue: 'Basta... He resistido... Más que suficiente... Te pido que me perdones, mi querida Nanaya... Aaaah.... ',
        item: ''
    },
    {
        level: 16,
        name: 'Malenia, Espada de Miquella',
        health: 200,
        power: { min: 40, max: 70 },
        accurate: 0.8,
        evasion: 0.8,
        image: 'https://media.discordapp.net/attachments/1267599517142745269/1272384116402425910/Remembrance_of_the_Rot_Goddess.png?ex=66bac78d&is=66b9760d&hm=dae9942357e141dd8414d0690e8b0298d643729aafc7af3cc0a71d2c1bcfe428&=&format=webp&quality=lossless&width=662&height=662',
        award: 16000,
        introduction: 'Tras encontrar la base del Árbol Hieráticom hasta sus raices, te encontraste a una guerrera protésica durmiendo en una silla. En cuanto te acercaste a ella, despertó y con calma sujetó su yelmo y empuñó su espada.',
        dialogue: 'Llevo tanto tiempo soñando... Que mi carne es ahora dorada... y mi sangre se ha podrido. Dejé innumerables cadáveres a mi paso... Todo ello esperando... a un ser querido. Haz caso a lo que digo. Me llamo Malenia, Espada de Miquella. Y jamás he conocido la derrota.',
        item: 'Gran Runa de Malenia'
    },
    {
        level: 17,
        name: 'Messmer, El Empalador',
        health: 210,
        power: { min: 40, max: 70 },
        accurate: 0.8,
        evasion: 0.7,
        image: 'https://media.discordapp.net/attachments/1267599517142745269/1272585665795723335/remembrance_of_the_impaler_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb8342&is=66ba31c2&hm=61296ad289632d47e9261b825732884c7eb4eac7fb56405cf9270774cd0394c5&=&format=webp&quality=lossless&width=250&height=250',
        award: 16000,
        introduction: 'Tras encontrar la cima de la fortaleza Sombría, fuiste recibido por una serpiente roja de ojos verdes, y más tarde, pudiste ver a un joven palido, de cabello rojizo y un ojo reemplazado por la runa de la reina Márika. En cuanto empuñó su lanza y conjuró una llama en su mano, supiste que estaba listo para combatir.',
        dialogue: 'Intruso sarnoso. Eres un Sin Luz, según parece. Madre, ¿acaso tu verdadero señoría sanciona a alguien tan despojado de la luz? Aun así... mi proposito no ha cambiado. Quienes se ven despojados del don del oro deberán hacer frente a la muerte... En el abrazo de la llama de Mesmmer. ',
        item: ''
    },
    {
        level: 18,
        name: 'Romina, la Santa del Brote',
        health: 260,
        power: { min: 40, max: 60 },
        accurate: 0.7,
        evasion: 0.2,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272585888223858791/remembrance_of_the_saint_of_the_bud_remembrances_elden_ring_shadow_of_the_erdtree_dlc_wiki_guide_200px.png?ex=66bb8377&is=66ba31f7&hm=3849a0784fdc0447cad39cb382e3843cd354171590f1004250de30cf2e1213ac&',
        award: 12800,
        introduction: 'Tras atravesar todas las antiguas ruinas de Rauh, hasta la iglesia del Brote, justo antes del Árbol Sellado, una mujer con cuerpo de cienpies y una lanza de putrefacción roja te detuvo, lista para combatir.',
        dialogue: '...',
        item: ''
    },
    {
        level: 19,
        name: 'Rykard, Señor de la Blasfemia',
        health: 400,
        power: { min: 80, max: 120 },
        accurate: 0.8,
        evasion: 0.0,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272384116897091584/Remembrance_of_the_Blasphemous.png?ex=66bac78d&is=66b9760d&hm=226c9d2be42e708ef10ee5e6fbc701de5da79296b844588477c85ef4082fd610&',
        award: 16000,
        introduction: 'Tras adentrarte en lo más profundo de la mansión volcánica, llegaste hasta el auditorio, en donde fuiste recibido por el Pretor Rykard, devorado y convertido en parte de la serpiente Devora Dioses, listo para luchar.',
        dialogue: 'Vaya. Muy bien. Tú... Únete al Rey Serpiente, forma parte de su familia. ¡Juntos, devoraremos a los propios dioses!',
        item: 'Gran Runa de Rykard'
    },
    {
        level: 20,
        name: 'Radahn, Rey Prometido',
        health: 300,
        power: { min: 50, max: 100 },
        accurate: 0.9,
        evasion: 0.3,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272590832821862450/menu_knowledge_00739-3fd1fed8.png?ex=66bb8812&is=66ba3692&hm=1b806b82d3fffe40beabbf7a72a4db9a9e9416d24ad73333370d12ae3a4371da&',
        award: 18000,
        introduction: 'Tras atravesar Enir-Ilim y llegar hasta lo más alto en la Puerta Divina, ya casi cumplías tu objetivo de derrotar al Empíreo Miquella, pero justo entonces, Radahn, en un nuevo cuerpo hecho con los restos del Semidios Mohg, apareció, al igual que Miquella, ahora ascendido como deidad, el cual se subió a la espalda de su hermanastro, listos para combatir.',
        dialogue: 'Mi fiel espada y campeón del festival. Tus hazañas siempre serán alabadas en canciones. Ahora, es preciso honrar el juramento para que regrese el alma de mi señor hermano. Para que pueda ser mi rey.',
        item: ''
    },
    {
        level: 21,
        name: 'Gigante de Fuego',
        health: 500,
        power: { min: 60, max: 100 },
        accurate: 0.7,
        evasion: 0.0,
        image: 'https://media.discordapp.net/attachments/1267599517142745269/1272384136962773045/Remembrance_of_the_Fire_Giant.png?ex=66bac792&is=66b97612&hm=d2b8b417518579735d2e3e8fa310c6806fe37f83ed4e8d7b6946384c00a87aa2&=&format=webp&quality=lossless&width=662&height=662',
        award: 8000,
        introduction: 'Tras atravesar las tierras prohibidas de Pico de los Gigantes y llegar hasta el Pico de la Llama, te encontraste al último de los Gigantes de Fuego, custodiando el paso hasta la Forja de los Gigantes, no te dejaría continuar sin luchar.',
        dialogue: '...',
        item: ''
    },
    {
        level: 22,
        name: 'Señor Dragón Placidusax',
        health: 450,
        power: { min: 50, max: 100 },
        accurate: 0.7,
        evasion: 0.2,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272384137755623485/Remembrance_of_the_Dragonlord.png?ex=66bac792&is=66b97612&hm=220ee69277e4c44419e4317ac7a145907e4c3a3a8dc7a940b6c2a7cc36870f17&',
        award: 16000,
        introduction: 'Tras atravesar la ciudad en ruinas Farum Azula y conseguir llegar hasta la parte más baja cerca del origen de la tormenta, el tiempo comenzó a retroceder, hasta la recreación de una enorme plataforma de piedra y un gran dragón antiguo de escamas de grava y oro, flotando en el aire con dos cabezas. Alzó las alas invocando dracorrayos, listo para combatir.',
        dialogue: '...',
        item: ''
    },
    {
        level: 23,
        name: 'Maliketh, la Hoja Negra',
        health: 250,
        power: { min: 1250, max: 1250 },
        accurate: 0.6,
        evasion: 0.4,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272384115408113684/Remembrance_of_the_Black_Blade.png?ex=66bac78c&is=66b9760c&hm=1c78f6b520a1a16ca3d807ba1d67088832506f2ace8281f8903587a616404802&',
        award: 18400,
        introduction: 'Tras atravesar la ciudad en ruinas Farum Azula y llegar hasta el Clerigo Bestia, el cual al deducir tus intenciones, rompió el selló que contenía a la muerte escrita y la convirtió en un espadón de obsidiana, el cual usaría para atacarte.',
        dialogue: 'Oh, Muerte. Conviértete en mi espada una vez más.',
        item: 'Armadura +3'
    },
    {
        level: 24,
        name: 'Hoarah Loux, Guerrero',
        health: 240,
        power: { min: 40, max: 80 },
        accurate: 0.8,
        evasion: 0.5,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272384114951196793/Remembrance_of_Hoarah_Loux.png?ex=66bac78c&is=66b9760c&hm=6aaeb4f572f710545d89afce19bb400a556a4495f1da8dc12058a7b71c4a5892&',
        award: 16200,
        introduction: 'Tras volver a la capital y llegar hasta el trono del señor del Círculo, en la base del Árbol Áureo, te encontraste a un gran hombre de cabello blanco y al león Rey de las bestias sobre su espalda.\n\n"Ha sido una lucha larga y dificil. Guerrero Sin Luz. Privado del don del oro. Ten por seguro que el Círculo de Elden se halla muy cerca. Por desgracia, aquí estoy denuevo, para reclamarlo una vez más."\n\nEl hombre alzó su pierna antes de pisar fuerte, haciendo retumbar los alrededores.\n\n"Yo, Godfrey, ¡el Primer Señor del Círculo!"\n\nTras demostrarle tu fuerza, el hombre se deshizo del león sobre tu espalda, al igual que de su hacha y su armadura. Preprarándose para una lucha a muerte.',
        dialogue: 'Ya basta de ser amable contigo... ¡Raaaaaargh! ¡Ahora peleo como Hoarah Loux! ¡Como un guerero!',
        item: ''
    },
    {
        level: 25,
        name: 'Bestia Elden',
        health: 500,
        power: { min: 40, max: 100 },
        accurate: 0.7,
        evasion: 0.1,
        image: 'https://cdn.discordapp.com/attachments/1267599517142745269/1272384135507476595/Elden_Remembrance.png?ex=66bac791&is=66b97611&hm=ba5b78c31decdd1bd21c21a80a735e65938cf5dab0d3e2fbccba8380969564fd&',
        award: 20000,
        introduction: 'Tras atravesar el muro de espinas vueltas cenizas que mantenían sellado al interior del Árbol Dorado, pudiste ver dentro a la Reina Márika, la Eterna, siendo convertida en una Reliquia de Espada Sagrada, con una hoja trenzada de color dorado y siendo empuñada por una criatura venida de las estrellas, esperando para desafiarte.',
        dialogue: '...',
        item: ''
    },
];

function getRandomNumber(x, y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

module.exports = {
    run: async ({ interaction }) => {
        const userId = interaction.user.id;

        let userProfile = await UserProfile.findOne({ userId }).select('userId balance health defeatedBosses stats');
        if (!userProfile) {
            userProfile = new UserProfile({ userId, balance: 0, health: 100, defeatedBosses: [], stats: [] });
            await userProfile.save(); // Guardar inmediatamente si es nuevo
        } else if (!userProfile.defeatedBosses) {
            userProfile.defeatedBosses = [];
            await userProfile.save(); // Guardar inmediatamente si defeatedBosses estaba undefined
        }
        const stats = userProfile.stats
        const level = stats.level;
            const vitality =  stats.vitality;
            const health = Math.floor(100 * ( 5 - ( 36 / ( vitality + 8 ) ) ));
            const attack =  stats.attack;
            const evasionRaw =  stats.evasion;
            const evasion = 13.5 / (evasionRaw + 12.5);
            const accuracyRaw =  stats.accuracy;
            const accuracy = 9 / (accuracyRaw + 8);

        const defeatedBosses = userProfile.defeatedBosses || [];

        let userInventory = await Inventory.findOne({ userId });

        if (!userInventory) {
            userInventory = new Inventory({ userId });
            await userInventory.save();
        }
        if (userInventory.items.find(item => item.name === 'Imitación de la Gracia')) {
            
        } else {
            return interaction.reply({ content: 'No cuentas con una Imitación de Gracia como para seguir un camino.', ephemeral: true })
        }

        const getArmorLevel = (inventory) => {
            let ArmorLevel = 1;
            if (!inventory) return ArmorLevel;
            const armor = inventory.items.find(item => item.name.startsWith('Armadura'));
            if (armor) {
                if (armor.name === 'Armadura') ArmorLevel = 0.85;
                if (armor.name === 'Armadura +1') ArmorLevel = 0.7;
                if (armor.name === 'Armadura +2') ArmorLevel = 0.55;
                if (armor.name === 'Armadura +3') ArmorLevel = 0.4;
            }
            return ArmorLevel;
        };

        const neggateDamage = getArmorLevel(userInventory)
        const MaxUserHealth = health;
        let userHealth = MaxUserHealth;

        const currentBoss = bosses.find(boss => !defeatedBosses.includes(boss.level));

        if (!currentBoss) {
            return interaction.reply({
                content: 'Ya has derrotado a todos enemigos poderosos.',
                ephemeral: true
            });
        }

        let bossHealth = currentBoss.health;

        const getSwordLevel = (inventory) => {
            if (!inventory) return 0;
            const sword = inventory.items.find(item => item.name.startsWith('Espada'));
            if (sword) {
                if (sword.name === 'Espada') return 1;
                if (sword.name === 'Espada +1') return 2;
                if (sword.name === 'Espada +2') return 3;
                if (sword.name === 'Espada +3') return 4;
                if (sword.name === 'Espada +4') return 5;
            }
            return 0;
        };

        const userSwordLevel = getSwordLevel(userInventory);

        let currentTurn = 0;

        const getRandomDamage = (level) => {
            const baseDamage = getRandomNumber(5, 20) * (Math. sqrt(attack));
            const swordMultiplier = 1 + (level * 0.1);
            return Math.floor(baseDamage * swordMultiplier);
        };

        const createCombatEmbed = (description) => {
            return new EmbedBuilder()
                .setColor('#b0875f')
                .setTitle(`Duelo contra ${currentBoss.name}`)
                .setDescription(description)
                .setThumbnail(currentBoss.image)
                .addFields(
                    { name: `${interaction.member.displayName}`, value: `${userHealth}`, inline: true },
                    { name: `${currentBoss.name}`, value: `${bossHealth}`, inline: true },
                );
        };

        const confirmButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Iniciar Duelo')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Rechazar')
                .setStyle(ButtonStyle.Secondary)
        );

        const StartEmbed = new EmbedBuilder()
            .setTitle('Enfrentamiento contra Enemigo Poderoso')
            .setColor('#b0875f')
            .setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.user.avatarURL() })
            .setDescription(`${currentBoss.introduction}\n\n"${currentBoss.dialogue}"`);

        await interaction.reply({ embeds: [StartEmbed], components: [confirmButtons] });

        const confirmCollector = interaction.channel.createMessageComponentCollector({
            filter: i => i.user.id === userId,
            max: 1,
            time: 120000
        });

        const createHealButton = (inventory) => {
            if (!inventory || !inventory.items.some(item => item.name === 'Vial de Lágrimas')) return null;

            return new ButtonBuilder()
                .setCustomId('heal')
                .setLabel('Curar')
                .setStyle(ButtonStyle.Secondary);
        };

        confirmCollector.on('collect', async i => {
            if (i.customId === 'confirm') {
                await i.update({ content: '', components: [] });

                const healButton = createHealButton(userInventory);

                const actionRow = new ActionRowBuilder();
                actionRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId('attack')
                        .setLabel('Atacar')
                        .setStyle(ButtonStyle.Primary)
                );

                if (healButton) actionRow.addComponents(healButton);

                await interaction.editReply({
                    embeds: [createCombatEmbed('El combate ha comenzado.')],
                    components: [actionRow]
                });

                const collector = interaction.channel.createMessageComponentCollector({
                    filter: i => i.user.id === userId || i.customId === 'boss-attack',
                    time: 120000
                });

                collector.on('collect', async i => {
                    let description = '';

                    if (i.customId === 'attack') {
                        const damage = getRandomDamage(userSwordLevel);
                        const hitChance = Math.random();

                        if (hitChance > currentBoss.evasion * accuracy) {
                            bossHealth -= damage;
                            description = `${interaction.member.displayName} ha lanzado un ataque y hecho ${damage} de daño a ${currentBoss.name}!`;
                        } else {
                            description = '¡El ataque falló!';
                        }
                    } else if (i.customId === 'heal') {
                        if (userInventory.items.some(item => item.name === 'Vial de Lágrimas')) {
                            let healAmount = parseInt(getRandomNumber(15, 50) * MaxUserHealth / 100);
                            userHealth = Math.min(userHealth + healAmount, MaxUserHealth);
                            description = `${interaction.member.displayName} se ha curado ${healAmount} puntos de salud.`;
                            const vialIndex = userInventory.items.findIndex(item => item.name === 'Vial de Lágrimas');
                            if (vialIndex > -1) {
                                if (userInventory.items[vialIndex].quantity > 1) {
                                    userInventory.items[vialIndex].quantity -= 1;
                                } else {
                                    userInventory.items.splice(vialIndex, 1);
                                }
                                await userInventory.save();
                            }
                        } else {
                            description = 'No tienes Viales de Lágrimas en tu inventario.';
                        }
                    }

                    if (userHealth <= 0) {
                        description = '¡Has sido derrotado! El jefe te ha vencido.';
                        await interaction.editReply({
                            embeds: [createCombatEmbed(description)],
                            components: []
                        });
                        return;
                    }

                    let BossItem = ''
                    if (currentBoss.item != '') {
                        BossItem = `\n\n+${currentBoss.item}`
                    }

                    if (bossHealth <= 0) {
                        description = `¡Has vencido a ${currentBoss.name}! Has recibido <:Runa:1267952292053647496>${currentBoss.award} runas.${BossItem}`;
                        userProfile.defeatedBosses.push(currentBoss.level);
                        userProfile.balance += currentBoss.award;


                        const item = currentBoss.item;
                        const inventory = await Inventory.findOne({ userId });
                        if (item != '') {
                            if (inventory) {
                            
                                // Asegúrate de que item es un string
                                if (typeof item === 'string') {
                                    const shopItem = await ShopItem.findOne({ name: item });
                                    const description = shopItem ? shopItem.description : 'Descripción no disponible';
                                    const usable = shopItem ? shopItem.usable : false;
                        
                                    const existingItem = inventory.items.find(i => i.name === item);
                                    if (existingItem) {
                                        existingItem.quantity += 1;
                                    } else {
                                        inventory.items.push({
                                            name: item,
                                            quantity: 1,
                                            usable,
                                            description
                                        });
                                    }
                                } else {
                                    console.error(`Item no es un string: ${item}`);
                                }
                            await inventory.save();
                            } else {
                                // Si no existe un inventario, crea uno nuevo
                                const newInventory = new Inventory({
                                    userId,
                                    items: await Promise.all(foundItems.map(async (item) => {
                                        if (typeof item === 'string') {
                                            const shopItem = await ShopItem.findOne({ name: item });
                                            const description = shopItem ? shopItem.description : 'Descripción no disponible';
                                            const usable = shopItem ? shopItem.usable : false;
                                            return {
                                                name: item,
                                                quantity: 1,
                                                usable,
                                                description
                                            };
                                        } else {
                                            console.error(`Item no es un string: ${item}`);
                                            return null;
                                        }
                                    })).filter(item => item !== null), // Filtrar posibles valores nulos
                                });
                                await newInventory.save();
                            }
                        }
                        

                        await userProfile.save();
                        await interaction.editReply({
                            embeds: [createCombatEmbed(description)],
                            components: []
                        });
                        return;
                    }

                    if (currentTurn === 0) {
                        currentTurn = 1;
                        // Boss attack
                        const hitChance = Math.random();

                        if (hitChance < currentBoss.accurate * evasion) {
                                                       
                            // Usar la función con el objeto currentBoss.power
                            const bossDamage = Math.floor(getRandomNumber(currentBoss.power.min, currentBoss.power.max) * neggateDamage);
                            userHealth -= bossDamage;
                            description += `\n\n${currentBoss.name} ha lanzado un ataque y hecho ${bossDamage} de daño a ${interaction.member.displayName}!`;
                        } else {
                            description += `\n\n${currentBoss.name} ha fallado su ataque.`;
                        }

                        if (userHealth <= 0) {
                            description = `¡Has sido derrotado por ${currentBoss.name}!`;
                            userProfile.balance = 0;
                            await userProfile.save();
                            await interaction.editReply({
                                embeds: [createCombatEmbed(description)],
                                components: []
                            });
                            return;
                        }

                        currentTurn = 0;
                    }

                    await interaction.editReply({
                        embeds: [createCombatEmbed(description)],
                        components: [actionRow]
                    });
                });

            } else if (i.customId === 'cancel') {
                await interaction.editReply({ content: 'Has decidido no enfrentarte al jefe.', components: [] });
            }
        });
    },

    data: {
        name: 'desafiar-enemigo-poderoso',
        description: 'Enfréntate a un enemigo cada vez más poderoso para obtener runas y valiosos objetos.',
    },
};
