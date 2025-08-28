-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('normal', 'meister');

-- CreateTable
CREATE TABLE "public"."user_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employee_number" TEXT NOT NULL,
    "years_of_service" INTEGER NOT NULL,
    "icon" TEXT,
    "password" TEXT NOT NULL,
    "user_type" "public"."UserType" NOT NULL DEFAULT 'normal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hotpepper_shop_id" TEXT NOT NULL,
    "hotpepper_shop_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shops" (
    "id" SERIAL NOT NULL,
    "hotpepper_shop_id" TEXT NOT NULL,
    "visit_counter" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_types_name_key" ON "public"."user_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "reviews_hotpepper_shop_id_idx" ON "public"."reviews"("hotpepper_shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "shops_hotpepper_shop_id_key" ON "public"."shops"("hotpepper_shop_id");

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_hotpepper_shop_id_fkey" FOREIGN KEY ("hotpepper_shop_id") REFERENCES "public"."shops"("hotpepper_shop_id") ON DELETE RESTRICT ON UPDATE CASCADE;
