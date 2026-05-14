import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from './repo/order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private orderRepository: OrderRepository) {}
  private readonly VAT = 0.19;

  async create(data: CreateOrderDto) {
    // calaculate NET total
    const totalNet = data.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // VAT 19%
    const totalGross = totalNet * this.VAT;

    // Save in DB
    const order = await this.orderRepository.create({
      totalNet,
      totalGross,
      items: {
        create: data.items,
      },
    });
    return order;
  }

  async findById(id: string) {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async changeStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // validate status transition
    this.validateStatusTransition(order.status, status);

    // create SAP number
    const generatedSapOrderNumber = this.handleSapOrderNumber(order, status);

    // update order
    return await this.orderRepository.changeStatus(
      id,
      status,
      generatedSapOrderNumber,
    );
  }

  async findAll() {
    return this.orderRepository.findAll();
  }

  async update(id: string, dto: UpdateOrderDto) {
    const existingOrder = await this.orderRepository.findOne(id);

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    let totalNet = existingOrder.totalNet;
    let totalGross = existingOrder.totalGross;

    if (dto.items) {
      totalNet = dto.items.reduce(
        (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
        0,
      );

      totalGross = totalNet * 1.19;
    }

    const data: Prisma.OrderUpdateInput = {
      status: existingOrder.status,
      totalNet,
      totalGross,

      ...(dto.items && {
        items: {
          deleteMany: {},
          create: dto.items.map((item) => ({
            name: item.name!,
            quantity: item.quantity!,
            price: item.price!,
          })),
        },
      }),
    };

    return await this.orderRepository.update(id, data);
  }
  async delete(id: string) {
    const existingOrder = await this.orderRepository.findOne(id);

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    return this.orderRepository.delete(id);
  }

  async deleteAll() {
    return this.orderRepository.deleteAll();
  }

  // private methods
  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ) {
    // Prevent reverting confirmed orders
    if (
      currentStatus === OrderStatus.CONFIRMED &&
      newStatus === OrderStatus.PENDING
    ) {
      throw new BadRequestException('Cannot revert confirmed order to pending');
    }

    // Prevent changing cancelled orders
    if (currentStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cancelled orders cannot be modified');
    }
  }
  private generateSapOrderNumber = ({
    prefix,
    length = 6,
  }: {
    prefix: string;
    length?: number;
  }): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = `${prefix}_`;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }

    return result;
  };

  private handleSapOrderNumber(order: Order, status: OrderStatus) {
    // Generate SAP number on confirmation
    if (status === OrderStatus.CONFIRMED && !order.sapOrderNumber) {
      return this.generateSapOrderNumber({
        prefix: 'SAP',
      });
    }

    return order.sapOrderNumber ?? '';
  }
}
