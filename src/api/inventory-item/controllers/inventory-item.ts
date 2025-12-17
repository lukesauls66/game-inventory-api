/**
 * inventory-item controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::inventory-item.inventory-item",
  ({ strapi }) => ({
    async sell(ctx) {
      const { inventoryItemId, amount } = ctx.request.body;
      try {
        const result = await strapi
          .service("api::inventory-item.inventory-item")
          .sell(inventoryItemId, amount);
        return result;
      } catch (err: any) {
        ctx.status = 400;
        ctx.body = { error: err.message };
      }
    },

    async restock(ctx) {
      const { inventoryItemId, amount } = ctx.request.body;
      try {
        const result = await strapi
          .service("api::inventory-item.inventory-item")
          .restock(inventoryItemId, amount);
        return result;
      } catch (err: any) {
        ctx.status = 400;
        ctx.body = { error: err.message };
      }
    },

    async bulkSell(ctx) {
      const items = ctx.request.body.items;
      try {
        const results = await strapi
          .service("api::inventory-item.inventory-item")
          .bulkSell(items);
        return results;
      } catch (err: any) {
        ctx.status = 400;
        ctx.body = { error: err.message };
      }
    },
  })
);
