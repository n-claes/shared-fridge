import { getFridge } from "./fridge.getFridge.handler.js"

export const getUserProductsFromFridge = async (location: number, lastName: string) => {
  const fridge = await getFridge(location)
  const products = fridge.products.filter((p) => p.belongsTo === lastName)
  if (!products) {
    throw new Error("No products for this user in fridge");
  }
  return products;
}
