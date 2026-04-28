export interface Stage {
  level: number;
  name: string;
  nameEn: string;
  minAsset: number;
  maxAsset: number | null;
  percentileMin: number;
  percentileMax: number;
  description: string;
  goal: string;
  strategies: string[];
}

export const STAGES: Stage[] = [
  {
    level: 1,
    name: "생존",
    nameEn: "Survival",
    minAsset: 0,
    maxAsset: 50_000_000,
    percentileMin: 0,
    percentileMax: 30,
    description: "기반을 다지는 단계",
    goal: "비상금 확보 + 부채 정리",
    strategies: [
      "3개월치 생활비 비상금 확보 (고금리 예금/파킹통장)",
      "신용카드 부채 전액 상환 (이자율 15-20% 부채 먼저)",
      "지출 파악 — 가계부 작성, 고정비 항목 점검",
    ],
  },
  {
    level: 2,
    name: "기반 구축",
    nameEn: "Foundation",
    minAsset: 50_000_000,
    maxAsset: 150_000_000,
    percentileMin: 30,
    percentileMax: 50,
    description: "종잣돈을 만드는 단계",
    goal: "종잣돈 형성 + 세제혜택 활용",
    strategies: [
      "IRP + ISA 세제혜택 한도 먼저 채우기 (연간 최대 900만원 공제)",
      "인덱스 ETF 적립식 투자 시작 (코스피200, S&P500)",
      "청약통장 납입 유지 — 사회초년생이라면 1순위 유지",
    ],
  },
  {
    level: 3,
    name: "성장",
    nameEn: "Growth",
    minAsset: 150_000_000,
    maxAsset: 300_000_000,
    percentileMin: 50,
    percentileMax: 70,
    description: "복리가 눈에 보이기 시작하는 단계",
    goal: "복리 궤도 진입 + 포트폴리오 설계",
    strategies: [
      "연금 포트폴리오 설계 — IRP 내 자산 배분 점검 (주식 70% 이상 권장)",
      "금융자산 비중 30% 이상 목표 (부동산 편중 줄이기)",
      "청약통장 실질적 활용 검토 — 청약 점수 계산, 타겟 지역 선정",
    ],
  },
  {
    level: 4,
    name: "가속",
    nameEn: "Acceleration",
    minAsset: 300_000_000,
    maxAsset: 700_000_000,
    percentileMin: 70,
    percentileMax: 85,
    description: "자산이 스스로 불어나기 시작하는 단계",
    goal: "자산 다각화 + 세금 최적화",
    strategies: [
      "부동산 vs 금융자산 리밸런싱 — 유동성 확보 관점에서 점검",
      "세금 최적화 — 금융소득 종합과세 기준(2,000만원) 고려한 계좌 분산",
      "포트폴리오 리스크 재조정 — 주식/채권/대안 비중 설계",
    ],
  },
  {
    level: 5,
    name: "독립",
    nameEn: "Independence",
    minAsset: 700_000_000,
    maxAsset: 2_000_000_000,
    percentileMin: 85,
    percentileMax: 95,
    description: "수동 소득이 가능한 단계",
    goal: "수동 소득 구조 만들기",
    strategies: [
      "배당 포트폴리오 구축 — 배당주/리츠 비중 확대로 현금흐름 설계",
      "부동산 임대 구조화 — 임대소득 세금 최적화",
      "세무사 필수 — 금융소득/임대소득 종합 절세 전략",
    ],
  },
  {
    level: 6,
    name: "자유",
    nameEn: "Freedom",
    minAsset: 2_000_000_000,
    maxAsset: null,
    percentileMin: 95,
    percentileMax: 100,
    description: "재정적 자유를 달성한 단계",
    goal: "자산 보존 + 이전 설계",
    strategies: [
      "법인 설립 활용 — 사업소득/투자소득 분리로 세금 최적화",
      "상속·증여 플래닝 — 증여세 면제한도 활용한 사전 이전",
      "가족 단위 재무 설계 — 배우자/자녀 계좌 활용",
    ],
  },
];

export function getStageByAsset(asset: number): Stage {
  for (const stage of STAGES) {
    if (stage.maxAsset === null || asset < stage.maxAsset) {
      return stage;
    }
  }
  return STAGES[STAGES.length - 1];
}
