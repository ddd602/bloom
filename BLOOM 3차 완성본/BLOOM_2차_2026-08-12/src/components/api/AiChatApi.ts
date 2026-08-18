import { apiFetch } from './ApiClient'

export type ChatRole = 'user' | 'ai'

export type ChatMessage = {
  role: ChatRole
  text: string
}

export type ChatCategory =
  | '운동'
  | '식단'
  | '시술'
  | '관리'
  | '기타'

export type Conversation = {
  id: string
  title: string
  date: string
  category: ChatCategory
  messages: ChatMessage[]
  createdAt?: string
  updatedAt?: string
}

export type SendChatMessageRequest = {
  conversationId?: number
  message: string
}

export type SendChatMessageResponse = {
  conversationId: number
  answer: string
  createdAt: string
}

export type ConversationSummaryResponse = {
  conversationId: number
  title: string
  lastMessageAt: string
}

export type ConversationDetailMessage = {
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt: string
}

export type ConversationDetailResponse = {
  conversationId: number
  title: string
  messages: ConversationDetailMessage[]
}

export function categorizeChat(
  text: string,
): ChatCategory {
  if (
    /운동|루틴|스쿼트|코어|자세|스트레칭/.test(
      text,
    )
  ) {
    return '운동'
  }

  if (
    /식단|식사|칼로리|다이어트|보조제|영양|먹/.test(
      text,
    )
  ) {
    return '식단'
  }

  if (
    /시술|레이저|병원|주사|필러|보톡스/.test(
      text,
    )
  ) {
    return '시술'
  }

  if (
    /관리|크림|피부|튼살|보습|각질/.test(
      text,
    )
  ) {
    return '관리'
  }

  return '기타'
}

export async function sendAiMessage(
  message: string,
  conversationId?: number,
): Promise<SendChatMessageResponse> {
  const body: SendChatMessageRequest = {
    message,
  }

  if (conversationId !== undefined) {
    body.conversationId = conversationId
  }

  return apiFetch<SendChatMessageResponse>(
    '/api/v1/ai/chat',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )
}

export async function getConversations(): Promise<
  ConversationSummaryResponse[]
> {
  return apiFetch<ConversationSummaryResponse[]>(
    '/api/v1/ai/conversations',
  )
}

export async function getConversation(
  conversationId: number,
): Promise<ConversationDetailResponse> {
  return apiFetch<ConversationDetailResponse>(
    `/api/v1/ai/conversations/${conversationId}`,
  )
}