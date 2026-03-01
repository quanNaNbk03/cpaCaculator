"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    ReactNode,
} from "react";
import { Subject, UserGoal, CalculatorResult, ImprovementEntry, ImprovementResult } from "@/types";
import { calculateResult, calculateImprovementResult } from "@/lib/calculator";
import { generateId } from "@/lib/utils";

export type InputMode = "manual" | "quick";

interface CalculatorContextType {
    subjects: Subject[];
    goal: UserGoal;
    result: CalculatorResult;
    inputMode: InputMode;
    setInputMode: (mode: InputMode) => void;
    improvements: ImprovementEntry[];
    improvementResult: ImprovementResult;
    addImprovement: () => void;
    updateImprovement: (id: string, updates: Partial<Omit<ImprovementEntry, "id">>) => void;
    removeImprovement: (id: string) => void;
    toggleImprovement: (id: string) => void;
    addSubject: () => void;
    updateSubject: (id: string, updates: Partial<Omit<Subject, "id">>) => void;
    removeSubject: (id: string) => void;
    setGoal: (updates: Partial<UserGoal>) => void;
    clearSubjects: () => void;
}

const DEFAULT_GOAL: UserGoal = {
    totalProgramCredits: 150,
    targetCPA: 3.2,
    quickInput: null,
};

const DEFAULT_RESULT: CalculatorResult = {
    currentCPA: 0,
    earnedCredits: 0,
    remainingCredits: 150,
    requiredScore: 0,
    isFeasible: true,
    isAlreadyAchieved: false,
};

const DEFAULT_IMPROVEMENT_RESULT: ImprovementResult = {
    deltaPoints: 0,
    improvedCPA: 0,
    selectedCount: 0,
};

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [goal, setGoalState] = useState<UserGoal>(DEFAULT_GOAL);
    const [result, setResult] = useState<CalculatorResult>(DEFAULT_RESULT);
    const [inputMode, setInputModeState] = useState<InputMode>("manual");
    const [improvements, setImprovements] = useState<ImprovementEntry[]>([]);

    // ────────────────────────────────────────────────
    // Tính kết quả chính
    // ────────────────────────────────────────────────
    useEffect(() => {
        if (inputMode === "quick") {
            if (!goal.quickInput || goal.quickInput.credits <= 0) {
                setResult({ ...DEFAULT_RESULT, remainingCredits: goal.totalProgramCredits });
                return;
            }
        } else {
            if (subjects.length === 0) {
                setResult({ ...DEFAULT_RESULT, remainingCredits: goal.totalProgramCredits });
                return;
            }
        }
        setResult(calculateResult(subjects, goal));
    }, [subjects, goal, inputMode]);

    // ────────────────────────────────────────────────
    // Auto-sync improvements từ subjects (Manual Mode)
    // Chỉ thêm mới các môn ≤ 2.5 chưa có trong list
    // Giữ lại user-added entries (isManual) và trạng thái selected
    // ────────────────────────────────────────────────
    useEffect(() => {
        if (inputMode !== "manual") return;

        const lowGradeSubjects = subjects.filter(
            (s) => s.credits > 0 && s.grade > 0 && s.grade <= 2.5
        );

        setImprovements((prev) => {
            // Lọc bỏ các auto-entries cũ không còn trong subjects/không còn ≤ 2.5
            const manualEntries = prev.filter((e) => e.isManual);
            const autoEntries: ImprovementEntry[] = lowGradeSubjects.map((s) => {
                const existing = prev.find((e) => !e.isManual && e.id === s.id);
                return {
                    id: s.id,
                    name: s.name || `Môn ${s.id.slice(0, 4)}`,
                    credits: s.credits,
                    currentGrade: s.grade,
                    targetGrade: existing?.targetGrade ?? 4.0,
                    selected: existing?.selected ?? false,
                    isManual: false,
                };
            });
            return [...autoEntries, ...manualEntries];
        });
    }, [subjects, inputMode]);

    // ────────────────────────────────────────────────
    // Reset improvements khi chuyển mode
    // ────────────────────────────────────────────────
    const setInputMode = useCallback((mode: InputMode) => {
        setInputModeState(mode);
        setImprovements([]);
        if (mode === "manual") {
            setGoalState((prev) => ({ ...prev, quickInput: null }));
        }
    }, []);

    // ────────────────────────────────────────────────
    // Computed: improvementResult
    // ────────────────────────────────────────────────
    const improvementResult = useMemo<ImprovementResult>(() => {
        if (result.earnedCredits <= 0) return DEFAULT_IMPROVEMENT_RESULT;
        return calculateImprovementResult(result.currentCPA, result.earnedCredits, improvements);
    }, [result.currentCPA, result.earnedCredits, improvements]);

    // ────────────────────────────────────────────────
    // Improvement actions
    // ────────────────────────────────────────────────
    const addImprovement = useCallback(() => {
        setImprovements((prev) => [
            ...prev,
            {
                id: generateId(),
                name: "",
                credits: 3,
                currentGrade: 2.0,
                targetGrade: 4.0,
                selected: true,
                isManual: true,
            },
        ]);
    }, []);

    const updateImprovement = useCallback(
        (id: string, updates: Partial<Omit<ImprovementEntry, "id">>) => {
            setImprovements((prev) =>
                prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
            );
        },
        []
    );

    const removeImprovement = useCallback((id: string) => {
        setImprovements((prev) => prev.filter((e) => e.id !== id));
    }, []);

    const toggleImprovement = useCallback((id: string) => {
        setImprovements((prev) =>
            prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e))
        );
    }, []);

    // ────────────────────────────────────────────────
    // Subject actions
    // ────────────────────────────────────────────────
    const addSubject = useCallback(() => {
        setSubjects((prev) => [
            ...prev,
            { id: generateId(), name: "", credits: 3, grade: 3.5 },
        ]);
    }, []);

    const updateSubject = useCallback(
        (id: string, updates: Partial<Omit<Subject, "id">>) => {
            setSubjects((prev) =>
                prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
            );
        },
        []
    );

    const removeSubject = useCallback((id: string) => {
        setSubjects((prev) => prev.filter((s) => s.id !== id));
    }, []);

    const setGoal = useCallback((updates: Partial<UserGoal>) => {
        setGoalState((prev) => ({ ...prev, ...updates }));
    }, []);

    const clearSubjects = useCallback(() => {
        setSubjects([]);
    }, []);

    return (
        <CalculatorContext.Provider
            value={{
                subjects,
                goal,
                result,
                inputMode,
                setInputMode,
                improvements,
                improvementResult,
                addImprovement,
                updateImprovement,
                removeImprovement,
                toggleImprovement,
                addSubject,
                updateSubject,
                removeSubject,
                setGoal,
                clearSubjects,
            }}
        >
            {children}
        </CalculatorContext.Provider>
    );
}

export function useCalculator(): CalculatorContextType {
    const ctx = useContext(CalculatorContext);
    if (!ctx) {
        throw new Error("useCalculator must be used within <CalculatorProvider>");
    }
    return ctx;
}
