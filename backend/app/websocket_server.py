# websocket_server.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, Set
import asyncio
import logging
import random
from datetime import datetime

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SubscriptionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.subscriptions: Dict[WebSocket, Dict[str, dict]] = {}
        self.background_tasks: Set[asyncio.Task] = set()
        
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        self.subscriptions[websocket] = {}
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")
        
    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        del self.subscriptions[websocket]
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")
        
    async def handle_subscription(self, websocket: WebSocket, message: dict):
        subscription_id = message.get('id')
        payload = message.get('payload', {})
        action = payload.get('action')
        config = payload.get('config')
        
        if action == 'subscribe':
            self.subscriptions[websocket][subscription_id] = config
            logger.info(f"New subscription: {subscription_id}, config: {config}")
            # 创建该订阅的数据发送任务
            task = asyncio.create_task(self.send_mock_data_for_subscription(websocket, subscription_id, config))
            self.background_tasks.add(task)
            task.add_done_callback(self.background_tasks.discard)
            
        elif action == 'unsubscribe':
            self.subscriptions[websocket].pop(subscription_id, None)
            logger.info(f"Unsubscribed: {subscription_id}")

    async def send_mock_data_for_subscription(self, websocket: WebSocket, sub_id: str, config: dict):
        """为单个订阅发送模拟数据"""
        try:
            while websocket in self.active_connections and sub_id in self.subscriptions[websocket]:
                mock_data = {
                    'type': 'subscription',
                    'id': sub_id,
                    'payload': {
                        'timestamp': datetime.now().timestamp(),
                        'values': self.generate_mock_data(config)
                    }
                }
                
                if websocket in self.active_connections:  # 再次检查连接是否还活着
                    await websocket.send_json(mock_data)
                    logger.debug(f"Sent mock data for subscription {sub_id}")
                    
                # 根据订阅类型设置不同的更新间隔
                interval = config.get('interval', 5)  # 默认5秒
                if config['type'] == 'SE':
                    await asyncio.sleep(interval * 60)  # SE类型以分钟为单位
                else:
                    await asyncio.sleep(interval)  # ME类型以秒为单位
                    
        except Exception as e:
            logger.error(f"Error in send_mock_data_for_subscription: {e}")

    def generate_mock_data(self, config: dict) -> dict:
        """根据订阅类型生成模拟数据"""
        if config['type'] == 'SE':
            return [random.random() * 100 for _ in range(config.get('samples', 5))]
        else:  # ME type
            return {param_id: random.random() * 100 for param_id in config.get('paramIds', [])}

# 创建全局管理器实例
subscription_manager = SubscriptionManager()

async def websocket_endpoint(websocket: WebSocket):
    await subscription_manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_json()
            logger.info(f"Received message: {message}")
            
            if message.get('type') == 'subscription':
                await subscription_manager.handle_subscription(websocket, message)
            else:
                logger.warning(f"Unknown message type: {message.get('type')}")
                
    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"Error in websocket connection: {e}")
    finally:
        await subscription_manager.disconnect(websocket)

def init_websocket(app: FastAPI) -> None:
    """初始化WebSocket路由"""
    app.add_api_websocket_route("/ws", websocket_endpoint)