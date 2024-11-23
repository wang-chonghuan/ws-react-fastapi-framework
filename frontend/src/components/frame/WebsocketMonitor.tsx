// src/components/WebSocketMonitor.tsx

import React, { useState } from 'react';
import { useWebSocketDebug } from '../../websocket/useWebSocketDebug';
import { SubscriptionType } from '../../websocket/types';

const styles = {
  modal: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#1e1e1e',
    color: '#e0e0e0',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    fontFamily: 'Monaco, Consolas, monospace',
    height: '50vh',
    width: '400px',
    overflowY: 'auto' as const,
    whiteSpace: 'pre' as const,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    cursor: 'default'
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    cursor: 'pointer',
    touchAction: 'none',
    userSelect: 'none' as const
  }
};

interface WebSocketMonitorProps {
  onClose: () => void;
}

export const WebSocketMonitor: React.FC<WebSocketMonitorProps> = ({ onClose }) => {
  const { isConnected, subscriptions } = useWebSocketDebug();

  const formatSubscriptionInfo = (subscription: any): string => {
    let info = '';
    const config = subscription.config;

    if (config.type === SubscriptionType.SE) {
      info = [
        `ID:        ${subscription.id}`,
        `Type:      ${config.type}`,
        `Parameter: ${config.paramId}`,
        `Period:    ${config.period}`,
        `Samples:   ${config.samples}`,
        `Window:    ${config.window}`,
        `Interval:  ${config.interval}min`,
        `Updated:   ${subscription.lastUpdate?.toLocaleTimeString() || 'Never'}`
      ].join('\n');
    } else {
      info = [
        `ID:         ${subscription.id}`,
        `Type:       ${config.type}`,
        `Parameters: ${config.paramIds.join(', ')}`,
        `Interval:   ${config.interval}s`,
        `Updated:    ${subscription.lastUpdate?.toLocaleTimeString() || 'Never'}`
      ].join('\n');
    }

    return info;
  };

  const getDisplayText = (): string => {
    const lines = [
      '=== WebSocket Monitor ===',
      '',
      `Status: ${isConnected ? 'CONNECTED' : 'DISCONNECTED'}`,
      '',
      `Active Subscriptions: ${subscriptions.length}`,
      '',
      ...subscriptions.map(sub => [
        '------------------------',
        formatSubscriptionInfo(sub),
        ''
      ]).flat()
    ];

    return lines.join('\n');
  };

  return (
    <>
      <div 
        onClick={onClose} 
        style={styles.overlay}
        onTouchMove={e => e.preventDefault()}
      />
      <pre 
        style={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        {getDisplayText()}
        {'\n\n[点击外部区域关闭]'}
      </pre>
    </>
  );
};