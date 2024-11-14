// src/dto/update-board.dto.ts

import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['private', 'public'])
  visibility?: string;
}
