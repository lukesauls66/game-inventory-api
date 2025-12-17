import { errors } from "@strapi/utils";

const { ValidationError } = errors;

interface InventoryItemData {
  game: { connect: { id: number; name?: string }[] };
  console: { connect: { id: number; name?: string }[] };
  quantity: number;
  price: number;
  available: boolean;
  sku?: string;
}

interface InventoryItemLifecycleEvent {
  params: {
    data: InventoryItemData;
  };
}

interface GameWithConsoles {
  title: string;
  consoles?: { id: number; name: string }[];
}

export default {
  async beforeCreate(event) {
    await validateGameConsoleRelation(event);
  },

  async beforeUpdate(event) {
    await validateGameConsoleRelation(event);
  },
};

async function validateGameConsoleRelation(event: InventoryItemLifecycleEvent) {
  const { data } = event.params;

  if (!data.game || !data.console) return;

  const gameId = data.game.connect?.[0]?.id;
  const consoleId = data.console.connect?.[0]?.id;

  if (!gameId || !consoleId) return;

  const game = (await strapi.entityService.findOne("api::game.game", gameId, {
    populate: ["consoles"],
  })) as GameWithConsoles;

  const allowedConsoleIds = game.consoles.map(
    (console: { id: number }) => console.id
  );

  const selectedConsole = await strapi.entityService.findOne(
    "api::console.console",
    consoleId
  );

  const selectedConsoleName = selectedConsole?.name || "selected console";

  if (!allowedConsoleIds.includes(consoleId)) {
    throw new ValidationError(
      `${game.title} is not available on ${selectedConsoleName}.`
    );
  }
}
