import type { ChatMessage, ReportContext } from '@/types'
import { answerQuestion, generateSummary } from './reportExplainer'
import { delay } from './delay'

let counter = 0
const nextId = () => `MSG-${Date.now()}-${counter++}`

export const mockChatService = {
  async openingMessage(ctx: ReportContext): Promise<ChatMessage> {
    await delay(300)
    return {
      id: nextId(),
      role: 'assistant',
      text: generateSummary(ctx),
      timestamp: new Date().toISOString(),
    }
  },
  async ask(question: string, ctx: ReportContext): Promise<ChatMessage> {
    await delay(350)
    return {
      id: nextId(),
      role: 'assistant',
      text: answerQuestion(question, ctx),
      timestamp: new Date().toISOString(),
    }
  },
}
