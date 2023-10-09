import { Body, ListRepresenter, Query, Representer, StatusCode } from "@panenco/papi";
import { UserBody } from "../contracts/user.body.js";
import { create } from "./users/handlers/user.create.handler.js";
import { Delete, Get, JsonController, Param, Post } from "routing-controllers";
import { UserView } from "../contracts/user.view.js";
import { SearchQuery } from "../contracts/search.query.js";
import { getAllUsers } from "./users/handlers/user.getAllUsers.js";
import { getUser } from "./users/handlers/user.getUser.js";
import { deleteByName } from "./users/handlers/user.delete.handler.js";

@JsonController("/users")
export class UserController {
  @Post()
  @Representer(UserView, StatusCode.created)
  async create(@Body() body: UserBody) {
    return create(body);
  }

  @Get()
  @ListRepresenter(UserView)
  async getAllUsers(@Query() query: SearchQuery) {
    return getAllUsers(query.search);
  }

  @Get("/:lastName")
  @Representer(UserView)
  async getUser(@Param("lastName") lastName: string) {
    return getUser(lastName);
  }

  @Delete("/:lastName")
  @Representer(null)
  async deleteUser(@Param("lastName") lastName: string) {
    return deleteByName(lastName);
  }
}
