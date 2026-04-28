"use client";

import { useState } from "react";
import type { Stage } from "@/lib/stages";
import { formatAsset } from "@/lib/percentile";

interface ResultProps {
  age: number;
  netAsset: number;
  percentile: number;
  stage: Stage;
  ageGroupLabel: string;
  onReset: () => void;
}

const STAGE_COLORS: Record<number, { bg: string; text: string; bar: string }> = {
  1: { bg: "bg-gray-100", text: "text-gray-700", bar: "bg-gray-400" },
  2: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-400" },
  3: { bg: "bg-green-50", text: "text-green-700", bar: "bg-green-500" },
  4: { bg: "bg-yellow-50", text: "text-yellow-700", bar: "bg-yellow-500" },
  5: { bg: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-500" },
  6: { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-600" },
};

export default function Result({
  age,
  netAsset,
  percentile,
  stage,
  ageGroupLabel,
  onReset,
}: ResultProps) {
  const [emailInput, setEmailInput] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const colors = STAGE_COLORS[stage.level];
  const topPercent = 100 - percentile;

  function handleShare() {
    const text = `나는 ${ageGroupLabel} 기준 자산 상위 ${topPercent}% — ${stage.level}단계 "${stage.name}" 구간입니다. 내 자산 단계는?`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ text, url });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to Resend/Supabase
    setEmailSubmitted(true);
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Stage badge */}
      <div className={`rounded-2xl p-6 ${colors.bg}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-4xl font-black ${colors.text}`}>
            {stage.level}단계
          </span>
          <span className={`text-2xl font-bold ${colors.text}`}>
            — {stage.name}
          </span>
        </div>
        <p className="text-gray-600 text-sm">{stage.description}</p>

        {/* Percentile */}
        <div className="mt-4 pt-4 border-t border-black/10">
          <p className="text-sm text-gray-500 mb-1">
            {ageGroupLabel} 기준
          </p>
          <p className={`text-xl font-bold ${colors.text}`}>
            상위 {topPercent}% ({percentile}번째 퍼센타일)
          </p>
          <p className="text-sm text-gray-500 mt-1">
            순자산 {formatAsset(netAsset)} · {age}세
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>하위 0%</span>
            <span>상위 0%</span>
          </div>
          <div className="h-3 bg-black/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bar} rounded-full transition-all`}
              style={{ width: `${percentile}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strategies */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1">지금 해야 할 것</h3>
        <p className="text-sm text-gray-500 mb-4">목표: {stage.goal}</p>
        <ul className="space-y-3">
          {stage.strategies.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${colors.bar}`}>
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 6-stage ladder */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">한국형 자산 6단계</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((lvl) => {
            const c = STAGE_COLORS[lvl];
            const isCurrentStage = lvl === stage.level;
            return (
              <div
                key={lvl}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  isCurrentStage ? `${c.bg} ring-2 ring-offset-1 ${c.bar.replace("bg-", "ring-")}` : ""
                }`}
              >
                <span className={`text-xs font-bold w-8 ${isCurrentStage ? colors.text : "text-gray-400"}`}>
                  {lvl}단계
                </span>
                <span className={`text-sm font-medium flex-1 ${isCurrentStage ? colors.text : "text-gray-500"}`}>
                  {["생존", "기반 구축", "성장", "가속", "독립", "자유"][lvl - 1]}
                </span>
                {isCurrentStage && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${c.bar}`}>
                    현재
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Email capture */}
      {!emailSubmitted ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-1">주간 코호트 리포트 받기</h3>
          <p className="text-sm text-gray-500 mb-4">
            내 또래 상위 20%는 지금 뭐 하나 — 무료 주간 뉴스레터
          </p>
          <form onSubmit={handleEmailSubmit} className="flex gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="이메일 주소"
              required
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              구독하기
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <p className="text-green-700 font-medium">등록되었습니다. 매주 인사이트를 보내드릴게요.</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
        >
          결과 공유하기
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          다시 계산하기
        </button>
      </div>

      <p className="text-xs text-center text-gray-400">
        통계청 가계금융복지조사 2023년 기준 · 일반 정보 제공 목적, 투자 권유 아님
      </p>
    </div>
  );
}
