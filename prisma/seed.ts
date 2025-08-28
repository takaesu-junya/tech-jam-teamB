import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 シードデータの作成を開始します...");

  // UserTypeModelの作成
  await prisma.userTypeModel.createMany({
    data: [
      { name: "normal" },
      { name: "meister" },
    ],
    skipDuplicates: true,
  });

  // サンプルユーザーの作成
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "normal@example.com" },
      update: {},
      create: {
        name: "田中太郎",
        email: "normal@example.com",
        employeeNumber: "EMP001",
        yearsOfService: 3,
        password: hashedPassword,
        userType: "normal",
      },
    }),
    prisma.user.upsert({
      where: { email: "meister@example.com" },
      update: {},
      create: {
        name: "山田花子",
        email: "meister@example.com",
        employeeNumber: "EMP002",
        yearsOfService: 8,
        password: hashedPassword,
        userType: "meister",
      },
    }),
  ]);

  console.log("✅ ユーザーを作成しました:", users);
  console.log("🎉 シードデータの作成が完了しました！");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ シードエラー:", e);
    await prisma.$disconnect();
    process.exit(1);
  });