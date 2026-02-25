import { Subject, UserGoal, CalculatorResult } from "@/types";

/**
 * Tính CPA hiện tại từ danh sách môn học đã nhập.
 * CPA = Σ(điểm × tín chỉ) / Σ(tín chỉ)
 */
export function calculateCPA(subjects: Subject[]): number {
    const valid = subjects.filter((s) => s.credits > 0 && s.grade > 0);
    if (valid.length === 0) return 0;

    const totalWeightedGrade = valid.reduce((sum, s) => sum + s.grade * s.credits, 0);
    const totalCredits = valid.reduce((sum, s) => sum + s.credits, 0);

    if (totalCredits === 0) return 0;
    return totalWeightedGrade / totalCredits;
}

/**
 * Tính điểm cần đạt cho phần tín chỉ còn lại để đạt mục tiêu CPA.
 *
 * Formula:
 *   requiredScore = (targetCPA × totalProgramCredits - accumulatedPoints) / remainingCredits
 *
 *   Trong đó:
 *   - accumulatedPoints = currentCPA × earnedCredits
 */
export function calculateRequiredScore(
    currentCPA: number,
    earnedCredits: number,
    totalProgramCredits: number,
    targetCPA: number
): { requiredScore: number; isFeasible: boolean; isAlreadyAchieved: boolean } {
    const remainingCredits = totalProgramCredits - earnedCredits;

    // Đã học đủ toàn khóa
    if (remainingCredits <= 0) {
        return {
            requiredScore: 0,
            isFeasible: currentCPA >= targetCPA,
            isAlreadyAchieved: currentCPA >= targetCPA,
        };
    }

    // CPA hiện tại đã đạt mục tiêu
    if (currentCPA >= targetCPA) {
        return { requiredScore: 0, isFeasible: true, isAlreadyAchieved: true };
    }

    const accumulatedPoints = currentCPA * earnedCredits;
    const requiredScore =
        (targetCPA * totalProgramCredits - accumulatedPoints) / remainingCredits;

    return {
        requiredScore,
        isFeasible: requiredScore <= 4.0,
        isAlreadyAchieved: false,
    };
}

/**
 * Tính toán tổng hợp tất cả kết quả từ danh sách môn và mục tiêu.
 */
export function calculateResult(
    subjects: Subject[],
    goal: UserGoal
): CalculatorResult {
    const valid = subjects.filter((s) => s.credits > 0 && s.grade > 0);
    const earnedCredits = valid.reduce((sum, s) => sum + s.credits, 0);
    const currentCPA = calculateCPA(subjects);
    const remainingCredits = Math.max(0, goal.totalProgramCredits - earnedCredits);

    const { requiredScore, isFeasible, isAlreadyAchieved } = calculateRequiredScore(
        currentCPA,
        earnedCredits,
        goal.totalProgramCredits,
        goal.targetCPA
    );

    return {
        currentCPA,
        earnedCredits,
        remainingCredits,
        requiredScore,
        isFeasible,
        isAlreadyAchieved,
    };
}
