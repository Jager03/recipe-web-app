import { useEffect, useState } from "react";
import { useApiClient } from "../../api/useApiClient";
import { BaseLayout } from "../../layout/BaseLayout";
import { Category, PostCategoryRequest, PutCategoryRequest } from "../../api";
import { CategoryTable } from "./CategoryTable";
import { Button, useDisclosure } from "@chakra-ui/react";
import { ModalCategoryUpdate } from "./components/ModalCategoryUpdate";

export const CategoryPage = () => {
  const client = useApiClient();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [category, setCategory] = useState<Category[]>([]);
  const onLoadData = async () => {
    const res = await client.getCategory();
    setCategory(res.data);
  };

  useEffect(() => {
    onLoadData();
  }, []);

  const onClickDeleteCategory = async (category: Category) => {
    await client.deleteCategory(category.id);
    await onLoadData();
  };

  const [categoryToBeUpdated, setCategoryToBeUpdated] =
    useState<Category | null>(null);

  const onClickUpdateCategory = (category: Category) => {
    setCategoryToBeUpdated(category);
    onOpen();
  };

  const onUpdateCategory = async (category: PutCategoryRequest) => {
    const res = await client.putCategory(categoryToBeUpdated?.id, category);
    console.log(res);
    onClose();
    await onLoadData();
    setCategoryToBeUpdated(null);
  };

  const onCreateCategory = async (category: PostCategoryRequest) => {
    await client.postCategory(category);
    onClose();
    await onLoadData();
  };

  const data = category;
  return (
    <BaseLayout>
      <Button
        onClick={() => {
          onOpen();
        }}
      >
        Create new category
      </Button>
      <ModalCategoryUpdate
        isOpen={isOpen}
        onClose={() => {
          setCategoryToBeUpdated(null);
          onClose();
        }}
        initialValues={categoryToBeUpdated}
        onSubmit={(updatedCategory) => {
          if (categoryToBeUpdated) {
            onUpdateCategory(updatedCategory);
          } else {
            onCreateCategory(updatedCategory);
          }
        }}
      />
      <CategoryTable
        data={data}
        onClickDeleteCategory={onClickDeleteCategory}
        onClickUpdateCategory={onClickUpdateCategory}
      />
    </BaseLayout>
  );
};
