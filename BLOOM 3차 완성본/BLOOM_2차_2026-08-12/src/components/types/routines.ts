// 운동 루틴 데이터 (예시). 나중에 서버 데이터로 교체하면 됩니다.
export type Routine = {
  id: string
  name: string
  kcal: number
  tag: string
  duration: string
  minutes: number // 루틴 목표 시간(분)
}

export const ROUTINES: Routine[] = [
  {
    id: 'abs',
    name: '복부 라인 개선 루틴',
    kcal: 82,
    tag: '남녀노소',
    duration: '13분',
    minutes: 13,
  },
  {
    id: 'run',
    name: '고강도 러닝머신 루틴',
    kcal: 305,
    tag: '남녀노소',
    duration: '30분',
    minutes: 30,
  },
  {
    id: 'cycle',
    name: '실내 사이클 루틴',
    kcal: 254,
    tag: '남녀노소',
    duration: '30분',
    minutes: 30,
  },
]
