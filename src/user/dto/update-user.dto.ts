import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'John Doe Updated',
    description: 'Updated user full name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Updated user password',
    required: false,
  })
  password?: string;
}
