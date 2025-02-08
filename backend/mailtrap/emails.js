import { response } from "express";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"
import { Error } from "mongoose";

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