import { getUserProductsFromFridge } from "./fridge.getUserProductsFromFridge.handler.js"
import { removeProductFromFridge } from "./fridge.removeProduct.handler.js"

export const deleteAllUserProductsFromFridge = async (
  userName: string, location: number
) => {
  const products = await getUserProductsFromFridge(location, userName)
  for (const product of products) {
    await removeProductFromFridge(userName, product.name, location)
  }
  return products;
}
