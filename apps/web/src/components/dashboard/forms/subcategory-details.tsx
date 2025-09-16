"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// >
import * as z from "zod";

// > Schema
import { SubCategoryFormSchema } from "@/lib/schemas";
import { Category, SubCategory } from "@prisma/client";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/shared/image-upload";

import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { upsertSubCategory } from "@/queries/subCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubCategoryDetailsProps {
  data?: SubCategory;
  categories: Category[];
}

const SubCategoryDetails = ({ data, categories }: SubCategoryDetailsProps) => {
  // > Initialize toaster
  const { toast } = useToast();
  const router = useRouter(); // Hook for redirection

  // > Form hook managing form state and validation
  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name,
      url: data?.url,
      featured: data?.featured,
      image: data?.image ? [{ url: data?.image }] : [],
      categoryId: data?.categoryId,
    },
  });

  // > Loading form base on submission
  const isLoading = form.formState.isSubmitting;

  // > Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        url: data?.url,
        featured: data?.featured,
        image: [{ url: data?.image }],
      });
    }
  }, [data, form]);

  // > Handle form submission
  const handleSubmit = async (
    values: z.infer<typeof SubCategoryFormSchema>
  ) => {
    console.log(values, "VALUES INSIDE");
    try {
      const response = await upsertSubCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        url: values.url,
        featured: values.featured,
        image: values.image[0].url,
        categoryId: values?.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // > Display success message
      toast({
        title: data?.id
          ? "subCategory has been updated"
          : `Congratulation ${response?.name} is now created`,
      });

      // Redirect or refresh
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (error: any) {
      // > Display error message
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.toString(),
      });
    }
  };

  // > Render
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>subCategory Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} subCategory informations`
              : "Let's create a new subCategory. You can edit subCategory information later, form subCategory page or categories table"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="name"
                control={form.control}
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel> subCategory name</FormLabel>
                    <FormControl>
                      <Input placeholder="subCategory name" {...field} />
                    </FormControl>
                    <FormDescription>
                      this is a subCategory name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="url"
                control={form.control}
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel> subCategory name</FormLabel>
                    <FormControl>
                      <Input placeholder="/subCategory-url" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="categoryId"
                control={form.control}
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel> Category</FormLabel>

                    <Select
                      disabled={isLoading || categories.length === 0}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a category"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="featured"
                control={form.control}
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        {...field}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        this subCategory is featured
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                    ? "Save subCategory"
                    : "Create subCategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
