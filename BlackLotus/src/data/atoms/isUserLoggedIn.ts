import { atom } from 'jotai'

// export interface IsUserLoggedIn {
//     isLoggedIn: boolean
// }

// export const currentUserAtom = atom<IsUserLoggedIn | false>(false)
export const isUserLoggedInAtom = atom<boolean>(false)
