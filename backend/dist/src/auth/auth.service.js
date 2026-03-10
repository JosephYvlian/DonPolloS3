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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../usuarios/usuario.entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const mailer_service_1 = require("../mailer/mailer.service");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    usuarioRepository;
    jwtService;
    mailerService;
    constructor(usuarioRepository, jwtService, mailerService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async register(data) {
        const existing = await this.usuarioRepository.findOne({ where: { correo: data.correo } });
        if (existing) {
            throw new common_1.ConflictException('El correo ya está registrado');
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.passwordHash, salt);
        const newUser = this.usuarioRepository.create({
            ...data,
            passwordHash: hash,
            rol: usuario_entity_1.RolUsuario.CLIENTE,
        });
        const saved = await this.usuarioRepository.save(newUser);
        const savedUser = Array.isArray(saved) ? saved[0] : saved;
        const { passwordHash, ...result } = savedUser;
        return result;
    }
    async validateUser(correo, pass) {
        const user = await this.usuarioRepository.findOne({ where: { correo } });
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { correo: user.correo, sub: user.id, rol: user.rol };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async requestPasswordReset(correo) {
        const user = await this.usuarioRepository.findOne({ where: { correo } });
        if (!user) {
            return { message: 'Si el correo existe, se ha enviado un enlace de recuperación.' };
        }
        const token = crypto.randomInt(100000, 999999).toString();
        user.resetPasswordToken = token;
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        user.resetPasswordExpires = expires;
        await this.usuarioRepository.save(user);
        await this.mailerService.sendPasswordResetEmail(user.correo, token);
        return { message: 'Si el correo existe, se ha enviado un enlace de recuperación.' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usuarioRepository.findOne({
            where: { resetPasswordToken: token },
        });
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new common_1.ConflictException('Token inválido o expirado.');
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.usuarioRepository.save(user);
        return { message: 'Contraseña actualizada exitosamente.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_service_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map