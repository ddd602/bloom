// 운동 선택 화면(운동 방법 고르기)에 쓰는 데이터
export const EXERCISE_CATEGORIES = [
  '어깨&팔',
  '가슴',
  '등',
  '코어',
  '하체',
  '유산소',
]

export const EQUIPMENTS = [
  '전체',
  '덤벨',
  '기구',
  '머신',
  '바벨',
  '맨몸',
  '케이블',
  '밴드',
  '케틀벨',
]

export type Exercise = {
  name: string
  category: string
  equipment: string
}

export const EXERCISES: Exercise[] = [
  { name: '30도 덤벨 레이즈', category: '어깨&팔', equipment: '덤벨' },
  { name: 'Bosu: 덤벨 컬', category: '어깨&팔', equipment: '덤벨' },
  { name: 'Bosu: 덤벨 해머 컬', category: '어깨&팔', equipment: '덤벨' },
  { name: '래터럴 덤벨 레이즈', category: '어깨&팔', equipment: '덤벨' },
  { name: '래터럴 케이블 레이즈', category: '어깨&팔', equipment: '케이블' },
  { name: '푸시업', category: '가슴', equipment: '맨몸' },
  { name: '벤치 프레스', category: '가슴', equipment: '바벨' },
  { name: '덤벨 플라이', category: '가슴', equipment: '덤벨' },
  { name: '랫 풀다운', category: '등', equipment: '머신' },
  { name: '바벨 로우', category: '등', equipment: '바벨' },
  { name: '리버스 크런치', category: '코어', equipment: '맨몸' },
  { name: '플랭크', category: '코어', equipment: '맨몸' },
  { name: '케이블 크런치', category: '코어', equipment: '케이블' },
  { name: '스쿼트', category: '하체', equipment: '맨몸' },
  { name: '레그 프레스', category: '하체', equipment: '머신' },
  { name: '런지', category: '하체', equipment: '맨몸' },
  { name: '트레드밀 러닝', category: '유산소', equipment: '머신' },
  { name: '실내 사이클', category: '유산소', equipment: '머신' },
]
