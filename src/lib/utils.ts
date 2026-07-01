import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// El sitio se sirve en la raíz del dominio (forjaarena.com), así que no hay prefijo de ruta.
export const BASE_PATH = ""

export function asset(path: string) {
  return `${BASE_PATH}${path}`
}
