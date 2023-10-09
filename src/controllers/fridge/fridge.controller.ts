import { Body, Representer, StatusCode } from "@panenco/papi";
import { JsonController, Post } from "routing-controllers";
import { FridgeView } from "../../contracts/fridge.view.js";
import { FridgeBody } from "../../contracts/fridge.body.js";
import { createFridge } from "./handlers/fridge.create.handler.js";

@JsonController("/fridge")
export class FridgeController {
  @Post()
  @Representer(FridgeView, StatusCode.created)
  async create(@Body() body: FridgeBody) {
    return createFridge(body);
  }
}
