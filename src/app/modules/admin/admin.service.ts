import { Admin, Prisma, UserStatus } from "@prisma/client";
import { searchableFieldsName } from "./admin.constant";
import { generatePaginationAndSorting } from "../../utils/generatePaginationAndSorting";
import prisma from "../../utils/prismaClient";

// get all admins
const getAllAdminsFromDB = async (query: any, options: any) => {
  const { searchTerm, ...filterData } = query;
  const { limit, skip, sortObj, page } = generatePaginationAndSorting(options);
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

  const total = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get admin by id
const getAdminByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update admin by id
const updateAdminByIdIntoDB = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete admin by id
const deleteAdminFromDB = async (id: string) => {
  // check admin is exists
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};

// soft delete admin by id
const softDeleteAdminFromDB = async (id: string) => {
  // check admin is exists
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return result;
};

export const adminServices = {
  getAllAdminsFromDB,
  getAdminByIdFromDB,
  updateAdminByIdIntoDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
