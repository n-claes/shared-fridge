import { RequestContext } from "@mikro-orm/core"
import { Fridge } from "../../../entities/fridge.entity.js";

export const getAllFridges = async (search: number) => {
  const em = RequestContext.getEntityManager();
  return em.findAndCount(
    Fridge,
    search
      ? {
        $or: [
          {location: search},
          {totalCapacity: search},
          {currentCapacity: search},
        ],
      }
      : {}
  );
}
