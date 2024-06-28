try {
        await transporter.sendMail({
            from: 'slowyou.net@gmail.com',
            to: to,
            subject:subject,
            text:text
        });

        res.send("Email sent successfully");
    } catch (error) {
        res.status(500).send("Error sending email: " + error.message);
    }