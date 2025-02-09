import { response } from "express";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"
import { Error } from "mongoose";
import { send } from "process";

export const sendVerificationEmail =async (email, verificationToken) =>{
    const recipient = [{email}];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email sent successfuly", response)
    } catch (error){
		console.error(`Error sending password reset email`, error);

        throw new Error(`Error sending verification: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, name) =>{

    const recipient = [{email}];

    try{

        await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid:"92e785b2-fba9-409a-90aa-41ec4c5dbee4",
            template_variables:{
                company_info_name: "Imad Company",
                name: name
            },
        });
        console.log("Welcome email send successfuly", response);

    } catch (error){
        console.error('Error sendig welcome email', error)
		throw new Error(`Error sending welcome email: ${error}`);
        
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset you Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"

        });
    } catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
}

export const sendResetSuccessEmail = async (email) =>{
    const recipient = [{email}];

    try{
        const response = await mailtrapClient.send({
            from :sender,
            to: recipient,
            subject: "Password Rest Succesful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reste",
        });
        console.log("password reset email sent success", response)
    }catch (error){
        console.log("Error sending password reset", error);
		throw new Error(`Error sending password reset success email: ${error}`);
        
    }
}