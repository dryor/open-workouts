import 'reflect-metadata'
import { Container } from 'inversify'
import type { IAuthService } from './interfaces/IAuthService'
import type { ISessionManager } from './interfaces/ISessionManager'
import type { IUserRepository } from './interfaces/IUserRepository'
import { SupabaseAuthService } from './services/SupabaseAuthService'
import { SupabaseSessionManager } from './services/SupabaseSessionManager'
import { SupabaseUserRepository } from './services/SupabaseUserRepository'

const TYPES = {
  IAuthService: Symbol.for('IAuthService'),
  ISessionManager: Symbol.for('ISessionManager'),
  IUserRepository: Symbol.for('IUserRepository'),
}

const container = new Container()

container.bind<IAuthService>(TYPES.IAuthService).to(SupabaseAuthService)
container.bind<ISessionManager>(TYPES.ISessionManager).to(SupabaseSessionManager)
container.bind<IUserRepository>(TYPES.IUserRepository).to(SupabaseUserRepository)

export { container, TYPES }