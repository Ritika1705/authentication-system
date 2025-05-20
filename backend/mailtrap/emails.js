import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });

        console.log("Email sent successfully:", response);
    }catch(error){
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email: ${error.message}");
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];

    try{

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "a18d1a9a-38dc-4570-a94f-3e320ebe8a43",
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name
            }
        });

        console.log("Welcome email sent successfully:", response);

    }catch(error){
        console.error("Error sending email:", error);
        throw new Error("Failed to send welcome email: ${error.message}");
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });

    }catch(error){
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email: ${error.message}");
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });
        console.log("Password reset success email sent successfully:", response);
    }catch(error){
        console.error("Error sending password reset success email:", error);
        throw new Error("Failed to send password reset success email: ${error.message}");
    }
}