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
exports.Card = void 0;
const typeorm_1 = require("typeorm");
const board_entity_1 = require("./board.entity");
const list_entity_1 = require("./list.entity");
let Card = class Card {
};
exports.Card = Card;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Card.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Card.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Card.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => list_entity_1.List, (list) => list.cards),
    __metadata("design:type", list_entity_1.List)
], Card.prototype, "list", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => board_entity_1.Board, (board) => board.cards),
    __metadata("design:type", board_entity_1.Board)
], Card.prototype, "board", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Card.prototype, "archived", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Card.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Card.prototype, "updatedAt", void 0);
exports.Card = Card = __decorate([
    (0, typeorm_1.Entity)('cards')
], Card);
//# sourceMappingURL=card.entity.js.map