import { registerSW } from 'virtual:pwa-register'
import { LocalStorageRepository } from './data/localStorageRepository.ts'
import { ensureSeedData } from './data/seed.ts'
import { SessionService } from './services/sessionService.ts'
import { SpeechService } from './services/speechService.ts'
import { startApp } from './ui/app.ts'
import { initSettingsView } from './ui/settingsView.ts'
import './ui/style.css'

registerSW()

const repository = new LocalStorageRepository()
ensureSeedData(repository)
initSettingsView(repository)

startApp(
  document.querySelector<HTMLDivElement>('#app')!,
  new SpeechService(repository),
  new SessionService(repository),
)
