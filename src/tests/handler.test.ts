import { expect } from "chai";
import { beforeEach, describe, it } from 'mocha';
import { User } from "../entities/user.entity.js";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import mikroOrmConfig from "../mikro-orm.config.js";
import { getAllUsers } from "../controllers/users/handlers/user.getAllUsers.handler.js";
import { getUser } from "../controllers/users/handlers/user.getUser.handler.js";

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

describe("Handler tests", () => {
  describe("User tests", () => {
    let orm: MikroORM<PostgreSqlDriver>;
    let users: User[];
    before(async () => {
      orm = await MikroORM.init(mikroOrmConfig);
    });

    beforeEach(async () => {
      await orm.em.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
      await orm.getMigrator().up();
      const generator = orm.getSchemaGenerator();
      await generator.updateSchema();
      const em = orm.em.fork();
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
        }
      });
    });
  });
});
