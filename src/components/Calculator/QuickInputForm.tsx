"use client";

import React, { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { cn } from "@/lib/utils";
import { Zap, Info } from "lucide-react";

export default function QuickInputForm() {
    const { goal, setGoal } = useCalculator();

    const qi = goal.quickInput;
    const [localCPA, setLocalCPA] = useState<string>(qi ? String(qi.cpa) : "");
    const [localCredits, setLocalCredits] = useState<string>(
        qi ? String(qi.credits) : ""
    );

    const inputStyle = {
        background: "var(--input)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
    };

    const handleCPAChange = (raw: string) => {
        setLocalCPA(raw);
        const val = parseFloat(raw);
        if (!isNaN(val) && val >= 0 && val <= 4) {
            const credits = parseFloat(localCredits);
            setGoal({
                quickInput: {
                    cpa: val,
                    credits: !isNaN(credits) && credits > 0 ? credits : 0,
                },
            });
        }
    };

    const handleCreditsChange = (raw: string) => {
        setLocalCredits(raw);
        const val = parseInt(raw);
        if (!isNaN(val) && val > 0) {
            const cpa = parseFloat(localCPA);
            setGoal({
                quickInput: {
                    cpa: !isNaN(cpa) && cpa >= 0 && cpa <= 4 ? cpa : 0,
                    credits: val,
                },
            });
        }
    };

    const cpaVal = parseFloat(localCPA);
    const creditsVal = parseInt(localCredits);
    const isCPAValid = !isNaN(cpaVal) && cpaVal >= 0 && cpaVal <= 4;
    const isCreditsValid = !isNaN(creditsVal) && creditsVal > 0;

    return (
        <div className="flex flex-col gap-5">
            {/* Info banner */}
            <div
                className="flex items-start gap-3 rounded-xl p-4"
                style={{
                    background: "rgba(108,99,255,0.08)",
                    border: "1px solid rgba(108,99,255,0.2)",
                }}
            >
                <Info size={16} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    Nhập{" "}
                    <span style={{ color: "var(--foreground)", fontWeight: 600 }}>CPA hiện tại</span>{" "}
                    và{" "}
                    <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
                        số tín chỉ đã tích lũy
                    </span>{" "}
                    để tính nhanh — không cần nhập từng môn học.
                </p>
            </div>

            {/* Two inputs side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CPA hiện tại */}
                <div>
                    <label
                        className="block text-xs font-medium mb-2"
                        style={{ color: "var(--muted-foreground)" }}
                    >
                        CPA hiện tại
                        <span className="ml-1 opacity-60">(thang 4.0)</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={4}
                        step={0.001}
                        placeholder="Ví dụ: 3.15"
                        value={localCPA}
                        onChange={(e) => handleCPAChange(e.target.value)}
                        className={cn(
                            "w-full rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none",
                            !isCPAValid && localCPA !== "" && "ring-1 ring-red-500"
                        )}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                    {!isCPAValid && localCPA !== "" && (
                        <p className="text-xs mt-1.5" style={{ color: "var(--destructive)" }}>
                            CPA phải từ 0.0 đến 4.0
                        </p>
                    )}
                </div>

                {/* Tín chỉ đã tích lũy */}
                <div>
                    <label
                        className="block text-xs font-medium mb-2"
                        style={{ color: "var(--muted-foreground)" }}
                    >
                        Số tín chỉ đã tích lũy
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={500}
                        step={1}
                        placeholder="Ví dụ: 85"
                        value={localCredits}
                        onChange={(e) => handleCreditsChange(e.target.value)}
                        className={cn(
                            "w-full rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none",
                            !isCreditsValid && localCredits !== "" && "ring-1 ring-red-500"
                        )}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                    {!isCreditsValid && localCredits !== "" && (
                        <p className="text-xs mt-1.5" style={{ color: "var(--destructive)" }}>
                            Số tín chỉ phải lớn hơn 0
                        </p>
                    )}
                </div>
            </div>

            {/* Preview row: accumulatedPoints */}
            {isCPAValid && isCreditsValid && (
                <div
                    className="rounded-xl px-4 py-3 flex items-center justify-between"
                    style={{ background: "var(--secondary)" }}
                >
                    <div className="flex items-center gap-2">
                        <Zap size={14} style={{ color: "var(--primary)" }} />
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                            Điểm tích lũy ước tính
                        </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                        {(cpaVal * creditsVal).toFixed(2)} điểm hệ số
                    </span>
                </div>
            )}
        </div>
    );
}
