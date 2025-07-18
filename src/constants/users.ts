interface User {
    id: number;
    name: string;
    image: string;
    calification: number;
    comment: string;
    date: string;
}

export const users: User[] = [
    {
        id: 1,
        name: 'John Doe',
        image: "/images/users/carameme.jpg",
        calification: 4.5,
        comment : "Great service and friendly staff! I've been using this platform for over a year now and I'm consistently impressed by the quality of service. The staff is always helpful and responsive to any questions or concerns I have. The user interface is intuitive and makes it easy to find what I'm looking for. I would definitely recommend this to anyone looking for a reliable and user-friendly experience.",
        date: "2023-10-01"
    },
    {
        id: 2,
        name: 'Jane Smith',
        image: "/images/users/carameme.jpg",
        calification: 4.0,
        comment: "I had a wonderful experience! The booking process was smooth and straightforward. I would highly recommend this service to anyone looking for a hassle-free experience.",
        date: "2023-10-02"
    },
    {
        id: 3,
        name: 'Alice Johnson',
        image: "/images/users/carameme.jpg",
        calification: 3.5,
        comment: "Decent service, but there were a few hiccups along the way. The customer support was helpful in resolving my issues, but I hope they can improve their system to avoid these problems in the future.",
        date: "2023-10-03"
    },
    {
        id: 4,
        name: 'Bob Brown',
        image: "/images/users/carameme.jpg",
        calification: 2.0,
        comment: "Not the best experience. I faced several issues during my booking, and while the support team was responsive, it took longer than expected to resolve everything. I hope they can streamline their process in the future.",
        date: "2023-10-04"
    },
    {
        id: 5,
        name: 'Charlie Davis',
        image: "/images/users/carameme.jpg",
        calification: 1.5,
        comment: "Very disappointed with the service. I encountered multiple problems, and the customer support was not very helpful. I would not recommend this service based on my experience.",
        date: "2023-10-05"
    },
    {
        id: 6,
        name: 'Diana Prince',
        image: "/images/users/carameme.jpg",
        calification: 4.8,
        comment: "Absolutely fantastic! The service exceeded my expectations in every way. The staff was incredibly friendly and went above and beyond to ensure I had a great experience. I will definitely be using this service again in the future!",
        date: "2023-10-06"
    },
    {
        id: 7,
        name: 'Ethan Hunt',
        image: "/images/users/carameme.jpg",
        calification: 3.0,
        comment: "Average experience. The service was okay, but nothing stood out. I think they could improve their offerings to make it more appealing.",
        date: "2023-10-07"
    },
    {
        id: 8,
        name: 'Fiona Gallagher',
        image: "/images/users/carameme.jpg",
        calification: 4.2,
        comment: "Good service overall. I had a few minor issues, but they were resolved quickly. The staff was friendly and accommodating, which made the experience much better.",
        date: "2023-10-08"
    },
    {
        id: 9,
        name: 'George Costanza',
        image: "/images/users/carameme.jpg",
        calification: 2.5,
        comment: "It was an okay experience. Some aspects were good, but others fell short. I think there's room for improvement.",
        date: "2023-10-09"
    },
    {
        id: 10,
        name: 'Hannah Montana',
        image: "/images/users/carameme.jpg",
        calification: 4.0,
        comment: "I had a great experience! The service was quick and efficient, and the staff was very friendly. I would definitely use this service again.",
        date: "2023-10-10"
    }
]