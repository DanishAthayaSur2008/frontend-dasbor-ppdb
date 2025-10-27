"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import bgBlue from "@/public/blue-header.png";
import folderBg from "@/public/bg-card-ddashboard.png";
import Image from "next/image";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [chartData, setChartData] = useState<any[]>([]);
  const [dataPertahun, setDataPertahun] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") {
      router.push("/");
      return;
    }

    // Ganti data chart berdasarkan provinsi (asal pendaftar)
    const provinsi = [
      "Sumatera",
      "Jawa",
      "Kalimatan",
      "Sulawesi",
      "Papua",
      "Timor",
    ]

    const chart = provinsi.map((p) => ({
      name: p,
      jumlah: Math.floor(Math.random() * 100) + 10,
    }))
    setChartData(chart)


    const years = [2025, 2024, 2023, 2022, 2021];
    const perTahun = years.map((y) => ({
      tahun: y,
      jumlah: Math.floor(Math.random() * 100) + 1,
    }));
    setDataPertahun(perTahun);

    const total = perTahun.reduce((a, b) => a + b.jumlah, 0);
    const verified = Math.floor(total * 0.3);
    const unverified = total - verified;
    setSummary({ total, verified, unverified });
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-poppins">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-[1rem] transition-all duration-300">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
          Dashboard
        </h1>

        {/* HEADER BLUE SECTION */}
        <div className="relative h-[140px] sm:h-[157px] rounded-[10px] overflow-visible mb-[110px]">
          <Image
            src={bgBlue}
            alt="Background Header"
            fill
            className="object-cover w-full h-full rounded-[10px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-[10px]" />

          <div className="absolute left-3 sm:left-6 -bottom-[60px] w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: `${summary.total} Pendaftar`, subtitle: "Jumlah Pendaftar" },
                { title: `${summary.unverified} Tidak Terverif`, subtitle: "Jumlah Tidak Terverifikasi" },
                { title: `${summary.verified} Terverifikasi`, subtitle: "Jumlah Verifikasi" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="relative w-full h-[110px] sm:h-[130px] rounded-[20px] shadow-md flex flex-col justify-center px-5 sm:px-6 bg-white"
                  style={{
                    backgroundImage: `url(${folderBg.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <h3 className="text-[#132B6D] text-[18px] sm:text-[22px] font-semibold leading-tight truncate">
                    {card.title}
                  </h3>
                  <p className="text-[13px] sm:text-[15px] text-black/50 truncate">
                    {card.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART + DATA TAHUN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                Jumlah Pendaftar Asal Pulau
              </h3>
              <div className="flex flex-wrap gap-2">
                {["12 Months", "6 Months", "30 Days", "7 Days"].map((label, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded-lg text-sm ${i === 0
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 transition"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-[220px] sm:h-[280px] md:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="jumlah"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Pertahun */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
            <h3 className="font-bold mb-4 text-gray-800 text-base sm:text-lg">
              Data Pertahun
            </h3>
            <div className="space-y-4">
              {dataPertahun.map((item) => (
                <div key={item.tahun}>
                  <div className="flex justify-between mb-1 text-sm sm:text-base">
                    <span>{item.tahun}</span>
                    <span>{item.jumlah} Peserta</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.jumlah}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
