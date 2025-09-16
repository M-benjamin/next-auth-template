import DataTable from "@/components/ui/data-table";

import { columns } from "./column";
import { Plus } from "lucide-react";
import { getAllSubCategories } from "@/queries/subCategory";
import SubCategoryDetails from "@/components/dashboard/forms/subcategory-details";
import { getAllCategories } from "@/queries/category";

const SubCategoriesDashboardPage = async () => {
  // > Get all categories
  const subCategories = await getAllSubCategories();
  const categories = await getAllCategories();

  if (!subCategories) return null; // if not found

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create sub category
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      newTabLink="/dashboard/admin/subCategories/new"
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subcategory name..."
      columns={columns}
    />
  );
};

export default SubCategoriesDashboardPage;
