interface Book {
    id: string;
    name: string;
    authorId: string; // Cambio: ahora usa el ID del autor
    image: string;
    resume: string;
    genre: string[];
    calification?: number;
    age: string;
    year: number;
    page: number;
}

export const bookList: Book[] = [
    {
        id: "1",
        name: "Cien Años de Soledad",
        image: "/images/cien-anios-de-soledad.webp",
        authorId: "1", // Gabriel García Márquez
        resume: "Cien años de soledad es un libro de Gabriel García Márquez que narra la historia de la familia Buendía en la región de Macondo, Colombia.",
        genre: ["Ficción", "Realismo mágico", "Literatura latinoamericana"],
        calification: 4.5,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "2",
        name: "Don Quijote de la Mancha",
        image: "/images/don-quijote.jpg",
        authorId: "2", // Miguel de Cervantes Saavedra
        resume: "Don Quijote de la Mancha es un libro de Miguel de Cervantes Saavedra que narra la historia de Don Quijote y su amigo Sancho Panza.",
        genre: ["Ficción", "Novela", "Literatura clásica"],
        calification: 4.5,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "3",
        name: "El Caballero Carmelo",
        image: "/images/el-caballero-carmelo.jpg",
        authorId: "3", // Abraham Valdelomar
        resume: "El caballero Carmelo es un cuento del escritor peruano Abraham Valdelomar que narra, con nostalgia y ternura, un episodio importante en la infancia del narrador. La historia se centra en el regreso del padre a casa luego de años de ausencia, y en cómo su llegada coincide con una pelea de gallos muy esperada en el pueblo de Pisco. El gallo de pelea de la familia, llamado El caballero Carmelo, es un animal noble, viejo y muy querido por todos. El padre decide hacerlo luchar una vez más, enfrentándolo a un gallo joven y violento llamado El Ajiseco. Aunque Carmelo gana la pelea con esfuerzo y valentía, muere poco después debido a las heridas. Su muerte causa gran tristeza en la familia.",
        genre: ["Cuento", "Literatura peruana"],
        calification: 4,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "4",
        name: "El Conde de Montecristo",
        image: "/images/el-conde-de-montecristo.jpg",
        authorId: "4", // Alexandre Dumas
        resume: "El Conde de Montecristo es un libro de Alexandre Dumas que narra la historia de Dantès, un hombre que es injustamente acusado de traición y enviado a prisión por 20 años.",
        genre: ["Ficción", "Aventura", "Literatura clásica"],
        calification: 4.5,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "5",
        name: "Hamlet",
        image: "/images/hamlet.jpg",
        authorId: "5", // William Shakespeare
        resume: "Hamlet es un libro de William Shakespeare que narra la historia de Hamlet, un príncipe de Dinamarca que se encuentra con una serie de desafíos y desventuras.",
        genre: ["Tragedia", "Teatro", "Literatura clásica"],
        calification: 4.5,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "6",
        name: "La Odisea",
        image: "/images/la-odisea.jpg",
        authorId: "6", // Homero
        resume: "La Odisea es un libro de Homero que narra la historia de la aventura de Odiseo, un griego que se encuentra con una serie de desafíos y desventuras.",
        genre: ["Épica", "Literatura clásica", "Aventura"],
        calification: 4.5,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "7",
        name: "El Lazarillo de Tormes",
        image: "/images/lazarillo-de-tormes.webp",
        authorId: "7", // Autor Anónimo
        resume: "El Lazarillo de Tormes es un libro de Anonymous que narra la historia de Lazarillo, un niño que se encuentra con una serie de desafíos y desventuras.",
        genre: ["Novela", "Literatura española"],
        calification: 4,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "8",
        name: "Romeo y Julieta",
        image: "/images/romeo-y-julieta.webp",
        authorId: "5", // William Shakespeare (mismo autor que Hamlet)
        resume: "Romeo y Julieta es un libro de William Shakespeare que narra la historia de Romeo y Julieta, dos jóvenes que se enamoran y se suicidan por amor.",
        genre: ["Tragedia", "Teatro", "Literatura clásica"],
        calification: 5,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "9",
        name: "Tradiciones Peruanas",
        image: "/images/tradiciones-peruanas.jpg",
        authorId: "8", // Ricardo Palma
        resume: "Es una colección de relatos cortos escritos por Ricardo Palma, que mezcla historia, leyenda, anécdota y ficción para contar episodios curiosos, divertidos o significativos del pasado del Perú, especialmente durante la época virreinal y republicana. Cada tradición tiene un tono ligero, irónico y costumbrista, y muchas veces juega con el lenguaje popular y refranes. Aunque muchas se basan en hechos reales, Palma toma libertades literarias para hacerlas más amenas.",
        genre: ["Cuento", "Literatura peruana", "Costumbrismo"],
        calification: 4,
        age: '16+',
        year: 2003,
        page: 20,
    },
    {
        id: "10",
        name: "Viaje al Centro de la Tierra",
        image: "/images/viaje-al-centro-de-la-tierra.webp",
        authorId: "9", // Jules Verne
        resume: "Viaje al Centro de la Tierra es un libro de Jules Verne que narra la historia de un grupo de científicos que se embarcan en una expedición para descubrir el centro de la Tierra.",
        genre: ["Ciencia ficción", "Aventura", "Literatura clásica"],
        calification: 4.5,
        age: '16+',
        year: 2003,
        page: 20,
    }
];