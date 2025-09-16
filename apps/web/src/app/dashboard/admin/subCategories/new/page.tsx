import SubCategoryDetails from "@/components/dashboard/forms/subcategory-details";
import { getAllCategories } from "@/queries/category";

const AdminSubCategoriesNewPage = async () => {
  // > Get all categories
  const categories = await getAllCategories();

  return (
    <div className="w-full h-full">
      <SubCategoryDetails categories={categories} />
    </div>
  );
};

export default AdminSubCategoriesNewPage;
