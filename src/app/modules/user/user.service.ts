import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../utils/prismaClient";
import { Request } from "express";
import imageUploadToCloudinary from "../../utils/uploadImageIntoCloudinary";
import { TFile } from "../../types/file";

// create admin
const createAdmin = async (req: Request) => {
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
const createDoctor = async (req: Request) => {
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
const createPatient = async (req: Request) => {
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

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
};
