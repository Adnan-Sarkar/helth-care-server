type TPaginationAndSorting = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

export const generatePaginationAndSorting = (
  options: TPaginationAndSorting
) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 5;

  const skip = (page - 1) * limit;

  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  const sortObj = {
    [sortBy]: sortOrder,
  };

  return {
    skip,
    limit,
    sortObj,
  };
};
