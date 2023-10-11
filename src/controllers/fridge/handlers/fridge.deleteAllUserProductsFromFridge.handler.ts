import { getProductsFromFridge } from "./fridge.getProductsFromFridge.handler.js"
import { removeProductFromFridge } from "./fridge.removeProductFromFridge.handler.js"

export const deleteAllUserProductsFromFridge = async (
  userName: string, location: number
) => {
  const products = await getProductsFromFridge(location, userName)
  for (const product of products) {
    await removeProductFromFridge(userName, product.name, location)
  }
  return products;
}
