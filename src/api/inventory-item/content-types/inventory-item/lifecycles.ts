import { errors } from "@strapi/utils";

const { ValidationError } = errors;

export default {
  async beforeCreate(event) {
    await validateGameConsoleRelation(event);
  },

  async beforeUpdate(event) {
    await validateGameConsoleRelation(event);
  },
};

async function validateGameConsoleRelation(event: any) {
  const { data } = event.params;

  if (!data.game || !data.console) return;

  const gameId = data.game.connect?.[0]?.id;
  const consoleId = data.console.connect?.[0]?.id;

  if (!gameId || !consoleId) return;

  const game = (await strapi.entityService.findOne("api::game.game", gameId, {
    populate: ["consoles"],
  })) as {
    consoles?: { id: number }[];
  };

  const allowedConsoleIds = game.consoles.map((console: any) => console.id);

  if (!allowedConsoleIds.includes(consoleId)) {
    throw new ValidationError(
      "This game is not available on the selected console."
    );
  }
}
