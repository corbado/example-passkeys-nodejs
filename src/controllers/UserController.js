const db = require("../../models");
const User = db.user;

exports.create = (name, email) => {
    const user = {
        name: name,
        email: email,
    }

    return User.create(user)
}

exports.findByEmail = (email) => {
    return User.findOne({where: {email: email}})
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error);
        })
};

exports.findById = (id) => {
    return User.findOne({where: {id: id}})
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error);
        });
}
