import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const healthcheck = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .json(new ApiResponse(200, { message: "API is very healthy" }));
});

// const healthcheck = async (req, res, next) => {
//   const user = await getUserFromDB(); // hypothetical function to get user data
//   try {
//     res.status(200).json(new ApiResponse(200, { message: "API is healthy" }));
//   } catch (error) {
//     next(err);
//   }
// };

export { healthcheck };
