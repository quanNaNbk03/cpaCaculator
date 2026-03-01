import { Subject, UserGoal, CalculatorResult, ImprovementEntry, ImprovementResult } from "@/types";

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
 * Nếu goal.quickInput được cung cấp, dùng dữ liệu đó thay vì tính từ subjects.
 */
export function calculateResult(
    subjects: Subject[],
    goal: UserGoal
): CalculatorResult {
    let earnedCredits: number;
    let currentCPA: number;

    if (goal.quickInput && goal.quickInput.credits > 0) {
        // --- Quick Mode: dùng CPA + tín chỉ nhập trực tiếp ---
        earnedCredits = goal.quickInput.credits;
        currentCPA = goal.quickInput.cpa;
    } else {
        // --- Manual Mode: tính từ danh sách môn học ---
        const valid = subjects.filter((s) => s.credits > 0 && s.grade > 0);
        earnedCredits = valid.reduce((sum, s) => sum + s.credits, 0);
        currentCPA = calculateCPA(subjects);
    }

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

/**
 * Tính CPA dự kiến sau khi học cải thiện các môn đã chọn.
 *
 * deltaPoints = Σ credits × (targetGrade - currentGrade)  — chỉ entry.selected
 * improvedCPA = (currentCPA × earnedCredits + deltaPoints) / earnedCredits
 */
export function calculateImprovementResult(
    currentCPA: number,
    earnedCredits: number,
    entries: ImprovementEntry[]
): ImprovementResult {
    if (earnedCredits <= 0) {
        return { deltaPoints: 0, improvedCPA: currentCPA, selectedCount: 0 };
    }

    const selected = entries.filter((e) => e.selected && e.targetGrade > e.currentGrade);
    const deltaPoints = selected.reduce(
        (sum, e) => sum + e.credits * (e.targetGrade - e.currentGrade),
        0
    );

    const currentAccumulated = currentCPA * earnedCredits;
    const improvedCPA = Math.min(4.0, (currentAccumulated + deltaPoints) / earnedCredits);

    return {
        deltaPoints,
        improvedCPA,
        selectedCount: selected.length,
    };
}
