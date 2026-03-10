"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let MailerService = MailerService_1 = class MailerService {
    transporter;
    logger = new common_1.Logger(MailerService_1.name);
    constructor() {
        this.initTransporter();
    }
    async initTransporter() {
        try {
            if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                this.transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });
                this.logger.log(`Mailer transport inicializado con correo real: ${process.env.SMTP_USER}`);
            }
            else {
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
        }
        catch (error) {
            this.logger.error('Error inicializando Mailer transport', error);
        }
    }
    async sendPasswordResetEmail(to, token) {
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
        }
        catch (error) {
            this.logger.error('Error enviando correo', error);
            throw error;
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailerService);
//# sourceMappingURL=mailer.service.js.map