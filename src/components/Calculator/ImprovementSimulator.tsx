"use client";

import React from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { VALID_GRADES, CREDIT_OPTIONS } from "@/constants/grades";
import { formatGrade } from "@/lib/utils";
import { Plus, Trash2, TrendingUp, CheckSquare, Square, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const selectStyle: React.CSSProperties = {
    background: "var(--input)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
    borderRadius: "0.75rem",
    padding: "0.4rem 0.5rem",
    fontSize: "0.8rem",
    outline: "none",
    cursor: "pointer",
};

// Chỉ cho phép chọn điểm kỳ vọng cao hơn điểm hiện tại
function TargetGradeSelect({
    currentGrade,
    targetGrade,
    onChange,
}: {
    currentGrade: number;
    targetGrade: number;
    onChange: (g: number) => void;
}) {
    const options = VALID_GRADES.filter((g) => g > currentGrade);
    return (
        <select
            value={targetGrade}
            onChange={(e) => onChange(Number(e.target.value))}
            style={selectStyle}
        >
            {options.map((g) => (
                <option key={g} value={g}>
                    {g}
                </option>
            ))}
        </select>
    );
}

export default function ImprovementSimulator() {
    const {
        inputMode,
        improvements,
        improvementResult,
        result,
        toggleImprovement,
        updateImprovement,
        addImprovement,
        removeImprovement,
    } = useCalculator();

    const { currentCPA, earnedCredits } = result;
    const { deltaPoints, improvedCPA, selectedCount } = improvementResult;

    const hasData = earnedCredits > 0;
    const hasImprovements = improvements.length > 0;
    const hasSelected = selectedCount > 0;
    const cpaGain = improvedCPA - currentCPA;

    // ── Trạng thái khi không có dữ liệu ──
    if (!hasData) {
        return null; // Ẩn hoàn toàn khi chưa có dữ liệu
    }

    return (
        <div
            className="rounded-2xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <RefreshCw size={14} style={{ color: "var(--primary)" }} />
                    <h2
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted-foreground)" }}
                    >
                        Giả lập cải thiện
                    </h2>
                </div>
                {hasSelected && (
                    <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: "rgba(108,99,255,0.15)", color: "var(--primary)" }}
                    >
                        {selectedCount} môn chọn
                    </span>
                )}
            </div>

            {/* ── MANUAL MODE: auto-suggest list ── */}
            {inputMode === "manual" && (
                <>
                    {!hasImprovements ? (
                        <div
                            className="rounded-xl px-4 py-5 text-center"
                            style={{ background: "var(--secondary)" }}
                        >
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                🎉 Không có môn nào dưới 2.5 điểm — không cần học cải thiện!
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
                                Tick chọn môn muốn học lại và điều chỉnh điểm kỳ vọng:
                            </p>

                            {/* Table header */}
                            <div
                                className="grid gap-2 mb-2 px-1 text-xs font-medium"
                                style={{
                                    gridTemplateColumns: "24px 1fr 64px 64px 64px",
                                    color: "var(--muted-foreground)",
                                }}
                            >
                                <span />
                                <span>Môn học</span>
                                <span className="text-center">TC</span>
                                <span className="text-center">Hiện tại</span>
                                <span className="text-center">Kỳ vọng</span>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                {improvements.map((entry) => {
                                    const gain = entry.selected
                                        ? entry.credits * (entry.targetGrade - entry.currentGrade)
                                        : 0;
                                    return (
                                        <div
                                            key={entry.id}
                                            className={cn(
                                                "grid gap-2 items-center rounded-xl px-2 py-1.5 transition-all",
                                                entry.selected
                                                    ? "ring-1"
                                                    : "opacity-60"
                                            )}
                                            style={{
                                                gridTemplateColumns: "24px 1fr 64px 64px 64px",
                                                background: entry.selected
                                                    ? "rgba(108,99,255,0.06)"
                                                    : "var(--secondary)",
                                                border: entry.selected
                                                    ? "1px solid rgba(108,99,255,0.25)"
                                                    : "1px solid transparent",
                                            }}
                                        >
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleImprovement(entry.id)}
                                                className="flex items-center justify-center"
                                                style={{
                                                    color: entry.selected
                                                        ? "var(--primary)"
                                                        : "var(--muted-foreground)",
                                                }}
                                            >
                                                {entry.selected ? (
                                                    <CheckSquare size={16} />
                                                ) : (
                                                    <Square size={16} />
                                                )}
                                            </button>

                                            {/* Tên môn */}
                                            <span
                                                className="text-xs font-medium truncate"
                                                style={{ color: "var(--foreground)" }}
                                                title={entry.name || "Môn chưa đặt tên"}
                                            >
                                                {entry.name || (
                                                    <span style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>
                                                        Môn chưa đặt tên
                                                    </span>
                                                )}
                                            </span>

                                            {/* Số tín chỉ (readonly) */}
                                            <span
                                                className="text-xs text-center font-medium"
                                                style={{ color: "var(--muted-foreground)" }}
                                            >
                                                {entry.credits} TC
                                            </span>

                                            {/* Điểm hiện tại (readonly) */}
                                            <span
                                                className="text-xs text-center font-bold"
                                                style={{ color: "#f59e0b" }}
                                            >
                                                {entry.currentGrade}
                                            </span>

                                            {/* Điểm kỳ vọng */}
                                            <div className="flex flex-col items-center gap-0.5">
                                                <TargetGradeSelect
                                                    currentGrade={entry.currentGrade}
                                                    targetGrade={entry.targetGrade}
                                                    onChange={(g) =>
                                                        updateImprovement(entry.id, { targetGrade: g })
                                                    }
                                                />
                                                {entry.selected && gain > 0 && (
                                                    <span
                                                        className="text-[10px] font-semibold"
                                                        style={{ color: "#4ade80" }}
                                                    >
                                                        +{gain.toFixed(1)}đ
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* ── QUICK MODE: manual add entries ── */}
            {inputMode === "quick" && (
                <>
                    <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
                        Thêm các môn muốn học lại, nhập điểm cũ và điểm kỳ vọng:
                    </p>

                    {hasImprovements && (
                        <>
                            {/* Table header */}
                            <div
                                className="grid gap-2 mb-2 px-1 text-xs font-medium"
                                style={{
                                    gridTemplateColumns: "24px 1fr 60px 64px 64px 28px",
                                    color: "var(--muted-foreground)",
                                }}
                            >
                                <span />
                                <span>Tên môn</span>
                                <span className="text-center">TC</span>
                                <span className="text-center">Cũ</span>
                                <span className="text-center">Mới</span>
                                <span />
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-3">
                                {improvements.map((entry) => {
                                    const gain = entry.selected
                                        ? entry.credits * (entry.targetGrade - entry.currentGrade)
                                        : 0;
                                    return (
                                        <div
                                            key={entry.id}
                                            className={cn(
                                                "grid gap-2 items-center rounded-xl px-2 py-1.5 transition-all"
                                            )}
                                            style={{
                                                gridTemplateColumns: "24px 1fr 60px 64px 64px 28px",
                                                background: entry.selected
                                                    ? "rgba(108,99,255,0.06)"
                                                    : "var(--secondary)",
                                                border: entry.selected
                                                    ? "1px solid rgba(108,99,255,0.25)"
                                                    : "1px solid transparent",
                                            }}
                                        >
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleImprovement(entry.id)}
                                                style={{
                                                    color: entry.selected
                                                        ? "var(--primary)"
                                                        : "var(--muted-foreground)",
                                                }}
                                            >
                                                {entry.selected ? (
                                                    <CheckSquare size={16} />
                                                ) : (
                                                    <Square size={16} />
                                                )}
                                            </button>

                                            {/* Tên môn (editable) */}
                                            <input
                                                type="text"
                                                placeholder="Tên môn..."
                                                value={entry.name}
                                                onChange={(e) =>
                                                    updateImprovement(entry.id, { name: e.target.value })
                                                }
                                                className="rounded-lg px-2 py-1 text-xs outline-none transition-all"
                                                style={{
                                                    background: "var(--input)",
                                                    border: "1px solid var(--border)",
                                                    color: "var(--foreground)",
                                                }}
                                                onFocus={(e) =>
                                                    (e.target.style.borderColor = "var(--primary)")
                                                }
                                                onBlur={(e) =>
                                                    (e.target.style.borderColor = "var(--border)")
                                                }
                                            />

                                            {/* Số tín chỉ */}
                                            <select
                                                value={entry.credits}
                                                onChange={(e) =>
                                                    updateImprovement(entry.id, {
                                                        credits: Number(e.target.value),
                                                    })
                                                }
                                                style={selectStyle}
                                            >
                                                {CREDIT_OPTIONS.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c} TC
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Điểm cũ */}
                                            <select
                                                value={entry.currentGrade}
                                                onChange={(e) => {
                                                    const g = Number(e.target.value);
                                                    updateImprovement(entry.id, {
                                                        currentGrade: g,
                                                        targetGrade: Math.max(entry.targetGrade, g + 0.5),
                                                    });
                                                }}
                                                style={selectStyle}
                                            >
                                                {VALID_GRADES.filter((g) => g < 4).map((g) => (
                                                    <option key={g} value={g}>
                                                        {g}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Điểm kỳ vọng */}
                                            <div className="flex flex-col items-center gap-0.5">
                                                <TargetGradeSelect
                                                    currentGrade={entry.currentGrade}
                                                    targetGrade={entry.targetGrade}
                                                    onChange={(g) =>
                                                        updateImprovement(entry.id, { targetGrade: g })
                                                    }
                                                />
                                                {entry.selected && gain > 0 && (
                                                    <span
                                                        className="text-[10px] font-semibold"
                                                        style={{ color: "#4ade80" }}
                                                    >
                                                        +{gain.toFixed(1)}đ
                                                    </span>
                                                )}
                                            </div>

                                            {/* Xóa */}
                                            <button
                                                onClick={() => removeImprovement(entry.id)}
                                                className="flex items-center justify-center w-6 h-6 rounded-lg transition-all hover:scale-110"
                                                style={{
                                                    background: "rgba(255,71,87,0.12)",
                                                    color: "var(--destructive)",
                                                }}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Thêm môn */}
                    <button
                        onClick={addImprovement}
                        className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all hover:opacity-80 border-dashed"
                        style={{
                            background: "transparent",
                            border: "1.5px dashed var(--border)",
                            color: "var(--muted-foreground)",
                        }}
                    >
                        <Plus size={14} />
                        Thêm môn cải thiện
                    </button>
                </>
            )}

            {/* ── Kết quả cải thiện ── */}
            {hasSelected && (
                <div
                    className="mt-4 rounded-xl p-4"
                    style={{
                        background: "rgba(74,222,128,0.08)",
                        border: "1px solid rgba(74,222,128,0.2)",
                    }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={14} style={{ color: "#4ade80" }} />
                        <p
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "#4ade80" }}
                        >
                            Dự kiến sau cải thiện
                        </p>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                        {/* CPA sau cải thiện */}
                        <div>
                            <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                                CPA dự kiến
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span
                                    className="text-4xl font-black tabular-nums"
                                    style={{
                                        background: "linear-gradient(135deg, #4ade80, #06b6d4)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >
                                    {formatGrade(improvedCPA)}
                                </span>
                                <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                    / 4.0
                                </span>
                            </div>
                        </div>

                        {/* Thống kê */}
                        <div className="text-right flex flex-col gap-1">
                            <div
                                className="text-xs px-3 py-1 rounded-full font-bold"
                                style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}
                            >
                                ↑ +{formatGrade(cpaGain)} điểm
                            </div>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                Gỡ được{" "}
                                <b style={{ color: "var(--foreground)" }}>
                                    {deltaPoints.toFixed(2)}
                                </b>{" "}
                                điểm hệ số
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
