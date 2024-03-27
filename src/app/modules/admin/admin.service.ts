import { Prisma } from "@prisma/client";
import { searchableFieldsName } from "./admin.constant";
import { generatePaginationAndSorting } from "../../utils/generatePaginationAndSorting";
import prisma from "../../utils/prismaClient";

// get all admins
const getAllAdminsFromDB = async (query: any, options: any) => {
  const { searchTerm, ...filterData } = query;
  const { limit, skip, sortObj } = generatePaginationAndSorting(options);
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchableFieldsName.map((filed) => {
        return {
          [filed]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((filed) => ({
        [filed]: {
          equals: filterData[filed],
        },
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortObj,
  });

  return result;
};

export const adminServices = {
  getAllAdminsFromDB,
};
