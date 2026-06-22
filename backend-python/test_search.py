import os
from dotenv import load_dotenv
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential

load_dotenv()

# configuração do azure ai search
endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
key = os.getenv("AZURE_SEARCH_KEY")
index = os.getenv("AZURE_SEARCH_INDEX")

def testar_conexao():
    """
    tenta conectat no Azure AI Search
    Ainda não tenho indice, então espoero 404 error
    apenas quero que a auth funcione
    """
    try:
        client = SearchClient(
            endpoint=endpoint,
            index_name=index,
            credential=AzureKeyCredential(key)
        )

        # tenta listar documentos (vai falar, pois ainda não existe indice)
        results = client.search(search_text="teste")
        print("Conexão OK! Indice encontrado.")

    except Exception as e:
        erro = str(e)

        # erro esperado: indice ainda não existe
        if "404" in erro or "index" in erro.lower():
            print("Conexão com Azure AI Search OK!")
            print("Indice 'viali-docs' ainda não existe - será criado em breve")
        else:
            print(f"Erro inesprado: {erro}")

if __name__ == "__main__":
    testar_conexao()