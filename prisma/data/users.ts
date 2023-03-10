import { genSaltSync, hashSync } from "bcryptjs";

const salt = genSaltSync(Number(process.env.SALT_ROUNDS));

const users = [
    {
        name: "Waseem Ansar",
        email: "waseemansar@outlook.com",
        password: hashSync("incorrect8", salt),
        posts: [
            {
                title: "Niagara falls",
                message: "Niagara falls is a group of three waterfalls spanning the border between the Canada and United States.",
                tags: ["niagarafalls", "canada", "usa"],
                selectedFile: "/uploads/niagara-falls.jpg",
            },
            {
                title: "Burj Khalifa",
                message:
                    "The Burj Khalifa is the tallest building in the world and a global icon. Truly a feat of engineering, the building represents the conceptual heart and soul of the city of Dubai.",
                tags: ["burjkhalifa", "dubai", "uae"],
                selectedFile: "/uploads/burj-khalifa.jpg",
            },
            {
                title: "Egyptian Pyramids",
                message: "The Egyptian pyramids are ancient masonry structures located in Egypt.",
                tags: ["pyramids", "cairo", "egypt"],
                selectedFile: "/uploads/pyramids.jpg",
            },
            {
                title: "Eiffel Tower",
                message: "The Eiffel Tower or as the French call it, La Tour Eiffel is one of the world's most recognizable landmarks.",
                tags: ["eiffeltower", "paris", "france"],
                selectedFile: "/uploads/eiffel-tower.jpg",
            },
            {
                title: "Birthday Party",
                message:
                    "A birthday is a time to celebrate birth itself, the joy of life. It is also an occasion to rethink your life: How great is the disparity between what I have accomplished and what I can accomplish?",
                tags: ["birthday", "happybirthday", "party"],
                selectedFile: "/uploads/birthday.jpg",
            },
        ],
    },
    {
        name: "Waseem Malik",
        email: "waseemansarmalik@gmail.com",
        password: hashSync("incorrect8", salt),
        posts: [
            {
                title: "London Eye",
                message: "Elegantly rotating and feel the exhilaration as you rise up over the River Thames.",
                tags: ["londoneye", "london", "uk"],
                selectedFile: "/uploads/london-eye.jpg",
            },
            {
                title: "Taj Mahal",
                message:
                    "The Taj Mahal is an Islamic ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra.",
                tags: ["tajmahal", "agra", "india"],
                selectedFile: "/uploads/taj-mahal.jpg",
            },
            {
                title: "Quad Biking",
                message: "We live for the thrill of the ride. Follow your free spirit, wherever it leads.",
                tags: ["quadbiking", "desert", "dubai"],
                selectedFile: "/uploads/quad-bike.jpg",
            },
            {
                title: "Times Square",
                message:
                    "Times Square, square in Midtown Manhattan, New York City, formed by the intersection of Seventh Avenue, 42nd Street, and Broadway.",
                tags: ["timessquare", "newyork", "usa"],
                selectedFile: "/uploads/times-square.jpg",
            },
            {
                title: "BBQ Night",
                message:
                    "Enjoying a nice meal, drinks, and memories are what make bbq nights so enjoyable. A number of people I know love to get together and have bbq nights every month.",
                tags: ["bbq", "night", "skydiver", "barbeque"],
                selectedFile: "/uploads/bbq.jpg",
            },
            {
                title: "New Year Eve",
                message:
                    "Here's to a bright New Year and a fond farewell to the old; here's to the things that are yet to come, and to the memories that we hold.",
                tags: ["newyear", "happynewyear", "dubai"],
                selectedFile: "/uploads/new-year.jpg",
            },
            {
                title: "Sydney Opera House",
                message: "The Sydney Opera House is a multi-venue performing arts centre in Sydney",
                tags: ["sydneyoperahouse", "sydney", "australia"],
                selectedFile: "/uploads/sydney-pera-house.jpg",
            },
        ],
    },
];

export default users;
