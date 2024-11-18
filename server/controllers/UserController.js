import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/register" , async(req,res)=>{
    const {firstname , lastname , email , password} = req.body;

    try {
        if(!firstname || !lastname || !email || !password){
            return res.status(400).json({error : "All fields are required"})
        }
        const existingUser = await User.findOne({email : email});
        if(existingUser){
            return res.status(400).json({error : "Email already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({firstname, lastname, email, password : hashedPassword});
        await newUser.save();
        res.status(201).json({message : "User registered successfully"})


    } catch (error) {
        console.error("Error in registration" ,error)
        res.status(500).json({error : "Server Error"})
    }
})

router.post("/login" , async(req,res)=>{
    const {email , password} = req.body
    try {
        if(!email || !password){
            return res.status(400).json({error : "All fields are required"})
        }
        const user = await User.findOne({email : email}) 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
         const passwordMatch = await bcrypt.compare(password , user.password);
         if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
          }
         const token = jwt.sign({ userId: user._id, role }, secret, { expiresIn: '1h' });
          res.json({
            token , userId : user._id 
          })
    } catch (error) {
        console.error("Error during login", error)
        res.status(500).json({error : "Server Error"})
    }
})

export {router as UserRouter};