import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { convert } from 'html-to-text';
import path from 'path';

/**
 * * Email class for sending emails using nodemailer with ejs templates.
 *
 * Its a utility email sending class that can easily be updated to send any kind of email.
 *
 * */
class Email {
  constructor() {}
  private emailTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.BREVO_SERVER,
        port: Number(process.env.BREVO_PORT),
        auth: {
          user: process.env.BREVO_LOGIN,
          pass: process.env.BREVO_API_KEY,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  private async send(template: string, subject: string, data: any) {
    // Switch file path depending on production/development
    const filepath =
      process.env.NODE_ENV === 'production'
        ? path.resolve(__dirname, `../../src/view/emails/${template}.ejs`)
        : path.resolve(__dirname, `../view/emails/${template}.ejs`);

    ejs.renderFile(filepath, { ...data }, (err, result) => {
      if (err) {
        throw err;
      } else {
        const mailOptions = {
          from:
            process.env.NODE_ENV === 'production'
              ? process.env.EMAIL_SENDER_PROD
              : process.env.EMAIL_SENDER_DEV,
          to: data.email,
          subject,
          html: result,
          text: convert(result),
        };
        return this.emailTransporter().sendMail(mailOptions);
      }
    });
  }
  /**
   * * Sends a verification email to the user with a link to verify their email address.
   * @param data @param {Object} data - The data object containing the recipient's email and related information. Most important information are url, email and name property in the data object.
   */
  async sendVerificationEmail(data: any) {
    await this.send('verificationEmail', 'Verify your email address', data);
  }

  /**
   * * Sends a OTP email to the user with the OTP details.
   * @param data @param {Object} data - The data object containing the recipient's email and related information. Most important information are OTP, email and name property in the data object.
   */
  async sendOTPEmail(data: any) {
    await this.send(
      'OTPEmail',
      'Letango Login: Here is your login code you requested.',
      data
    );
  }

  /**
   * * Sends reset password link to user.
   * @param data @param {Object} data - The data object containing the recipient's email and related information. Most important information are OTP, email and name property in the data object.
   */
  async sendResetPasswordLink(data: any) {
    await this.send(
      'resetPassword',
      'Reset Password Link (Expires in 15 minutes)',
      data
    );
  }
}

export default new Email();
