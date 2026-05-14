import { IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class OrderItemDto {
  @ApiPropertyOptional({ example: 'Bandage' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 10.5 })
  @IsNumber()
  @Min(0, { message: 'Price must be greater than 0' })
  price: number;
}
