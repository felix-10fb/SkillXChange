import json
from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # conversation_id -> List[WebSocket]
        self.active_conversations: Dict[str, List[WebSocket]] = {}
        # user_id -> WebSocket
        self.user_sockets: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, conversation_id: str, user_id: str):
        await websocket.accept()
        if conversation_id not in self.active_conversations:
            self.active_conversations[conversation_id] = []
        self.active_conversations[conversation_id].append(websocket)
        self.user_sockets[user_id] = websocket

    def disconnect(self, websocket: WebSocket, conversation_id: str, user_id: str):
        if conversation_id in self.active_conversations:
            if websocket in self.active_conversations[conversation_id]:
                self.active_conversations[conversation_id].remove(websocket)
            if not self.active_conversations[conversation_id]:
                del self.active_conversations[conversation_id]
        if user_id in self.user_sockets:
            del self.user_sockets[user_id]

    async def broadcast_to_conversation(self, conversation_id: str, data: dict):
        if conversation_id in self.active_conversations:
            message_text = json.dumps(data)
            for connection in self.active_conversations[conversation_id]:
                try:
                    await connection.send_text(message_text)
                except Exception:
                    pass

manager = ConnectionManager()
