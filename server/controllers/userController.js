const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jsonwebtoken.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('incorrect email or password'))
        }
        const candidate = await User.findOne({where: {email}})

        if (candidate) {
            return next(ApiError.badRequest('user with this email address already exists'))
        }
        const hashPassword = await bcrypt.hash(password, 5)

        const user = await User.create({email, password: hashPassword, role})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('User with this email does not exist'))
        }
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Wrong password specified'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async authCheck(req, res, next) {
        
    }
}

module.exports = new UserController()