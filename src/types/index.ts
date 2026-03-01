export interface Subject {
    id: string;
    name: string;
    credits: number;
    grade: number; // thang 4: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4
}

/** Dữ liệu nhập nhanh: thay thế danh sách môn học */
export interface QuickInput {
    cpa: number;     // CPA hiện tại
    credits: number; // Số tín chỉ đã tích lũy
}

export interface UserGoal {
    totalProgramCredits: number;  // Tổng tín chỉ toàn khóa
    targetCPA: number;            // CPA mục tiêu
    quickInput: QuickInput | null; // Dữ liệu nhập nhanh (null = dùng danh sách môn)
}

export interface CalculatorResult {
    currentCPA: number;
    earnedCredits: number;       // Tổng tín chỉ đã học
    remainingCredits: number;    // Tín chỉ còn lại
    requiredScore: number;       // Điểm cần đạt cho phần còn lại
    isFeasible: boolean;         // false nếu requiredScore > 4.0
    isAlreadyAchieved: boolean;  // true nếu CPA hiện tại đã đạt mục tiêu
}
