import { Controller, Logger } from '@nestjs/common';
import { InventoryClient } from '../inventory/inventory.client';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  CreateOrderRequest,
  Order,
  ORDER_SERVICE_NAME,
  OrderServiceController,
  OrderServiceControllerMethods,
} from '../generated/order';

@Controller()
@OrderServiceControllerMethods()
export class OrderController implements OrderServiceController {
  constructor(private readonly inventoryClient: InventoryClient) {}

  @GrpcMethod(ORDER_SERVICE_NAME, 'CreateOrder')
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const { productId, quantity } = request;
    const { isAvailable } = await this.inventoryClient.checkStock(
      productId,
      quantity,
    );

    Logger.log(
      `Checking stock for product ${productId} with quantity ${quantity}`,
    );
    if (!isAvailable) {
      Logger.error('Insufficient stock');
      throw new RpcException('Insufficient stock');
    }

    const newOrder: Order = {
      id: '1',
      productId,
      quantity,
      status: 'pending',
    };

    await this.inventoryClient.updateStock(productId, -quantity);
    Logger.log(
      `Updated stock for product ${productId} with quantity ${quantity}`,
    );
    return newOrder;
  }
}
