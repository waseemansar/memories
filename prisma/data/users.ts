import { genSaltSync, hashSync } from "bcryptjs";

const salt = genSaltSync(Number(process.env.SALT_ROUNDS));

const users = [
    {
        name: "Waseem Malik",
        email: "waseemansarmalik@gmail.com",
        password: hashSync("incorrect8", salt),
    },
    {
        name: "Waseem Ansar",
        email: "waseemansar@outlook.com",
        password: hashSync("incorrect8", salt),
    },
];

export default users;
