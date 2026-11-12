import { atom } from 'jotai'

export interface CurrentUser {
  id: number
  name: string
  email: string
}

export const currentUserAtom = atom<CurrentUser | null>(null)
