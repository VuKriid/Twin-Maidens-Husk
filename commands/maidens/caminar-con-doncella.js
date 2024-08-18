const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Maiden = require('../../schemas/Maiden');
const Cooldown = require('../../schemas/Cooldown');

function getRandomNumber(x, y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

const MaidenReplies = [
    {
        personality: 'Seria',
        FirstAffect: [
            { response: 'Mientras caminaban por un sendero oscuro y solitario, {MaidenName} te observó con una mirada reservada. "No esperaba encontrar compañía aquí, Sin Luz. Agradezco tu presencia en este lugar solitario."'},
            { response: 'En el borde de un bosque espeso, {MaidenName} caminó a tu lado con una expresión neutral. "Este lugar es tranquilo y adecuado para una conversación sin distracciones. Gracias por tu compañía, Sin Luz."'},
            { response: 'A la luz de una fogata en un claro del bosque, {MaidenName} se quedó en silencio, observando el fuego. "Tu compañía ha sido aceptable, Sin Luz. Gracias por no interrumpir mi reflexión en este lugar."'},
            { response: 'En la penumbra de una cueva secreta, {MaidenName} mantuvo una expresión seria mientras recorrían el espacio. "Tu presencia aquí es inesperada pero no desagradable. Gracias, Sin Luz, por acompañarme en este lugar."'}
        ],
        SecondAffect: [
            { response: 'En un jardín de hierbas medicinales, {MaidenName} te miró con una leve inclinación de cabeza. "Este lugar es ideal para una conversación tranquila. Gracias por tu presencia, Sin Luz, lo aprecio más de lo que demuestro."'},
            { response: 'Mientras paseaban por una senda rodeada de antiguos árboles, {MaidenName} mantuvo un tono neutral. "Este entorno ofrece paz. Agradezco tu compañía en este lugar, Sin Luz."'},
            { response: 'En un pequeño santuario en el bosque, {MaidenName} observó las estatuas en silencio. "Compartir este momento aquí tiene su valor. Gracias por estar aquí, Sin Luz, aunque prefiera no mostrar mi gratitud abiertamente."'},
            { response: 'En el crepúsculo de una torre de vigilancia, {MaidenName} te miró con una expresión seria. "Este lugar permite una buena vista y tranquilidad. Aprecio tu compañía, Sin Luz, aunque no lo exprese de manera efusiva."'}
        ],
        ThirdAffect: [
            { response: 'En un antiguo templo en ruinas, {MaidenName} te miró con una mezcla de respeto y afecto. "Este lugar tiene una historia interesante. Agradezco tu presencia aquí, {OwnerName}, y me alegra compartir este momento contigo."'},
            { response: 'En una biblioteca antigua llena de pergaminos, {MaidenName} te observó con interés. "Tu presencia en este lugar tan significativo no pasa desapercibida. Gracias por acompañarme, {OwnerName}. Este sitio y tu compañía son apreciados."'},
            { response: 'En un jardín de esculturas y fuentes, {MaidenName} se volvió hacia ti con una sonrisa sutil. "Este lugar es adecuado para una conversación seria. Agradezco sinceramente tu compañía, {OwnerName}."'},
            { response: 'Mientras exploraban una fortaleza antigua, {MaidenName} te miró con una expresión contemplativa. "Este entorno refleja una historia profunda. Gracias por estar aquí, {OwnerName}, en un lugar tan significativo."'}
        ],
        FourthAffect: [
            { response: 'En un elegante salón con vistas a un paisaje impresionante, {MaidenName} te miró con una profunda emoción contenida. "Este momento contigo es valioso. Gracias, {OwnerName}, por compartir esta experiencia tan significativa."'},
            { response: 'En la cima de una montaña con vistas a un vasto horizonte, {MaidenName} te abrazó con una expresión de sincero aprecio. "Tu presencia aquí es significativa para mí. Gracias, {OwnerName}, por estar a mi lado en este lugar."'},
            { response: 'En una cámara privada adornada con tapices antiguos, {MaidenName} aceptó tu regalo con una sonrisa de gratitud. "Este gesto significa mucho para mí. Gracias, {OwnerName}, por hacer de este momento algo inolvidable."'},
            { response: 'En un elegante banquete con vistas a un jardín iluminado, {MaidenName} te miró con una mezcla de afecto y respeto. "Este momento contigo ha sido invaluable. Gracias, {OwnerName}, de todo corazón."'}
        ],
    },
    {
        personality: 'Cariñosa',
        FirstAffect: [
            { response: 'Mientras caminaban por un sendero iluminado por la luz de la luna, {MaidenName} te miró con curiosidad. "No puedo creer que hayas venido conmigo, Sin Luz. Este lugar es tan tranquilo, y tu compañía lo hace aún más especial."'},
            { response: 'En el claro de un bosque encantado, {MaidenName} te observó mientras paseaban entre árboles antiguos. "Nunca había estado aquí con alguien antes. Gracias por hacer este momento tan agradable, Sin Luz."'},
            { response: 'Juntos, exploraron un pequeño campo florido en el atardecer. {MaidenName} te sonrió suavemente. "Este lugar es precioso, y tenerte aquí lo hace aún mejor. Gracias por compartir esto conmigo, Sin Luz."'},
            { response: 'Al borde de un lago tranquilo, {MaidenName} te miró con sorpresa mientras caminaban por la orilla. "No esperaba disfrutar tanto de este paseo. Gracias, Sin Luz, por hacer de este momento algo especial."'}
        ],
        SecondAffect: [
            { response: 'En una colina cubierta de flores, {MaidenName} te miró con una sonrisa. "Este lugar es perfecto para una tarde juntos. Gracias por hacer este momento aún más mágico, Sin Luz."'},
            { response: 'Mientras paseaban por un mercado encantado lleno de colores y aromas, {MaidenName} te miró con ternura. "Nunca había compartido un lugar tan vibrante con alguien. Gracias por estar aquí conmigo, Sin Luz."'},
            { response: 'En un jardín secreto lleno de hierbas y flores raras, {MaidenName} aceptó tu compañía con gratitud. "Este lugar tiene un aire especial, y compartirlo contigo hace que sea aún más encantador. Gracias, Sin Luz."'},
            { response: 'A la luz de un atardecer dorado, {MaidenName} caminó a tu lado por un sendero sinuoso. "Este paseo contigo es más hermoso de lo que imaginé. Gracias por hacerme sentir tan especial, Sin Luz."'}
        ],
        ThirdAffect: [
            { response: 'En un claro mágico con vistas a un valle encantado, {MaidenName} te tomó de la mano mientras caminaban. "Tenerte a mi lado en este lugar hace que cada momento sea memorable. Gracias, {OwnerName}, por siempre hacerme sonreír."'},
            { response: 'En el esplendor de un bosque iluminado por luces flotantes, {MaidenName} te miró con cariño. "Compartir estos momentos contigo me hace sentir tan especial. Tal vez debería empezar a mimarte también. Gracias, {OwnerName}."'},
            { response: 'En un elegante jardín de rosas doradas, {MaidenName} te sonrió mientras paseaban. "Cada paseo contigo es un regalo. Guardaré este recuerdo con cariño, {OwnerName}. Gracias por hacerme sentir tan apreciada."'},
            { response: 'Mientras exploraban un sendero en una montaña nevada, {MaidenName} se detuvo para mirarte con afecto. "Cada vez me sorprendes más. Este paseo es increíble, gracias, {OwnerName}, por hacerlo tan especial."'}
        ],
        FourthAffect: [
            { response: 'En un prado bajo el cielo estrellado, {MaidenName} se acercó a ti con una sonrisa radiante. "Gracias, {OwnerName}, siempre te recordaré. Eres el mejor, y este momento contigo significa el mundo para mí."'},
            { response: 'Juntos, en una antigua torre con vistas a un río resplandeciente, {MaidenName} te abrazó con ternura. "Gracias, {OwnerName}, me haces muy feliz. Este lugar y este momento contigo son perfectos."'},
            { response: 'En un jardín iluminado por luces mágicas, {MaidenName} aceptó tu regalo con una sonrisa radiante y te dio un suave beso en la mejilla. "Gracias, {OwnerName}, esto significa mucho para mí. Eres maravilloso."'},
            { response: 'En el borde de un acantilado con vistas a un vasto océano estrellado, {MaidenName} te miró con profunda emoción. "¿Te he dicho lo mucho que te quiero? Gracias, {OwnerName}, de todo corazón. Este momento contigo es invaluable."'}
        ]
    },
    {
        personality: 'Enérgica',
        FirstAffect: [
            { response: 'Caminaban por un sendero cubierto de hojas, {MaidenName} avanzaba a paso ligero, casi saltando. "¡Vamos, Sin Luz! El día es joven y tenemos mucho que explorar. ¡Gracias por unirte a la aventura!"'},
            { response: 'En un prado abierto, {MaidenName} giraba sobre sí misma, disfrutando del viento. "¡Sin Luz, este lugar es increíble! ¡No puedo esperar a ver qué más encontramos!"'},
            { response: 'Mientras corrían por una colina, {MaidenName} te lanzó una sonrisa amplia. "¡Sin Luz, sigue el ritmo! ¡No hay tiempo que perder!"'},
            { response: 'En un bosque con árboles altos, {MaidenName} se detuvo por un momento, respirando hondo. "¡El aire aquí es tan fresco, Sin Luz! ¡Esto es justo lo que necesitaba!"'}
        ],
        SecondAffect: [
            { response: 'Caminaban por un sendero rodeado de flores silvestres, {MaidenName} recogía algunas mientras avanzaban. "¡Sin Luz, mira estas flores! No puedo creer que hayamos encontrado un lugar tan bonito. ¡Gracias por venir conmigo!"'},
            { response: 'En un campo abierto, {MaidenName} comenzó a correr, riendo mientras lo hacía. "¡Sin Luz, ven conmigo! ¡El mundo es nuestro para explorar!"'},
            { response: 'Mientras cruzaban un río por un puente de madera, {MaidenName} te lanzó una mirada divertida. "¿Qué te parece un desafío, Sin Luz? ¡A ver quién llega primero al otro lado!"'},
            { response: 'En un valle rodeado de montañas, {MaidenName} se estiraba y respiraba profundamente. "No hay nada mejor que un buen paseo para sentirse vivo, Sin Luz. ¡Gracias por estar aquí!"'}
        ],
        ThirdAffect: [
            { response: 'Caminaban por un sendero estrecho, {MaidenName} saltaba de piedra en piedra. "¡{OwnerName}, esto es justo lo que necesitaba! Gracias por acompañarme en esta aventura."'},
            { response: 'En un campo lleno de flores silvestres, {MaidenName} corría alegremente, girando a tu alrededor. "¡{OwnerName}, este lugar es perfecto! ¡Gracias por siempre estar dispuesto a explorar conmigo!"'},
            { response: 'Mientras cruzaban un río poco profundo, {MaidenName} te salpicó con agua y rió. "¡{OwnerName}, no te quedes atrás! ¡Esto es lo que llamo diversión!"'},
            { response: 'En un bosque iluminado por la luz del sol, {MaidenName} te miró con una sonrisa. "Contigo, {OwnerName}, siempre hay algo emocionante por descubrir. ¡Gracias por ser mi compañero de aventuras!"'}
        ],
        FourthAffect: [
            { response: 'En la cima de una colina, {MaidenName} respiró hondo y te miró con una gran sonrisa. "No puedo imaginar hacer esto sin ti, {OwnerName}. ¡Gracias por siempre estar a mi lado en cada paso del camino!"'},
            { response: 'Caminaban por un sendero bordeado de árboles, {MaidenName} tomó tu mano y la apretó suavemente. "Eres mi roca, {OwnerName}. Gracias por ser siempre tan firme y por hacer de cada día una aventura."'},
            { response: 'En un prado bajo el cielo estrellado, {MaidenName} te miró a los ojos con un brillo de emoción. "A tu lado, {OwnerName}, cada día se siente como una nueva aventura. ¡Gracias por ser mi compañero en esta loca travesía!"'},
            { response: 'Caminaban por un bosque bajo la luz de la luna, {MaidenName} te lanzó una mirada llena de alegría. "Nunca hay un momento aburrido contigo, {OwnerName}. ¡Gracias por hacer cada día más emocionante!"'}
        ]
    },
    {
        personality: 'Formal',
        FirstAffect: [
            { response: 'Caminaban por un sendero enmarcado por altos árboles. {MaidenName} te miró con una ligera inclinación de cabeza. "Mi Señor, agradezco su compañía en esta caminata. Es un honor compartir este momento con usted."'},
            { response: 'En un jardín bien cuidado, {MaidenName} te lanzó una mirada respetuosa. "Mi Señor, este lugar parece aún más sereno con su presencia. Gracias por acompañarme."'},
            { response: 'Caminaban junto a un arroyo tranquilo, el sonido del agua llenando el silencio. {MaidenName} caminaba a tu lado, sus palabras medidas. "Mi Señor, su compañía es... apreciada. Gracias por estar aquí."'},
            { response: 'En un claro rodeado de majestuosos robles, {MaidenName} te miró con seriedad. "Mi Señor, me complace que haya decidido unirse a mí en esta caminata. Es un placer estar a su lado."'}
        ],
        SecondAffect: [
            { response: 'Caminando por un pasillo de piedra antigua, {MaidenName} te lanzó una mirada respetuosa. "Mi Señor, su compañía ha hecho de este paseo una experiencia más gratificante. Agradezco su presencia."'},
            { response: 'En un campo abierto bajo un cielo despejado, {MaidenName} te dirigió una sonrisa leve. "Mi Señor, caminar a su lado es siempre un placer. Gracias por compartir este momento conmigo."'},
            { response: 'Mientras paseaban por un jardín lleno de estatuas antiguas, {MaidenName} te miró con aprecio. "Mi Señor, estos momentos de tranquilidad son más valiosos con usted. Agradezco profundamente su compañía."'},
            { response: 'En la cima de una colina, con el viento soplando suavemente, {MaidenName} te miró a los ojos con un leve asentimiento. "Mi Señor, su presencia es siempre bienvenida. Gracias por estar aquí conmigo."'}
        ],
        ThirdAffect: [
            { response: 'Caminaban por un sendero bordeado de flores doradas, {MaidenName} te miró con respeto. "Gracias, {OwnerName}. Su compañía hace que estos momentos sean más significativos. Aprecio mucho su amabilidad."'},
            { response: 'En un jardín iluminado por la luz del sol, {MaidenName} te lanzó una mirada cálida. "Es un honor para mí, {OwnerName}, caminar a su lado. Gracias por estar aquí, su presencia siempre me tranquiliza."'},
            { response: 'Caminaban por un camino empedrado en silencio, {MaidenName} te miró con una ligera sonrisa. "Cada vez que compartimos estos momentos, {OwnerName}, siento una conexión más profunda. Gracias por su constante apoyo."'},
            { response: 'En un claro iluminado por la luna, {MaidenName} te miró con afecto. "Su presencia, {OwnerName}, es un verdadero regalo. Gracias por estar siempre ahí cuando lo necesito."'}
        ],
        FourthAffect: [
            { response: 'En un balcón con vistas a un vasto paisaje, {MaidenName} te miró con profunda gratitud. "Cada día, {OwnerName}, me siento más afortunada de tener su compañía. Gracias por ser mi roca en este mundo incierto."'},
            { response: 'Mientras caminaban por un sendero bordeado de rosas, {MaidenName} tomó suavemente tu mano. "No sé cómo expresar adecuadamente mi gratitud, {OwnerName}. Su presencia en mi vida es invaluable. Gracias por estar siempre a mi lado."'},
            { response: 'En un jardín silencioso, {MaidenName} te miró a los ojos, su voz suave y llena de respeto. "Usted, {OwnerName}, ha sido una guía y un apoyo constante. Gracias por todo lo que ha hecho por mí. Lo valoro profundamente."'},
            { response: 'Caminaban por un sendero solitario, el cielo estrellado brillando sobre ustedes. {MaidenName} te miró con una sonrisa sincera. "Aprecio cada momento que pasamos juntos, {OwnerName}. Gracias por ser una parte tan importante de mi vida."'}
        ]
    },
    {
        personality: 'Fría',
        FirstAffect: [
            { response: 'Caminaban en silencio por un oscuro sendero bordeado de árboles retorcidos. {MaidenName} te miró con frialdad. "No sé por qué estás aquí, Sin Luz. No necesito ni quiero tu compañía."'},
            { response: 'En el borde de un abismo, {MaidenName} caminaba delante de ti, sin mirar atrás. "No te equivoques, Sin Luz. Tu presencia aquí es tan irrelevante como el viento que sopla. No creas que me importas."'},
            { response: 'En un desierto frío y vacío, {MaidenName} te lanzó una mirada despectiva. "No te hagas ilusiones, Sin Luz. Tu compañía aquí no significa nada para mí. Podrías desaparecer y no lo notaría."'},
            { response: 'Al pie de una montaña nevada, {MaidenName} se detuvo brevemente, sin voltear a verte. "No sé qué esperas de este paseo, Sin Luz, pero no lo conseguirás de mí. No estoy interesada en lo que tengas que ofrecer."'}
        ],
        SecondAffect: [
            { response: 'En un camino cubierto de niebla, {MaidenName} mantuvo su distancia. "Tu insistencia en acompañarme, Sin Luz, es... irritante. Pero admito que este lugar es menos... vacío con alguien más aquí."'},
            { response: 'En una fortaleza abandonada, {MaidenName} te lanzó una mirada gélida. "No malinterpretes mi silencio, Sin Luz. No es por aprobación, es solo que prefiero no desperdiciar palabras en algo tan trivial como tu compañía."'},
            { response: 'En una caverna oscura, {MaidenName} te observó brevemente antes de seguir adelante. "No estoy aquí para complacerte, Sin Luz. Pero si insistes en seguirme, no te quejes cuando encuentres el frío que acompaña a mi presencia."'},
            { response: 'En una ciudad desierta, {MaidenName} caminó por las calles vacías sin dirigir una palabra hacia ti. "Tu presencia no es del todo inútil, Sin Luz. Pero tampoco te hagas ilusiones. No me interesa lo que puedas estar pensando."'}
        ],
        ThirdAffect: [
            { response: 'En un jardín sombrío, {MaidenName} se detuvo un momento, mirando las flores marchitas. "Parece que insistes en estar aquí, {OwnerName}. Supongo que podría haber peores compañías en este lugar... aunque no muchos."'},
            { response: 'En un antiguo castillo, {MaidenName} te lanzó una mirada calculadora. "Sigues aquí, {OwnerName}. Tal vez eres más persistente de lo que pensaba... o más terco. Pero de alguna manera, no encuentro tu presencia completamente desagradable."'},
            { response: 'En un bosque oscuro, {MaidenName} caminó a tu lado, su actitud más relajada, pero aún distante. "No te he pedido que vengas, {OwnerName}, pero tampoco te he echado. Eso debería decirte algo... aunque no mucho."'},
            { response: 'En un puente que cruzaba un río helado, {MaidenName} te miró por el rabillo del ojo. "No suelo tolerar a muchos, {OwnerName}, pero parece que has ganado un mínimo de respeto. No es un gran logro, pero es algo."'}
        ],
        FourthAffect: [
            { response: 'En lo alto de una torre con vistas a un vasto paisaje, {MaidenName} se detuvo a tu lado, su expresión suavizándose. "Es extraño, {OwnerName}, pero me encuentro... acostumbrándome a ti. No es algo que esperaba ni deseaba, pero aquí estamos. Gracias... supongo."'},
            { response: 'En un rincón apartado de un castillo en ruinas, {MaidenName} te observó con una mirada más cálida. "He pasado mucho tiempo rechazando a otros, {OwnerName}, pero contigo es diferente. Aún no sé si eso me gusta, pero gracias por estar aquí... a pesar de todo."'},
            { response: 'En un claro oculto, {MaidenName} aceptó tu presencia con un leve asentimiento. "Nunca pensé que diría esto, {OwnerName}, pero... me alegra que estés aquí conmigo. No lo admitiré de nuevo, así que escucha bien."'},
            { response: 'En un balcón que daba a un paisaje desolado, {MaidenName} te miró con una sinceridad inusual. "No soy fácil de complacer, {OwnerName}, pero... de alguna manera, lo has logrado. Gracias por demostrarme que no todos son... despreciables."'}
        ],
    },
    {
        personality: 'Amable',
        FirstAffect: [
            { response: 'Caminaban por un sendero bordeado de flores silvestres, el aire fresco llenando sus pulmones. {MaidenName} te sonrió suavemente. "Es agradable tener compañía, Sin Luz. Gracias por caminar conmigo hoy."'},
            { response: 'En un tranquilo bosque, {MaidenName} miró a su alrededor, disfrutando del entorno. "Este lugar es hermoso, ¿verdad, Sin Luz? Me alegra que lo estemos explorando juntos."'},
            { response: 'Mientras caminaban por la orilla de un río, {MaidenName} lanzó una mirada amistosa. "Es bueno compartir estos momentos con alguien, Sin Luz. Gracias por estar aquí."'},
            { response: 'Caminaban por un sendero iluminado por la suave luz del sol. {MaidenName} te miró con una sonrisa tranquila. "Este paseo es... relajante. Gracias por acompañarme, Sin Luz."'}
        ],
        SecondAffect: [
            { response: 'En un claro rodeado de árboles altos, {MaidenName} te sonrió con calidez. "Me siento más en paz cuando estoy contigo, Sin Luz. Gracias por hacer este momento especial."'},
            { response: 'Mientras cruzaban un puente de piedra sobre un río sereno, {MaidenName} te miró con aprecio. "Es fácil disfrutar de estos momentos contigo, Sin Luz. Gracias por estar aquí."'},
            { response: 'Caminaban por un sendero que serpenteaba entre colinas verdes. {MaidenName} te lanzó una sonrisa. "No siempre encontramos la paz en este mundo, Sin Luz, pero hoy, contigo, la siento más cerca."'},
            { response: 'En una colina con vistas a un valle, {MaidenName} miró el horizonte antes de volverse hacia ti. "Estos momentos son los que realmente aprecio, Sin Luz. Gracias por compartirlos conmigo."'}
        ],
        ThirdAffect: [
            { response: 'En un jardín oculto, {MaidenName} caminaba a tu lado, su sonrisa cálida iluminando el entorno. "Cada vez que estamos juntos, {OwnerName}, me siento más conectada con este mundo... y contigo. Gracias por hacer que todo sea más brillante."'},
            { response: 'Mientras paseaban por un camino arbolado, {MaidenName} te miró con gratitud. "Siempre encuentro consuelo en tu compañía, {OwnerName}. Gracias por hacer cada momento más especial."'},
            { response: 'En un prado cubierto de flores, {MaidenName} se detuvo por un momento, disfrutando del paisaje. "Estos pequeños momentos, {OwnerName}, son los que realmente importan. Me alegra compartirlos contigo."'},
            { response: 'Caminando juntos bajo un cielo despejado, {MaidenName} te lanzó una mirada de cariño. "Siempre he apreciado la calma, {OwnerName}, pero contigo, se siente aún más significativa. Gracias por estar aquí."'}
        ],
        FourthAffect: [
            { response: 'En un acantilado con vistas al mar, {MaidenName} se acercó a ti, su sonrisa llena de afecto. "Cada momento contigo, {OwnerName}, es un tesoro que guardo en mi corazón. Gracias por ser siempre tan amable."'},
            { response: 'Mientras caminaban por un sendero iluminado por la luz de la luna, {MaidenName} tomó suavemente tu mano. "No puedo imaginar estos momentos sin ti, {OwnerName}. Gracias por hacer mi mundo más hermoso."'},
            { response: 'En un bosque encantado, {MaidenName} te miró a los ojos con sinceridad. "Contigo, {OwnerName}, cada día se siente más brillante, más lleno de vida. No sé cómo agradecerte lo suficiente por estar aquí."'},
            { response: 'Caminaban juntos por un campo de flores doradas, {MaidenName} te sonrió con profundo afecto. "Nunca había encontrado una compañía tan reconfortante, {OwnerName}. Gracias por ser mi luz en este mundo."'}
        ],
    },
    {
        personality: 'Lanzada',
        FirstAffect: [
            { response: 'Mientras caminaban por un sendero iluminado por la luz de la luna, {MaidenName} te lanzó una sonrisa juguetona. "No esperaba que te atrevieras a acompañarme, Sin Luz. Pero no te preocupes, no muerdo... mucho."'},
            { response: 'En el borde de un bosque encantado, {MaidenName} te miró con un brillo travieso en los ojos. "Caminar juntos bajo estas estrellas... quién diría que serías tan valiente, Sin Luz. ¿O es que te atraigo tanto?"'},
            { response: 'Juntos, exploraron un jardín secreto bajo la luz del atardecer. {MaidenName} te dio un leve empujón con su hombro. "Este lugar es hermoso, ¿verdad, Sin Luz? Aunque no tan hermoso como lo que podríamos descubrir juntos."'},
            { response: 'Al borde de un lago tranquilo, {MaidenName} te miró con una sonrisa insinuante. "No esperaba disfrutar tanto de este paseo... contigo, Sin Luz. Quizás haya más de lo que parece bajo esa fachada tuya."'}
        ],
        SecondAffect: [
            { response: 'En una colina cubierta de flores, {MaidenName} te lanzó una mirada coqueta. "Este lugar es perfecto para una tarde juntos, ¿no crees, Sin Luz? Aunque estoy segura de que podríamos encontrar algo más... interesante que hacer."'},
            { response: 'Mientras paseaban por un mercado encantado, {MaidenName} te guiñó un ojo. "Este lugar es tan vibrante, casi como nosotros dos juntos, Sin Luz. ¿Quién sabe qué aventuras podríamos encontrar?"'},
            { response: 'En un jardín secreto lleno de flores raras, {MaidenName} te lanzó una sonrisa traviesa. "Este lugar es especial, Sin Luz, pero no tanto como compartirlo contigo. ¿Estás seguro de que puedes manejar todo esto?"'},
            { response: 'A la luz de un atardecer dorado, {MaidenName} caminó a tu lado, acercándose más de lo necesario. "Este paseo contigo es más hermoso de lo que imaginé, Sin Luz. ¿O será que tú haces que todo se vea mejor?"'}
        ],
        ThirdAffect: [
            { response: 'En un claro mágico con vistas a un valle encantado, {MaidenName} tomó tu brazo con una sonrisa seductora. "Tenerte a mi lado en este lugar hace que cada momento sea más... interesante. Gracias, {OwnerName}, por ser tan encantador."'},
            { response: 'En el esplendor de un bosque iluminado por luces flotantes, {MaidenName} te miró con deseo. "Compartir estos momentos contigo me hace sentir viva. Quizás deberíamos hacerlo más seguido, {OwnerName}."'},
            { response: 'En un jardín de rosas doradas, {MaidenName} te sonrió con picardía mientras paseaban. "Cada paseo contigo es como un pequeño juego. Me encanta ver hasta dónde llegaremos, {OwnerName}."'},
            { response: 'Mientras exploraban un sendero en una montaña nevada, {MaidenName} se detuvo para mirarte con un brillo de anticipación. "Cada vez me sorprendes más, {OwnerName}. Este paseo es increíble... pero contigo, siempre lo es."'}
        ],
        FourthAffect: [
            { response: 'En un prado bajo el cielo estrellado, {MaidenName} se acercó a ti con una sonrisa cautivadora. "Gracias, {OwnerName}, por este momento. Eres el único que logra hacerme sentir así... tan viva y tan feliz."'},
            { response: 'Juntos, en una antigua torre con vistas a un río resplandeciente, {MaidenName} te abrazó, susurrando cerca de tu oído. "Gracias, {OwnerName}. No solo por este momento, sino por cada uno de los que hemos compartido... y los que vendrán."'},
            { response: 'En un jardín iluminado por luces mágicas, {MaidenName} aceptó tu regalo con una sonrisa seductora y te dio un suave beso en la mejilla. "Gracias, {OwnerName}. Esto significa mucho para mí... y quién sabe, tal vez algún día te lo devuelva de una manera especial."'},
            { response: 'En el borde de un acantilado con vistas a un vasto océano estrellado, {MaidenName} te miró con pasión. "¿Te he dicho lo mucho que te quiero? Gracias, {OwnerName}, por ser todo lo que necesito... y más."'}
        ],
    },
    {
        personality: 'Tímida',
        FirstAffect: [
            { response: 'Caminaban por un sendero rodeado de altos árboles, sus hojas susurrando suavemente al viento. {MaidenName} caminaba a tu lado en silencio, sus mejillas ligeramente sonrojadas. "N-no sé por qué decidiste acompañarme, Sin Luz... pero gracias."'},
            { response: 'En un prado cubierto de flores silvestres, {MaidenName} te lanzó una rápida mirada antes de apartar la vista. "No suelo hacer esto, Sin Luz... caminar así con alguien. Pero... no es tan malo."'},
            { response: 'En la orilla de un lago tranquilo, {MaidenName} caminaba a tu lado, sus manos jugueteando nerviosamente con su ropa. "No sé qué decir, Sin Luz... pero me alegra que estés aquí... c-conmigo."'},
            { response: 'Caminaban por un camino empedrado, el sonido de sus pasos resonando en la quietud. {MaidenName} bajó la mirada, evitando el contacto visual. "No estoy acostumbrada a esto, Sin Luz... pero gracias por estar aquí."'}
        ],
        SecondAffect: [
            { response: 'En un jardín oculto entre las montañas, {MaidenName} caminaba a tu lado, sus pasos ligeramente titubeantes. "E-es extraño, Sin Luz... pero me siento... más tranquila cuando estás cerca. Gracias por acompañarme."'},
            { response: 'Mientras paseaban por un bosque iluminado por la luz del sol que se filtraba entre las hojas, {MaidenName} te lanzó una tímida sonrisa. "Nunca pensé que disfrutaría tanto de una caminata, Sin Luz... especialmente contigo."'},
            { response: 'En un pequeño puente que cruzaba un río cristalino, {MaidenName} te miró brevemente antes de volver la vista al agua. "No soy muy buena con las palabras, Sin Luz... pero gracias. Significa mucho para mí que estés aquí."'},
            { response: 'En un sendero cubierto de flores, {MaidenName} caminaba cerca de ti, su mirada fija en el suelo. "A veces me siento... un poco nerviosa, Sin Luz. Pero contigo aquí, es... diferente. Mejor."'}
        ],
        ThirdAffect: [
            { response: 'En un campo de flores doradas, {MaidenName} caminaba a tu lado, sus dedos rozando suavemente las flores. "C-cuando estoy contigo, {OwnerName}, me siento... segura. Gracias por estar siempre ahí."'},
            { response: 'En una colina con vistas a un valle cubierto de niebla, {MaidenName} te lanzó una mirada furtiva antes de sonreír suavemente. "No sé cómo lo haces, {OwnerName}, pero... me haces sentir especial. Gracias por eso."'},
            { response: 'En un bosque encantado, {MaidenName} se acercó a ti tímidamente. "Nunca me había sentido tan... conectada con alguien, {OwnerName}. Eres diferente... en el buen sentido."'},
            { response: 'En un rincón tranquilo de un jardín, {MaidenName} te sonrió tímidamente. "Me siento tan... a gusto cuando estoy contigo, {OwnerName}. Gracias por hacerme sentir así."'}
        ],
        FourthAffect: [
            { response: 'En lo alto de una colina, bajo un cielo estrellado, {MaidenName} se detuvo a tu lado, sus ojos llenos de afecto. "Nunca pensé que podría sentirme tan feliz, {OwnerName}. Gracias por todo... por estar a mi lado."'},
            { response: 'En un jardín iluminado por la luz de la luna, {MaidenName} se acercó tímidamente, tomando tu mano. "No soy muy buena expresando mis sentimientos, {OwnerName}, pero... te aprecio más de lo que puedes imaginar."'},
            { response: 'Caminaban por un sendero solitario, el viento susurrando entre los árboles. {MaidenName} te miró con una sonrisa dulce. "Gracias, {OwnerName}. No solo por hoy, sino por cada momento que hemos compartido... Significas mucho para mí."'},
            { response: 'En un rincón apartado de un bosque, {MaidenName} te miró a los ojos, su expresión llena de ternura. "Nunca pensé que podría sentirme así, {OwnerName}. Gracias por ser tan especial... por ser tú."'}
        ]
    }
];

function getMaidenReply(personality, affectLevel) {
    const replies = MaidenReplies.find(reply => reply.personality === personality);
    
    
    if (replies) {
        switch (true) {
            case affectLevel < 50:
                AffectLevel = 1;
                return replies.FirstAffect[getRandomNumber(0, replies.FirstAffect.length - 1)].response;
            case affectLevel < 125:
                AffectLevel = 2;
                return replies.SecondAffect[getRandomNumber(0, replies.SecondAffect.length - 1)].response;
            case affectLevel < 275:
                AffectLevel = 3;
                return replies.ThirdAffect[getRandomNumber(0, replies.ThirdAffect.length - 1)].response;
            default:
                return replies.FourthAffect[getRandomNumber(0, replies.FourthAffect.length - 1)].response;
        }
    }
    return '"Hum..."';
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

        const userId = interaction.user.id;
        const commandName = 'caminar-con-doncella';
        let cooldown = await Cooldown.findOne({ userId, commandName });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');
                const CDWalkEmbed = new EmbedBuilder()
                    .setColor('#b0875f')
                    .setAuthor({
                        name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL(),
                    })
                    .setDescription(`Ya has salido a caminar con tu doncella, inténtalo de nuevo en ${prettyMs(cooldown.endsAt - Date.now())}.`)
                await interaction.reply({ embeds: [CDWalkEmbed] });
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

        try {
            

            // Buscar la Maiden correspondiente
            const maiden = await Maiden.findOne({ ownerId: userId });
            if (!maiden) {
                interaction.reply({
                    content: "No eres dueño de ninguna Doncella.",
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

            let AffectLevel = 4;
            if (maiden.affect < 50) {
                AffectLevel = 1;
            } else if (maiden.affect < 125) {
                AffectLevel = 2;
            } else if (maiden.affect < 275) {
                AffectLevel = 3;
            }

            const MaxRandom = 5 * AffectLevel
            AffectGained = getRandomNumber(1, MaxRandom);
            maiden.affect += AffectGained
            await maiden.save();
            cooldown.endsAt = Date.now() + 14400_000;
            await cooldown.save();

            // Generar la respuesta de la Maiden
            const reply = getMaidenReply(maiden.personality, maiden.affect)
                .replace('{MaidenName}', maiden.name)
                .replace('{OwnerName}', ownerNick)

            // Crear el embed
            const embed = new EmbedBuilder()
                .setColor('#b0875f')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setThumbnail(maiden.image)
                .setDescription(`${reply}\n\n+${AffectGained} Afecto`);

            // Enviar respuesta como embed
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al ejecutar el comando de caminar-con-doncella:', error);
            interaction.reply({
                content: 'Hubo un error al intentar caminar con la doncella. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        }
    },
    data: {
        name: 'caminar-con-doncella',
        description: 'Camina con tu doncella para conocerla mejor y mejorar tu relación con ella.',
    },
}