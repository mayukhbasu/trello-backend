import { IsString, IsIn } from 'class-validator';

export class UpdateVisibilityDto {
  @IsString()
  @IsIn(['public', 'private'], {
    message: 'Visibility must be either "public" or "private".',
  })
  visibility: 'public' | 'private';
}
