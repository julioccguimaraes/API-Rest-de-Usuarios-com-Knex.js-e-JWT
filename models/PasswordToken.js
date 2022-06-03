const User = require('../models/User')
const knex = require("../database/connection")
const uuid = require('uuid');

class PasswordToken {
    async create(email) {
        const user = await User.findByEmail(email)

        if (user) {
            try {
                const token = uuid.v4()

                await knex.insert({ user_id: user.id, used: 0, token }).table("passwordtokens")
                return { status: true, token }
            } catch (err) {
                return { status: false, err: err }
            }
        } else {
            return { status: false, err: "User does not exist!" }
        }
    }

    async validate(token) {
        try {
            const result = await knex.select("*").where({ token }).table("passwordtokens")

            if (result.length > 0 && !result[0].used) {
                return { status: true, passwordtoken: result[0] }
            } else {
                return { status: false, err: "Token is invalid!" }
            }
        } catch (err) {
            return { status: false, err: err }
        }
    }

    async setUsed(token) {
        await knex.update({ used: 1 }).where({ token }).table("passwordtokens")
    }
}

module.exports = new PasswordToken()