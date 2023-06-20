import db from "../../models/index.js";
import bcrypt from "bcryptjs";

const User = db.user;

export const create = async (name, email, password = null) => {
    let hashedPassword = null;
    if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const user = {
        name,
        email,
        password: hashedPassword,
    }

    return User.create(user);
}

export const findByEmail = async (email) => {
    try {
        const response = await User.findOne({ where: { email }});
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const findById = async (id) => {
    try {
        const response = await User.findOne({ where: { id }});
        return response;
    } catch (error) {
        console.error(error);
    }
};
