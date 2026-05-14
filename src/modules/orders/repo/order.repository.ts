import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        items: true,
      },
    });
  }
  async delete(id: string) {
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    return this.prisma.order.delete({
      where: { id },
    });
  }

  async deleteAll() {
    return this.prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({});
      const deletedOrders = await tx.order.deleteMany({});
      return { deletedOrders: deletedOrders.count };
    });
  }
  async create(data: Prisma.OrderCreateInput) {
    return await this.prisma.order.create({
      data,
      include: {
        items: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });
  }
  async changeStatus(id: string, status: OrderStatus, sapOrderNumber: string) {
    return this.prisma.order.update({
      where: {
        id,
      },
      include: {
        items: true,
      },
      data: {
        status: status,
        sapOrderNumber,
      },
    });
  }
}
