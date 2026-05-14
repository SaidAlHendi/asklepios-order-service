import { ArrayNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UpdateOrderItemDto } from './update-order-item.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    type: [UpdateOrderItemDto],
    example: [
      { name: 'Bandage', quantity: 2, price: 10.5 },
      {
        name: 'Syringe',
        quantity: 5,
        price: 2.0,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];
}
