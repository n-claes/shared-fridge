import { getFridge } from "../../fridge/handlers/fridge.getFridge.handler.js";
import { getProductFromUser } from "./user.getProduct.handler.js";
import { removeProductFromUser } from "./user.removeProduct.handler.js";
import { addProductToFridge } from "../../fridge/handlers/fridge.addProduct.handler.js";

export const moveProductToFridge = async (
  lastName: string, productName: string, location: number
) => {
  const fridge = await getFridge(location)
  const product = await getProductFromUser(lastName, productName)
  await removeProductFromUser(lastName, productName)
  await addProductToFridge(product, fridge)
  return fridge
}
