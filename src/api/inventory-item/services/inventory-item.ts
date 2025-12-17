/**
 * inventory-item service
 */

import { factories } from "@strapi/strapi";

interface InventoryItemWithRelations {
  id: number;
  quantity: number;
  available: boolean;
  game: { id: number; title: string };
  console: { id: number; name: string };
}

export default factories.createCoreService(
  "api::inventory-item.inventory-item",
  ({ strapi }) => ({
    async sell(inventoryItemId: number, amount = 1) {
      const item = (await strapi.entityService.findOne(
        "api::inventory-item.inventory-item",
        inventoryItemId,
        {
          populate: ["game", "console"],
        }
      )) as unknown as InventoryItemWithRelations;

      if (!item || !item.game || !item.console) {
        throw new Error("Inventory item, game, or console not found");
      }

      if (item.quantity < amount) {
        throw new Error(
          `Not enough stock for ${item.game.title} on ${item.console.name}`
        );
      }

      const newQuantity = item.quantity - amount;

      await strapi.entityService.update(
        "api::inventory-item.inventory-item",
        inventoryItemId,
        {
          data: {
            quantity: newQuantity,
            available: newQuantity > 0,
          },
        }
      );

      return { newQuantity, available: newQuantity > 0 };
    },

    async bulkSell(items: { inventoryItemId: number; amount: number }[]) {
      const results = [];

      for (const { inventoryItemId, amount } of items) {
        const result = await this.sell(inventoryItemId, amount);
        results.push({ inventoryItemId, ...result });
      }

      return results;
    },

    async restock(inventoryItemId: number, amount: number) {
      const item = await strapi.entityService.findOne(
        "api::inventory-item.inventory-item",
        inventoryItemId
      );

      if (!item) {
        throw new Error("Inventory item not found");
      }

      const newQuantity = item.quantity + amount;

      await strapi.entityService.update(
        "api::inventory-item.inventory-item",
        inventoryItemId,
        {
          data: {
            quantity: newQuantity,
            available: true,
          },
        }
      );

      return { newQuantity, available: true };
    },
  })
);
