import { Module } from '@nestjs/common';
import { OrderController } from './order/order.controller';
import { InventoryClient } from './inventory/inventory.client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INVENTORY_PACKAGE_NAME } from './generated/inventory';
import { join } from 'path';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: INVENTORY_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: INVENTORY_PACKAGE_NAME,
          protoPath: join(__dirname, '../../shared-proto/inventory.proto'),
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [InventoryClient],
})
export class AppModule {}
