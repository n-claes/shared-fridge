import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/fridge.entity.js";

export const getFridge = async (location: number) => {
  const em = RequestContext.getEntityManager();
  const fridge = await em.findOneOrFail(Fridge, {location});
  return fridge;
}
