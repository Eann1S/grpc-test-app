import { Controller, Logger } from '@nestjs/common';
import {
  CheckStockRequest,
  CheckStockResponse,
  InventoryServiceController,
  Product,
  UpdateStockRequest,
  UpdateStockResponse,
} from '../generated/inventory';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

@Controller('inventory')
export class InventoryController implements InventoryServiceController {
  private readonly products: Product[] = [
    { id: '1', name: 'Product 1', quantity: 10 },
    { id: '2', name: 'Product 2', quantity: 20 },
    { id: '3', name: 'Product 3', quantity: 30 },
  ];

  @GrpcMethod('InventoryService', 'CheckStock')
  async checkStock(request: CheckStockRequest): Promise<CheckStockResponse> {
    Logger.log(`Checking stock for product ${request.productId}`);

    const product = this.products.find((p) => p.id === request.productId);
    if (!product) {
      Logger.error('Product not found');
      throw new RpcException('Product not found');
    }

    Logger.log(`Product ${product.id} has ${product.quantity} units in stock`);
    return { isAvailable: product.quantity >= request.requiredQuantity };
  }

  @GrpcMethod('InventoryService', 'UpdateStock')
  async updateStock(request: UpdateStockRequest): Promise<UpdateStockResponse> {
    Logger.log(`Updating stock for product ${request.productId}`);

    const product = this.products.find((p) => p.id === request.productId);
    if (!product) {
      Logger.error('Product not found');
      throw new RpcException('Product not found');
    }

    product.quantity += request.quantity;

    Logger.log(`Updated stock for product ${request.productId}`);
    return { success: true };
  }
}
