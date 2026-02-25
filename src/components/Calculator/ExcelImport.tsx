"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";

export default function ExcelImport() {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        // TODO: implement Excel/CSV import
        alert("⏳ Tính năng import Excel/CSV đang được phát triển và sẽ sớm ra mắt!");
    };

    return (
        <div
            className="rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all hover:opacity-90"
            style={{
                background: "var(--card)",
                border: "1px dashed var(--border)",
            }}
            onClick={handleClick}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(108,99,255,0.12)" }}
                >
                    <Upload size={18} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Import từ Excel / CSV
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        Hỗ trợ file .xlsx, .csv từ cổng đào tạo (sắp ra mắt)
                    </p>
                </div>
            </div>

            <span
                className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                style={{ background: "rgba(108,99,255,0.15)", color: "var(--primary)" }}
            >
                Coming soon
            </span>

            {/* Hidden file input - not yet wired up */}
            <input ref={inputRef} type="file" accept=".xlsx,.csv" className="hidden" />
        </div>
    );
}
