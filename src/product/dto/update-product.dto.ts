import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    example: 'Laptop Pro',
    description: 'Updated product name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'An updated description',
    description: 'Updated product description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 1300,
    description: 'Updated product price',
    required: false,
  })
  price?: number;
}
