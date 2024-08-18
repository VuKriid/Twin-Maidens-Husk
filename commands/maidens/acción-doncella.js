const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const Maiden = require('../../schemas/Maiden');
const Inventory = require('../../schemas/Inventory');

const actionsAvailable = [
    { name: 'Observar', riskLevel: 1 },
    { name: 'Tomar de la Mano', riskLevel: 2 },
    { name: 'Abrazar', riskLevel: 3 },
    { name: 'Besar', riskLevel: 4 },
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
            { action: 'observar', response: '"Hum... ¿Sucede algo, Sin Luz?"\n\n{MaidenName} apartó la mirada con algo de incomodidad.' },
            { action: 'tomar de la mano', response: '{MaidenName} te arrebató su mano con algo de incomodidad.\n\n"Por favor no hagas eso, Sin Luz."' },
            { action: 'abrazar', response: '{MaidenName} rápidamente se apartó de ti bastante incomoda por tu atrevimiento.\n\n"Sin Luz... No vuelvas a hacer eso de nuevo, por favor..."' },
            { action: 'besar', response: '{MaidenName} te apartó cuando intentaste besarla, poniendo una mueca llena de aprensión. Sin decir nada más, te dio la espalda.' }
        ],
        SecondAffect: [
            { action: 'observar', response: '{MaidenName} te regresó la mirada con confusión.\n\n"¿Sin Luz?"' },
            { action: 'tomar de la mano', response: '{MaidenName} sutilmente te quitó su mano, mirando hacia el lado ligeramente incomoda.' },
            { action: 'abrazar', response: '{MaidenName} te empujó suavemente hacia atrás antes de que pudieras terminar de abrazarla.\n\n"Sin abrazos, Sin Luz."' },
            { action: 'besar', response: '{MaidenName} se apartó bastante incomodada por tu actuar, dándote la espalda.\n\n"Sin Luz... No vuelvas a hacer eso de nuevo..."' },
        ],
        ThirdAffect: [
            { action: 'observar', response: '{MaidenName} te devolvió la mirada con curiosidad.\n\n"Hum..."' },
            { action: 'tomar de la mano', response: '{MaidenName} te permitió sostener su mano mientras miraba hacia otro lado.' },
            { action: 'abrazar', response: '{MaidenName} parecía un poco nerviosa cuando la abrazaste, pero lentamente te correspondió.\n\n"¿Tú... Querías un abrazo, {OwnerName}?"' },
            { action: 'besar', response: '{MaidenName} giró la cabeza antes de que pudieras besarla, terminando por darle un beso en la mejilla. No dijo mucho más, parecía ansiosa.' },
        ],
        FourthAffect: [
            { action: 'observar', response: '{MaidenName} te regresó la mirada, sonriendo suavemente.\n\n"¿{OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos mientras sujetabas su mano, caminando con tranquilidad.' },
            { action: 'abrazar', response: '{MaidenName} te correspondió el abrazo de inmediato, pudiste sentir su calidez.' },
            { action: 'besar', response: '{MaidenName} correspondió a tu beso, parecía muy feliz tras ello.\n\n"Quiero que sepas, {OwnerName}, que eres alguien importante para mí."' },
        ]
    },
    {
        personality: 'Enérgica',
        FirstAffect: [
            { action: 'observar', response: '"¡Oye! ¿Por qué me miras tanto, Sin Luz?"\n\n{MaidenName} te dio un pequeño golpe en el brazo, sonriendo de manera juguetona.' },
            { action: 'tomar de la mano', response: '{MaidenName} se soltó de inmediato, riendo un poco.\n\n"¡Jaja! ¡Eso fue inesperado, Sin Luz!"' },
            { action: 'abrazar', response: '{MaidenName} se apartó rápidamente, riendo de forma nerviosa.\n\n"¡Wow, Sin Luz! ¡Eres muy directo! Pero no tan rápido..."' },
            { action: 'besar', response: '{MaidenName} se echó hacia atrás, poniendo una expresión sorprendida.\n\n"¡¿Qué haces?! Eso fue un poco inesperado..."' }
        ],
        SecondAffect: [
            { action: 'observar', response: '{MaidenName} te regresó la mirada con una sonrisa traviesa.\n\n"¿Me estás retando a un concurso de miradas, Sin Luz?"' },
            { action: 'tomar de la mano', response: '{MaidenName} te dejó sostener su mano brevemente antes de apartarla con una sonrisa.\n\n"¡Mira quién se está volviendo valiente!"' },
            { action: 'abrazar', response: '{MaidenName} se quedó quieta por un momento, luego rió y te empujó suavemente.\n\n"¡Está bien, está bien, Sin Luz, pero no te acostumbres!"' },
            { action: 'besar', response: '{MaidenName} se sorprendió, pero luego rió un poco nerviosa.\n\n"¡Eso fue inesperado... pero interesante!"' }
        ],
        ThirdAffect: [
            { action: 'observar', response: '{MaidenName} te miró con una sonrisa llena de energía.\n\n"¿Algo en mi cara, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos por un momento, sonriendo.\n\n"¡Vamos, {OwnerName}, a ver qué más tienes!"' },
            { action: 'abrazar', response: '{MaidenName} te devolvió el abrazo rápidamente, riendo con alegría.\n\n"¡Eres un abrazo sorpresa, {OwnerName}!"' },
            { action: 'besar', response: '{MaidenName} se dejó besar en la mejilla y luego te dio un rápido beso en respuesta, sonriendo ampliamente.\n\n"¡Eso fue divertido, {OwnerName}!"' }
        ],
        FourthAffect: [
            { action: 'observar', response: '{MaidenName} te miró fijamente y luego sonrió ampliamente.\n\n"¿Qué tienes en mente, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos de manera firme y caminó a tu lado con energía.\n\n"¡Vamos, {OwnerName}, hay mucho por hacer!"' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con fuerza y rió mientras lo hacía.\n\n"¡Me encanta cuando haces eso, {OwnerName}!"' },
            { action: 'besar', response: '{MaidenName} te devolvió el beso con entusiasmo, sonriendo con felicidad.\n\n"¡Eres el mejor, {OwnerName}!"' }
        ]
    },
    {
        personality: 'Cariñosa',
        FirstAffect: [
            { action: 'observar', response: '"¿Sucede algo, Sin Luz?"\n\n{MaidenName} te miró con dulzura, aunque parecía un poco reservada.' },
            { action: 'tomar de la mano', response: '{MaidenName} sonrió suavemente, aunque se soltó con delicadeza.\n\n"Tal vez más adelante, Sin Luz."' },
            { action: 'abrazar', response: '{MaidenName} se apartó con gentileza, mirándote con una sonrisa comprensiva.\n\n"Quizás no sea el momento adecuado, Sin Luz."' },
            { action: 'besar', response: '{MaidenName} te detuvo antes de que pudieras besarla, pero lo hizo con una expresión amable.\n\n"Vamos despacio, Sin Luz."' }
        ],
        SecondAffect: [
            { action: 'observar', response: '{MaidenName} te devolvió la mirada con una sonrisa tierna.\n\n"¿Te preocupa algo, Sin Luz?"' },
            { action: 'tomar de la mano', response: '{MaidenName} te permitió sostener su mano por un momento antes de apartarla suavemente.\n\n"Es un gesto bonito, pero prefiero esperar un poco más."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó brevemente antes de retroceder un poco, aún sonriendo.\n\n"Es un lindo gesto, Sin Luz, pero vamos con calma."' },
            { action: 'besar', response: '{MaidenName} giró la cabeza antes de que pudieras besarla, aunque te dio una caricia suave en la mejilla.\n\n"Hay tiempo para todo, Sin Luz."' }
        ],
        ThirdAffect: [
            { action: 'observar', response: '{MaidenName} te devolvió la mirada con una expresión tranquila y cariñosa.\n\n"¿En qué piensas, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos, su sonrisa cálida.\n\n"Me gusta esto, {OwnerName}."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con ternura, apoyando su cabeza en tu hombro.\n\n"Esto es agradable, {OwnerName}."' },
            { action: 'besar', response: '{MaidenName} te permitió besarla suavemente, correspondiendo con calidez.\n\n"Eres alguien muy especial para mí, {OwnerName}."' }
        ],
        FourthAffect: [
            { action: 'observar', response: '{MaidenName} te miró con una profunda ternura, su sonrisa reflejando todo el cariño que siente por ti.\n\n"¿Sí, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos de manera segura, caminando a tu lado con una expresión de paz.\n\n"Siempre estaré a tu lado, {OwnerName}."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con calidez, como si nunca quisiera soltarte.\n\n"Este es mi lugar favorito, {OwnerName}, junto a ti."' },
            { action: 'besar', response: '{MaidenName} te besó con amor y dedicación, su sonrisa iluminando su rostro.\n\n"Te amo, {OwnerName}, con todo mi corazón."' }
        ]
    },
    {
        personality: 'Amable',
        FirstAffect: [
            { action: 'observar', response: '"¿Te pasa algo, Sin Luz?"\n\n{MaidenName} te devolvió la mirada con una expresión serena.' },
            { action: 'tomar de la mano', response: '{MaidenName} se sorprendió un poco, pero no apartó su mano de inmediato.\n\n"Eso fue inesperado, Sin Luz."' },
            { action: 'abrazar', response: '{MaidenName} se quedó quieta por un momento antes de retroceder suavemente.\n\n"Quizás no sea el momento adecuado, Sin Luz."' },
            { action: 'besar', response: '{MaidenName} se apartó con una leve sonrisa, mirándote con una expresión neutral.\n\n"Eso fue un poco apresurado, ¿no crees?"' }
        ],
        SecondAffect: [
            { action: 'observar', response: '{MaidenName} te devolvió la mirada con una sonrisa tranquila.\n\n"¿En qué piensas, Sin Luz?"' },
            { action: 'tomar de la mano', response: '{MaidenName} permitió que sostuvieras su mano por un momento antes de retirarla con delicadeza.\n\n"Eso fue inesperado, pero agradable."' },
            { action: 'abrazar', response: '{MaidenName} te devolvió el abrazo brevemente antes de apartarse con una sonrisa neutral.\n\n"Un gesto bonito, Sin Luz."' },
            { action: 'besar', response: '{MaidenName} se apartó ligeramente, aunque mantuvo una expresión amable.\n\n"Vamos despacio, ¿sí?"' }
        ],
        ThirdAffect: [
            { action: 'observar', response: '{MaidenName} te miró con curiosidad y una suave sonrisa.\n\n"¿Hay algo que quieras decirme, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos por un momento, sonriendo de manera tranquila.\n\n"Esto es agradable, {OwnerName}."' },
            { action: 'abrazar', response: '{MaidenName} te devolvió el abrazo con calidez, aunque mantuvo cierta distancia.\n\n"Me gusta estar cerca de ti, {OwnerName}."' },
            { action: 'besar', response: '{MaidenName} permitió que la besaras en la mejilla y respondió con una sonrisa sincera.\n\n"Eres muy amable, {OwnerName}."' }
        ],
        FourthAffect: [
            { action: 'observar', response: '{MaidenName} te devolvió la mirada con una expresión amable, sonriendo suavemente.\n\n"¿Sí, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos y caminó a tu lado con serenidad.\n\n"Disfruto de estos momentos, {OwnerName}."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con afecto y calidez, quedándose cerca por un momento.\n\n"Me hace feliz estar contigo, {OwnerName}."' },
            { action: 'besar', response: '{MaidenName} correspondió a tu beso de manera suave, sonriendo con calidez.\n\n"Te quiero mucho, {OwnerName}."' }
        ]
    },
    {
        personality: 'Fría',
        FirstAffect: [
            { action: 'observar', response: '"¿Qué miras, Sin Luz?"\n\n{MaidenName} desvió la mirada con una expresión molesta.' },
            { action: 'tomar de la mano', response: '{MaidenName} rápidamente apartó su mano con brusquedad.\n\n"¡No te atrevas a tocarme, Sin Luz!"' },
            { action: 'abrazar', response: '{MaidenName} se apartó de inmediato, empujándote hacia atrás.\n\n"¡No creas que puedes hacer lo que quieras conmigo!"' },
            { action: 'besar', response: '{MaidenName} te empujó con fuerza antes de que pudieras besarla, su expresión llena de enojo.\n\n"¡Ni lo pienses, Sin Luz!"' }
        ],
        SecondAffect: [
            { action: 'observar', response: '"¿Qué estás mirando?"\n\n{MaidenName} te miró con una mezcla de enfado y nerviosismo.' },
            { action: 'tomar de la mano', response: '{MaidenName} dejó que tomes su mano por un segundo antes de apartarla bruscamente.\n\n"¡No creas que esto significa algo especial!"' },
            { action: 'abrazar', response: '{MaidenName} te empujó con menos fuerza esta vez, pero aún visiblemente incómoda.\n\n"¡Eres un idiota, Sin Luz!"' },
            { action: 'besar', response: '{MaidenName} te esquivó rápidamente, pero no se alejó del todo.\n\n"¡No creas que me gustas o algo así!"' }
        ],
        ThirdAffect: [
            { action: 'observar', response: '{MaidenName} te miró por un momento antes de desviar la vista, con una expresión un poco menos hostil.\n\n"¿Qué es lo que quieres, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} dejó que sostuvieras su mano un poco más, aunque su rostro estaba ligeramente sonrojado.\n\n"No creas que esto me hace feliz ni nada por el estilo..."' },
            { action: 'abrazar', response: '{MaidenName} se quedó rígida en tus brazos antes de suspirar, devolviendo el abrazo de forma torpe.\n\n"No te acostumbres a esto, {OwnerName}..."' },
            { action: 'besar', response: '{MaidenName} te permitió besarla brevemente, aunque su rostro se tornó rojo.\n\n"¡Es solo un beso, no significa nada!"' }
        ],
        FourthAffect: [
            { action: 'observar', response: '{MaidenName} te miró con un leve rubor en sus mejillas, aunque trató de mantener una expresión severa.\n\n"¿Por qué me miras así, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos, pero miró hacia otro lado para ocultar su sonrojo.\n\n"Solo porque no me molesta... no significa que me guste..."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con fuerza, aunque no pudo evitar sonrojarse intensamente.\n\n"¡Solo porque tú lo querías, {OwnerName}...!"' },
            { action: 'besar', response: '{MaidenName} finalmente te besó, aunque inmediatamente te dio la espalda para ocultar su vergüenza.\n\n"¡Eres tan tonto, {OwnerName}...!"' }
        ]
    },
    {
        personality: 'Formal',
        FirstAffect: [
            { action: 'observar', response: '{MaidenName} te miró con una expresión neutral, ligeramente inclinando la cabeza.\n\n"¿Hay algo que desee, mi señor?"' },
            { action: 'tomar de la mano', response: '{MaidenName} retiró su mano suavemente, haciendo una pequeña reverencia.\n\n"Disculpe, mi señor, pero tal contacto es inapropiado."' },
            { action: 'abrazar', response: '{MaidenName} se apartó con delicadeza, manteniendo su compostura.\n\n"Por favor, mi señor, tales gestos no son adecuados."' },
            { action: 'besar', response: '{MaidenName} se retiró rápidamente, bajando la mirada con una expresión seria.\n\n"Le ruego que no vuelva a intentar tal cosa, mi señor."' }
        ],
        SecondAffect: [
            { action: 'observar', response: '{MaidenName} sostuvo tu mirada con calma, ofreciendo una leve sonrisa.\n\n"¿Puedo ayudarle en algo, mi señor?"' },
            { action: 'tomar de la mano', response: '{MaidenName} permitió que sostuvieras su mano por un momento antes de retirarla con cortesía.\n\n"Un gesto inusual, pero lo agradezco, mi señor."' },
            { action: 'abrazar', response: '{MaidenName} se tensó por un instante antes de apartarse con una leve inclinación de cabeza.\n\n"Le pido que guarde las formas, mi señor."' },
            { action: 'besar', response: '{MaidenName} se apartó con calma, mirándote con seriedad.\n\n"Esto no es propio, mi señor... Le pido discreción."' }
        ],
        ThirdAffect: [
            { action: 'observar', response: '{MaidenName} te miró directamente a los ojos, con una ligera sonrisa.\n\n"¿Hay algo en particular que le llame la atención, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} permitió que sostuvieras su mano por más tiempo, aunque su mirada permaneció fija en otro lado.\n\n"Un gesto inesperado, pero no del todo desagradable, {OwnerName}."' },
            { action: 'abrazar', response: '{MaidenName} correspondió brevemente el abrazo, pero pronto se apartó, su expresión mostrando una leve incomodidad.\n\n"No es común que actúe de esta manera, {OwnerName}."' },
            { action: 'besar', response: '{MaidenName} dejó que la besaras en la mejilla, pero pronto apartó su rostro, ligeramente sonrojada.\n\n"Por favor, {OwnerName}, seamos prudentes."' }
        ],
        FourthAffect: [
            { action: 'observar', response: '{MaidenName} te miró con ternura, su expresión suavizándose.\n\n"¿Sí, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos, caminando a tu lado con tranquilidad.\n\n"Me siento honrada de acompañarle, {OwnerName}."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con calidez, sin apartarse de tu lado.\n\n"Es un honor estar a su lado, {OwnerName}."' },
            { action: 'besar', response: '{MaidenName} correspondió a tu beso, aunque mantuvo una expresión seria.\n\n"Debo admitir que aprecio mucho su compañía, {OwnerName}."' }
        ]
    },
    {
        personality: 'Tímida',
        FirstAffect: [
            { action: 'observar', response: '{MaidenName} bajó la mirada rápidamente, sonrojándose.\n\n"¿P-Por qué me mira así, Sin Luz?"' },
            { action: 'tomar de la mano', response: '{MaidenName} retiró su mano de inmediato, su rostro completamente rojo.\n\n"¡E-Espera, Sin Luz... No... No estoy lista para esto!"' },
            { action: 'abrazar', response: '{MaidenName} se quedó completamente quieta, demasiado nerviosa para moverse.\n\n"¿Q-Q-Qué estás haciendo, Sin Luz...?"' },
            { action: 'besar', response: '{MaidenName} se apartó rápidamente, evitando tu mirada mientras su rostro ardía de vergüenza.\n\n"¡No... No tan de repente, por favor!"' }
        ],
        SecondAffect: [
            { action: 'observar', response: '{MaidenName} te devolvió la mirada por un segundo antes de apartarla tímidamente.\n\n"¿P-Pasa algo, Sin Luz?"' },
            { action: 'tomar de la mano', response: '{MaidenName} dejó que sostuvieras su mano por un momento, pero estaba claramente nerviosa.\n\n"Esto... esto es un poco... difícil para mí, Sin Luz..."' },
            { action: 'abrazar', response: '{MaidenName} correspondió a tu abrazo, aunque su cuerpo estaba tenso.\n\n"E-Esto es... un poco abrumador..."' },
            { action: 'besar', response: '{MaidenName} se quedó quieta cuando intentaste besarla, pero finalmente apartó la cara, todavía ruborizada.\n\n"¿P-Por qué... es tan difícil...?"' }
        ],
        ThirdAffect: [
            { action: 'observar', response: '{MaidenName} te miró brevemente antes de bajar la vista, sonrojándose un poco.\n\n"Es... Es difícil para mí sostener tu mirada, {OwnerName}..."' },
            { action: 'tomar de la mano', response: '{MaidenName} te permitió sostener su mano, aunque su agarre era débil y tembloroso.\n\n"S-Sigo poniéndome nerviosa cuando haces esto, {OwnerName}..."' },
            { action: 'abrazar', response: '{MaidenName} correspondió a tu abrazo, apoyando suavemente su cabeza en tu hombro.\n\n"S-Siento que mi corazón va a estallar..."' },
            { action: 'besar', response: '{MaidenName} finalmente dejó que la besaras, aunque su rostro se tornó rojo brillante.\n\n"N-No me odies si me pongo demasiado nerviosa, {OwnerName}..."' }
        ],
        FourthAffect: [
            { action: 'observar', response: '{MaidenName} te miró con ternura, aunque aún parecía un poco nerviosa.\n\n"T-Todavía me pongo nerviosa a veces... pero me hace feliz verte, {OwnerName}."' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos, apretando suavemente tu mano.\n\n"M-Me siento más segura cuando estoy contigo, {OwnerName}..."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con fuerza, recostando su cabeza en tu pecho.\n\n"C-Cuando me abrazas... todo parece estar bien..."' },
            { action: 'besar', response: '{MaidenName} te besó con delicadeza, aunque seguía un poco sonrojada.\n\n"T-Todavía me siento un poco nerviosa... pero no quiero que te alejes, {OwnerName}."' }
        ]
    },
    {
        personality: 'Lanzada',
        FirstAffect: [
            { action: 'observar', response: '{MaidenName} te devolvió la mirada con una sonrisa traviesa.\n\n"¿Te gusta lo que ves, Sin Luz?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos, inclinándose ligeramente hacia ti.\n\n"Vaya, Sin Luz, no sabía que te gustaban estos gestos tan atrevidos..."' },
            { action: 'abrazar', response: '{MaidenName} se permitió disfrutar del abrazo, rozando ligeramente tu espalda.\n\n"¿Te sientes cómodo allí, Sin Luz?"' },
            { action: 'besar', response: '{MaidenName} se acercó antes de que pudieras besarla, dejando que tus labios rozaran los suyos brevemente.\n\n"¿Eso es todo lo que tienes, Sin Luz?"' }
        ],
        SecondAffect: [
            { action: 'observar', response: '{MaidenName} te miró con ojos brillantes, sonriendo con picardía.\n\n"¿Planeas hacer algo interesante, Sin Luz?"' },
            { action: 'tomar de la mano', response: '{MaidenName} acarició suavemente tu mano con el pulgar, acercándose un poco más.\n\n"Así que... ¿te gustan los juegos arriesgados, Sin Luz?"' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con fuerza, dejando que su cuerpo se acomodara contra el tuyo.\n\n"¿Esto te hace sentir mejor, Sin Luz?"' },
            { action: 'besar', response: '{MaidenName} dejó que tus labios rozaran los suyos, pero luego se apartó juguetonamente.\n\n"No tan rápido, Sin Luz. ¿Pensaste que sería tan fácil?"' }
        ],
        ThirdAffect: [
            { action: 'observar', response: '{MaidenName} te miró de arriba abajo, mordiéndose ligeramente el labio.\n\n"Veo que estás pensando en algo... ¿interesante, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} entrelazó sus dedos con los tuyos, presionando su cuerpo contra el tuyo.\n\n"No me sueltes ahora, {OwnerName}... las cosas recién comienzan a ponerse interesantes."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó con fuerza, acercando sus labios a tu oído.\n\n"¿Sabes? Podríamos quedarnos así toda la noche, {OwnerName}..."' },
            { action: 'besar', response: '{MaidenName} se dejó besar, pero respondió con un beso mucho más apasionado.\n\n"Eso es lo que me gusta, {OwnerName}... no te contengas."' }
        ],
        FourthAffect: [
            { action: 'observar', response: '{MaidenName} te miró con un deseo evidente en sus ojos, sonriendo con seducción.\n\n"¿Qué planeas hacerme esta vez, {OwnerName}?"' },
            { action: 'tomar de la mano', response: '{MaidenName} sostuvo tu mano con fuerza, atrayéndote hacia ella con un guiño coqueto.\n\n"No pienso soltarte, {OwnerName}... no hasta que me hagas tuya."' },
            { action: 'abrazar', response: '{MaidenName} te abrazó de inmediato, inclinando su cabeza hacia ti con una sonrisa.\n\n"Me encanta estar así, tan cerca de ti, {OwnerName}..."' },
            { action: 'besar', response: '{MaidenName} te besó apasionadamente, dejando que el beso se prolongara.\n\n"No hay lugar en el que prefiera estar que aquí, contigo, {OwnerName}..."' }
        ]
    },    
];

function getMaidenReply(personality, affectLevel, action) {
    const replies = MaidenReplies.find(reply => reply.personality === personality);
    if (replies) {
        let affectCategory;
        switch (true) {
            case affectLevel < 50:
                affectCategory = 'FirstAffect';
                break;
            case affectLevel < 125:
                affectCategory = 'SecondAffect';
                break;
            case affectLevel < 275:
                affectCategory = 'ThirdAffect';
                break;
            default:
                affectCategory = 'FourthAffect';
                break;
        }

        const actionResponse = replies[affectCategory].find(res => res.action === action);
        return actionResponse ? actionResponse.response : '"Gracias, {OwnerName}."';
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
            const actionName = interaction.options.getString('acción');
            const action = actionsAvailable.find(a => a.name === actionName);

            if (!action) {
                interaction.reply({
                    content: "Acción no válida.",
                    ephemeral: true,
                });
                return;
            }

            const maiden = await Maiden.findOne({ ownerId: userId });
            if (!maiden) {
                interaction.reply({
                    content: "No eres dueño de ninguna Maiden.",
                    ephemeral: true,
                });
                return;
            }

            const guild = interaction.guild;
            const owner = await guild.members.fetch(maiden.ownerId);
            const ownerNick = owner ? owner.nickname || owner.user.globalName : 'Sin Luz';

            let affectChange;
            if (action.riskLevel > 2 && maiden.affect < 125) {
                affectChange = -10; // Penalización por realizar una acción arriesgada
            } else {
                affectChange = 5; // Aumento de afecto normal
            }

            maiden.affect += affectChange;
            if (maiden.affect < 0) maiden.affect = 0; // Evitar que el afecto sea negativo

            maiden.lastModified = new Date(); // Actualiza la fecha de la última modificación
            await maiden.save(); // Guarda los cambios

            // Generar la respuesta de la Maiden
            const reply = getMaidenReply(maiden.personality, maiden.affect, action.name.toLowerCase())
                .replace('{MaidenName}', maiden.name)
                .replace('{OwnerName}', ownerNick);

            // Crear el embed
            const embed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setThumbnail(maiden.image)
                .setDescription(reply);

            // Enviar respuesta como embed
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al ejecutar el comando de acción-doncella:', error);
            interaction.reply({
                content: 'Hubo un error al intentar realizar una acción. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        }
    },
    data: {
        name: 'acción-doncella',
        description: 'Realiza una acción con tu doncella una vez cada hora.',
        options: [
            {
                name: 'acción',
                type: ApplicationCommandOptionType.String,
                description: 'Acción a realizar',
                required: true,
                autocomplete: true,
            },
        ]
    },
};
