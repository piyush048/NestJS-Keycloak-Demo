import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'StrongPass123!' })
  password: string;
}
