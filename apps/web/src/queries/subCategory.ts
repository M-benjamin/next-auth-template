"use server";

import db from "@/db/prisma";
import { currentUser } from "@/lib/auth";
import { SubCategory } from "@prisma/client";

/**
 * Upserts a subCategory in the database.
 * PERMISSIONS LEVEL: only ADMIN can create
 *
 * This function ensures that the current user is authenticated and has admin privileges.
 * It checks if a subCategory with the same name or URL already exists, excluding the subCategory
 * with the same ID. If such a subCategory exists, an error is thrown. Otherwise, it upserts
 * the subCategory data in the database.
 *
 * @param subCategory - The subCategory data to be upserted.
 * @returns The upserted subCategory details.
 * @throws Will throw an error if the user is not authenticated, lacks admin privileges,
 *         if subCategory data is not provided, or if a subCategory with the same name or URL
 *         already exists.
 */

export const upsertSubCategory = async (subCategory: SubCategory) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authentification
    if (!user) throw new Error("Unauthorized");

    // Verify admin permission
    if (user.role !== "ADMIN")
      throw new Error(
        "Unauthorized access: Admin privileges required for Entry"
      );

    // ensure subCategory data is provided
    if (!subCategory) throw new Error("subCategory data is required");

    console.log(subCategory, "subCategory");

    // throw error if subCategory with same name or URL already exists
    const existingsubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          { OR: [{ name: subCategory.name }, { url: subCategory.url }] },
          { NOT: { id: subCategory.id } },
        ],
      },
    });

    if (existingsubCategory) {
      let errorMessage = "";
      if (existingsubCategory.name === subCategory.name)
        errorMessage = "subCategory with this name already exists";
      else if (existingsubCategory.url === subCategory.url)
        errorMessage = "subCategory with this URL already exists";

      throw new Error(errorMessage);
    }

    // UPPSERT subCategory in database
    const subCategoryDetails = await db.subCategory.upsert({
      where: {
        id: subCategory.id,
      },
      update: subCategory,
      create: subCategory,
    });

    // Return subCategory infos
    return subCategoryDetails;
  } catch (error) {
    // Log and return error
    console.log(error);
    throw error;
  }
};

/**
 * Gets all subCategories from the database.
 *
 * @returns An array of subCategory objects.
 * @throws Will throw an error if any error occurs during database query.
 */
export const getAllSubCategories = async () => {
  try {
    const subCategories = await db.subCategory.findMany({
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return subCategories;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Gets a subCategory by its ID from the database.
 * ACCESS: PUBLIC
 *
 * @param {string} subCategoryId - The ID of the subCategory to be retrieved.
 * @returns The subCategory object with the given ID.
 * @throws Will throw an error if any error occurs during database query.
 */
export const getSubCategory = async (subCategoryId: string) => {
  try {
    if (!subCategoryId) throw new Error("subCategory ID is required");

    const subCategory = await db.subCategory.findUnique({
      where: {
        id: subCategoryId,
      },
    });

    return subCategory;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Deletes a subCategory by its ID from the database.
 * ACCESS: ADMIN ONLY
 *
 * @param {string} subCategoryId - The ID of the subCategory to be deleted.
 * @returns The deleted subCategory object.
 * @throws Will throw an error if the user is not authenticated, does not have admin privileges, or if the subCategory ID is not provided.
 */

export const deleteSubCategory = async (subCategoryId: string) => {
  // Get current user
  const user = await currentUser();

  // Ensure user is authentification
  if (!user) throw new Error("Unauthorized");

  // Verify admin permission
  if (user.role !== "ADMIN")
    throw new Error("Unauthorized access: Admin privileges required for Entry");

  //   Ensure categoru Id is provided
  if (!subCategoryId) throw new Error("subCategory ID is required");

  // Delete subCategory from database
  const deletedsubCategory = await db.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });

  return deletedsubCategory;
};
