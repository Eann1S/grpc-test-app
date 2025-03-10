import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  InventoryServiceClient,
  INVENTORY_PACKAGE_NAME,
} from '../generated/inventory';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InventoryClient {
  private readonly inventoryService: InventoryServiceClient;

  constructor(
    @Inject(INVENTORY_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {
    this.inventoryService =
      this.client.getService<InventoryServiceClient>('InventoryService');
  }

  async checkStock(productId: string, quantity: number) {
    return firstValueFrom(
      this.inventoryService.checkStock({
        productId,
        requiredQuantity: quantity,
      }),
    );
  }

  async updateStock(productId: string, quantity: number) {
    return firstValueFrom(
      this.inventoryService.updateStock({
        productId,
        quantity,
      }),
    );
  }
}
