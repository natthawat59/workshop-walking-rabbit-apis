import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';

export class ProductDTO extends BaseDTO {
  @IsNumber()
  @ApiProperty({
    description: 'id of product',
    type: Number,
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'name of product',
    type: String,
    example: 'pencil',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'sku of product',
    type: String,
    example: 'piece',
  })
  sku: string;

  @IsString()
  @ApiProperty({
    description: 'description of product',
    type: String,
    example: '2B pencil',
  })
  description: string;

  @IsString()
  @ApiProperty({
    description: 'url image of product',
    type: String,
    example: 'www.xxx/image.png',
  })
  image_urls: string;

  @IsString()
  @ApiProperty({
    description: 'status of product',
    type: String,
    example: 'Active',
  })
  status: string;

  @IsDate()
  @ApiProperty({
    description: 'Created date of product',
    type: Date,
    example: '',
  })
  created_at: Date;

  @IsDate()
  @ApiProperty({
    description: 'Updated date of product',
    type: Date,
    example: '',
  })
  updated_at: Date;
}
