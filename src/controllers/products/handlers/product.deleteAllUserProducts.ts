import { RequestContext } from "@mikro-orm/core"
import { getAllFridges } from "../../fridge/handlers/fridge.getAllFridges.handler.js"
import { getUserProductsFromFridge } from "../../fridge/handlers/fridge.getUserProductsFromFridge.handler.js"
import { removeProductFromFridge } from "../../fridge/handlers/fridge.removeProduct.handler.js"
import { Product } from "../../../entities/product.entity.js"
import { getProduct } from "./product.getProduct.handler.js"

export const deleteAllUserProducts = async (lastName: string) => {
  const em = RequestContext.getEntityManager()
  const [allFridges, __] = await getAllFridges(null)
  const removedProducts: Product[] = []
  for (const fridge of allFridges) {
    const products = await getUserProductsFromFridge(fridge.location, lastName)
    if (products.length === 0) continue

    for (const product of products) {
      await removeProductFromFridge(lastName, product.name, fridge.location)
      removedProducts.push(await getProduct(product.name, lastName))
    }
  }
  await em.removeAndFlush(removedProducts)
  return removedProducts
}
