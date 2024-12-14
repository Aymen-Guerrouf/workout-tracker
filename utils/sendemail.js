import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendRestEmail = async (email, token) => {
  try {
    const resetUrl = `http://localhost:${process.env.PORT}/api/v1/auth/resetpassword/${token}`;
    console.log(resetUrl);
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Reset Your Fitness Tracker Password",
      html: `
              <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background-color: #f4f4f4; padding: 20px;">
                <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <img src="https://example.com/fitness-logo.png" alt="Fitness Tracker Logo" style="max-width: 150px; margin-bottom: 20px;">
                  
                  <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
                  
                  <p style="color: #666; line-height: 1.6;">
                    You've requested to reset your password for your Fitness Tracker account. 
                    Click the button below to set a new password and get back to tracking your workouts!
                  </p>
                  
                  <div style="margin: 30px 0;">
                    <a href="${resetUrl}" style="
                      background-color: #4CAF50;
                      color: white;
                      padding: 12px 25px;
                      text-decoration: none;
                      border-radius: 5px;
                      font-weight: bold;
                      display: inline-block;
                      text-transform: uppercase;
                    ">Reset Password</a>
                  </div>
                  
                  <p style="color: #888; font-size: 14px; margin-top: 20px;">
                    This link will expire in 1 hour. If you didn't request this, 
                    please ignore the email or contact our support team.
                  </p>
                  
                  <footer style="margin-top: 30px; font-size: 12px; color: #aaa;">
                    © ${new Date().getFullYear()} Fitness Tracker App
                  </footer>
                </div>
              </div>
            `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
};

export const sendEmail = (user) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: "Ready to Get Back to Your Fitness Goals?",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <img src="https://example.com/fitness-logo.png" alt="Fitness Tracker Logo" style="max-width: 150px; margin-bottom: 20px;">
            
            <h2 style="color: #333;">Hey ${user.name}, Time to Move!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Time to crush another workout and keep your momentum going!
            </p>
            
            
            
            <p style="color: #888; font-size: 14px;">
              Not interested in these emails? 
            </p>
            
            <footer style="margin-top: 30px; font-size: 12px; color: #aaa;">
              © ${new Date().getFullYear()} Fitness Tracker App
            </footer>
          </div>
        </div>
      `,
    };

    // Send email
    return transporter.sendMail(mailOptions);
    console.log("email sent");
  } catch (error) {
    console.error("Error sending notification :", error);
    throw new Error("Failed to send notification ");
  }
};
