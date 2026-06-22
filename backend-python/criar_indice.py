import os
from dotenv import load_dotenv
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SearchField,
    SearchFieldDataType,
    SimpleField,
    SearchableField,
    VectorSearch,
    HnswAlgorithmConfiguration,
    VectorSearchProfile,
)
from azure.core.credentials import AzureKeyCredential

load_dotenv()

endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
key = os.getenv("AZURE_SEARCH_KEY")
index = os.getenv("AZURE_SEARCH_INDEX") # viali-docs

def criar_indice():
    # SearchIndexClient gerencia indices (criar, deletar, listar)
    # diferente do SearchClient que pesquisa DENTRO de um indice
    client = SearchIndexClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(key)
    )

    # define os campos de indice - como um Model do Django
    campos = [
        # campo obrigatorio: ID unico de cada doc
        SimpleField(
        name="id",
        type=SearchFieldDataType.String,
        key=True
        ),

        # titulo do doc (ex: "Abertura de Empresas")
        SearchableField(
            name="titulo",
            type=SearchFieldDataType.String,
        ),

        # categoria (ex: "servicos", "faq", "tributario")
        SimpleField(
            name="categoria",
            type=SearchFieldDataType.String,
            filterable=True # permite filtrar por categoria
        ),

        # vetor de embeddings para busca semantica (1536 = ada-002)
        SearchField(
            name="embedding",
            type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
            searchable=True,
            vector_search_dimensions=1536,
            vector_search_profile_name="perfil-hnsw"
        ),
    ]

    # configuração da busca vetorial
    # HNSW = Hierarchical Navigable Small World - algoritmo eficiente para busca de vetores
    vector_search = VectorSearch(
        algorithms=[
            HnswAlgorithmConfiguration(name="hnsw-config")
        ],
        profiles=[
            VectorSearchProfile(
                name="perfil-hnsw",
                algorithm_configuration_name="hnsw-config",
            )
        ]
    )

    # monta o indice completo
    indice = SearchIndex(
        name=index,
        fields=campos,
        vector_search=vector_search
    )

    # cria ou substitui o indice no Azure
    resultado = client.create_or_update_index(indice)
    print(f"indice '{resultado}' criado com sucesso!")

if __name__ == "__main__":
    criar_indice()