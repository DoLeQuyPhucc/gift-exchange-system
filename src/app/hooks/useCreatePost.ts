import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Category,
  CategoryAttribute,
  AttributeValue,
  FormData,
} from "@/app/types/types";
import axiosInstance from "../api/axiosInstance";

export const useCreatePost = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showGuideTitle, setShowGuideTitle] = useState(false);
  const [showGuideContent, setShowGuideContent] = useState(false);
  const [hasCategorySelected, setHasCategorySelected] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<
    CategoryAttribute[]
  >([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [currentCategoryAttributes, setCurrentCategoryAttributes] = useState<
    CategoryAttribute[]
  >([]);
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>(
    []
  );
  const [wards, setWards] = useState<{ code: string; name: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    categoryId: "",
    condition: "Used",
    image: "",
    quantity: 1,
    available: true,
    attributes: {},
    province: "",
    district: "",
    ward: "",
    specificAddress: "",
    address: "",
    itemAttribute: [],
    images: [],
  });

  console.log("formData", formData);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("category");
        if (response.data.isSuccess) {
          const data = response.data.data;
          setCategories(data);
          // setCategoryAttributes(data.categoryAttributes);
          // setAttributeValues(data.attributeValues);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải danh mục. Vui lòng thử lại sau");
      }
    };
    fetchData();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (name: string, value: any) => {
    if (name === "categoryId") {
      setHasCategorySelected(!!value);
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transformedData = {
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      quantity: formData.quantity,
      condition: formData.condition,
      available: formData.available,
      itemAttribute: Object.keys(formData.attributes).map((attributeId) => ({
        attributeId,
        value: formData.attributes[attributeId],
      })),
      images: formData.images,
    };

    try {
      const response = await axiosInstance.post("/items", transformedData);
      if (response.data.isSuccess) {
        // Handle success
        toast.success("Đăng bài thành công");
        setFormData({
          name: "",
          description: "",
          category: "",
          categoryId: "",
          condition: "Used",
          image: "",
          quantity: 1,
          available: true,
          attributes: {},
          province: "",
          district: "",
          ward: "",
          specificAddress: "",
          address: "",
          itemAttribute: [],
          images: [],
        });
        router.push("/products");
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return {
    formData,
    isLoading,
    showGuideTitle,
    showGuideContent,
    categories,
    currentCategoryAttributes,
    attributeValues,
    provinces,
    hasCategorySelected,
    districts,
    wards,
    images,
    isDialogOpen,
    setShowGuideTitle,
    setImages,
    setIsLoading,
    setFormData,
    setShowGuideContent,
    setIsDialogOpen,
    handleImageChange,
    handleFormChange,
    handleSubmit,
  };
};
