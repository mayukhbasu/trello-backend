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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const typeorm_1 = require("typeorm");
const list_entity_1 = require("./list.entity");
const card_entity_1 = require("./card.entity");
const user_entity_1 = require("./user.entity");
let Board = class Board {
};
exports.Board = Board;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Board.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Board.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Board.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => list_entity_1.List, (list) => list.board, { cascade: true }),
    __metadata("design:type", Array)
], Board.prototype, "lists", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => card_entity_1.Card, (card) => card.board, { cascade: true }),
    __metadata("design:type", Array)
], Board.prototype, "cards", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'private' }),
    __metadata("design:type", String)
], Board.prototype, "visibility", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    (0, typeorm_1.Index)('idx_board_owner', { unique: false }),
    __metadata("design:type", user_entity_1.User)
], Board.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinTable)({
        name: 'board_collaborators', // Custom join table name
        joinColumn: {
            name: 'board_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Board.prototype, "collaborators", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Board.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Board.prototype, "updatedAt", void 0);
exports.Board = Board = __decorate([
    (0, typeorm_1.Entity)('board')
], Board);
//# sourceMappingURL=board.entity.js.map