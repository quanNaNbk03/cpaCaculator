"use client";

import React from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { formatGrade, getGradeLabel, calcProgressPercent } from "@/lib/utils";
import { CPA_THRESHOLDS, TARGET_OPTIONS } from "@/constants/grades";
import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

function ProgressBar({
    percent,
    earned,
    total,
}: {
    percent: number;
    earned: number;
    total: number;
}) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                <span>Tiến độ tín chỉ</span>
                <span>
                    <b style={{ color: "var(--foreground)" }}>{earned}</b> / {total} TC
                    &nbsp;({percent}%)
                </span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                <div
                    className="absolute left-0 top-0 h-3 rounded-full transition-all duration-700"
                    style={{
                        width: `${percent}%`,
                        background: "linear-gradient(90deg, var(--primary) 0%, #4ade80 100%)",
                        boxShadow: "0 0 8px rgba(108,99,255,0.5)",
                    }}
                />
                {/* CPA milestone markers */}
                {Object.values(CPA_THRESHOLDS).map((t) => {
                    const pos = (t.value / 4) * 100;
                    return (
                        <div
                            key={t.label}
                            className="absolute top-0 h-3 w-0.5 opacity-40"
                            style={{ left: `${pos}%`, background: t.color }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default function SummaryCard() {
    const { result, goal } = useCalculator();
    const {
        currentCPA,
        earnedCredits,
        remainingCredits,
        requiredScore,
        isFeasible,
        isAlreadyAchieved,
    } = result;

    const gradeInfo = getGradeLabel(currentCPA);
    const progressPercent = calcProgressPercent(earnedCredits, goal.totalProgramCredits);
    const targetLabel =
        TARGET_OPTIONS.find((o) => o.value === goal.targetCPA)?.label ?? `CPA ${goal.targetCPA}`;

    const hasData = earnedCredits > 0;

    return (
        <div
            className="rounded-2xl p-6 flex flex-col gap-5 h-full"
            style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
            }}
        >
            <h2
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted-foreground)" }}
            >
                📊 Kết quả & Dự báo
            </h2>

            {/* CPA Hiện tại */}
            <div className="flex items-end gap-4">
                <div>
                    <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                        CPA Hiện tại
                    </p>
                    <div className="flex items-baseline gap-3">
                        <span
                            className="text-6xl font-black tabular-nums"
                            style={{
                                background: hasData
                                    ? `linear-gradient(135deg, ${gradeInfo.color}, var(--primary))`
                                    : "var(--secondary)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {hasData ? formatGrade(currentCPA) : "—"}
                        </span>
                        <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                            / 4.0
                        </span>
                    </div>
                </div>

                {hasData && (
                    <span
                        className="mb-1 px-3 py-1 rounded-full text-sm font-bold"
                        style={{
                            background: `${gradeInfo.color}22`,
                            color: gradeInfo.color,
                            border: `1px solid ${gradeInfo.color}44`,
                        }}
                    >
                        {gradeInfo.label}
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <ProgressBar
                percent={progressPercent}
                earned={earnedCredits}
                total={goal.totalProgramCredits}
            />

            {/* Divider */}
            <hr style={{ borderColor: "var(--border)" }} />

            {/* Forecast section */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>
                    <TrendingUp size={12} className="inline mr-1.5" />
                    Dự báo mục tiêu: {targetLabel}
                </p>

                {!hasData ? (
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Nhập môn học để xem dự báo.
                    </p>
                ) : isAlreadyAchieved ? (
                    /* Đã đạt mục tiêu */
                    <div
                        className="flex items-start gap-3 rounded-xl p-4"
                        style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}
                    >
                        <CheckCircle2 size={20} style={{ color: "#4ade80", flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <p className="text-sm font-bold" style={{ color: "#4ade80" }}>
                                🎉 Bạn đã đạt mục tiêu!
                            </p>
                            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                                CPA hiện tại ({formatGrade(currentCPA)}) đã vượt mục tiêu ({goal.targetCPA}).
                                Hãy duy trì phong độ!
                            </p>
                        </div>
                    </div>
                ) : remainingCredits <= 0 ? (
                    /* Đã học hết tín chỉ nhưng không đạt */
                    <div
                        className="flex items-start gap-3 rounded-xl p-4"
                        style={{ background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.2)" }}
                    >
                        <AlertTriangle size={20} style={{ color: "var(--destructive)", flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <p className="text-sm font-bold" style={{ color: "var(--destructive)" }}>
                                Không thể đạt được
                            </p>
                            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                                Bạn đã học hết tín chỉ nhưng CPA ({formatGrade(currentCPA)}) chưa đạt mục tiêu ({goal.targetCPA}).
                            </p>
                        </div>
                    </div>
                ) : !isFeasible ? (
                    /* Không khả thi — cần điểm quá cao */
                    <div
                        className="flex items-start gap-3 rounded-xl p-4"
                        style={{ background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.2)" }}
                    >
                        <AlertTriangle size={20} style={{ color: "var(--destructive)", flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <p className="text-sm font-bold" style={{ color: "var(--destructive)" }}>
                                ⚠️ Không thể đạt được
                            </p>
                            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                Bạn còn{" "}
                                <b style={{ color: "var(--foreground)" }}>{remainingCredits}</b> tín chỉ.
                                Để đạt <b style={{ color: "var(--foreground)" }}>{targetLabel}</b>, bạn cần điểm trung bình{" "}
                                <b style={{ color: "var(--destructive)" }}>{formatGrade(requiredScore)}</b>{" "}
                                — vượt quá thang điểm 4.0.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Khả thi */
                    <div
                        className="rounded-xl p-4 animate-fade-in"
                        style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)" }}
                    >
                        <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                            Bạn còn{" "}
                            <b style={{ color: "var(--primary)" }}>{remainingCredits}</b> tín chỉ.
                            Để đạt{" "}
                            <b style={{ color: "var(--primary)" }}>{targetLabel}</b>, các môn còn lại bạn cần đạt trung bình:
                        </p>

                        <div className="mt-3 flex items-baseline gap-2">
                            <span
                                className="text-5xl font-black tabular-nums"
                                style={{
                                    background: "linear-gradient(135deg, var(--primary), #4ade80)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                {formatGrade(requiredScore)}
                            </span>
                            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                điểm / 4.0
                            </span>
                        </div>

                        {/* Visual difficulty bar */}
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                                <span>Độ khó</span>
                                <span>{Math.round((requiredScore / 4) * 100)}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                                <div
                                    className="h-1.5 rounded-full transition-all duration-700"
                                    style={{
                                        width: `${Math.min(100, (requiredScore / 4) * 100)}%`,
                                        background:
                                            requiredScore >= 3.5
                                                ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                                                : requiredScore >= 3.0
                                                    ? "linear-gradient(90deg, var(--primary), #8b5cf6)"
                                                    : "linear-gradient(90deg, #4ade80, var(--primary))",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats row */}
            {hasData && (
                <div className="grid grid-cols-3 gap-3 mt-auto pt-2">
                    {[
                        { label: "Đã tích lũy", value: `${earnedCredits} TC`, color: "var(--primary)" },
                        { label: "Còn lại", value: `${remainingCredits} TC`, color: "#f59e0b" },
                        { label: "Mục tiêu CPA", value: goal.targetCPA.toFixed(1), color: "#4ade80" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl p-3 text-center"
                            style={{ background: "var(--secondary)" }}
                        >
                            <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                                {stat.label}
                            </p>
                            <p className="text-lg font-bold" style={{ color: stat.color }}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
