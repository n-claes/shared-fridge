import supertest from "supertest";
import { expect } from "chai";
import { beforeEach, describe, it } from 'mocha';
import { StatusCode } from "@panenco/papi";

import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { App } from "../app.js";
import { User } from "../entities/user.entity.js";
import { Fridge } from "../entities/fridge.entity.js";
import { ProductBody } from "../contracts/products/product.body.js";
import { Product } from "../entities/product.entity.js";
import { Recipe } from "../entities/recipe.entity.js";
import { RecipeBody } from "../contracts/recipes/recipe.body.js";

const testProducts = {
  egg: {name: "egg", size: 1},
  apple: {name: "apple", size: 1},
  water: {name: "water", size: 1},
  spices: {name: "spices", size: 1},
  milk: {name: "milk", size: 2},
  flour: {name: "flour", size: 3},
  tomatoes: {name: "tomatoes", size: 5},
  chicken: {name: "chicken", size: 5},
  pasta: {name: "pasta", size: 8},
}

const testUsers = {
  user1: {
    firstName: "user1_fn",
    lastName: "user1",
    email: "user1@test.com",
    password: "password",
  } as User,
  user2: {
    firstName: "user2_fn",
    lastName: "user2",
    email: "user2@test.com",
    password: "password",
  } as User
}

const testFridges = {
  fridge1: {
    location: 1,
    totalCapacity: 10,
  } as Fridge,
  fridge2: {
    location: 2,
    totalCapacity: 20,
  } as Fridge,
  fridge3: {
    location: 3,
    totalCapacity: 5,
  } as Fridge,
}

const testRecipes = {
  friedEgg: {
    name: "fried_egg",
    description: "ingredients for fried eggs.",
    ingredients: [testProducts.egg.name, testProducts.spices.name],
  } as Recipe,
  cookedPasta: {
    name: "cooked_pasta",
    description: "ingredients for cooked pasta.",
    ingredients: [testProducts.pasta.name, testProducts.water.name],
  } as Recipe,
  friedChicken: {
    name: "fried_chicken_pasta",
    description: "ingredients for fried chicken.",
    ingredients: [
      testProducts.chicken.name,
      testProducts.spices.name,
      testProducts.tomatoes.name,
      testProducts.pasta.name,
      testProducts.flour.name,
    ],
  } as Recipe,
}


