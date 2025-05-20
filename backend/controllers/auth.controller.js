import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail , sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail} from "../mailtrap/emails.js";
export const signup = async (req, res) => {
    
    const { email, password, name } = req.body;

    try{
        if(!email || !password || !name){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 1 hour
        })

        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    console.log(code);
    try{
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() } // Ensure token is not expired
        });

        console.log("Query parameters:", {
            verificationToken: code.trim(),
            verificationTokenExpiresAt: { $gt: Date.now() }
        });
        
        console.log(user);

        if(!user){
            return res.status(400).json({message: "Invalid or expired verification code"});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user:{
                ...user._doc,
                password: undefined,
            }
        });
    }catch(error){
        console.error("Error verifying email:", error);
        return res.status(500).json({message: error.message});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({
            email
        })
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    }
    catch(error){
        console.error("Error logging in:", error);
        return res.status(500).json({message: error.message});
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}

export const forgotPassword = async(req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        //Generate user token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    }catch(error){
        console.error("Error in forgot password:", error);
        return res.status(500).json({message: error.message});
    }
}

export const resetPassword = async (req, res) => {
    try{
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() } // Ensure token is not expired
        });
        if(!user){
            return res.status(400).json({message: "Invalid or expired reset token"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully",});
        
    }catch(error){
        console.error("Error in reset password:", error);
        return res.status(500).json({message: error.message});
    }
}

export const checkAuth = async(req, res) => {
    try{
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        res.status(200).json({success: true, user});
    }
    catch(error){
        console.error("Error checking auth:", error);
        return res.status(400).json({message: error.message});
    }
}