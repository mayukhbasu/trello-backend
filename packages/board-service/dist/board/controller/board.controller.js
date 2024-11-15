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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const common_1 = require("@nestjs/common");
const board_service_1 = require("../services/board.service");
const create_board_dto_1 = require("../dto/create-board.dto");
const shared_lib_1 = require("shared-lib");
const update_board_dto_1 = require("../dto/update-board.dto");
let BoardController = class BoardController {
    constructor(boardService) {
        this.boardService = boardService;
    }
    async createBoard(createBoardDto, req) {
        const user = req.user;
        return this.boardService.createBoard(createBoardDto, user);
    }
    async getAllBoards(req, page = 1, limit = 10, visibility) {
        const user = req.user;
        return this.boardService.getAllBoards(user.id, page, limit, visibility);
    }
    async updateBoard(boardId, updateBoardDto, req) {
        const userId = req.user.userId;
        return this.boardService.updateBoard(boardId, updateBoardDto, userId);
    }
    async deleteBoard(boardId, req) {
        const user = req.user;
        return this.boardService.deleteBoard(boardId, user);
    }
    async addCollaborator(boardId, collaboratorId, role, req) {
        const userId = req.user.id;
        return this.boardService.addCollaborator(boardId, userId, collaboratorId, role);
    }
    async deleteCollaborator(boardId, collaboratorId, role, req) {
        const userId = req.user.id;
        return this.boardService.deleteCollaborator(boardId, userId, collaboratorId, role);
    }
};
exports.BoardController = BoardController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(shared_lib_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_board_dto_1.CreateBoardDto, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "createBoard", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(shared_lib_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('visibility')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getAllBoards", null);
__decorate([
    (0, common_1.Put)(':boardId'),
    (0, common_1.UseGuards)(shared_lib_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_board_dto_1.UpdateBoardDto, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "updateBoard", null);
__decorate([
    (0, common_1.Delete)(':boardId'),
    (0, common_1.UseGuards)(shared_lib_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "deleteBoard", null);
__decorate([
    (0, common_1.Post)('/:boardId/collaborators'),
    (0, common_1.UseGuards)(shared_lib_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)('collaboratorId')),
    __param(2, (0, common_1.Body)('role')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "addCollaborator", null);
__decorate([
    (0, common_1.Delete)('/:boardId/collaborators'),
    (0, common_1.UseGuards)(shared_lib_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)('collaboratorId')),
    __param(2, (0, common_1.Body)('role')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "deleteCollaborator", null);
exports.BoardController = BoardController = __decorate([
    (0, common_1.Controller)('boards'),
    __metadata("design:paramtypes", [board_service_1.BoardService])
], BoardController);
//# sourceMappingURL=board.controller.js.map