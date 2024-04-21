import config from "../src/app/config";
import prisma from "../src/app/utils/prismaClient";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (isSuperAdminExists) {
      return;
    }

    await prisma.user.create({
      data: {
        email: config.SUPERADMIN_EMAIL as string,
        password: config.SUPERADMIN_PASSWORD as string,
        role: "SUPER_ADMIN",
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "",
          },
        },
      },
    });
  } catch (error: any) {
    console.log(error);
  }
};

seedSuperAdmin();
