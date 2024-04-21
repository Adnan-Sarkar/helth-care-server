import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { metaService } from "./meta.service";

// get meta data
const getDashboardMetaData = catchAsync(async (req, res) => {
  const result = await metaService.getDashboardMetaData(req?.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meta data retrived successfully",
    data: result,
  });
});

export const metaController = { getDashboardMetaData };
