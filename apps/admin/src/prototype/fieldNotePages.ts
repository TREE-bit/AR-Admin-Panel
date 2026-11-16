import raw from './notes/field-notes.md?raw'
import { parseFieldNotes } from './parseFieldNotes'

export const fieldNotePages = parseFieldNotes(raw)
export type { PageDoc } from './parseFieldNotes'
