import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A high-performance laptop',
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  description: string;

  @ApiProperty({ example: 1200, description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 5, description: 'Product quantity' })
  @IsNumber()
  @Min(0)
  quantity: number;
}
