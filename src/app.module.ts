import { Module } from '@nestjs/common';

import { PrismaService } from './database/prisma.service';
import { OrdersModule } from './modules/orders/orders.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [OrdersModule, HealthModule, DatabaseModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
