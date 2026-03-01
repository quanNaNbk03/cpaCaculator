// Thang điểm 4 được phép nhập (0 = F, không đạt)
export const VALID_GRADES = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4] as const;
export type ValidGrade = (typeof VALID_GRADES)[number];

// Các mốc CPA tiêu chuẩn
export const CPA_THRESHOLDS = {
    TRUNG_BINH: { label: "Trung bình", value: 2.0, color: "#f59e0b" },
    KHA: { label: "Khá", value: 2.5, color: "#3b82f6" },
    GIOI: { label: "Giỏi", value: 3.2, color: "#8b5cf6" },
    XUAT_SAC: { label: "Xuất sắc", value: 3.6, color: "#4ade80" },
} as const;

export type ThresholdKey = keyof typeof CPA_THRESHOLDS;

// Options cho dropdown target
export const TARGET_OPTIONS = [
    { label: "Trung bình (≥ 2.0)", value: 2.0 },
    { label: "Khá (≥ 2.5)", value: 2.5 },
    { label: "Giỏi (≥ 3.2)", value: 3.2 },
    { label: "Xuất sắc (≥ 3.6)", value: 3.6 },
] as const;

// Options cho số tín chỉ môn học
export const CREDIT_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
