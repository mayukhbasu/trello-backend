import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateListDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}
