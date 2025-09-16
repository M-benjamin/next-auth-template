"use server";

import db from "@/db/prisma";
import { currentUser } from "@/lib/auth";
import { Category } from "@prisma/client";

/**
 * Upserts a category in the database.
 * PERMISSIONS LEVEL: only ADMIN can create
 *
 * This function ensures that the current user is authenticated and has admin privileges.
 * It checks if a category with the same name or URL already exists, excluding the category
 * with the same ID. If such a category exists, an error is thrown. Otherwise, it upserts
 * the category data in the database.
 *
 * @param category - The category data to be upserted.
 * @returns The upserted category details.
 * @throws Will throw an error if the user is not authenticated, lacks admin privileges,
 *         if category data is not provided, or if a category with the same name or URL
 *         already exists.
 */

export const upsertCategory = async (category: Category) => {
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

    // ensure category data is provided
    if (!category) throw new Error("Category data is required");

    // throw error if category with same name or URL already exists
    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          { OR: [{ name: category.name }, { url: category.url }] },
          { NOT: { id: category.id } },
        ],
      },
    });

    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name)
        errorMessage = "Category with this name already exists";
      else if (existingCategory.url === category.url)
        errorMessage = "Category with this URL already exists";

      throw new Error(errorMessage);
    }

    // UPPSERT Category in database
    const categoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: category,
      create: category,
    });

    // Return Category infos
    return categoryDetails;
  } catch (error) {
    // Log and return error
    console.log(error);
    throw error;
  }
};

/**
 * Gets all categories from the database.
 *
 * @returns An array of category objects.
 * @throws Will throw an error if any error occurs during database query.
 */
export const getAllCategories = async () => {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return categories;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Gets a category by its ID from the database.
 * ACCESS: PUBLIC
 *
 * @param {string} categoryId - The ID of the category to be retrieved.
 * @returns The category object with the given ID.
 * @throws Will throw an error if any error occurs during database query.
 */
export const getCategory = async (categoryId: string) => {
  try {
    if (!categoryId) throw new Error("Category ID is required");

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return category;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Deletes a category by its ID from the database.
 * ACCESS: ADMIN ONLY
 *
 * @param {string} categoryId - The ID of the category to be deleted.
 * @returns The deleted category object.
 * @throws Will throw an error if the user is not authenticated, does not have admin privileges, or if the category ID is not provided.
 */

export const deleteCategory = async (categoryId: string) => {
  // Get current user
  const user = await currentUser();

  // Ensure user is authentification
  if (!user) throw new Error("Unauthorized");

  // Verify admin permission
  if (user.role !== "ADMIN")
    throw new Error("Unauthorized access: Admin privileges required for Entry");

  //   Ensure categoru Id is provided
  if (!categoryId) throw new Error("Category ID is required");

  // Delete category from database
  const deletedCategory = await db.category.delete({
    where: {
      id: categoryId,
    },
  });

  return deletedCategory;
};
