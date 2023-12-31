import { expect } from "chai";
import { after, beforeEach, describe, it } from 'mocha';
import { User } from "../entities/user.entity.js";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import mikroOrmConfig from "../mikro-orm.config.js";
import { getAllUsers } from "../controllers/users/handlers/user.getAllUsers.handler.js";
import { getUser } from "../controllers/users/handlers/user.getUser.handler.js";
import { Fridge } from "../entities/fridge.entity.js";
import { getAllFridges } from "../controllers/fridge/handlers/fridge.getAllFridges.handler.js";
import { getFridge } from "../controllers/fridge/handlers/fridge.getFridge.handler.js";
import { Product } from "../entities/product.entity.js";
import { moveProductToFridge } from "../controllers/users/handlers/user.moveProductToFridge.handler.js";
import { create } from "../controllers/users/handlers/user.create.handler.js";
import { createFridge } from "../controllers/fridge/handlers/fridge.create.handler.js";
import { giftProductToUser } from "../controllers/users/handlers/user.giftProduct.handler.js";
import { addProduct } from "../controllers/users/handlers/user.addProduct.handler.js";
import { removeProductFromFridge } from "../controllers/fridge/handlers/fridge.removeProductFromFridge.handler.js";
import { getProductFromUser } from "../controllers/users/handlers/user.getProduct.handler.js";
import { getProductsFromFridge } from "../controllers/fridge/handlers/fridge.getProductsFromFridge.handler.js";
import { deleteAllUserProductsFromFridge } from "../controllers/fridge/handlers/fridge.deleteAllUserProductsFromFridge.handler.js";
import { giftAllProductsFromFridgeToUser } from "../controllers/fridge/handlers/fridge.giftAllProductsFromFridgeToUser.handler.js";
import { getAllProducts } from "../controllers/products/handlers/product.getAllProducts.handler.js";

const userFixtures: User[] = [
  {
    firstName: "first1",
    lastName: "last1",
    email: "user1@email.com",
    password: "password1",
  } as User,
  {
    firstName: "first2",
    lastName: "last2",
    email: "user2@email.com",
    password: "password2",
  } as User,
  {
    firstName: "first3",
    lastName: "last3",
    email: "user3@email.com",
    password: "password3",
  } as User,
]

const fridgeFixtures: Fridge[] = [
  {
    location: 0,
    totalCapacity: 10,
    currentCapacity: 5,
  } as Fridge,
  {
    location: 1,
    totalCapacity: 2,
    currentCapacity: 0,
  } as Fridge,
  {
    location: 3,
    totalCapacity: 20,
    currentCapacity: 0,
  } as Fridge,
]

const productNames: string[] = [
  "apple", "pear", "beer", "egg", "flour", "water",
  "milk", "tomatoes", "carrots", "spices"
]
const productSizes: number[] = [2, 2, 4, 1, 2, 1, 1, 3, 5, 1]
const productBelongsToIdx: number[] = [0, 0, 0, 1, 1, 1, 2, 2, 2, 2]
const productFixtures: Product[] = [
  ...Array.from({length: 10}, (_, i) => ({
    "name": productNames[i],
    "size": productSizes[i],
    "belongsTo": userFixtures[productBelongsToIdx[i]].lastName,
    "inFridge": false,
  })),
]

const createOrmFork = async (orm: MikroORM<PostgreSqlDriver>) => {
  await orm.em.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await orm.getMigrator().up();
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
  return orm.em.fork();
}

