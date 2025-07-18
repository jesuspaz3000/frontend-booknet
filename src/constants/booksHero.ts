interface BookHero {
    id: string;
    name: string;
    image: string;
    description: string;
    age: string;
    year: number;
    rating: number;
    reviews: number;
    price: number;
}

export const booksHero : BookHero[] = [
    {
        id: "1principal",
        name: "El Señor de los anillos",
        image: "/Images/senior-de-los-anillos.jpg",
        description: "La historia de un grupo de amigos que se embarcan en una aventura épica para salvar el mundo.",
        age: '16+',
        year: 2003,
        rating: 4.5,
        reviews: 100,
        price: 19.99
    },
    {
        id: "2principal",
        name: "El Hobbit",
        image: "/Images/el-hobbit.jpg",
        description: "Un hobbit que se embarca en una aventura épica para salvar el mundo.",
        age: '16+',
        year: 2003,
        rating: 4.5,
        reviews: 100,
        price: 19.99
    },
    {
        id: "3principal",
        name: "Jardines de la Luna",
        image: "/Images/jardines-de-la-luna.jpg",
        description: "Una epopeya de fantasía donde imperios se desmoronan, dioses despiertan y el destino de mundos pende de un hilo. ¿Estás listo para el inicio de una saga legendaria?",
        age: '16+',
        year: 2003,
        rating: 4.5,
        reviews: 100,
        price: 19.99
    }
];