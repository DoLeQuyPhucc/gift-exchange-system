import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Category } from "@/app/types/types";
import { CategoryAttribute } from "@/app/types/types";
import { AttributeValue } from "@/app/types/types";
export interface FormData {
  [key: string]: any;
  name: string;
  description: string;
  category: string;
  condition: string;
  image: string;
  quantity: string;
  available: boolean;
  attributes: Record<string, any>;
  province: string;
  district: string;
  ward: string;
  specificAddress: string;
  address: string;
}

export const useCreatePost = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showGuideTitle, setShowGuideTitle] = useState(false);
  const [showGuideContent, setShowGuideContent] = useState(false);
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    condition: "new",
    image: "",
    quantity: "1",
    available: true,
    attributes: {},
    province: "",
    district: "",
    ward: "",
    specificAddress: "",
    address: "",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://67302fa666e42ceaf15f9caf.mockapi.io/items"
        );
        const data = response.data;
        setCategories(data[0].data);
        setCategoryAttributes(data[1].data);
        setAttributeValues(data[3].data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải danh mục. Vui lòng thử lại sau");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find(
        (cat) => cat.name === formData.category
      );
      if (selectedCategory) {
        const attributes = categoryAttributes.filter(
          (attr) => attr.category_id === selectedCategory.id
        );
        setCurrentCategoryAttributes(attributes);
      }
    }
  }, [formData.category, categories, categoryAttributes]);

  // Fetch locations data
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("Không thể tải danh sách tỉnh thành");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (formData.province) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/p/${formData.province}?depth=2`
          );
          setDistricts(response.data.districts);
        } catch (error) {
          console.error("Error fetching districts:", error);
          toast.error("Không thể tải danh sách quận huyện");
        }
      };
      fetchDistricts();
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.district) {
      const fetchWards = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/d/${formData.district}?depth=2`
          );
          setWards(response.data.wards);
        } catch (error) {
          console.error("Error fetching wards:", error);
          toast.error("Không thể tải danh sách phường xã");
        }
      };
      fetchWards();
    }
  }, [formData.district]);

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

  const handleSaveLocation = () => {
    const selectedProvince =
      provinces.find((p) => p.code === formData.province)?.name || "";
    const selectedDistrict =
      districts.find((d) => d.code === formData.district)?.name || "";
    const selectedWard =
      wards.find((w) => w.code === formData.ward)?.name || "";

    setFormData((prev) => ({
      ...prev,
      address: `${selectedWard}, ${selectedDistrict}, ${selectedProvince}`,
    }));
    setIsDialogOpen(false);
  };

  const handleFormChange = (name: string, value: any) => {
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
    setIsLoading(true);

    try {
      await axios.post("https://67302fa666e42ceaf15f9caf.mockapi.io/items", {
        ...formData,
        owner_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      router.push("/");
      toast.success("Đăng bài mới thành công");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Đăng bài thất bại. Vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
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
    districts,
    wards,
    isDialogOpen,
    setShowGuideTitle,
    setIsLoading,
    setFormData,
    setShowGuideContent,
    setIsDialogOpen,
    handleImageChange,
    handleSaveLocation,
    handleFormChange,
    handleSubmit,
  };
};
