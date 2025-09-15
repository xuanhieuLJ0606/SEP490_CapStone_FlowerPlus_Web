import React from "react";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Activity, 
  MapPin, 
  AlertCircle 
} from "lucide-react";

export function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'from-green-500 to-green-700'; // Xanh lá đậm (hoàn thành)
    case 'checked-out':
      return 'from-blue-700 to-blue-900'; // Xanh dương đậm (đã rời đi)
    case 'checked-in':
      return 'from-teal-400 to-teal-600'; // Xanh ngọc (đã đến)
    case 'pending':
      return 'from-yellow-400 to-yellow-600'; // Vàng (chờ xác nhận)
    case 'cancelled':
      return 'from-red-500 to-red-700'; // Đỏ (đã huỷ)
    case 're-examination':
      return 'from-orange-400 to-orange-600'; // Cam (tái khám)
    case 'confirmed':
      return 'from-purple-500 to-purple-700'; // Tím (đã xác nhận)
    default:
      return 'from-gray-400 to-gray-600'; // Mặc định xám
  }
}

export function translateBookingStatus(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận';
    case 'pending':
      return 'Chờ xác nhận';
    case 'cancelled':
      return 'Đã huỷ';
    case 'checked-in':
      return 'Đã xác nhận';
    case 'completed':
      return 'Hoàn thành';
    case 'checked-out':
      return 'Đã thanh toán';
    case 're-examination':
      return 'Tái khám';
    default:
      return status;
  }
}

export function getStatusIcon(status: string): React.ReactElement {
  switch (status) {
    case "completed":
    case "confirmed":
      return React.createElement(CheckCircle, { className: "h-4 w-4" });
    case "pending":
      return React.createElement(Clock, { className: "h-4 w-4" });
    case "cancelled":
      return React.createElement(XCircle, { className: "h-4 w-4" });
    case "re-examination":
      return React.createElement(Activity, { className: "h-4 w-4" });
    case "checked-in":
    case "checked-out":
      return React.createElement(MapPin, { className: "h-4 w-4" });
    default:
      return React.createElement(AlertCircle, { className: "h-4 w-4" });
  }
}
