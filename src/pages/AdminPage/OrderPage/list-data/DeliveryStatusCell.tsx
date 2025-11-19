// DeliveryStatusCell.tsx
import React, { useMemo, useState } from 'react';

const deliveryStepMap: Record<string, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  PREPARING: 'Đang chuẩn bị',
  DELIVERING: 'Đang giao',
  DELIVERED: 'Giao thành công',
  DELIVERY_FAILED: 'Giao thất bại'
};

// Icon cho từng trạng thái
const getStatusIcon = (step: string) => {
  switch (step) {
    case 'PENDING_CONFIRMATION':
      return (
        <svg
          className="h-5 w-5 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case 'PREPARING':
      return (
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      );
    case 'DELIVERING':
      return (
        <svg
          className="h-5 w-5 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      );
    case 'DELIVERED':
      return (
        <svg
          className="h-5 w-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case 'DELIVERY_FAILED':
      return (
        <svg
          className="h-5 w-5 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
};

interface DeliveryStatus {
  id?: number | string;
  step: string;
  eventAt: string;
  description?: string;
  note?: string;
  imageUrl?: string;
}

interface DeliveryStatusCellProps {
  deliveryStatuses: DeliveryStatus[];
}

export const DeliveryStatusCell: React.FC<DeliveryStatusCellProps> = ({
  deliveryStatuses
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<any>(null);

  const sortedStatuses = useMemo(() => {
    return [...deliveryStatuses].sort(
      (a, b) => new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime()
    );
  }, [deliveryStatuses]);

  const currentStep = useMemo(() => {
    if (!sortedStatuses.length) return '';
    return sortedStatuses[sortedStatuses.length - 1].step;
  }, [sortedStatuses]);

  if (!deliveryStatuses || deliveryStatuses.length === 0) {
    return <span className="text-gray-400">Chưa có</span>;
  }

  const activeStatus = sortedStatuses[activeIndex];

  return (
    <>
      <div className="flex flex-col items-start justify-start">
        <div className="flex items-center gap-2">
          {getStatusIcon(currentStep)}
          <span>
            {deliveryStepMap[currentStep] || currentStep || (
              <span className="text-gray-400">Chưa có</span>
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-blue-600 underline hover:text-blue-800"
        >
          Xem tất cả
        </button>
      </div>

      {/* Modal danh sách trạng thái */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-50 h-[70vh] w-full max-w-3xl rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-lg font-semibold">
                Lịch sử trạng thái giao hàng
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>

            <div className="flex h-[calc(70vh-3rem)]">
              {/* Cột trái */}
              <div className="w-1/3 border-r p-3">
                <div className="flex h-full flex-col gap-2 overflow-y-auto">
                  {sortedStatuses.map((status, index) => {
                    const label = deliveryStepMap[status.step] || status.step;
                    return (
                      <button
                        key={status.id ?? index}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`w-full rounded border px-3 py-2 text-left text-sm transition ${
                          index === activeIndex
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-medium">
                          {getStatusIcon(status.step)}
                          {label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(status.eventAt).toLocaleString('vi-VN')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cột phải */}
              <div className="w-2/3 overflow-y-auto p-4">
                {activeStatus ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Trạng thái</div>
                      <div className="flex items-center gap-2 text-base font-semibold">
                        {getStatusIcon(activeStatus.step)}
                        {deliveryStepMap[activeStatus.step] ||
                          activeStatus.step}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Thời gian</div>
                      <div>
                        {new Date(activeStatus.eventAt).toLocaleString('vi-VN')}
                      </div>
                    </div>

                    {activeStatus.description && (
                      <div>
                        <div className="text-sm text-gray-500">Mô tả</div>
                        <p className="whitespace-pre-line text-sm">
                          {activeStatus.description}
                        </p>
                      </div>
                    )}

                    {activeStatus.note && (
                      <div>
                        <div className="text-sm text-gray-500">Ghi chú</div>
                        <p className="whitespace-pre-line text-sm">
                          {activeStatus.note}
                        </p>
                      </div>
                    )}

                    {/* PHẦN HÌNH ẢNH + ZOOM */}
                    {activeStatus.imageUrl && (
                      <div>
                        <div className="text-sm text-gray-500">Hình ảnh</div>

                        <img
                          onClick={() => setZoomImage(activeStatus.imageUrl)}
                          src={activeStatus.imageUrl}
                          alt="Hình ảnh"
                          className="max-w-xs cursor-zoom-in rounded border object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Chọn một trạng thái ở bên trái để xem chi tiết.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ZOOM ẢNH FULLSCREEN */}
      {zoomImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
          <img
            src={zoomImage}
            alt="Zoom"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
          />
          <button
            onClick={() => setZoomImage(null)}
            className="absolute right-5 top-5 rounded bg-white/80 px-3 py-1 text-sm shadow hover:bg-white"
          >
            Đóng
          </button>
        </div>
      )}
    </>
  );
};
