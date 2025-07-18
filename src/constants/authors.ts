interface Author {
    id: string;
    name: string;
    about: string;
    totalBooks?: number;
    image: string;
}

export const authors: Author[] = [
    {
        id: "1",
        name: "Gabriel García Márquez",
        about: "Gabriel García Márquez fue un escritor colombiano, ganador del Premio Nobel de Literatura en 1982. Es conocido por su estilo de realismo mágico y por obras como 'Cien años de soledad' y 'El amor en los tiempos del cólera'.",
        totalBooks: 20,
        image: "/images/authors/gabriel-garcia-marquez.webp",
    },
    {
        id: "2",
        name: "Miguel de Cervantes",
        about: "Miguel de Cervantes fue un escritor español, considerado una de las figuras más importantes de la literatura española y universal. Su obra más conocida es 'Don Quijote de la Mancha'.",
        totalBooks: 1,
        image: "/images/authors/miguel-de-cervantes.jpg",
    },
    {
        id: "3",
        name: "Abraham Valdelomar",
        about: "Abraham Valdelomar fue un escritor peruano, conocido por su estilo poético y por obras como 'El caballero Carmelo'.",
        totalBooks: 1,
        image: "/images/authors/abraham-valdelomar.jpg",
    },
    {
        id: "4",
        name: "Alexandre Dumas",
        about: "Alexandre Dumas fue un escritor francés, conocido por sus novelas de aventuras como 'Los tres mosqueteros' y 'El conde de Montecristo'.",
        totalBooks: 2,
        image: "/images/authors/alexandre-dumas.jpg",
    },
    {
        id: "5",
        name: "William Shakespeare",
        about: "William Shakespeare fue un dramaturgo y poeta inglés, considerado uno de los más grandes escritores de la lengua inglesa. Sus obras incluyen tragedias, comedias y dramas históricos.",
        totalBooks: 39,
        image: "/images/authors/william-shakespeare.jpg",
    },
    {
        id: "6",
        name: "Homero",
        about: "Homero fue un poeta y narrador griego, considerado uno de los más grandes de la literatura occidental. Sus obras más conocidas son 'La Ilíada' y 'La Odisea'.",
        totalBooks: 2,
        image: "/images/authors/homero.jpg",
    },
    {
        id: "7",
        name: "Autor Anónimo",
        about: "El autor de 'El Lazarillo de Tormes' es anónimo, lo que ha llevado a debates sobre su identidad. Se cree que fue escrito en el siglo XVI en España y es considerado una de las primeras novelas modernas.",
        totalBooks: 1,
        image: "/images/authors/anonymous.jpeg",
    },
    {
        id: "8",
        name: "Ricardo Palma",
        about: "Ricardo Palma fue un escritor y periodista peruano, conocido por su estilo costumbrista y por obras como 'Tradiciones Peruanas'.",
        totalBooks: 1,
        image: "/images/authors/ricardo-palma.jpg",
    },
    {
        id: "9",
        name: "Jules Verne",
        about: "Jules Verne fue un escritor francés, conocido por sus novelas de ciencia ficción y aventuras. Sus obras incluyen 'Veinte mil leguas de viaje submarino' y 'La vuelta al mundo en ochenta días'.",
        totalBooks: 1,
        image: "/images/authors/julio-verne.png",
    }
]