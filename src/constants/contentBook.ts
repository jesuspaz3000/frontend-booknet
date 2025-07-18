interface BookContent {
    id: string;
    chapters: Chapter[];
}

interface Chapter {
    id: string;
    title: string;
    content: string;
}

export const bookContent: BookContent[] = [
    {
        id: "1", // Cien Años de Soledad
        chapters: [
            {
                id: "1",
                title: "Capítulo 1: Los Orígenes de Macondo",
                content: `Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos. El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo.

Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba la carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos. Primero llevaron el imán. Un gitano corpulento, de barba montaraz y manos de gorrión, que se presentó con el nombre de Melquíades, hizo una truculenta demostración pública de lo que él mismo llamaba la octava maravilla de los sabios alquimistas de Macedonia.

José Arcadio Buendía, que era el hombre más emprendedor que se vería jamás en la aldea, había decidido construir la casa de manera que ninguno pudiera pasar sin ser visto. La había concebido como una fortaleza, con ventanas que daban a la calle principal, y una puerta principal que se abría hacia el interior del pueblo.

El patriarca de la familia había llegado a Macondo huyendo de los recuerdos de una guerra civil que había asolado su tierra natal. Con él llegaron su esposa Úrsula Iguarán y sus dos hijos: José Arcadio y Aureliano. La familia se estableció en la que sería la casa más imponente del pueblo, desde donde José Arcadio Buendía gobernaría con mano firme pero justa.

Los gitanos traían cada año nuevas maravillas: brújulas, lupas, imanes, y toda clase de inventos que fascinaban a los habitantes de Macondo. Pero lo que más impresionó a José Arcadio Buendía fue el hielo, esa sustancia transparente y fría que parecía un diamante líquido y que se derretía en las manos como si fuera un milagro.

"Es el diamante más grande del mundo", decía Melquíades, mientras los niños del pueblo se acercaban tímidamente a tocar aquella maravilla. José Arcadio Buendía pagó treinta reales por acercar la mano al hielo, y la mantuvo puesta por varios minutos, mientras experimentaba el terror y la maravilla de estar en contacto con el misterio.

La llegada de los gitanos marcaba el inicio de una época de descubrimientos y maravillas para Macondo. Cada año traían nuevos inventos que transformaban la vida del pueblo de maneras inesperadas. Pero también traían consigo la semilla de la nostalgia, porque cada invento recordaba a los habitantes que existía un mundo más allá de las montañas que rodeaban su aldea.

Así comenzó la historia de una familia que estaba destinada a repetir los mismos errores generación tras generación, en un ciclo interminable de amor, guerra, soledad y muerte. La historia de los Buendía era también la historia de América Latina, con sus revoluciones, sus dictadores, sus sueños frustrados y sus esperanzas eternas.

El tiempo en Macondo no transcurría de manera lineal, sino en círculos, como si el destino de la familia estuviera escrito desde el principio y no pudiera ser cambiado. Los nombres se repetían, los caracteres se repetían, y los destinos se repetían, en una danza eterna de la cual parecía imposible escapar.`
            },
            {
                id: "2",
                title: "Capítulo 2: La Peste del Insomnio",
                content: `La peste del insomnio llegó a Macondo de la manera más inesperada. Todo comenzó cuando Rebeca, la huérfana que había llegado a la casa con una talega de huesos de sus padres, comenzó a mostrar signos extraños. No podía dormir, y poco a poco, su insomnio se fue extendiendo por toda la casa y luego por todo el pueblo.

Al principio, los habitantes de Macondo no le dieron importancia al hecho de no poder dormir. Pensaron que era una bendición, pues tenían más tiempo para trabajar y para vivir. Pero pronto se dieron cuenta de que la falta de sueño traía consigo algo mucho peor: la pérdida de la memoria.

Úrsula Iguarán fue la primera en notar los síntomas. Comenzó a olvidar los nombres de las cosas más simples. Miraba una silla y no recordaba cómo se llamaba. Veía una taza y no sabía qué era. El mundo comenzó a perder su significado, y con él, la realidad misma comenzó a desvanecerse.

José Arcadio Buendía, en su desesperación, comenzó a poner etiquetas a todas las cosas de la casa. "Esta es la mesa", "Esta es la silla", "Este es el reloj". Pero pronto se dio cuenta de que las etiquetas no bastaban, porque la gente olvidaba también lo que significaban las palabras escritas.

La situación se volvió desesperante cuando comenzaron a olvidar no solo los nombres de las cosas, sino también sus funciones. Sabían que una vaca era una vaca, pero no recordaban para qué servía. Veían el fuego, pero no sabían qué hacer con él. El mundo se volvió un lugar extraño y hostil, lleno de objetos sin propósito.

En medio de esta crisis, Aureliano, el hijo menor de José Arcadio Buendía, comenzó a mostrar signos de una habilidad especial. Podía predecir el futuro, veía cosas que los demás no podían ver, y tenía sueños proféticos que se cumplían con una precisión aterradora. Su padre, desesperado por encontrar una cura para la peste del insomnio, comenzó a confiar en las visiones de su hijo.

Melquíades, el gitano sabio, regresó a Macondo justo cuando la situación parecía perdida. Trajo consigo una poción mágica que podía devolver la memoria y el sueño a los habitantes del pueblo. Pero la cura tenía un precio: quien la tomara olvidaría para siempre el tiempo que había pasado despierto durante la peste.

La decisión fue difícil. Los habitantes de Macondo habían vivido experiencias únicas durante su insomnio, habían descubierto cosas sobre sí mismos que nunca habrían conocido durmiendo. Pero el precio de la vigilia eterna era demasiado alto, y finalmente decidieron tomar la poción.

Cuando despertaron del primer sueño en meses, Macondo había cambiado. Era como si hubieran despertado de una pesadilla colectiva, pero al mismo tiempo, habían perdido algo precioso: la intensidad de la experiencia vivida al límite, sin el consuelo del olvido que trae el sueño.

Esta primera gran crisis de Macondo estableció un patrón que se repetiría a lo largo de la historia de la familia Buendía: cada generación tendría que enfrentar sus propias plagas, sus propios insomnios, sus propias pérdidas de memoria y de identidad.`
            }
        ]
    },
    {
        id: "3", // El Caballero Carmelo
        chapters: [
            {
                id: "1",
                title: "Capítulo 1: El Regreso del Padre",
                content: `Era un día de julio, tibio y perfumado, cuando mi padre regresó de su largo viaje. Habían pasado tres años desde que se marchó, dejando en nuestra casa de Pisco un vacío que ni mi madre, ni mis hermanos, ni yo habíamos podido llenar completamente. Su regreso fue como el amanecer después de una larga noche, trayendo consigo no solo su presencia querida, sino también la promesa de nuevas aventuras.

Mi padre venía de Lima, donde había estado trabajando en diversos negocios. Pero lo que más nos emocionó no fueron los regalos que traía, ni las historias que contaba, sino la noticia de que había adquirido un gallo de pelea extraordinario. Se llamaba "El Caballero Carmelo", y según decía mi padre, era el gallo más noble y valiente que había conocido jamás.

La llegada del Caballero Carmelo a nuestra casa fue un acontecimiento memorable. Era un gallo colorado, de plumas brillantes que reflejaban el sol como si fueran de oro. Su porte era majestuoso, su mirada altiva, y en cada uno de sus movimientos se notaba la dignidad de un verdadero caballero. No era joven, eso se podía ver en algunas de sus plumas que comenzaban a perder el brillo, pero su experiencia y sabiduría eran evidentes.

Desde el primer momento, todos en la familia quedamos fascinados con el Caballero Carmelo. Mi madre, que generalmente no prestaba mucha atención a los gallos, se detuvo a observarlo con una mezcla de admiración y ternura. Mis hermanos y yo lo rodeamos, estudiando cada detalle de su magnífica figura. Pero quien más se encariñó con él fue mi hermana menor, quien le daba de comer en la mano y le hablaba como si fuera una persona.

El Caballero Carmelo no era solo un gallo de pelea, era un miembro más de la familia. Tenía su propio lugar en el patio, un rincón especial donde se refugiaba durante las horas más calurosas del día. Por las mañanas, su canto despertaba a todo el barrio, no con la estridencia de un gallo común, sino con la solemnidad de quien sabe que su voz es importante y respetada.

Mi padre nos contó la historia de cómo había adquirido al Caballero Carmelo. Había sido en una de esas riñas de gallos que se organizaban en los barrios de Lima, donde los aficionados se reunían para apostar y disfrutar del espectáculo. El Caballero Carmelo había vencido a varios oponentes jóvenes y fuertes, demostrando que la experiencia y la astucia podían más que la fuerza bruta.

"Este gallo", decía mi padre con orgullo, "ha peleado en las mejores galleras de Lima. Ha vencido a gallos famosos, y nunca ha conocido la derrota. Pero ya está viejo, y creo que merece descansar en paz en nuestra casa". Sin embargo, había algo en los ojos de mi padre que me decía que el Caballero Carmelo tendría que pelear una vez más.

Los días pasaron tranquilos, con el Caballero Carmelo adaptándose a su nueva vida en Pisco. Era evidente que extrañaba la emoción de las peleas, pero también parecía disfrutar de la paz de nuestro hogar. Nosotros, los niños, pasábamos horas observándolo, aprendiendo de su comportamiento, de su dignidad, de su manera de enfrentar cada día con la cabeza en alto.

Pero la tranquilidad no duraría mucho. En el pueblo se comenzó a correr la voz de que había llegado un gallo extraordinario, y pronto llegaron los desafíos. Los galleros de Pisco querían ver de qué estaba hecho el famoso Caballero Carmelo que había traído don Abraham desde Lima.`
            },
            {
                id: "2",
                title: "Capítulo 2: El Desafío del Ajiseco",
                content: `La noticia llegó un martes por la mañana, cuando el sol apenas comenzaba a calentar las piedras del patio. Don Raimundo Sánchez, el gallero más respetado de Pisco, había venido a nuestra casa con una propuesta que cambiaría para siempre la vida del Caballero Carmelo y la nuestra.

"Don Abraham", dijo con voz firme pero respetuosa, "tengo un gallo joven, fuerte, que ha ganado todas sus peleas. Se llama 'El Ajiseco', y me dicen que usted tiene un gallo famoso venido de Lima. ¿Qué le parece si los enfrentamos este domingo en la gallera del pueblo?".

Mi padre escuchó la propuesta en silencio, mientras yo observaba sus ojos buscando alguna señal de lo que pensaba. El Caballero Carmelo estaba a pocos pasos de nosotros, picoteando algunos granos de maíz con su habitual elegancia, ajeno a la conversación que decidía su destino.

"El Caballero Carmelo ya está viejo", respondió finalmente mi padre. "Ha peleado muchas batallas, y creo que merece descansar". Pero don Raimundo insistió: "Precisamente por eso sería una pelea interesante. La experiencia contra la juventud, la sabiduría contra la fuerza. Todo el pueblo está esperando ver esta pelea".

Esa noche, la familia se reunió para discutir la propuesta. Mi madre estaba en contra, argumentando que el Caballero Carmelo ya había dado suficiente gloria y que no era justo exponerlo a una pelea que podría ser su última. Mis hermanos estaban divididos: algunos querían ver al Caballero Carmelo en acción, otros temían por su vida.

Yo observaba a mi padre, tratando de entender sus pensamientos. Sabía que él también estaba dividido entre el amor por nuestro gallo y el orgullo del gallero que no podía rechazar un desafío. Finalmente, fue el propio Caballero Carmelo quien pareció tomar la decisión por nosotros.

Al día siguiente, cuando don Raimundo vino a buscar la respuesta, el Caballero Carmelo se acercó a la cerca donde estábamos conversando. Alzó su cabeza con altivez, extendió sus alas y lanzó un canto que resonó por todo el barrio. Era como si estuviera diciendo: "Estoy listo para defender mi honor una vez más".

"Está bien", dijo mi padre con una mezcla de orgullo y tristeza en la voz. "El Caballero Carmelo peleará contra el Ajiseco este domingo". Don Raimundo sonrió satisfecho y se despidió, prometiendo que sería una pelea memorable.

Los días que siguieron fueron de preparación intensa. Mi padre comenzó a entrenar al Caballero Carmelo, aunque más que entrenamiento, parecía un ritual de despedida. Le daba los mejores granos, le preparaba comidas especiales, y pasaba horas hablándole en voz baja, como si le estuviera dando consejos para la batalla que se aproximaba.

Toda la familia participó en los preparativos. Mi madre, a pesar de su oposición inicial, comenzó a cocinar comidas especiales para el Caballero Carmelo. Mis hermanos y yo nos encargamos de mantener limpio su lugar en el patio y de darle toda la atención que merecía un guerrero que se preparaba para su última batalla.

El Caballero Carmelo parecía consciente de la importancia del momento. Su comportamiento cambió sutilmente: se volvió más alerta, más orgulloso, como si estuviera recordando todos los triunfos de su gloriosa carrera. Sin embargo, también había algo melancólico en sus ojos, como si supiera que esta pelea sería diferente a todas las anteriores.

El domingo llegó demasiado pronto. Todo el pueblo se había reunido en la gallera para presenciar el enfrentamiento entre la experiencia y la juventud, entre el legendario Caballero Carmelo y el joven e implacable Ajiseco. El destino estaba por cumplirse.`
            }
        ]
    },
    {
        id: "5", // Hamlet
        chapters: [
            {
                id: "1",
                title: "Acto I: El Fantasma del Rey",
                content: `¿Ser o no ser? Esa es la cuestión. Pero antes de llegar a esta pregunta fundamental, debemos comenzar por el principio, en las murallas del castillo de Elsinore, donde los centinelas han visto algo que helará la sangre de cualquier mortal: el fantasma del rey Hamlet, muerto hace apenas dos meses.

Bernardo y Marcelo, dos de los guardias más leales del reino, han presenciado durante tres noches consecutivas la aparición del espectro del rey difunto. La figura, vestida con la misma armadura que usó en vida, camina silenciosamente por los parapetos del castillo, como si buscara algo o alguien. Su presencia es tan real y tan aterradora que los guardias han decidido informar a Horacio, el mejor amigo del príncipe Hamlet, sobre estas extrañas apariciones.

Horacio, hombre de ciencia y razón, inicialmente se muestra escéptico ante los relatos de los guardias. "Es pura fantasía", dice, "los muertos no regresan". Pero cuando el fantasma aparece nuevamente ante sus ojos, su incredulidad se transforma en horror y asombro. La figura del rey muerto es inconfundible, y su presencia no puede ser negada.

El fantasma intenta comunicarse con los guardias, pero cuando estos se acercan, desaparece como si fuera humo llevado por el viento. Es entonces cuando Horacio comprende la gravedad de la situación: si el espíritu del rey ha regresado, debe ser por una razón muy importante, y esa razón probablemente tenga que ver con su hijo, el príncipe Hamlet.

Mientras tanto, en el gran salón del castillo, se celebra una ceremonia muy diferente. El rey Claudio, hermano del difunto rey Hamlet, ha contraído matrimonio con Gertrudis, la viuda del rey, apenas dos meses después de la muerte de su esposo. Esta boda apresurada ha causado gran escándalo en la corte, pero Claudio ha justificado su decisión diciendo que el reino necesita estabilidad en estos tiempos difíciles.

El príncipe Hamlet, vestido de luto riguroso, observa la ceremonia con una mezcla de dolor, disgusto y rabia. No puede entender cómo su madre pudo casarse tan pronto con su tío, y menos aún cómo pudo olvidar tan rápidamente a su padre. "¡Fragilidad, tu nombre es mujer!", murmura entre dientes, mientras observa a Gertrudis sonreír en brazos de su nuevo esposo.

Claudio, consciente del malestar de su sobrino, intenta acercarse a él con palabras de consuelo y consejos sobre la necesidad de seguir adelante. "Es natural llorar por los muertos", le dice, "pero la vida debe continuar. Tu padre no habría querido verte así de triste". Pero Hamlet no puede ser consolado. Su dolor es profundo, y la rapidez con que su madre se ha vuelto a casar ha abierto una herida que parece imposible de sanar.

Es en medio de esta situación tan tensa que Horacio llega para informar a Hamlet sobre las apariciones del fantasma. Al principio, Hamlet no puede creer lo que escucha. "¿Mi padre? ¿Has visto a mi padre?", pregunta con incredulidad. Pero cuando Horacio le describe detalladamente la aparición, Hamlet comprende que debe ser cierto.

"Esta noche iré a las murallas", declara Hamlet con determinación. "Si es verdad que el espíritu de mi padre camina por este castillo, debo hablar con él. Necesito saber qué lo mantiene atado a este mundo". Horacio intenta disuadirlo, advirtiendo sobre los peligros de comunicarse con los muertos, pero Hamlet está decidido.

Esa noche, bajo un cielo estrellado y con el viento frío azotando las murallas del castillo, Hamlet espera junto a Horacio y los guardias la aparición del fantasma. La tensión es palpable, y cada sonido parece amplificado en el silencio de la noche. Finalmente, cuando el reloj marca la medianoche, la figura del rey muerto aparece ante ellos.

El fantasma se dirige directamente hacia Hamlet, haciendo un gesto para que lo siga. "No vayas", le suplica Horacio, "puede ser una trampa del demonio". Pero Hamlet no puede resistir la llamada de su padre. "Sígueme", parece decir el espectro, y Hamlet obedece, siguiéndolo hasta un lugar apartado donde nadie más puede escucharlos.

Lo que el fantasma le revela a Hamlet esa noche cambiará para siempre el curso de su vida y el destino del reino de Dinamarca.`
            },
            {
                id: "2",
                title: "Acto II: La Revelación del Fantasma",
                content: `"¡Escúchame!", dice el fantasma con voz que parece venir de las profundidades de la tierra. "Mi tiempo es breve, pues debo regresar a las llamas del purgatorio antes de que cante el gallo. Pero tengo algo que decirte, hijo mío, algo que clamará venganza desde las profundidades del infierno".

Hamlet, temblando no solo por el frío de la noche sino por la presencia sobrenatural de su padre, se arrodilla ante el espectro. "Habla, padre mío", dice con voz quebrada por la emoción. "He llorado tu muerte cada día desde que partiste. Dime qué puedo hacer para darte paz".

El fantasma se acerca más, y su voz se vuelve más intensa y terrible: "Si alguna vez amaste a tu padre, debes vengar su muerte. Pero no fue una muerte natural, como todos creen. No morí por la picadura de una serpiente mientras dormía en mi jardín. ¡Fui asesinado! ¡Asesinado por mi propio hermano!".

Las palabras del fantasma caen sobre Hamlet como rayos. "¡Claudio!", exclama con horror. "¡Mi tío Claudio!". El espectro asiente con solemnidad: "Sí, ese mismo hombre que ahora duerme en el lecho de tu madre, que se ha coronado rey de Dinamarca, que ha seducido a mi esposa con palabras melosas y regalos falsos".

El fantasma continúa su terrible relato: "Mientras yo dormía en mi jardín, como era mi costumbre después del almuerzo, tu tío se acercó sigilosamente. Tenía en sus manos un frasco de henbane, un veneno mortal. Con maldad diabólica, vertió el contenido en mi oído. El veneno corrió por mi sangre como mercurio, cortando mi vida en el momento de mayor paz".

Hamlet escucha con horror creciente. Su padre había muerto no solo asesinado, sino sin posibilidad de confesarse, sin sacramentos, sin preparación para la muerte. "Morí con todos mis pecados sobre mi cabeza", lamenta el fantasma. "Por eso estoy condenado a vagar por la noche y a purificarme en el fuego durante el día, hasta que los crímenes cometidos en mi vida mortal sean purificados".

"Pero no permitas que el lecho real de Dinamarca sea un nido de lujuria y incesto", continúa el espectro. "Venga a tu padre, pero no contamines tu alma con pensamientos de venganza contra tu madre. Deja que sea el cielo quien la juzgue, y que su conciencia sea su castigo. Actúa solo contra Claudio, el verdadero culpable".

Hamlet, abrumado por la revelación, jura venganza: "¡Por todos los santos del cielo! ¡Por todos los demonios del infierno! ¡Juro que te vengaré, padre mío! Claudio pagará por su crimen con su vida". El fantasma, satisfecho con la promesa de su hijo, comienza a desvanecerse: "Recuerda, Hamlet. Recuerda siempre". Y con estas palabras, desaparece.

Cuando Horacio y los guardias encuentran a Hamlet, lo hallan en un estado de gran agitación. "¿Qué te ha dicho el fantasma?", pregunta Horacio con preocupación. Pero Hamlet, ahora cargado con el terrible secreto de su padre, no puede revelar completamente lo que ha escuchado. "Hay más cosas en el cielo y en la tierra, Horacio, de las que contempla tu filosofía", responde enigmáticamente.

Hamlet hace jurar a sus compañeros que no revelarán nada de lo que han visto esa noche. "Jurad por mi espada", insiste, y cuando vacilan, la voz del fantasma se escucha desde debajo de la tierra: "¡Jurad!". Aterrorizados, Horacio y los guardias hacen el juramento solemne.

Pero Hamlet también les advierte sobre algo más: "En los días que vienen, puede que yo actúe de manera extraña, que parezca loco o perturbado. No importa cómo me comporte, recordad vuestro juramento y no reveléis nada de lo que sabéis". Esta advertencia resultará profética, pues Hamlet ha decidido fingir locura para poder planear su venganza sin despertar sospechas.

Mientras regresa al castillo, Hamlet reflexiona sobre la terrible carga que ahora pesa sobre sus hombros. "¡Oh, tiempo maldito, que me tocó nacer para enderezar lo que está torcido!", murmura. La revelación del fantasma ha transformado al melancólico príncipe en un vengador, pero también ha sembrado en su alma las semillas de una lucha interna que lo atormentará hasta el final de sus días.

La vida en el castillo de Elsinore nunca volverá a ser la misma. Hamlet ahora sabe la verdad sobre la muerte de su padre, pero también sabe que demostrar esa verdad y ejecutar su venganza será una tarea que pondrá a prueba no solo su valor, sino su cordura misma.`
            }
        ]
    }
];

// Función para obtener el contenido de un libro específico
export const getBookContent = (bookId: string): BookContent | undefined => {
    return bookContent.find(book => book.id === bookId);
};

// Función para obtener un capítulo específico de un libro
export const getChapter = (bookId: string, chapterId: string): Chapter | undefined => {
    const book = getBookContent(bookId);
    if (!book) return undefined;
    return book.chapters.find(chapter => chapter.id === chapterId);
};

// Función para obtener el número total de capítulos de un libro
export const getTotalChapters = (bookId: string): number => {
    const book = getBookContent(bookId);
    return book ? book.chapters.length : 0;
};
