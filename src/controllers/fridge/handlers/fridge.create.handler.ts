import { RequestContext } from "@mikro-orm/core";
import { FridgeBody } from "../../../contracts/fridge/fridge.body.js";
import { Fridge } from "../../../entities/fridge.entity.js";


export const createFridge = async (body: FridgeBody) => {
  const em = RequestContext.getEntityManager();
  if (!body.currentCapacity) {
    body.currentCapacity = 0;
  }
  if (await em.findOne(Fridge, { location: body.location })) {
    throw new Error("Fridge already exists at this location");
  }
  const newFridge = em.create(Fridge, body);
  await em.persistAndFlush(newFridge);
  return newFridge;
};
