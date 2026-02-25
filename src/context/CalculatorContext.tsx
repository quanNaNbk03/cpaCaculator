"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { Subject, UserGoal, CalculatorResult } from "@/types";
import { calculateResult } from "@/lib/calculator";
import { generateId } from "@/lib/utils";

interface CalculatorContextType {
    subjects: Subject[];
    goal: UserGoal;
    result: CalculatorResult;
    addSubject: () => void;
    updateSubject: (id: string, updates: Partial<Omit<Subject, "id">>) => void;
    removeSubject: (id: string) => void;
    setGoal: (updates: Partial<UserGoal>) => void;
    clearSubjects: () => void;
}

const DEFAULT_GOAL: UserGoal = {
    totalProgramCredits: 150,
    targetCPA: 3.2,
};

const DEFAULT_RESULT: CalculatorResult = {
    currentCPA: 0,
    earnedCredits: 0,
    remainingCredits: 150,
    requiredScore: 0,
    isFeasible: true,
    isAlreadyAchieved: false,
};

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [goal, setGoalState] = useState<UserGoal>(DEFAULT_GOAL);
    const [result, setResult] = useState<CalculatorResult>(DEFAULT_RESULT);

    // Tính lại result mỗi khi subjects hoặc goal thay đổi
    useEffect(() => {
        if (subjects.length === 0) {
            setResult({
                ...DEFAULT_RESULT,
                remainingCredits: goal.totalProgramCredits,
            });
            return;
        }
        setResult(calculateResult(subjects, goal));
    }, [subjects, goal]);

    const addSubject = useCallback(() => {
        const newSubject: Subject = {
            id: generateId(),
            name: "",
            credits: 3,
            grade: 3.5,
        };
        setSubjects((prev) => [...prev, newSubject]);
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
