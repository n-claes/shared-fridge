import { RequestContext } from "@mikro-orm/core"
import { Fridge } from "../../../entities/fridge.entity.js";

export const getAllFridges = async (search: string) => {
  const em = RequestContext.getEntityManager();
  return em.findAndCount(
    Fridge,
    search
      ? {
        $or: [
          {location: {$ilike: `%${search}%`}},
          {totalCapacity: {$ilike: `%${search}%`}},
          {currentCapacity: {$ilike: `%${search}%`}}],
      }
      : {}
  );
}
