/**
 * HTTP-Client Platzhalter – wird später mit Axios oder fetch gegen das .NET-Backend ersetzt.
 *
 * Beispiel-Integration (nach Backend-Anbindung):
 *
 * import axios from 'axios'
 *
 * const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.yourdomain.com'
 *
 * export const http = axios.create({
 *   baseURL: BASE_URL,
 *   headers: { 'Content-Type': 'application/json' },
 * })
 *
 * http.interceptors.request.use(config => {
 *   // z.B. Bearer Token aus Store
 *   return config
 * })
 */

// Temporärer Platzhalter – noch nicht verwendet
export const httpClient = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
}
