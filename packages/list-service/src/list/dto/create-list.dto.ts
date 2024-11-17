// src/list/dto/create-list.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
