const User = require('../models/user');
const jwt=require('jsonwebtoken');

const addUser = (req, res) => {
    let user = new User(
        {
            email: req.body.email,
            password: req.body.password,
        }
    );

    user.save( (err) => {
        if (err) {
            res.send(`Error: ${err}`);
        }
        res.send('User Created successfully');
    })
}

const signInUser = async (req, res) => {
    
    try {
        let user = await User.findOne({email:req.body.email});
        user.comparePassword(req.body.password, (err,isMatch) => {
            if(isMatch){
                var token=jwt.sign({userId:user.id}, process.env.JWT_KEY);
                res.status(200).json({
                    userId:user.id,
                    email:user.email,
                    token
                })
            }
            else{
                res.status(400).json({message:'Invalid Password/Username'});
            }
        })
    }
    catch (e) {
        res.status(400).json({message:'Invalid Password/Username'});
    }
}

const isValidUser = (req, res, next) => {

    const authorizationHeaader = req.headers.authorization;

    if (authorizationHeaader) {

        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        const options = {
            expiresIn: '2d'
        };
        try {
            // verify makes sure that the token hasn't expired and has been issued by us
            result = jwt.verify(token, process.env.JWT_KEY, options);
    
            // Let's pass back the decoded token to the request object
            req.decoded = result;
            // We call next to pass execution to the subsequent middleware
            next();
        } catch (err) {
            // Throw an error just in case anything goes wrong with verification
            throw new Error(err);
        }
    }
    else {
        res.status(401).send({message:'Authentication error. Token required.'});
    }
}

module.exports = {
    addUser,
    signInUser,
    isValidUser
}