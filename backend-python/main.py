# main.py
# ponto de entrada da aplicação

import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# carrega variaveis de ambiente do .env
load_dotenv()

# cria instacia da aplicação fastapi
# titulo e versão aparece na doc automatica
app = FastAPI(
    title="Viali IA Service",
    description="Serviço de IA com RAG para chatbot da Viali Assessoria Contábil",
    version="1.0.0"
)

# configura CORS - mesma necessidade do node.js
# permite requisições do node e do front
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em prod deixar apenas para os dominios reais
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SCHEMAS


class ChatRequest(BaseModel):
    pergunta: str
    sessao_id: str | None = None  # opcional por enquanto


class ChatResponse(BaseModel):
    resposta: str
    sessao_id: str | None = None

# ROTAS


@app.get("/health")
def health_check():
    """
    Health check endpoint - padrão de mercado para verificar saúde do serviço
    Retorna status, nome do serviço e timestamp.
    """
    return {
        "status": "ok",
        "service": "backend-python",
        "timestamp": datetime.utcnow().isoformat(),
        "enviroment": os.getenv("NODE_ENV", "development")
    }


@app.get("/")
def root():
    return {
        "message": "Viali IA Service - Python rodando!",
        "version": "1.0.0",
        "docs": "/docs",  # FastAPI gera doc Swagger automatica aqui
        "endpoints": ["/health", "/chat", "/docs"]
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Endpoint principal do chatbot.
    Recebe a pergunta do usuario e retorna a resposta da IA
    """

    # TODO: integrar com RAG / LLM aqui
    resposta = f"[Python recebeu] Pergunta: {request.pergunta}"

    return ChatResponse(
        resposta=resposta,
        sessao_id=request.sessao_id
    )
