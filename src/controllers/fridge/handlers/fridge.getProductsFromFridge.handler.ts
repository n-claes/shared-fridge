import { getFridge } from "./fridge.getFridge.handler.js"

export const getProductsFromFridge = async (location: number, lastName: string) => {
  const fridge = await getFridge(location)
  const products = fridge.products.filter((p) => p.belongsTo === lastName)
  return products;
}
