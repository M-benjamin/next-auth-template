import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { columns } from "./column";
import { Plus } from "lucide-react";

const CategoriesDashboardPage = async () => {
  // > Get all categories
  const categories = await getAllCategories();

  console.log(categories);

  if (!categories) return null; // if not found

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
      modalChildren={<CategoryDetails />}
      newTabLink="/dashboard/admin/categories/new"
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name..."
      columns={columns}
    />
  );
};

export default CategoriesDashboardPage;
