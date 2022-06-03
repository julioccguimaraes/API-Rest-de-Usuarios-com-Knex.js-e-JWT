const User = require("../models/User")
const PasswordToken = require("../models/PasswordToken")
//const sendEmail = require('../tools/sendEmail')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const secret = require("../auth/secret") // const secret = "blabla..."

class UserController {
    async index(req, res) {
        const users = await User.findAll()
        res.json(users)
    }

    async create(req, res) {
        const { name, email, password } = req.body

        if (!name || name.length < 3) {
            res.status(400)
            res.json({ err: "Name is invalid! Name must be greater than 3 and less than 64 characters!" })
            return // usa-se quando se trabalha com controllers
        }

        if (!email || email.length < 3 || email.length > 128) {
            res.status(400)
            res.json({ err: "E-mail is invalid! E-mail must be greater than 3 and less than 128 characters!" })
            return
        }

        if (!password || password.length < 3 || password.length > 256) {
            res.status(400)
            res.json({ err: "Password is invalid! Password must be greater than 3 and less than 256 characters!" })
            return
        }

        const emailExists = await User.findEmail(email)

        if (emailExists) {
            res.status(400)
            res.json({ err: "E-Mail Address is already registered!" })
            return
        }

        await User.new(req.body)

        res.status(200)
        res.send("User created")
    }

    async edit(req, res) {
        const { name, email, role } = req.body

        if (name && (name.length < 3 || name.length > 128)) {
            res.status(400)
            res.json({ err: "Name is invalid! Name must be greater than 3 and less than 64 characters!" })
            return // usa-se quando se trabalha com controllers
        }

        if (email && (email.length < 3 || email.length > 128)) {
            res.status(400)
            res.json({ err: "E-mail is invalid! E-mail must be greater than 3 and less than 128 characters!" })
            return
        }

        if (role && parseInt(role) < 0) {
            res.status(400)
            res.json({ err: "Role is invalid!" })
            return
        }

        const id = req.params.id
        const user = await User.findById(id)

        if (user) {
            if (email) {
                const emailExists = await User.findEmail(email)

                if (user.email != email && emailExists) {
                    res.status(400)
                    res.json({ err: "E-Mail Address is already registered!" })
                    return
                }
            }

            const result = await User.update(id, req.body)

            if (result.status) {
                res.status(200)
                res.send("User updated!")
            } else {
                res.status(406)
                res.json({ err: result.err })
            }
        } else {
            res.status(404)
            res.json({ err: "User does not exist!" })
        }
    }

    async delete(req, res) {
        const id = req.params.id
        const result = await User.delete(id)

        if (result.status) {
            res.status(200)
            res.send("User deleted!")
        } else {
            res.status(406)
            res.json({ err: result.err })
        }
    }

    async findById(req, res) {
        const id = req.params.id
        const user = await User.findById(id)

        if (user) {
            res.status(200)
            res.json(user)
        } else {
            res.status(404)
            res.json({})
        }
    }

    async recoverPassword(req, res) {
        const email = req.body.email

        const result = await PasswordToken.create(email)

        if (result.status) {
            const text = 'Use essa url para recuperar sua senha: ' + req.baseUrl + '/token/' + result.token
            const html = '<a href="' + req.baseUrl + '/changepassword/' + result.token + '">Clique aqui para recuperar a senha</a>'

            //sendEmail(email, "Password Recover", text, html)
            console.log(text)
            console.log(html)

            res.status(200)
            res.json(result.token)
        } else {
            res.status(406)
            res.json({ err: result.err })
        }
    }

    async changePassword(req, res) {
        const token = req.params.token
        const password = req.body.password

        const resultToken = await PasswordToken.validate(token)

        if (resultToken.status) {
            const result = await User.changePassword(resultToken.passwordtoken.user_id, password)

            if (result) {
                await PasswordToken.setUsed(token)
                res.status(200)
                res.send("Password changed!")
            } else {
                res.status(406)
                res.send("Error changing password")
            }
        } else {
            res.status(406)
            res.json({ err: resultToken.err })
        }
    }

    async login(req, res) {
        const { email, password } = req.body
        const user = await User.findByEmail(email)

        if (user) {
            const result = await bcrypt.compare(password, user.password)

            if (result) {
                const token = jwt.sign({ email: user.email, role: user.role }, secret);
                res.status(200)
                res.json({ token })
            } else {
                res.status(401)
                res.send("Senha incorreta")
            }
        } else {
            res.status(401)
            res.json({ status: false })
        }
    }
}

module.exports = new UserController()