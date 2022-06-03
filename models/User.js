const knex = require("../database/connection")
const bcrypt = require("bcrypt")
const PasswordToken = require("./PasswordToken")

class User {
    async new(user) {
        const { name, email, password } = user

        try {
            const hash = await bcrypt.hash(password, 10) // 10 é o salt

            await knex.insert({ name, email, password: hash, role: 0 }).table("users")
        } catch (err) {
            console.log(err)
        }
    }

    async update(id, user) {
        try {
            await knex.update(user).where({ id: id }).table("users")
            return { status: true }
        } catch (err) {
            return { status: false, err: err }
        }
    }

    async delete(id) {
        const user = await this.findById(id)

        if (user) {
            try {
                await knex.delete(user).where({ id: id }).table("users")
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }
        } else {
            return { status: false, err: "User does not exist!" }
        }
    }

    async findAll() {
        try {
            const result = await knex.select(["id", "name", "email", "role"]).table("users")
            return result
        } catch (err) {
            console.log(err)
            return []
        }
    }

    async findById(id) {
        try {
            const result = await knex.select(["id", "name", "email", "role"]).where({ id: id }).table("users")

            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        } catch (err) {
            console.log(err)
            return undefined
        }
    }

    async findByEmail(email) {
        try {
            const result = await knex.select("*").where({ email: email }).table("users")

            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        } catch (err) {
            console.log(err)
            return undefined
        }
    }

    async findEmail(email) {
        try {
            const result = await knex.select("*").from("users").where({ email: email })

            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async changePassword(id, newPassword) {
        const hash = await bcrypt.hash(newPassword, 10) // 10 é o salt

        try {
            await knex.update({ password: hash }).where({ id: id }).table("users")
            
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }
}

module.exports = new User()