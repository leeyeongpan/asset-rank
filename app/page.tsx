import Calculator from "@/components/Calculator";

export const metadata = {
  title: "내 자산 단계 — 또래 대비 순자산 순위",
  description:
    "나이와 순자산을 입력하면 또래 대비 상위 몇 %인지, 지금 어떤 단계인지, 다음에 뭘 해야 하는지 알려드립니다.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-3">
            내 자산, 또래 대비 몇 단계?
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            나이와 순자산을 입력하면<br />
            상위 몇 %인지 + 지금 뭘 해야 하는지 알려드립니다
          </p>
          <p className="text-xs text-gray-400 mt-2">
            순자산 = 금융자산 + 부동산 − 부채
          </p>
        </div>

        <Calculator />
      </div>
    </main>
  );
}
