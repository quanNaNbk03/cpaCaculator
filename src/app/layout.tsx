import type { Metadata } from "next";
import "./globals.css";
import { CalculatorProvider } from "@/context/CalculatorContext";

export const metadata: Metadata = {
  title: "CPA Calculator — Tính điểm & Dự báo tốt nghiệp",
  description:
    "Công cụ tính CPA và dự báo điểm cần đạt để tốt nghiệp loại Khá, Giỏi, Xuất sắc dành cho sinh viên đại học hệ tín chỉ.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CalculatorProvider>{children}</CalculatorProvider>
      </body>
    </html>
  );
}
