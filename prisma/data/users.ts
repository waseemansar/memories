import { genSaltSync, hashSync } from "bcryptjs";

const salt = genSaltSync(Number(process.env.SALT_ROUNDS));

const users = [
    {
        name: "Waseem Malik",
        email: "waseemansarmalik@gmail.com",
        password: hashSync("incorrect8", salt),
        posts: [
            {
                title: "Quad Biking",
                message: "We live for the thrill of the ride. Follow your free spirit, wherever it leads.",
                tags: ["quadbiking", "desert"],
                selectedFile: "/uploads/quad-bike.jpg",
            },
            {
                title: "BBQ Night",
                message:
                    "Enjoying a nice meal, drinks, and memories are what make bbq nights so enjoyable. A number of people I know love to get together and have bbq nights every month.",
                tags: ["bbq", "night", "skydiver", "barbeque"],
                selectedFile: "/uploads/bbq.jpg",
            },
        ],
    },
    {
        name: "Waseem Ansar",
        email: "waseemansar@outlook.com",
        password: hashSync("incorrect8", salt),
        posts: [
            {
                title: "Birthday Party",
                message:
                    "A birthday is a time to celebrate birth itself, the joy of life. It is also an occasion to rethink your life: How great is the disparity between what I have accomplished and what I can accomplish?",
                tags: ["birthday", "happybirthday", "party"],
                selectedFile: "/uploads/birthday.jpg",
            },
        ],
    },
];

export default users;