describe("Integration tests", () => {
  describe("Use case tests", () => {
    let request: supertest.SuperTest<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;
    before(async () => {
      const app = new App();
      await app.createConnection()
      orm = app.orm;
      request = supertest(app.host);
    })

    after(async () => {
      await orm.close(true);
    })

    beforeEach(async () => {
      await orm.em.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
      await orm.getMigrator().up();
      const generator = orm.getSchemaGenerator();
      await generator.updateSchema();
    })

    const createTestUsers = async () => {
      const {body: user1} = await request.post(`/api/users`).send(
        testUsers.user1
      ).expect(StatusCode.created);
      const {body: user2} = await request.post(`/api/users`).send(
        testUsers.user2
      ).expect(StatusCode.created);
      return {user1, user2};
    }

    const createTestFridges = async() => {
      const {body: fridge1} = await request.post(`/api/fridge`).send(
        testFridges.fridge1
      ).expect(StatusCode.created);
      const {body: fridge2} = await request.post(`/api/fridge`).send(
        testFridges.fridge2
      ).expect(StatusCode.created);
      const {body: fridge3} = await request.post(`/api/fridge`).send(
        testFridges.fridge3
      ).expect(StatusCode.created);
      return {fridge1, fridge2, fridge3};
    }

    const addTestProductToUser = async (user: User, body: ProductBody) => {
      const {body: response} = await request.post(
        `/api/users/${user.lastName}/buy`
      ).send(body as ProductBody).expect(StatusCode.ok);
      return response;
    }

    const addTestProductToFridge = async(user: User, fridge: Fridge, pname: string) => {
      const {body: response} = await request.post(
        `/api/users/${user.lastName}/move/${pname}/${fridge.location}`
      ).expect(StatusCode.ok);
      return response
    }

    const addTestRecipe = async (user: User, body: RecipeBody) => {
      const {body: response} = await request.post(
        `/api/recipes/${user.lastName}`
      ).send(body as RecipeBody).expect(StatusCode.created);
      return response;
    }

    const getTestUser = async (userName: string) => {
      const {body: response} = await request.get(`/api/users/${userName}`).expect(
        StatusCode.ok
      );
      return response;
    }

    const getTestFridge = async (location: number) => {
      const {body: response} = await request.get(`/api/fridge/${location}`).expect(
        StatusCode.ok
      );
      return response;
    }

    const getTestRecipe = async (user: User, recipeName: string) => {
      const {body: response} = await request.get(
        `/api/recipes/${user.lastName}/${recipeName}`
      ).expect(StatusCode.ok);
      return response;
    }

    it("should create users", async () => {
      const {user1, user2} = await createTestUsers();
      expect(user1.firstName).to.equal("user1_fn");
      expect(user2.firstName).to.equal("user2_fn");
    });

    it("should create fridges", async() => {
      const {fridge1, fridge2, fridge3} = await createTestFridges();
      expect(fridge1.location).to.equal(1);
      expect(fridge2.location).to.equal(2);
      expect(fridge3.location).to.equal(3);
    })

    it("should CRG product to user", async () => {
      const user = testUsers.user1;
      const product = testProducts.tomatoes;
      await createTestUsers();

      // add product to user
      const addResponse = await addTestProductToUser(user, product);
      expect(addResponse.lastName).to.equal(user.lastName);
      expect(addResponse.products.length).to.equal(1);
      expect(addResponse.products[0].name).to.equal(product.name);
      expect(addResponse.products[0].size).to.equal(product.size);
      expect(addResponse.products[0].belongsTo).to.equal(user.lastName);

      // get specific product
      const {body: getResponse} = await request.get(
        `/api/users/${user.lastName}/${product.name}`
      ).expect(StatusCode.ok);
      expect(getResponse.name).to.equal(product.name);
      expect(getResponse.size).to.equal(product.size);
      expect(getResponse.belongsTo).to.equal(user.lastName);

      // gift product to other user
      let fromUser = await getTestUser(user.lastName);
      let toUser = await getTestUser(testUsers.user2.lastName);
      const {body: giftResponse} = await request.post(
        `/api/users/${fromUser.lastName}/gift/${product.name}/${toUser.lastName}`
      ).expect(StatusCode.ok);
      expect(giftResponse.lastName).to.equal(testUsers.user2.lastName);
      expect(giftResponse.products.length).to.equal(1);
      expect(giftResponse.products[0].name).to.equal(product.name);

      fromUser = await getTestUser(fromUser.lastName);
      expect(fromUser.products.length).to.equal(0);
      toUser = await getTestUser(toUser.lastName);
      expect(toUser.products.length).to.equal(1);
      expect(toUser.products[0].name).to.equal(product.name);
      expect(toUser.products[0].belongsTo).to.equal(toUser.lastName);
    });


    it("should allow a user to PGD product in fridge", async () => {
      await createTestUsers();
      await createTestFridges();
      let user = testUsers.user1;
      let fridge = testFridges.fridge1;
      const egg = testProducts.egg;
      const tomatoes = testProducts.tomatoes;
      const flour = testProducts.flour;
      await addTestProductToUser(user, egg);

      // put product in fridge
      const putResponse = await addTestProductToFridge(user, fridge, egg.name);
      expect(putResponse.location).to.equal(fridge.location);
      expect(putResponse.products.length).to.equal(1);
      expect(putResponse.products[0].name).to.equal(egg.name);
      expect(putResponse.products[0].size).to.equal(egg.size);
      expect(putResponse.currentCapacity).to.equal(egg.size);

      // delete product from fridge
      await request.delete(
        `/api/fridge/${fridge.location}/${user.lastName}/remove/${egg.name}`
      );
      fridge = await getTestFridge(fridge.location);
      expect(fridge.products.length).to.equal(0);
      expect(fridge.currentCapacity).to.equal(0);

      // add all products to fridge
      for (const product of [egg, tomatoes, flour]) {
        await addTestProductToUser(user, product);
        await addTestProductToFridge(user, fridge, product.name);
      }
      fridge = await getTestFridge(fridge.location);
      expect(fridge.products.length).to.equal(3);
      expect(fridge.currentCapacity).to.equal(egg.size + tomatoes.size + flour.size);

      // get all products from fridge
      const {body: getAllResponse} = await request.get(
        `/api/fridge/${fridge.location}/${user.lastName}`
      );
      expect(getAllResponse.length).to.equal(3);
      expect(getAllResponse.some((p: Product) => p.name === egg.name)).true;
      expect(getAllResponse.some((p: Product) => p.name === tomatoes.name)).true;
      expect(getAllResponse.some((p: Product) => p.name === flour.name)).true;
      expect(getAllResponse.every((p: Product) => p.belongsTo === user.lastName)).true;

      // gift all products to other user
      let toUser = await getTestUser(testUsers.user2.lastName);
      expect(toUser.products.length).to.equal(0);
      const {body: giftAllResponse} = await request.post(
        `/api/fridge/${fridge.location}/${user.lastName}/gift/${toUser.lastName}`
      );
      expect(giftAllResponse.products.length).to.equal(0);
      expect(giftAllResponse.currentCapacity).to.equal(0);
      toUser = await getTestUser(toUser.lastName);
      expect(toUser.products.length).to.equal(3);
      expect(toUser.products.some((p: Product) => p.name === egg.name)).true;
      expect(toUser.products.some((p: Product) => p.name === tomatoes.name)).true;
      expect(toUser.products.some((p: Product) => p.name === flour.name)).true;
      expect(
        toUser.products.every((p: Product) => p.belongsTo === toUser.lastName)
      ).true;

      // user2 puts all products back in a (different) fridge
      fridge = testFridges.fridge2;
      for (const product of toUser.products) {
        await addTestProductToFridge(toUser, fridge, product.name);
      }
      fridge = await getTestFridge(fridge.location);
      expect(fridge.products.length).to.equal(3);
      expect(fridge.currentCapacity).to.equal(egg.size + tomatoes.size + flour.size);
      expect(fridge.products.every(
        (p: Product) => p.belongsTo === toUser.lastName)
      ).true;
      toUser = await getTestUser(toUser.lastName);
      expect(toUser.products.length).to.equal(0);

      // user2 deletes all products from fridge
      await request.delete(
        `/api/fridge/${fridge.location}/${toUser.lastName}`
      );
      fridge = await getTestFridge(fridge.location);
      expect(fridge.products.length).to.equal(0);
      expect(fridge.currentCapacity).to.equal(0);
      toUser = await getTestUser(toUser.lastName);
      expect(toUser.products.length).to.equal(0);
    });

    it("should allow users to GGD all products from all fridges", async() => {
      await createTestUsers()
      await createTestFridges()
      let user = testUsers.user1;
      let fridge1 = testFridges.fridge1;
      let fridge2 = testFridges.fridge2;
      const pasta = testProducts.pasta;
      const water = testProducts.water;
      const flour = testProducts.flour;

      // add products to user
      for (const product of [pasta, water, flour]) {
        await addTestProductToUser(user, product);
      }
      await addTestProductToFridge(user, fridge1, pasta.name);
      await addTestProductToFridge(user, fridge2, water.name);
      await addTestProductToFridge(user, fridge2, flour.name);
      user = await getTestUser(user.lastName);
      expect(user.products.length).to.equal(0);

      // add products to different fridges
      fridge1 = await getTestFridge(fridge1.location);
      expect(fridge1.products.length).to.equal(1);
      expect(fridge1.products[0].name).to.equal(pasta.name);
      expect(fridge1.currentCapacity).to.equal(pasta.size);
      fridge2 = await getTestFridge(fridge2.location);
      expect(fridge2.products.length).to.equal(2);
      expect(fridge2.products.some((p: Product) => p.name === water.name)).true;
      expect(fridge2.products.some((p: Product) => p.name === flour.name)).true;
      expect(fridge2.currentCapacity).to.equal(water.size + flour.size);

      // get all products from all fridges
      const {body: getAllResponse} = await request.get(
        `/api/products/${user.lastName}/`
      );
      const {items, count} = getAllResponse;
      expect(count).to.equal(3);
      expect(items.some((p: Product) => p.name === pasta.name)).true;
      expect(items.some((p: Product) => p.name === water.name)).true;
      expect(items.some((p: Product) => p.name === flour.name)).true;
      expect(items.every((p: Product) => p.belongsTo === user.lastName)).true;

      // gift all products to other user
      let toUser = await getTestUser(testUsers.user2.lastName);
      expect(toUser.products.length).to.equal(0);
      const {body: allGiftResponse} = await request.post(
        `/api/products/${user.lastName}/gift/${testUsers.user2.lastName}`
      );
      expect(allGiftResponse.length).to.equal(3);
      toUser = await getTestUser(testUsers.user2.lastName);
      expect(toUser.products.length).to.equal(3);
      expect(
        toUser.products.every((p: Product) => p.belongsTo === toUser.lastName)
      ).true;

      // put everything back in the fridges
      await addTestProductToFridge(toUser, fridge1, pasta.name);
      fridge1 = await getTestFridge(fridge1.location);
      expect(fridge1.products.length).to.equal(1);
      await addTestProductToFridge(toUser, fridge2, water.name);
      await addTestProductToFridge(toUser, fridge2, flour.name);
      fridge2 = await getTestFridge(fridge2.location);
      expect(fridge2.products.length).to.equal(2);

      // delete all user products from all fridges
      await request.delete(`/api/products/${toUser.lastName}`);
      fridge1 = await getTestFridge(fridge1.location);
      expect(fridge1.products.length).to.equal(0);
      expect(fridge1.currentCapacity).to.equal(0);
      fridge2 = await getTestFridge(fridge2.location);
      expect(fridge2.products.length).to.equal(0);
      expect(fridge2.currentCapacity).to.equal(0);
    });

    it("should CRUD recipes", async () => {
      await createTestUsers();
      const user = testUsers.user1;
      const friedEgg = testRecipes.friedEgg;

      // create recipes
      const createResponse = await addTestRecipe(user, friedEgg);
      expect(createResponse.name).to.equal(friedEgg.name);
      expect(createResponse.description).to.equal(friedEgg.description);
      expect(createResponse.ingredients.length).to.equal(friedEgg.ingredients.length);
      expect(createResponse.belongsTo).to.equal(user.lastName);

      // get recipe
      const getResponse = await getTestRecipe(user, friedEgg.name);
      expect(getResponse.name).to.equal(friedEgg.name);
      expect(getResponse.description).to.equal(friedEgg.description);
      expect(getResponse.ingredients.length).to.equal(friedEgg.ingredients.length);
      expect(getResponse.belongsTo).to.equal(user.lastName);

      // patch recipe
      const newBody = {
        "description": "a new description",
        "ingredients": ["egg", "spices", "water"],
      }
      const {body: patchResponse} = await request.patch(
        `/api/recipes/${user.lastName}/${friedEgg.name}`
      ).send(newBody as RecipeBody);
      expect(patchResponse.name).to.equal(friedEgg.name);
      expect(patchResponse.description).to.equal(newBody.description);
      expect(patchResponse.ingredients.length).to.equal(newBody.ingredients.length);
      expect(patchResponse.belongsTo).to.equal(user.lastName);

      // add some extra recipes
      await addTestRecipe(user, testRecipes.cookedPasta);
      await addTestRecipe(testUsers.user2, testRecipes.friedChicken);

      // get all recipes for user1
      const {body: getAllResponse} = await request.get(
        `/api/recipes/${user.lastName}`
      );
      let {items, count} = getAllResponse;
      expect(count).to.equal(2);
      expect(items.some((r: Recipe) => r.name === friedEgg.name)).true;
      expect(items.some((r: Recipe) => r.name === testRecipes.cookedPasta.name)).true;
      expect(items.every((r: Recipe) => r.belongsTo === user.lastName)).true;
      const {body: getAllResponse2} = await request.get(
        `/api/recipes/${testUsers.user2.lastName}`
      );
      ({items, count} = getAllResponse2);
      expect(count).to.equal(1);
      expect(items[0].name).to.equal(testRecipes.friedChicken.name);
      expect(items[0].belongsTo).to.equal(testUsers.user2.lastName);

      // delete recipe
      await request.delete(`/api/recipes/${user.lastName}/${friedEgg.name}`);
      const {body: getAllResponseDeleted} = await request.get(
        `/api/recipes/${user.lastName}`
      );
      ({items, count} = getAllResponseDeleted);
      expect(count).to.equal(1);
      expect(items[0].name).to.equal(testRecipes.cookedPasta.name);
      expect(items[0].belongsTo).to.equal(user.lastName);

      // get all recipes
      const {body: allRecipesResponse} = await request.get(`/api/recipes`);
      ({items, count} = allRecipesResponse);
      expect(count).to.equal(2);
      expect(items.some((r: Recipe) => r.name === testRecipes.cookedPasta.name)).true;
      expect(items.some((r: Recipe) => r.name === testRecipes.friedChicken.name)).true;
    });

    it("should fetch missing ingredients", async() => {
      await createTestUsers();
      await createTestFridges();
      const user = testUsers.user1;
      const products = [
        testProducts.chicken,
        testProducts.tomatoes,
        testProducts.flour,
        testProducts.pasta,
        testProducts.spices,
      ]
      const recipe = testRecipes.friedChicken;

      for (const product of products) {
        await addTestProductToUser(user, product);
      }
      for (const product of products.slice(2, products.length)) {
        await addTestProductToFridge(user, testFridges.fridge2, product.name);
      }
      await addTestRecipe(user, recipe)

      // get missing ingredients from fridge
      const {body: missingIngredients} = await request.get(
        `/api/recipes/${user.lastName}/${recipe.name}/ingredients`
      );
      expect(missingIngredients.length).to.equal(3);
      expect(missingIngredients.some((p: Product) => p.name === products[2].name)).true;
      expect(missingIngredients.some((p: Product) => p.name === products[3].name)).true;
      expect(missingIngredients.some((p: Product) => p.name === products[4].name)).true;
    })
  });
});
