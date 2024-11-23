// src/websocket/WebSocketManager.ts

import { WebSocketStatus, WSMessage } from './types';

export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private status: WebSocketStatus = WebSocketStatus.DISCONNECTED;
  private messageHandlers: ((message: WSMessage) => void)[] = [];
  private statusHandlers: ((status: WebSocketStatus) => void)[] = [];
  private reconnectTimer: number | null = null;
  private url: string;

  private constructor(url: string) {
    this.url = url;
  }

  public static getInstance(url: string): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager(url);
    }
    return WebSocketManager.instance;
  }

  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.updateStatus(WebSocketStatus.CONNECTING);

    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.updateStatus(WebSocketStatus.CONNECTED);
        if (this.reconnectTimer) {
          window.clearInterval(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;
          this.messageHandlers.forEach(handler => handler(message));
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.updateStatus(WebSocketStatus.DISCONNECTED);
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateStatus(WebSocketStatus.ERROR);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.updateStatus(WebSocketStatus.ERROR);
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      window.clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.updateStatus(WebSocketStatus.DISCONNECTED);
  }

  public send(message: WSMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  public addMessageHandler(handler: (message: WSMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  public removeMessageHandler(handler: (message: WSMessage) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  public addStatusHandler(handler: (status: WebSocketStatus) => void): void {
    this.statusHandlers.push(handler);
    // 立即通知当前状态
    handler(this.status);
  }

  public removeStatusHandler(handler: (status: WebSocketStatus) => void): void {
    this.statusHandlers = this.statusHandlers.filter(h => h !== handler);
  }

  public getStatus(): WebSocketStatus {
    return this.status;
  }

  private updateStatus(newStatus: WebSocketStatus): void {
    this.status = newStatus;
    this.statusHandlers.forEach(handler => handler(newStatus));
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    console.log('Scheduling reconnection...');
    this.reconnectTimer = window.setInterval(() => {
      if (this.status !== WebSocketStatus.CONNECTED) {
        console.log('Attempting to reconnect...');
        this.connect();
      }
    }, 5000); // 每5秒尝试重连一次
  }
}