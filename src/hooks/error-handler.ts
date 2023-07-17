const errorMap: { [key: string]: string } = {
  invalid_username_password: "Sai thông tin đăng nhập",
  invalid_password: "Sai thông tin đăng nhập",
  forbidden: "Phiên làm việc hết hạn",
  invalid_service: "Sai dịch vụ",
  invalid_permission: "Không có quyền truy cập",
  user_not_found: "Không tìm được thông tin người dùng",
  invalid_account: "Sai thông tin tài khoản",
  customer_already_claim_first_land: "customer_already_claim_first_land",
  invalid_plot_type: "Invalid plot type",
  plot_must_be_hatching: "Plot must be hatching",
  cannot_attach_to_hatching: "Cannot attach to hatching",
  invalid_plot: "Invalid plot",
  plot_not_found: "Plot not found",
  invalid_owner: "Invalid owner",
  plot_is_not_your: "Invalid owner",
  not_enough_storage: "Not enough storage",
  plot_is_busy: "Plot is busy",
  invalid_mongen_ids: "Invalid mongen ids",
  invalid_energy_transaction: "Not enough energy",
  invalid_skill_stones_transaction: "Not enough skill stones",
  invalid_mag_transaction: "Not enough MAG",
  invalid_food_transaction: "Not enough food",
  invalid_mstr_transaction: "Not enough MSTR",
  mongen_is_locked: "Mongen is locked",
  mongen_must_be_detach_first: "Mongen must be detach first",
  mongen_is_not_attach: "Mongen is not attach",
  invalid_mongen_state: "Invalid mongen state",
  cannot_feed_egg: "Cannot feed egg",
  level_is_max: "Level is max",
  cannot_evolve_egg: "Cannot evolve egg",
  evolution_is_max: "Evolution is max",
  unable_to_convert: "Unable to convert",
  invalid_type_to_skip_time: "Invalid plot type",
  plot_is_already_attach: "Plot is already attach",
  plot_is_locked: "Plot is locked",
  plot_is_not_active: "Plot is not active",
  plot_is_full: "Plot is full",
  plot_is_claimable: "Plot is claimable",
  no_mongen_attached: "Mo mongen attached",
  invalid_produce_time: "Invalid produce time",
  plot_is_not_hatching: "Plot is not hatching",
  no_egg_attached: "No egg attached",
  plot_must_be_breeding: "Plot must be breeding",
  invalid_breeding_time: "Invalid breeding time",
  mongen_not_found: "Mongen not found",
  user_name_already_exists: "User name already exists",
  invalid_uid: "Invalid uuid",
  invalid_nonce: "Invalid nonce",
};
export function convertError(error: any) {
  let message: string = errorMap[String(error.code)];
  // Send error response
  return { code: error.code, message: message || error };
}
export default function (error: any, request: any, reply: any) {
  let message: string = errorMap[String(error.code)];
  if (!message) {
    // Log unhandle error1
    console.error(error);
  }
  // Send error response
  if (error.message === "forbidden") {
    reply
      .status(403)
      .send({ code: error.code, message: message || error.message || error });
  }
  reply.status(400).send({
    code: error.code,
    message: message || error.message || error,
    debug: error,
  });
}
