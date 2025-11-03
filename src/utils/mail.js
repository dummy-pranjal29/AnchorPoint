import mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async(options) => {
    //Putting up the branding for the email
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "AnchorPoint",
            link: "https://anchorpoint.com/",
        },
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

    const emailHtml = mailGenerator.generate(options.mailgenContent);

    const transporeter = nodemailer.createTransport({
        host: process.env.MAIL_SMTP_HOST,
        port: process.env.MAIL_SMTP_PORT,
        auth: {
            user: process.env.MAIL_SMTP_USER,
            pass: process.env.MAIL_SMTP_PASSWORD
        },
    })

    const mail = {
        from: "anchorpointmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try {
        await transporeter.sendMail(mail);
    } catch (error) {
        console.error("Error sending email:", error);
        console.error("Error", error);
    }
};


const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to AnchorPoint! We're very excited to have you on board.",
            action: {
                instructions: "To verify your email, please click here:",
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro : "Need help, or have questions? Just reply to this email, we're always happy to help.",
        },
    };
};

const forgotPasswordMailgenContent = (username, passwordresetUrl) => {
    return {
        body: {
            name: username,
            intro: "You have requested to reset your password.",
            action: {
                instructions: "To reset your password, please click here:",
                button: {
                    color: "#DC4D2F",
                    text: "Reset your password",
                    link: passwordresetUrl,
                },
            },
            outro : "If you did not request a password reset, please ignore this email.",
        },
    };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };


