import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import {generateTokenAndSendCookies} from '../utils/generateTokenAndSendCookies.js'
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
const {email, password, name} = req.body;

try{
    if (!email || !password || !name){
        throw new Error("All feilds are required");
    }
    const userAlreadyExists = await User.findOne({email});
    console.log("user existe", userAlreadyExists)
    if(userAlreadyExists){
        return res.status(400).json({success:false, message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User ({
        email,
        password: hashedPassword,
        name,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000

    })
    await user.save();
    // jwt
    generateTokenAndSendCookies(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);


    res.status(201).json({ 
        success: true, 
        message: "user created successfuly",
    User:{
        ...user._doc,
        password: undefined,
    },
    });
    } catch (error){
        res.status(400).json({success: false, message: error.message});

    }
};

export const verifyEmail = async (req, res) =>{
    const  {code} = req.body;
    try{
        const user = await User.findOne({
            verificationToken : code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({success: false, message: "Invalide or expired verification code"})
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined,
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "email verified successfuly",
            user:{
                ...user._doc,
                password : undefined,

            },
        });
    } catch (error){
        console.log("error in verification email", error)
        res.status(500).json({success: false, message: "Server error"})

    }
}

export const login = async (req, res) => {
    res.send("login route");

}


export const logout = async (req, res) => {
    res.send("logout route");

}