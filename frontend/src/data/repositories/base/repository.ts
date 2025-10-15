import {
  LOCAL_STORAGE_KEYS,
  LocalStorageKey,
} from '@/domain/constants/local-storage'
import { AxiosInstance } from 'axios'
import { httpClient } from './httpClient'

export class BaseRepository {
  path: string
  protected httpClient: AxiosInstance

  constructor(path: string) {
    this.path = path
    this.httpClient = httpClient

    httpClient.interceptors.request.use(
      config => {
        const token = this.loadFromLocalStorage<string>(
          LOCAL_STORAGE_KEYS.accessToken,
        )
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )

    httpClient.interceptors.response.use(
      response => response,
      (error) => {
        console.error(
          '[BaseService] [interceptors.response] Error interceptor',
          error.response?.data,
        )

        if (error.response?.status === 401) {
          // Remove tokens and redirect to login
          this.removeFromLocalStorage(LOCAL_STORAGE_KEYS.accessToken)
          this.removeFromLocalStorage(LOCAL_STORAGE_KEYS.refreshToken)
          this.removeFromLocalStorage(LOCAL_STORAGE_KEYS.user)
          window.location.href = '/'
        }

        return Promise.reject(error)
      },
    )
  }

  healthCheck() {
    return this.httpClient.get<{ status: boolean }>(`${this.path}/health`)
  }

  loadFromLocalStorage<T>(key: LocalStorageKey): T | null {
    const value = localStorage.getItem(key)
    if (!value) return null
    try {
      if (typeof value === 'object') {
        return JSON.parse(value) as T
      }

      return value as unknown as T
    } catch (e: unknown) {
      console.error(`Error on loadFromLocalStorage: ${e}`)
      return value as unknown as T
    }
  }

  saveToLocalStorage<T>(key: LocalStorageKey, value: T) {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value))
      return
    }

    localStorage.setItem(key, value as unknown as string)
  }

  removeFromLocalStorage(key: LocalStorageKey) {
    localStorage.removeItem(key)
  }
}
