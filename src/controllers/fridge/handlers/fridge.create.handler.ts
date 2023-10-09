import { RequestContext } from "@mikro-orm/core";
import { FridgeBody } from "../../../contracts/fridge.body.js";
import { Fridge } from "../../../entities/fridge.entity.js";


export const createFridge = async (body: FridgeBody) => {
  const em = RequestContext.getEntityManager();
  if (!body.currentCapacity) {
    body.currentCapacity = 0;
  }
  const newFridge = em.create(Fridge, body);
  await em.persistAndFlush(newFridge);
  return newFridge;
};
