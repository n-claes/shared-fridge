import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/products/product.body.js";
import { Product } from "../../../entities/product.entity.js";
import { createProduct } from "../../products/handlers/product.create.handler.js";
import { getUser } from "./user.getUser.handler.js";

export const addProduct = async (body: ProductBody, userName: string) => {
  const em = RequestContext.getEntityManager();
  const user = await getUser(userName)
  const product = await em.findOne(Product, {
    name: body.name,
    belongsTo: user.lastName
  }) || await createProduct(body, user.lastName)
  product.inFridge = false;
  user.products.push(product);
  await em.persistAndFlush(user);
  return user;
}
