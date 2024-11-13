// src/dto/create-board.dto.ts

import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['private', 'public'])
  visibility?: 'private' | 'public';
}
