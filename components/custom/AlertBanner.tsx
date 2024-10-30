import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, TriangleAlert } from "lucide-react";

interface AlertBannerProps {
  isCompleted: boolean;
  requiredFieldsCount: number;
  missingFieldsCount: number;
}

const AlertBanner = ({
  isCompleted,
  requiredFieldsCount,
  missingFieldsCount,
}: AlertBannerProps) => {
  return (
    <Alert
      className="my-4"
      variant={`${isCompleted ? "complete" : "destructive"}`}
    >
      {isCompleted ? (
        <Rocket className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      <AlertTitle className="text-xs font-medium">
        Còn {missingFieldsCount} trường còn thiếu / {requiredFieldsCount} trường yêu cầu
         
      </AlertTitle>
      <AlertDescription className="text-xs">
        {isCompleted
          ? "Tuyệt vời! Đã cập nhật đủ thông tin để xuất bản khóa học"
          : "Bạn cần cung cấp thêm thông tin để xuất bản khóa học này"}
      </AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
