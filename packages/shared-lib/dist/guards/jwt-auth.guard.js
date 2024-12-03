"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const google_auth_library_1 = require("google-auth-library");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
        const clientId = this.configService.get('GCLOUD_CLIENT_ID');
        if (!clientId) {
            throw new Error('GCLOUD_CLIENT_ID is not defined in environment variables.');
        }
        this.googleClient = new google_auth_library_1.OAuth2Client(clientId);
        this.logger.log('Google OAuth2 Client initialized in GoogleAuthGuard');
    }
    canActivate(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                this.logger.warn('Authorization header not found');
                throw new common_1.UnauthorizedException('Authorization header not provided.');
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                this.logger.warn('Bearer token not found in authorization header');
                throw new common_1.UnauthorizedException('Google ID token not provided.');
            }
            try {
                const ticket = yield this.googleClient.verifyIdToken({
                    idToken: token,
                    audience: this.configService.get('GCLOUD_CLIENT_ID'),
                });
                const payload = ticket.getPayload();
                if (!payload) {
                    this.logger.warn('Google ID token payload is missing');
                    throw new common_1.UnauthorizedException('Invalid Google ID token.');
                }
                this.logger.debug(`Google ID token successfully verified for user: ${payload.email}`);
                // Attach user information to the request object
                request.user = {
                    id: payload.sub, // Google user ID
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                };
                return true; // Allow access
            }
            catch (error) {
                this.logger.error('Failed to validate Google ID token', error);
                throw new common_1.UnauthorizedException('Invalid or expired Google ID token.');
            }
        });
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map