import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/products/product.body.js"
import { Product } from "../../../entities/product.entity.js";

export const createProduct = async (body: ProductBody, lastName: string) => {
  const em = RequestContext.getEntityManager();
  const product = em.create(Product, body);
  product.belongsTo = lastName;
  await em.persistAndFlush(product);
  return product;
}
