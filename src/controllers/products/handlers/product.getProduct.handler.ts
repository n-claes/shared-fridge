import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity.js";

export const getProduct = async (name: string, belongsTo: string) => {
  const em = RequestContext.getEntityManager();
  return await em.findOneOrFail(Product, {name, belongsTo});
}
