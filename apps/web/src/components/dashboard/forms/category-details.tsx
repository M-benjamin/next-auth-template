"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// >
import * as z from "zod";

// > Schema
import { CategoryFormSchema } from "@/lib/schemas";
import { Category } from "@prisma/client";
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
import { upsertCategory } from "@/queries/category";
import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails = ({ data }: CategoryDetailsProps) => {
  // > Initialize toaster
  const { toast } = useToast();
  const router = useRouter(); // Hook for redirection

  // > Form hook managing form state and validation
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name,
      url: data?.url,
      featured: data?.featured,
      image: data?.image ? [{ url: data?.image }] : [],
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
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    // console.log(values);
    try {
      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        url: values.url,
        featured: values.featured,
        image: values.image[0].url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // > Display success message
      toast({
        title: data?.id
          ? "Category has been updated"
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
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} category informations`
              : "Let's create a new category. You can edit category information later, form category page or categories table"}
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
                    <FormLabel> Category name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormDescription>this is a category name</FormDescription>
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
                    <FormLabel> Category name</FormLabel>
                    <FormControl>
                      <Input placeholder="/category-url" {...field} />
                    </FormControl>

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
                        this category is featured
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
                    ? "Save category"
                    : "Create Category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
