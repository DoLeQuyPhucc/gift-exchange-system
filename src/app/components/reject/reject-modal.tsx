import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const REJECTION_REASONS = [
  "Hình ảnh không rõ ràng hoặc không phù hợp",
  "Thông tin sản phẩm không đầy đủ",
  "Sản phẩm không được phép trao đổi trên nền tảng",
  "Giá trị sản phẩm không phù hợp",
  "Vi phạm điều khoản sử dụng",
  "Khác",
];

export const RejectDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
      onClose();
      setSelectedReason("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chọn lý do từ chối</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {REJECTION_REASONS.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <RadioGroupItem value={reason} id={reason} />
                <Label htmlFor={reason}>{reason}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <div className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedReason}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Xác nhận từ chối
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
