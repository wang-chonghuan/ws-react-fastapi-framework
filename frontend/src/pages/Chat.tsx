import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

// 定义主题颜色
const CHAT_COLORS = {
  background: 'bg-white',
  userBubble: 'bg-zinc-200 text-zinc-900',
  aiBubble: 'bg-zinc-100 text-zinc-900',
} as const;

// 定义消息类型
interface Message {
  id: number;
  text: string;
  isSelf: boolean;
  timestamp: Date;
}

// 聊天气泡组件
const ChatBubble = ({ message }: { message: Message }) => (
  <div className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-full w-fit rounded-2xl px-4 py-2 ${
      message.isSelf 
        ? CHAT_COLORS.userBubble + ' rounded-br-none' 
        : CHAT_COLORS.aiBubble + ' rounded-bl-none'
    }`}>
      <p className="break-words">{message.text}</p>
    </div>
  </div>
);

// 聊天历史记录组件
const HistoryCard = ({ messages }: { messages: Message[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

// 输入框组件
const InputCard = ({ onSend }: { onSend: (text: string) => void }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-white border-t">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            className="bg-black text-white rounded-full p-3 hover:bg-gray-800 focus:outline-none"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

// 主聊天组件
const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! Welcome to the chat room",
      isSelf: false,
      timestamp: new Date()
    }
  ]);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      isSelf: true,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);

    // 模拟自动回复
    setTimeout(() => {
      const replyMessage: Message = {
        id: messages.length + 2,
        text: "This is an automated reply",
        isSelf: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  return (
    <div className={`flex flex-col h-[100dvh] ${CHAT_COLORS.background}`}>
      <div className="h-[var(--topbar-h)]" />
      <div className="flex-1 overflow-hidden flex flex-col">
        <HistoryCard messages={messages} />
        <InputCard onSend={handleSend} />
      </div>
      <div className="h-[var(--bottombar-h)]" />
    </div>
  );
};

export default Chat; 