import {
  getDailyDiary,
  saveDailyDiary,
  type EmotionTag,
  type BodyConditionTag,
} from './DiaryApi'

export type ConditionData = {
  date: string
  emotionScore: number
  bodyScore: number
  emotionTags: string[]
  bodyTags: string[]
  memo: string
}

const EMOTION_TO_SERVER: Record<
  string,
  EmotionTag
> = {
  행복: 'HAPPY',
  기쁨: 'JOY',
  설렘: 'EXCITED',
  신남: 'ENERGETIC',
  평온: 'CALM',
  편안: 'COMFORTABLE',
  지루함: 'BORED',
  불안: 'ANXIOUS',
  불쾌: 'UNPLEASANT',
  불편: 'UNCOMFORTABLE',
  자책: 'SELF_BLAME',
  슬픔: 'SAD',
  짜증: 'IRRITATED',
  분노: 'ANGRY',
  예민: 'SENSITIVE',
  스트레스: 'STRESS',
}

const EMOTION_TO_FRONT: Record<
  EmotionTag,
  string
> = {
  HAPPY: '행복',
  JOY: '기쁨',
  EXCITED: '설렘',
  ENERGETIC: '신남',
  CALM: '평온',
  COMFORTABLE: '편안',
  BORED: '지루함',
  ANXIOUS: '불안',
  UNPLEASANT: '불쾌',
  UNCOMFORTABLE: '불편',
  SELF_BLAME: '자책',
  SAD: '슬픔',
  IRRITATED: '짜증',
  ANGRY: '분노',
  SENSITIVE: '예민',
  STRESS: '스트레스',
}

const BODY_TO_SERVER: Record<
  string,
  BodyConditionTag
> = {
  생리중: 'MENSTRUATING',
  가임기: 'FERTILE_WINDOW',
  배란기: 'OVULATION',

  피곤함: 'FATIGUED',
  붓기: 'SWELLING',
  '허리 통증':
    'LOWER_BACK_PAIN',
  '골반 통증':
    'PELVIC_PAIN',
  근육통: 'MUSCLE_PAIN',

  '식욕 저하':
    'LOW_APPETITE',
  '식욕 보통':
    'NORMAL_APPETITE',
  '식욕 증가':
    'INCREASED_APPETITE',
}

const BODY_TO_FRONT: Record<
  BodyConditionTag,
  string
> = {
  MENSTRUATING: '생리중',
  FERTILE_WINDOW: '가임기',
  OVULATION: '배란기',

  FATIGUED: '피곤함',
  SWELLING: '붓기',
  LOWER_BACK_PAIN:
    '허리 통증',
  PELVIC_PAIN:
    '골반 통증',
  MUSCLE_PAIN: '근육통',

  LOW_APPETITE:
    '식욕 저하',
  NORMAL_APPETITE:
    '식욕 보통',
  INCREASED_APPETITE:
    '식욕 증가',
}

// ==============================
// 특정 날짜 컨디션 조회
// ==============================

export async function getConditionByDate(
  date: string,
): Promise<ConditionData> {
  const data =
    await getDailyDiary(
      date,
    )

  return {
    date: data.date,

    emotionScore:
      data.emotionScore ?? 0,

    bodyScore:
      data.bodyScore ?? 0,

    emotionTags:
      data.emotionTags.map(
        (tag) =>
          EMOTION_TO_FRONT[
            tag
          ],
      ),

    bodyTags:
      data.bodyTags.map(
        (tag) =>
          BODY_TO_FRONT[
            tag
          ],
      ),

    memo:
      data.memo ?? '',
  }
}

// ==============================
// 컨디션 저장
//
// 저장 버튼을 눌렀을 때만
// ConditionDetail에서 호출
// ==============================

export async function saveCondition(
  data: ConditionData,
): Promise<ConditionData> {
  const emotionTags =
    data.emotionTags
      .map(
        (tag) =>
          EMOTION_TO_SERVER[
            tag
          ],
      )
      .filter(
        (
          tag,
        ): tag is EmotionTag =>
          tag !== undefined,
      )

  const bodyTags =
    data.bodyTags
      .map(
        (tag) =>
          BODY_TO_SERVER[
            tag
          ],
      )
      .filter(
        (
          tag,
        ): tag is BodyConditionTag =>
          tag !== undefined,
      )

  const saved =
    await saveDailyDiary({
      date:
        data.date,

      emotionScore:
        data.emotionScore,

      bodyScore:
        data.bodyScore,

      emotionTags,

      bodyTags,

      memo:
        data.memo,
    })

  return {
    date:
      saved.date,

    emotionScore:
      saved.emotionScore ??
      0,

    bodyScore:
      saved.bodyScore ??
      0,

    emotionTags:
      saved.emotionTags.map(
        (tag) =>
          EMOTION_TO_FRONT[
            tag
          ],
      ),

    bodyTags:
      saved.bodyTags.map(
        (tag) =>
          BODY_TO_FRONT[
            tag
          ],
      ),

    memo:
      saved.memo ?? '',
  }
}