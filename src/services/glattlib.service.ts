/**
 * GlattLibService – SignalR-Verbindung zum GlattLib-.NET-Backend.
 *
 * Verwaltet die Verbindung und leitet eingehende Events via Callbacks
 * an den Store weiter. Die Callbacks-Pattern ermöglicht, dass mehrere
 * Abnehmer registriert werden können.
 *
 * Unterstützte Events (IGlattEvents):
 *   - OnPositions         → Delta-Updates der Bestandspostionen
 *   - OnGlattState        → Server-Status (Stopped/Starting/Running/Stopping)
 *   - OnOrderManagementState → OMS-Status (gleicher GlattState-Enum)
 */

import * as signalR from '@microsoft/signalr'
import type { RawGlattPosition, GlattState } from '@/types/glattlib'

export type PositionsUpdateCallback = (
  positions: Record<string, RawGlattPosition | null>
) => void

export type GlattStateCallback = (state: GlattState) => void

class GlattLibService {
  private connection: signalR.HubConnection | null = null
  private positionsCallbacks: Set<PositionsUpdateCallback> = new Set()
  private glattStateCallbacks: Set<GlattStateCallback> = new Set()
  private omsStateCallbacks: Set<GlattStateCallback> = new Set()

  async connect(hubUrl: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) return

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    this.connection.on(
      'OnPositions',
      (positions: Record<string, RawGlattPosition | null>) => {
        this.positionsCallbacks.forEach(cb => cb(positions))
      }
    )

    this.connection.on('OnGlattState', (state: GlattState) => {
      this.glattStateCallbacks.forEach(cb => cb(state))
    })

    this.connection.on('OnOrderManagementState', (state: GlattState) => {
      this.omsStateCallbacks.forEach(cb => cb(state))
    })

    await this.connection.start()
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop()
      this.connection = null
    }
  }

  get connectionState(): signalR.HubConnectionState {
    return this.connection?.state ?? signalR.HubConnectionState.Disconnected
  }

  onPositions(cb: PositionsUpdateCallback): void {
    this.positionsCallbacks.add(cb)
  }

  offPositions(cb: PositionsUpdateCallback): void {
    this.positionsCallbacks.delete(cb)
  }

  onGlattState(cb: GlattStateCallback): void {
    this.glattStateCallbacks.add(cb)
  }

  offGlattState(cb: GlattStateCallback): void {
    this.glattStateCallbacks.delete(cb)
  }

  onOmsState(cb: GlattStateCallback): void {
    this.omsStateCallbacks.add(cb)
  }

  offOmsState(cb: GlattStateCallback): void {
    this.omsStateCallbacks.delete(cb)
  }
}

export const glattLibService = new GlattLibService()
