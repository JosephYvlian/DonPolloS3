import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Usar servidor SMTP real (Gmail, Outlook, SendGrid, etc.)
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true', // true para puerto 465, false para 587
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        this.logger.log(`Mailer transport inicializado con correo real: ${process.env.SMTP_USER}`);
      } else {
        // Fallback a Ethereal para desarrollo si no hay credenciales
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.logger.warn('Credenciales SMTP no encontradas. Usando Ethereal (Pruebas)');
      }
    } catch (error) {
      this.logger.error('Error inicializando Mailer transport', error);
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    if (!this.transporter) {
      this.logger.warn('Transporter no inicializado, esperando 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    try {
      const info = await this.transporter.sendMail({
        from: '"Don Pollo Support" <support@donpollo.com>',
        to,
        subject: 'Recuperación de Contraseña - Don Pollo',
        text: `Tu código de recuperación es: ${token}. Expirará en 1 hora.`,
        html: `
          <h1>Recuperación de Contraseña</h1>
          <p>Has solicitado restablecer tu contraseña en Don Pollo.</p>
          <p>Tu código de recuperación es: <strong>${token}</strong></p>
          <p>Este código expirará en 1 hora.</p>
          <p>Si no fuiste tú, ignora este mensaje.</p>
        `,
      });

      this.logger.log(`Mensaje enviado: ${info.messageId}`);
      if (!process.env.SMTP_USER) {
        this.logger.log(`URL de vista previa: ${nodemailer.getTestMessageUrl(info)}`);
      }
      
      return { success: true, message: 'Correo enviado correctamente.' };
    } catch (error) {
      this.logger.error('Error enviando correo', error);
      throw error;
    }
  }
}
