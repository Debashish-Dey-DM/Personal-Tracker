import { IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  username?: string;

  @IsOptional()
  email?: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  user_type: string;

  @IsOptional()
  created_at?: Date;
}
