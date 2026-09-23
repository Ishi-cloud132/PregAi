import type { ChatMessage, ReportContext } from '@/types'
import { MOCK_API_ENABLED } from '@/constants'
import { apiClient } from './api'
import { mockChatService } from './mock/mockChatService'

// Same mock/real split as every other domain service. The real branch below
// is a placeholder contract for when the backend exposes an explainer
// endpoint (rule-based or LLM-backed) — the frontend doesn't need to know
// which, it just renders ChatMessage objects either way.
export const chatService = {
  async openingMessage(ctx: ReportContext): Promise<ChatMessage> {
    if (MOCK_API_ENABLED) return mockChatService.openingMessage(ctx)
    return apiClient.get<ChatMessage>(`/reports/${ctx.report.id}/chat/summary`)
  },
  async ask(question: string, ctx: ReportContext): Promise<ChatMessage> {
    if (MOCK_API_ENABLED) return mockChatService.ask(question, ctx)
    return apiClient.post<ChatMessage>(`/reports/${ctx.report.id}/chat`, { question })
  },
}
