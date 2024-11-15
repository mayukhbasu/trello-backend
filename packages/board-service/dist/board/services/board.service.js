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
exports.BoardService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const board_entity_1 = require("../entities/board.entity");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const shared_lib_1 = require("shared-lib");
const cache_manager_1 = require("@nestjs/cache-manager");
let BoardService = class BoardService {
    constructor(boardRepository, userRepository, cacheManager) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
        this.cacheManager = cacheManager;
    }
    async createBoard(createBoardDto, user) {
        const { name, description, visibility = 'private' } = createBoardDto;
        if (!user || !user.id) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingBoard = await this.boardRepository.findOne({
            where: {
                name,
                owner: { id: user.id },
            },
            relations: ['owner'],
        });
        if (existingBoard) {
            throw new common_1.ConflictException('A board with this name already exists.');
        }
        const board = this.boardRepository.create({
            name,
            description,
            visibility,
            owner: user,
        });
        if (!board.name || !board.owner || !board.visibility) {
            throw new Error('Invalid board data. Please check the input values.');
        }
        return await this.boardRepository.save(board);
    }
    async getAllBoards(userId, page, limit, visibility) {
        const cacheKey = `boards:${userId}:page:${page}:limit:${limit}:visibility:${visibility || 'all'}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }
        const query = this.boardRepository.createQueryBuilder('board')
            .where('board.owner_id = :userId', { userId })
            .skip((page - 1) * limit).take(limit);
        if (visibility) {
            query.andWhere('board.visibility = :visibility', { visibility });
        }
        const [boards, totalCount] = await query.getManyAndCount();
        const result = { boards, totalCount };
        await this.cacheManager.set(cacheKey, result, 300);
        return { boards, totalCount };
    }
    async updateBoard(boardId, updateBoardDto, userId) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId },
            relations: ['owner'],
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found.');
        }
        if (board.owner.id !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this board.');
        }
        if (updateBoardDto.name && updateBoardDto.name !== board.name) {
            const existingBoard = await this.boardRepository.findOne({
                where: { name: updateBoardDto.name, owner: { id: userId } },
            });
            if (existingBoard) {
                throw new common_1.ConflictException('A board with this name already exists.');
            }
        }
        Object.assign(board, updateBoardDto);
        return this.boardRepository.save(board);
    }
    async deleteBoard(boardId, user) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId, owner: { id: user.id } },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found.');
        }
        if (board.owner.id !== user.id) {
            throw new common_1.ForbiddenException('You are not authorized to delete this board.');
        }
        await this.boardRepository.softRemove(board);
        return `Board with ID ${boardId} has been successfully deleted.`;
    }
    async addCollaborator(boardId, userId, collaboratorId, role) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId },
            relations: ['owner', 'collaborators'],
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found.');
        }
        if (board.owner.id !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to add collaborators.');
        }
        const collaborator = await this.userRepository.findOne({ where: { id: collaboratorId } });
        if (!collaborator) {
            throw new common_1.NotFoundException('Collaborator user not found.');
        }
        const isAlreadyCollaborator = board.collaborators.some((user) => user.id === collaborator.id);
        if (isAlreadyCollaborator) {
            throw new common_1.ConflictException('User is already a collaborator.');
        }
        board.collaborators.push(collaborator);
        return await this.boardRepository.save(board);
    }
    async deleteCollaborator(boardId, userId, collaboratorId, role) {
        const board = await this.boardRepository.findOne({
            where: { id: boardId },
            relations: ['owner', 'collaborators'],
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found.');
        }
        if (board.owner.id !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete collaborators.');
        }
        const collaborator = await this.userRepository.findOne({
            where: { id: collaboratorId },
        });
        if (!collaborator) {
            throw new common_1.NotFoundException('Collaborator user not found.');
        }
        const collaboratorIndex = board.collaborators.findIndex((user) => user.id === collaboratorId);
        if (collaboratorIndex === -1) {
            throw new common_1.NotFoundException('User is not a collaborator on this board.');
        }
        board.collaborators.splice(collaboratorIndex, 1);
        return await this.boardRepository.save(board);
    }
};
exports.BoardService = BoardService;
exports.BoardService = BoardService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(board_entity_1.Board)),
    __param(1, (0, typeorm_1.InjectRepository)(shared_lib_1.User)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], BoardService);
//# sourceMappingURL=board.service.js.map