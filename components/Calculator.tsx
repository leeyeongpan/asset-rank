"use client";

import { useState } from "react";
import { calculatePercentile, getAgeGroupLabel } from "@/lib/percentile";
import { getStageByAsset } from "@/lib/stages";
import Result from "./Result";

export default function Calculator() {
  const [age, setAge] = useState("");
  const [assetInput, setAssetInput] = useState("");
  const [assetUnit, setAssetUnit] = useState<"만원" | "억원">("만원");
  const [submitted, setSubmitted] = useState(false);

  const netAsset = assetInput
    ? parseFloat(assetInput) * (assetUnit === "억원" ? 100_000_000 : 10_000)
    : 0;

  const ageNum = parseInt(age);
  const isValid = ageNum >= 20 && ageNum <= 79 && netAsset !== 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
  }

  function handleReset() {
    setSubmitted(false);
    setAge("");
    setAssetInput("");
  }

  if (submitted && isValid) {
    const percentile = calculatePercentile(ageNum, netAsset);
    const stage = getStageByAsset(netAsset);
    const ageGroupLabel = getAgeGroupLabel(ageNum);
    return (
      <Result
        age={ageNum}
        netAsset={netAsset}
        percentile={percentile}
        stage={stage}
        ageGroupLabel={ageGroupLabel}
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 나이
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="예: 35"
              min={20}
              max={79}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-600 font-medium">세</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            순자산
            <span className="ml-2 text-xs text-gray-400 font-normal">
              (금융자산 + 부동산 − 부채)
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={assetInput}
              onChange={(e) => setAssetInput(e.target.value)}
              placeholder="예: 2"
              step="0.1"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              {(["만원", "억원"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setAssetUnit(unit)}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    assetUnit === unit
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          내 자산 단계 확인하기
        </button>

        <p className="text-xs text-center text-gray-400">
          통계청 가계금융복지조사 2023년 기준 · 일반 정보 제공 목적 (투자 권유 아님)
        </p>
      </div>
    </form>
  );
}
