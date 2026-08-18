import {
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
} from 'react-router-dom'

import {
  IconChevronLeft,
} from '../components/icons'

import HistorySheet from '../components/AiChat/HistorySheet'
import type {
  HistoryItem,
} from '../components/AiChat/HistorySheet'

import {
  categorizeChat,
  getConversation,
  getConversations,
  sendAiMessage,
  type ChatMessage,
  type ConversationSummaryResponse,
} from '../components/api/AiChatApi'

const USER_NAME = '○○'

const SUGGESTIONS = [
  '시술 관련 정보 탐색 요청',
  '운동 자세 관련 확인 질문',
]

function AiChat() {
  const navigate =
    useNavigate()

  // 현재 서버 대화 ID
  const [
    conversationId,
    setConversationId,
  ] = useState<number | null>(
    null,
  )

  // 현재 화면에 표시할 메시지
  const [
    messages,
    setMessages,
  ] = useState<
    ChatMessage[]
  >([])

  const [
    input,
    setInput,
  ] = useState('')

  const [
    sending,
    setSending,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('')

  // =========================
  // 이전 대화
  // =========================

  const [
    historyOpen,
    setHistoryOpen,
  ] = useState(false)

  const [
    conversations,
    setConversations,
  ] = useState<
    ConversationSummaryResponse[]
  >([])

  // =========================
  // 서버에서 대화 목록 조회
  // =========================

  const loadConversations =
    async () => {
      try {
        const result =
          await getConversations()

        setConversations(
          result,
        )
      } catch (error) {
        console.error(
          '이전 대화 목록을 불러오지 못했습니다.',
          error,
        )
      }
    }

  useEffect(() => {
    void loadConversations()
  }, [])

  // =========================
  // 메시지 보내기
  // =========================

  const send = async (
    text: string,
  ) => {
    const trimmed =
      text.trim()

    if (
      !trimmed ||
      sending
    ) {
      return
    }

    const userMessage:
      ChatMessage = {
      role: 'user',
      text: trimmed,
    }

    // 사용자 메시지를 먼저 화면에 표시
    setMessages(
      (prev) => [
        ...prev,
        userMessage,
      ],
    )

    setInput('')
    setErrorMessage('')
    setSending(true)

    try {
      const response =
        await sendAiMessage(
          trimmed,
          conversationId ??
            undefined,
        )

      // 새 대화라면
      // 서버가 생성한 conversationId 저장
      if (
        conversationId ===
        null
      ) {
        setConversationId(
          response.conversationId,
        )
      }

      const aiMessage:
        ChatMessage = {
        role: 'ai',
        text:
          response.answer,
      }

      setMessages(
        (prev) => [
          ...prev,
          aiMessage,
        ],
      )

      // 대화 목록 최신화
      await loadConversations()
    } catch (error) {
      console.error(
        'AI 응답을 불러오지 못했습니다.',
        error,
      )

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'AI 응답을 불러오지 못했습니다.',
      )
    } finally {
      setSending(false)
    }
  }

  // =========================
  // 서버의 이전 대화 열기
  // =========================

  const openConvo =
    async (
      id: string,
    ) => {
      const numericId =
        Number(id)

      if (
        Number.isNaN(
          numericId,
        )
      ) {
        return
      }

      try {
        setErrorMessage('')

        const conversation =
          await getConversation(
            numericId,
          )

        // 서버 conversationId 복원
        setConversationId(
          conversation.conversationId,
        )

        // 서버 메시지 형식
        // USER / ASSISTANT
        // ↓
        // 프론트 user / ai
        const convertedMessages:
          ChatMessage[] =
          conversation.messages.map(
            (message) => ({
              role:
                message.role ===
                'USER'
                  ? 'user'
                  : 'ai',

              text:
                message.content,
            }),
          )

        setMessages(
          convertedMessages,
        )

        setInput('')
        setHistoryOpen(false)
      } catch (error) {
        console.error(
          '이전 대화를 불러오지 못했습니다.',
          error,
        )

        setErrorMessage(
          error instanceof Error
            ? error.message
            : '이전 대화를 불러오지 못했습니다.',
        )
      }
    }

  // =========================
  // 새 대화
  // =========================

  const newConvo =
    () => {
      // conversationId를 null로 만들어
      // 다음 메시지를 새 서버 대화로 생성
      setConversationId(
        null,
      )

      setMessages([])
      setInput('')
      setErrorMessage('')
      setHistoryOpen(false)
    }

  // =========================
  // HistorySheet용 데이터 변환
  // =========================

  const historyItems:
    HistoryItem[] =
    conversations.map(
      (
        conversation,
      ) => ({
        // HistorySheet는 string id를 사용하므로 변환
        id: String(
          conversation.conversationId,
        ),

        title:
          conversation.title,

        date:
          conversation.lastMessageAt,

        // 현재 서버 summary에는
        // category가 없으므로 제목으로 분류
        category:
          categorizeChat(
            conversation.title,
          ),
      }),
    )

  const hasChat =
    messages.length > 0

  return (
    <div className="relative flex h-full flex-col bg-white">

      {/* 헤더 */}
      <header
        className="relative shrink-0 px-6"
        style={{
          paddingTop:
            'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="relative flex h-8 items-center justify-between">

          {/* 뒤로가기 */}
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            aria-label="뒤로가기"
            className="flex h-6 w-6 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          {/* 가운데 제목 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="whitespace-nowrap text-[16px] font-bold text-gray-900">
              Blooming
            </p>

            <p className="mt-0.5 whitespace-nowrap text-[7px] text-gray-400">
              퍼스널 AI 매니저
            </p>
          </div>

          {/* 오른쪽 버튼 */}
          <div className="flex items-center gap-3">

            {/* 새 대화 */}
            <button
              type="button"
              onClick={
                newConvo
              }
              aria-label="새 대화"
              className="flex h-6 w-6 items-center justify-center text-gray-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>

            {/* 이전 대화 */}
            <button
              type="button"
              onClick={() => {
                void loadConversations()
                setHistoryOpen(
                  true,
                )
              }}
              aria-label="이전 대화"
              className="flex h-6 w-6 items-center justify-center text-gray-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3.5 8.5a8.5 8.5 0 1 1-1 4" />
                <path d="M2 4.5v4h4" />
                <path d="M12 8v4.2l3 1.8" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 대화 있음 */}
      {hasChat ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-3 pt-8">
          <div className="space-y-4">

            {messages.map(
              (
                message,
                index,
              ) => (
                <div
                  key={index}
                  className={
                    'flex ' +
                    (
                      message.role ===
                      'user'
                        ? 'justify-end'
                        : 'justify-start'
                    )
                  }
                >
                  <div
                    className={
                      'max-w-[72%] px-4 py-2.5 text-[11px] leading-5 ' +
                      (
                        message.role ===
                        'user'
                          ? 'rounded-[18px] rounded-br-md bg-[#31C66B] text-white'
                          : 'rounded-[18px] rounded-bl-md bg-[#F7F7F7] text-gray-700'
                      )
                    }
                  >
                    {
                      message.text
                    }
                  </div>
                </div>
              ),
            )}

            {/* AI 응답 대기 */}
            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[72%] rounded-[18px] rounded-bl-md bg-[#F7F7F7] px-4 py-2.5 text-[11px] leading-5 text-gray-400">
                  AI가 답변을 작성하고 있어요...
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (

        /* 대화 없음 */
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6">
          <div className="-translate-y-2 text-center">

            <p className="mb-1 text-[12px] font-medium text-[#31C66B]">
              {USER_NAME}님
            </p>

            <p className="text-[21px] font-bold tracking-[-0.5px] text-gray-900">
              무엇이든 물어보세요!
            </p>

          </div>
        </div>
      )}

      {/* 오류 */}
      {errorMessage && (
        <div className="shrink-0 px-6 pb-2">
          <p className="text-center text-[10px] text-red-500">
            {errorMessage}
          </p>
        </div>
      )}

      {/* 하단 */}
      <div className="shrink-0 bg-white px-6 pb-5 pt-2">

        {/* 추천 질문 */}
        <div
          className={
            'mb-4 flex flex-wrap items-center gap-2 ' +
            (
              hasChat
                ? 'justify-start'
                : 'justify-center'
            )
          }
        >
          {hasChat && (
            <div className="mr-1 h-6 w-6 shrink-0 rounded-full bg-[#31C66B]" />
          )}

          {SUGGESTIONS.map(
            (
              suggestion,
            ) => (
              <button
                key={
                  suggestion
                }
                type="button"
                disabled={
                  sending
                }
                onClick={() =>
                  void send(
                    suggestion,
                  )
                }
                className="
                  rounded-full
                  border border-[#31C66B]
                  bg-white
                  px-3 py-1.5
                  text-[9px] font-medium
                  text-gray-700
                  transition-colors
                  active:bg-[#EAF8EC]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {suggestion}
              </button>
            ),
          )}
        </div>

        {/* 입력 */}
        <form
          onSubmit={(
            event,
          ) => {
            event.preventDefault()

            void send(input)
          }}
          className="
            flex h-[42px]
            items-center
            rounded-full
            border border-gray-200
            bg-white
            pl-5 pr-1.5
            shadow-[0_2px_7px_rgba(0,0,0,0.10)]
          "
        >
          <input
            value={
              input
            }
            disabled={
              sending
            }
            onChange={(
              event,
            ) =>
              setInput(
                event.target.value,
              )
            }
            placeholder=""
            className="
              min-w-0 flex-1
              bg-transparent
              text-[12px]
              text-gray-800
              outline-none
              placeholder:text-gray-300
              disabled:opacity-50
            "
          />

          <button
            type="submit"
            disabled={
              sending ||
              !input.trim()
            }
            aria-label="전송"
            className="
              flex h-7 w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#31C66B]
              text-white
              active:bg-[#28B65F]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21.5 3.5 2.5 11l7 2.5 2.5 7L21.5 3.5Z" />
              <path d="M9.5 13.5 21.5 3.5" />
            </svg>
          </button>
        </form>
      </div>

      {/* 이전 대화 */}
      <HistorySheet
        open={
          historyOpen
        }
        onClose={() =>
          setHistoryOpen(
            false,
          )
        }
        items={
          historyItems
        }
        onSelect={
          openConvo
        }
        onNew={
          newConvo
        }
      />

    </div>
  )
}

export default AiChat