import type { SessionService } from '../services/sessionService.ts'
import type { SpeechService } from '../services/speechService.ts'

/** Everything a view needs: the services and a way to trigger a re-render. */
export interface AppContext {
  content: SpeechService
  session: SessionService
  rerender: () => void
}
