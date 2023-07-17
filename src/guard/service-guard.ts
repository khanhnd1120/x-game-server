export default async function ServiceGuard(
  req: any,
  res: any,
  done: CallableFunction
) {
  try {
    const auth = req.headers.authorization;
    if (auth !== "NVu5UUjufmPklB9g1wfn") {
      throw new Error("forbidden");
    }
  } catch (error) {
    throw new Error("forbidden");
  }
}