describe("Handler tests", () => {
  let orm: MikroORM<PostgreSqlDriver>;
  before(async () => {
    orm = await MikroORM.init(mikroOrmConfig);
  });

  after(async () => {
    await orm.close(true);
  });

  describe("User tests", () => {
    let users: User[];

    beforeEach(async () => {
      const em = await createOrmFork(orm);
      users = userFixtures.map((x) => em.create(User, x));
      await em.persistAndFlush(users);
    });

    it("should get all users", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const [res, total] = await getAllUsers(null);
        expect(res.length).to.equal(userFixtures.length);
        expect(res.some((x) => x.firstName === "first3")).to.be.true;
      });
    });

    it("should search a user", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const [res, total] = await getAllUsers("first1");
        expect(res.some((x) => x.firstName === "first1")).to.be.true;
      });
    });

    it("should get a user by its last name", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const res = await getUser(users[0].lastName);
        expect(res.firstName).to.equal("first1");
        expect(res.lastName).to.equal("last1");
        expect(res.email).to.equal("user1@email.com");
      });
    });

    it("should fail to find a user", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        try {
          await getUser("unknown");
        } catch (error) {
          expect(error.message).to.equal("User not found");
          return
        }
        expect(true, "should have thrown an error").false;
      });
    });

    it("should fail to create a user", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        try {
          await create(users[0]);
        } catch (error) {
          expect(error.message).to.equal("User already exists");
          return
        }
        expect(true, "should have thrown an error").false;
      });
    });
  });


  describe("Fridge tests", () => {
    let fridges: Fridge[];

    beforeEach(async () => {
      const em = await createOrmFork(orm);
      fridges = fridgeFixtures.map((x) => em.create(Fridge, x));
      await em.persistAndFlush(fridges);
    });

    it("should get all fridges", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const [res, total] = await getAllFridges(null);
        expect(res.length).to.equal(fridgeFixtures.length);
        expect(res.some((x) => x.location === 3)).to.be.true;
      });
    })

    it("should search a fridge", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const [res, total] = await getAllFridges(1);
        expect(res.some((x) => x.location === 1)).to.be.true;
      });
    });

    it("should get a fridge by its location", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const res = await getFridge(fridges[0].location);
        expect(res.location).to.equal(0);
        expect(res.totalCapacity).to.equal(fridgeFixtures[0].totalCapacity);
      });
    });

    it("should fail to create a fridge", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        try {
          await createFridge(fridges[0]);
        } catch (error) {
          expect(error.message).to.equal("Fridge already exists at this location");
          return
        }
        expect(true, "should have thrown an error").false;
      });
    });
  });


  describe("Product tests", () => {
    let users: User[];
    let fridges: Fridge[];

    beforeEach(async () => {
      const em = await createOrmFork(orm);
      users = userFixtures.map((x) => em.create(User, x));
      fridges = fridgeFixtures.map((x) => em.create(Fridge, x));
      await em.persistAndFlush(users);
      await em.persistAndFlush(fridges);
    })

    it("should let a user buy a product", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const prod = productFixtures[0]
        const user = await getUser(prod.belongsTo)
        await addProduct(prod, user.lastName)
        expect(user.products.length).to.equal(1)
        expect(user.products[0].name).to.equal(prod.name)
      });
    });

    it("should put a user's product in a fridge", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const prod = productFixtures[0]
        const fridge = await getFridge(0)
        const user = await getUser(prod.belongsTo)
        await addProduct(prod, prod.belongsTo)

        expect(user.products.length).to.equal(1)
        expect(fridge.products.length).to.equal(0)

        await moveProductToFridge(user.lastName, prod.name, fridge.location)

        expect(user.products.length).to.equal(0)
        expect(fridge.products.length).to.equal(1)
        expect(fridge.products[0].name).to.equal(prod.name)
        expect(fridge.currentCapacity).to.equal(
          fridgeFixtures[0].currentCapacity + prod.size
        )
        expect(fridge.products[0].belongsTo).to.equal(prod.belongsTo)
      });
    });

    it("should not accept products if they don't fit in the fridge", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const prod = productFixtures[8]
        await addProduct(prod, prod.belongsTo)
        try {
          await moveProductToFridge(prod.belongsTo, prod.name, 1)
        } catch (error) {
          expect(error.message).to.equal("Product does not fit in fridge")
        }
      });
    });

    it("should gift a product to another user", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const prod = productFixtures[1]
        const user1 = await getUser(users[0].lastName)
        const user2 = await getUser(users[1].lastName)
        await addProduct(prod, user1.lastName)
        expect(user1.products.length).to.equal(1)
        expect(user1.products[0].name).to.equal(prod.name)
        expect(user2.products.length).to.equal(0)
        await giftProductToUser(user1.lastName, prod.name, user2.lastName)
        expect(user1.products.length).to.equal(0)
        expect(user2.products.length).to.equal(1)
        expect(user2.products[0].name).to.equal(prod.name)
      });
    });

    it("should remove a user's product from a fridge", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const prod = productFixtures[2]
        const fridge = await getFridge(3)
        const user = await getUser(users[1].lastName)
        await addProduct(prod, user.lastName)
        expect(user.products.length).to.equal(1)
        await moveProductToFridge(user.lastName, prod.name, fridge.location)
        expect(fridge.products.length).to.equal(1)
        expect(fridge.currentCapacity).to.equal(prod.size)
        await removeProductFromFridge(user.lastName, prod.name, fridge.location)
        expect(fridge.products.length).to.equal(0)
        expect(fridge.currentCapacity).to.equal(0)
        expect(user.products.length).to.equal(0)
      });
    });

    it("should get a specific product", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const prod = productFixtures[2]
        await addProduct(prod, users[1].lastName)
        const userProd = await getProductFromUser(users[1].lastName, prod.name)
        expect(userProd.name).to.equal(prod.name)
        expect(userProd.size).to.equal(prod.size)
        expect(userProd.belongsTo).to.equal(users[1].lastName)
      });
    });

    it("should get all products by a user from a fridge", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const prod1 = productFixtures[0]
        const prod2 = productFixtures[1]
        const prod3 = productFixtures[2]
        const user1 = await getUser(users[1].lastName)
        const user2 = await getUser(users[2].lastName)
        const fridge = await getFridge(3)
        for (const prod of [prod1, prod2]) {
          await addProduct(prod, user1.lastName)
          await moveProductToFridge(user1.lastName, prod.name, fridge.location)
        }
        await addProduct(prod3, user2.lastName)
        await moveProductToFridge(user2.lastName, prod3.name, fridge.location)
        const userProds = await getProductsFromFridge(fridge.location, user1.lastName)
        expect(userProds.length).to.equal(2)
        expect(userProds[0].name).to.equal(prod1.name)
        expect(userProds[1].name).to.equal(prod2.name)
      });
    });

    it("should delete all user products from a fridge", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const products = productFixtures.slice(0, 4)
        const user = await getUser(users[1].lastName)
        const fridge = await getFridge(3)
        for (const prod of products) {
          await addProduct(prod, user.lastName)
          await moveProductToFridge(user.lastName, prod.name, fridge.location)
        }
        expect(fridge.products.length).to.equal(products.length)
        const removedProducts = await deleteAllUserProductsFromFridge(
          user.lastName, fridge.location
        )
        expect(removedProducts.length).to.equal(products.length)
        expect(fridge.products.length).to.equal(0)
      });
    });

    it("should gift all user products from a fridge to another user", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const products = productFixtures.slice(0, 4)
        const fromUser = await getUser(users[1].lastName)
        const toUser = await getUser(users[2].lastName)
        const fridge = await getFridge(3)

        for (const prod of products) {
          await addProduct(prod, fromUser.lastName)
          await moveProductToFridge(fromUser.lastName, prod.name, fridge.location)
        }
        expect(fridge.products.length).to.equal(products.length)
        expect(toUser.products.length).to.equal(0)
        await giftAllProductsFromFridgeToUser(
          fromUser.lastName, fridge.location, toUser.lastName
        )
        expect(fridge.products.length).to.equal(0)
        expect(fromUser.products.length).to.equal(0)
        expect(toUser.products.length).to.equal(products.length)
        for (const prod of products) {
          expect(toUser.products.some((p) => p.name === prod.name)).to.be.true
        }
      });
    });


    it("should retrieve all products from all fridges", async() => {
      await RequestContext.createAsync(orm.em.fork(), async() => {
        const products = productFixtures.slice(0, 4)
        const user = await getUser(users[1].lastName)
        const fridge1 = await getFridge(0)
        const fridge3 = await getFridge(3)

        for (const prod of products) {
          await addProduct(prod, user.lastName)
        }
        for (let i = 0; i < 2; i++) {
          await moveProductToFridge(user.lastName, products[i].name, fridge1.location)
          await moveProductToFridge(user.lastName, products[i+2].name, fridge3.location)
        }
        const [res, total] = await getAllProducts(null);
        expect(res.length).to.equal(products.length);
        for (let i = 0; i < products.length; i++) {
          expect(res.some((x) => x.name === products[i].name)).to.be.true;
        }
      });
    });
  });
});
