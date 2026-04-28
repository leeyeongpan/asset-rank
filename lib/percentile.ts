// 통계청 가계금융복지조사 2023년 기준 (순자산 기준)
// 출처: 통계청 가계금융복지조사, 2023년 기준

interface AgeGroupData {
  label: string;
  // 순자산 누적 분포 포인트 (퍼센타일 → 순자산 원)
  percentilePoints: [number, number][]; // [percentile, netAsset]
}

// 연령대별 순자산 분포 (통계청 2023년 기준 추정치)
// 각 포인트: [퍼센타일, 해당 순자산(원)]
const AGE_GROUP_DATA: Record<string, AgeGroupData> = {
  "20s": {
    label: "20대",
    percentilePoints: [
      [10, -5_000_000],
      [20, 2_000_000],
      [30, 10_000_000],
      [40, 25_000_000],
      [50, 50_000_000],
      [60, 80_000_000],
      [70, 120_000_000],
      [80, 180_000_000],
      [90, 280_000_000],
      [95, 400_000_000],
      [99, 700_000_000],
    ],
  },
  "30s": {
    label: "30대",
    percentilePoints: [
      [10, 5_000_000],
      [20, 30_000_000],
      [30, 70_000_000],
      [40, 120_000_000],
      [50, 190_000_000],
      [60, 280_000_000],
      [70, 400_000_000],
      [80, 570_000_000],
      [90, 850_000_000],
      [95, 1_200_000_000],
      [99, 2_500_000_000],
    ],
  },
  "40s": {
    label: "40대",
    percentilePoints: [
      [10, 10_000_000],
      [20, 60_000_000],
      [30, 130_000_000],
      [40, 220_000_000],
      [50, 330_000_000],
      [60, 470_000_000],
      [70, 660_000_000],
      [80, 950_000_000],
      [90, 1_500_000_000],
      [95, 2_200_000_000],
      [99, 4_500_000_000],
    ],
  },
  "50s": {
    label: "50대",
    percentilePoints: [
      [10, 10_000_000],
      [20, 70_000_000],
      [30, 160_000_000],
      [40, 280_000_000],
      [50, 420_000_000],
      [60, 600_000_000],
      [70, 850_000_000],
      [80, 1_200_000_000],
      [90, 2_000_000_000],
      [95, 3_000_000_000],
      [99, 6_000_000_000],
    ],
  },
  "60s": {
    label: "60대",
    percentilePoints: [
      [10, 5_000_000],
      [20, 60_000_000],
      [30, 150_000_000],
      [40, 270_000_000],
      [50, 410_000_000],
      [60, 590_000_000],
      [70, 830_000_000],
      [80, 1_200_000_000],
      [90, 2_100_000_000],
      [95, 3_200_000_000],
      [99, 7_000_000_000],
    ],
  },
};

function getAgeGroup(age: number): string {
  if (age < 30) return "20s";
  if (age < 40) return "30s";
  if (age < 50) return "40s";
  if (age < 60) return "50s";
  return "60s";
}

export function calculatePercentile(age: number, netAsset: number): number {
  const ageGroup = getAgeGroup(age);
  const data = AGE_GROUP_DATA[ageGroup];
  const points = data.percentilePoints;

  // Below lowest point (including negative assets)
  if (netAsset <= points[0][1]) {
    return 1;
  }

  // Above highest point
  if (netAsset >= points[points.length - 1][1]) {
    return 99;
  }

  // Linear interpolation between bracket points
  for (let i = 0; i < points.length - 1; i++) {
    const [p1, a1] = points[i];
    const [p2, a2] = points[i + 1];
    if (netAsset >= a1 && netAsset <= a2) {
      const ratio = (netAsset - a1) / (a2 - a1);
      return Math.round(p1 + ratio * (p2 - p1));
    }
  }

  return 50;
}

export function getAgeGroupLabel(age: number): string {
  return AGE_GROUP_DATA[getAgeGroup(age)].label;
}

export function formatAsset(amount: number): string {
  if (Math.abs(amount) >= 100_000_000) {
    const eok = amount / 100_000_000;
    return `${eok % 1 === 0 ? eok : eok.toFixed(1)}억원`;
  }
  if (Math.abs(amount) >= 10_000) {
    const man = amount / 10_000;
    return `${man % 1 === 0 ? man : man.toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}
