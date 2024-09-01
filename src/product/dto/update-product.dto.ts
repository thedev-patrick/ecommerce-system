import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    example: 'Laptop Pro',
    description: 'Updated product name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'An updated description',
    description: 'Updated product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1300,
    description: 'Updated product price',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 100,
    description: 'Updated product quantity',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;
}
