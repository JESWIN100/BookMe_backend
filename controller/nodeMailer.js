import nodemailer from 'nodemailer';




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.Nodemailer_User, 
        pass: process.env.Nodemailer_Pass 
    }
});

export const Createmessage = async (req, res) => {
    const { to, subject, text, html } = req.body;

    const mailOptions = {
        from: 'jeswinjoseph654@gmail.com', 
        to: to,  
        subject: subject,
        text: text,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};
