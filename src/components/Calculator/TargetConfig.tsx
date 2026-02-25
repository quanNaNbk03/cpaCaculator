"use client";

import React from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { TARGET_OPTIONS } from "@/constants/grades";
import { cn } from "@/lib/utils";

export default function TargetConfig() {
    const { goal, setGoal } = useCalculator();

    return (
        <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted-foreground)" }}>
                ⚙️ Cấu hình mục tiêu
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tổng tín chỉ toàn khóa */}
                <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
                        Tổng tín chỉ toàn khóa
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={300}
                        value={goal.totalProgramCredits}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val > 0) setGoal({ totalProgramCredits: val });
                        }}
                        className={cn(
                            "w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-all outline-none",
                            "focus:ring-2"
                        )}
                        style={{
                            background: "var(--input)",
                            border: "1px solid var(--border)",
                            color: "var(--foreground)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                </div>

                {/* CPA mục tiêu — Quick Select */}
                <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
                        Mục tiêu tốt nghiệp
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {TARGET_OPTIONS.map((opt) => {
                            const isActive = goal.targetCPA === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => setGoal({ targetCPA: opt.value })}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                        isActive
                                            ? "text-white scale-105"
                                            : "hover:opacity-80"
                                    )}
                                    style={{
                                        background: isActive ? "var(--primary)" : "var(--secondary)",
                                        color: isActive ? "white" : "var(--secondary-foreground)",
                                        border: isActive ? "1px solid var(--primary)" : "1px solid var(--border)",
                                    }}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Manual CPA input */}
            <div className="mt-4">
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
                    Hoặc nhập CPA mục tiêu thủ công
                </label>
                <input
                    type="number"
                    min={1}
                    max={4}
                    step={0.01}
                    value={goal.targetCPA}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 1 && val <= 4) setGoal({ targetCPA: val });
                    }}
                    className="w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-all outline-none"
                    style={{
                        background: "var(--input)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
            </div>
        </div>
    );
}
