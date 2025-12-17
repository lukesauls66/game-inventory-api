/**
 * inventory-item router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/inventory-items",
      handler: "inventory-item.find",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/inventory-items/:id",
      handler: "inventory-item.findOne",
      config: { auth: false },
    },
    {
      method: "POST",
      path: "/inventory-items",
      handler: "inventory-item.create",
      config: { auth: true },
    },
    {
      method: "PUT",
      path: "/inventory-items/:id",
      handler: "inventory-item.update",
      config: { auth: true },
    },
    {
      method: "DELETE",
      path: "/inventory-items/:id",
      handler: "inventory-item.delete",
      config: { auth: true },
    },
    {
      method: "POST",
      path: "/inventory-items/sell",
      handler: "inventory-item.sell",
      config: { auth: true },
    },
    {
      method: "POST",
      path: "/inventory-items/restock",
      handler: "inventory-item.restock",
      config: { auth: true },
    },
    {
      method: "POST",
      path: "/inventory-items/bulk-sell",
      handler: "inventory-item.bulkSell",
      config: { auth: true },
    },
  ],
};
