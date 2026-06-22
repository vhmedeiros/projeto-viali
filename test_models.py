import os 
from dotenv import load_dotenv
from openai import AzureOpenAI, OpenAI  # importa os dois

load_dotenv()

# ✅ DeepSeek usa OpenAI padrão com base_url customizada
deepseek_client = OpenAI(
    api_key=os.getenv("AZURE_AI_API_KEY"),
    base_url="https://victorhugomls-4206-resource.services.ai.azure.com/openai/v1/",
)

# ✅ Embedding continua com AzureOpenAI normalmente
embedding_client = AzureOpenAI(
    api_key=os.getenv("AZURE_AI_API_KEY"),
    azure_endpoint=os.getenv("EMBEDDING_API_ENDPOINT"),
    api_version=os.getenv("EMBEDDING_API_VERSION"),
)

# teste 1 - deepseek-v4-flash (chat completion)
print("*" * 50)
print("Testando DeepSeek-V4_flash...")
print("*" * 50)

try:
    response = deepseek_client.chat.completions.create(
        model=os.getenv("DEEPSEEK_DEPLOYMENT_NAME"),  # "DeepSeek-V4-Flash"
        messages=[
            {"role": "system", "content": "Você é um assistente útil."},
            {"role": "user", "content": "Olá! Me diga em uma frase quem você é."}
        ],
        max_tokens=100,
    )
    print(f" Resposta: {response.choices[0].message.content}")
    print(f" Tokens usados: {response.usage.total_tokens}")
except Exception as e:
    print(f" Erro no Deepseek: {e}")

# teste 2 - text-embedding-3-small
print("\n" + "=" * 50)
print(" Testando text-embedding-3-small...")
print("=" * 50)

try:
    texto = "Azure AI Foundry é uma plataforma incrivel para IA. Será?"
    response = embedding_client.embeddings.create(
        model=os.getenv("EMBEDDING_DEPLOYMENT_NAME"),
        input=texto,
    )
    vetor = response.data[0].embedding
    print(f" Embedding gerado com sucesso!")
    print(f" Texto: '{texto}'")
    print(f" Dimensões do vetor: {len(vetor)}")
    print(f" Primeiros 5 valores: {vetor[:5]}")
except Exception as e:
    print(f" Erro no Embedding: {e}")
