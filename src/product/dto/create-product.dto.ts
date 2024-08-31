import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'Product name' })
  name: string;

  @ApiProperty({
    example: 'A high-performance laptop',
    description: 'Product description',
  })
  description: string;

  @ApiProperty({ example: 1200, description: 'Product price' })
  price: number;
}
