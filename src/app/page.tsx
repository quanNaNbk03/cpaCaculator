"use client";

import React from "react";
import TargetConfig from "@/components/Calculator/TargetConfig";
import InputForm from "@/components/Calculator/InputForm";
import ExcelImport from "@/components/Calculator/ExcelImport";
import SummaryCard from "@/components/Calculator/SummaryCard";
import QuickInputForm from "@/components/Calculator/QuickInputForm";
import { useCalculator } from "@/context/CalculatorContext";
import { Trash2, ListChecks, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { clearSubjects, subjects, inputMode, setInputMode } = useCalculator();

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎓</span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: "var(--foreground)" }}>
                CPA{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--primary), #4ade80)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Calculator
                </span>
              </h1>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Tính CPA & dự báo điểm cần đạt để tốt nghiệp theo đúng mục tiêu của bạn.
            </p>
          </div>

          {inputMode === "manual" && subjects.length > 0 && (
            <button
              onClick={clearSubjects}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 self-start sm:self-auto"
              style={{
                background: "rgba(255,71,87,0.1)",
                color: "var(--destructive)",
                border: "1px solid rgba(255,71,87,0.2)",
              }}
            >
              <Trash2 size={14} />
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">
        {/* Left column: input */}
        <div className="flex flex-col gap-5">
          <TargetConfig />

          {/* ── Input mode card with tab switcher ── */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            {/* Tab bar */}
            <div
              className="flex rounded-xl p-1 mb-5"
              style={{ background: "var(--secondary)" }}
            >
              {(
                [
                  { mode: "manual", icon: <ListChecks size={14} />, label: "Nhập từng môn" },
                  { mode: "quick", icon: <Zap size={14} />, label: "Nhập nhanh" },
                ] as const
              ).map(({ mode, icon, label }) => {
                const isActive = inputMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setInputMode(mode)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
                      isActive ? "shadow-sm" : "hover:opacity-70"
                    )}
                    style={{
                      background: isActive ? "var(--card)" : "transparent",
                      color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                      border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                    }}
                  >
                    {icon}
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {inputMode === "quick" ? (
              <QuickInputForm />
            ) : (
              <div className="flex flex-col gap-5">
                <ExcelImport />
                <InputForm />
              </div>
            )}
          </div>
        </div>

        {/* Right column: result — sticky on large screens */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <SummaryCard />
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 text-center text-xs" style={{ color: "var(--muted-foreground)" }}>
        <p>
          Chạy hoàn toàn trên trình duyệt · Không lưu dữ liệu cá nhân ·{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "var(--primary)" }}
          >
            Open Source
          </a>
        </p>
      </footer>
    </main>
  );
}
