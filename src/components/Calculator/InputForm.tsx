"use client";

import React from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { VALID_GRADES, CREDIT_OPTIONS } from "@/constants/grades";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

const selectStyle: React.CSSProperties = {
    background: "var(--input)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
    borderRadius: "0.75rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    cursor: "pointer",
};

export default function InputForm() {
    const { subjects, addSubject, updateSubject, removeSubject } = useCalculator();

    return (
        <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                    📚 Danh sách môn học
                </h2>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                    {subjects.length} môn
                </span>
            </div>

            {/* Table header */}
            {subjects.length > 0 && (
                <div className="grid gap-2 mb-2 px-1" style={{ gridTemplateColumns: "1fr 80px 80px 40px" }}>
                    {["Tên môn học", "Tín chỉ", "Điểm", ""].map((h, i) => (
                        <span key={i} className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                            {h}
                        </span>
                    ))}
                </div>
            )}

            {/* Subject rows */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {subjects.length === 0 && (
                    <div className="text-center py-8" style={{ color: "var(--muted-foreground)" }}>
                        <p className="text-sm">Chưa có môn học nào.</p>
                        <p className="text-xs mt-1">Nhấn &quot;Thêm môn học&quot; để bắt đầu.</p>
                    </div>
                )}

                {subjects.map((subject, idx) => (
                    <div
                        key={subject.id}
                        className="grid gap-2 animate-fade-in items-center"
                        style={{ gridTemplateColumns: "1fr 80px 80px 40px" }}
                    >
                        {/* Tên môn */}
                        <input
                            type="text"
                            placeholder={`Môn học ${idx + 1}`}
                            value={subject.name}
                            onChange={(e) => updateSubject(subject.id, { name: e.target.value })}
                            className={cn("rounded-xl px-3 py-2 text-sm outline-none transition-all")}
                            style={{
                                background: "var(--input)",
                                border: "1px solid var(--border)",
                                color: "var(--foreground)",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        />

                        {/* Số tín chỉ */}
                        <select
                            value={subject.credits}
                            onChange={(e) => updateSubject(subject.id, { credits: Number(e.target.value) })}
                            style={selectStyle}
                        >
                            {CREDIT_OPTIONS.map((c) => (
                                <option key={c} value={c}>{c} TC</option>
                            ))}
                        </select>

                        {/* Điểm thang 4 */}
                        <select
                            value={subject.grade}
                            onChange={(e) => updateSubject(subject.id, { grade: Number(e.target.value) })}
                            style={selectStyle}
                        >
                            {VALID_GRADES.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>

                        {/* Xóa */}
                        <button
                            onClick={() => removeSubject(subject.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:scale-110"
                            style={{ background: "rgba(255,71,87,0.12)", color: "var(--destructive)" }}
                            title="Xóa môn học"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Thêm môn */}
            <button
                onClick={addSubject}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)",
                    color: "white",
                }}
            >
                <Plus size={16} />
                Thêm môn học
            </button>
        </div>
    );
}
