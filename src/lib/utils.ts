import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CPA_THRESHOLDS } from "@/constants/grades";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Hiển thị CPA với 2 chữ số thập phân.
 * Quy tắc làm tròn: chỉ xét chữ số thập phân thứ 3.
 *   - Nếu chữ số thứ 3 >= 5 → làm tròn lên chữ số thứ 2.
 *   - Nếu chữ số thứ 3 <  5 → bỏ đi (truncate).
 * Ví dụ: 2.495 → "2.50", 2.493 → "2.49", 2.4953 → "2.50"
 */
export function formatGrade(value: number): string {
    if (!isFinite(value) || isNaN(value)) return "—";
    // Lấy chữ số thập phân thứ 3 (bỏ qua thứ 4 trở đi)
    const thirdDecimalDigit = Math.floor(Math.abs(value) * 1000) % 10;
    // Cắt về 2 chữ số thập phân (không làm tròn)
    const truncated = Math.trunc(value * 100) / 100;
    // Nếu chữ số thứ 3 >= 5 thì cộng thêm 0.01
    if (thirdDecimalDigit >= 5) {
        return (truncated + 0.01).toFixed(2);
    }
    return truncated.toFixed(2);
}

/**
 * Trả về nhãn xếp loại dựa trên CPA.
 */
export function getGradeLabel(cpa: number): {
    label: string;
    color: string;
} {
    if (cpa >= CPA_THRESHOLDS.XUAT_SAC.value)
        return { label: CPA_THRESHOLDS.XUAT_SAC.label, color: CPA_THRESHOLDS.XUAT_SAC.color };
    if (cpa >= CPA_THRESHOLDS.GIOI.value)
        return { label: CPA_THRESHOLDS.GIOI.label, color: CPA_THRESHOLDS.GIOI.color };
    if (cpa >= CPA_THRESHOLDS.KHA.value)
        return { label: CPA_THRESHOLDS.KHA.label, color: CPA_THRESHOLDS.KHA.color };
    if (cpa >= CPA_THRESHOLDS.TRUNG_BINH.value)
        return { label: CPA_THRESHOLDS.TRUNG_BINH.label, color: CPA_THRESHOLDS.TRUNG_BINH.color };
    return { label: "Yếu", color: "#ef4444" };
}

/**
 * Tính phần trăm progress (0-100).
 */
export function calcProgressPercent(earned: number, total: number): number {
    if (total <= 0) return 0;
    return Math.min(100, Math.round((earned / total) * 100));
}

/**
 * Generate unique id.
 */
export function generateId(): string {
    return Math.random().toString(36).slice(2, 10);
}
