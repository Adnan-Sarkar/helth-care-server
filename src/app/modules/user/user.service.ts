import { Admin, Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../utils/prismaClient";
import { Request } from "express";
import imageUploadToCloudinary from "../../utils/uploadImageIntoCloudinary";
import { TFile } from "../../types/file";
import { TPaginationOptions } from "../../types/pagination";
import { generatePaginationAndSorting } from "../../utils/generatePaginationAndSorting";
import { searchableFieldsName } from "./user.constant";

// create admin
const createAdmin = async (req: Request): Promise<Admin> => {
  const file: TFile = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await imageUploadToCloudinary(file);
    req.body.data.admin.profilePhoto = uploadToCloudinary.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

// create doctor
const createDoctor = async (req: Request): Promise<Doctor> => {
  const file: TFile = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await imageUploadToCloudinary(file);
    req.body.data.doctor.profilePhoto = uploadToCloudinary.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

// create patient
const createPatient = async (req: Request): Promise<Patient> => {
  const file: TFile = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await imageUploadToCloudinary(file);
    req.body.data.patient.profilePhoto = uploadToCloudinary.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createdPatientData;
  });

  return result;
};

// get all users
const getAllUsersFromDB = async (query: any, options: TPaginationOptions) => {
  const { searchTerm, ...filterData } = query;
  const { limit, skip, sortObj, page } = generatePaginationAndSorting(options);
  const andConditions: Prisma.UserWhereInput[] = [];

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
          equals: (filterData as any)[filed],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput = {
    AND: andConditions as Prisma.UserWhereInput,
  };

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortObj,
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      Patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
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

// update user status
const updateUserStatusIntoDB = async (id: string, status: UserRole) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

// get my profile
const getMyProfile = async (user) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;
  if (userInfo.role === "SUPER_ADMIN" || userInfo.role === "ADMIN") {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === "DOCTOR") {
    profileInfo = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === "PATIENT") {
    profileInfo = await prisma.patient.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }

  return {
    ...userInfo,
    ...profileInfo,
  };
};

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getMyProfile,
};
