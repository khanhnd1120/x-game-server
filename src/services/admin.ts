import { Api } from "../config/admin-interface";

const apis = require("../../admin/api.json");
const menus = require("../../admin/menu.json");
const enums = require("../../admin/enum.json");
const grids = require("../../admin/grid.json");
const forms = require("../../admin/form.json");

function getApiByName(name: string) {
  let api = apis.find((a: Api) => a.name === name);
  if (!api) {
    throw new Error("api_not_found");
  }
  return api;
}
function getAllEnums() {
  return enums;
}

function getAllMenus() {
  return menus;
}
function getAllForms() {
  return forms;
}
function getAllGrids() {
  return grids;
}
const admin = {
  getApiByName,
  getAllEnums,
  getAllMenus,
  getAllForms,
  getAllGrids,
};
export default admin;
