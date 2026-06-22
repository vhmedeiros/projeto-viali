// cosmosdb.js
// responsabilidade: gerenciar a conexao com o azure cosmos db
// padrao usado: Singleton - uma unica instancia de conexao reutilizada em toda aplicacao

const { CosmosClient } = require('@azure/cosmos');

// le as variaveis de ambiente do .env
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const database = process.env.COSMOS_DB_DATABASE || 'viali';
const containerConversas = process.env.COSMOS_DB_CONTAINER_CONVERSAS || 'conversas';
const containerLeads = process.env.COSMOS_DB_CONTAINER_LEADS || 'leads';

// verifica se as variaveis obrigatorias existem
// isso evita que o server suba com config incompleta
// mesmo que o check do settings.py no django
const cosmosDisponivel = !!(endpoint && key);

if (!cosmosDisponivel) {
    console.warn('Cosmos DB NÃO configurado - conversas não serão salvas');
    console.warn('Configure COSMOS_DB_ENDPOINT e COSMOS_DB_KEY no .env');
}

// criar o cliente do cosmos db (somente se configurado)
// o CosmosClient é o ponto de entrada para todas as operações
// mesmo que o django.db.connections
let client = null;

if (cosmosDisponivel) {
    client = new CosmosClient({ endpoint, key });
}

// função auxiliar para obter um container
// no cosmos db: account -> database -> container -> documents
// no Django é:  server  -> database -> table     -> rows
async function getContainer(nomeContainer) {
    if (!client) return null;

    const { database: db } = await client.databases.createIfNotExists({ id: database });
    const { container } = await db.containers.createIfNotExists({ id: nomeContainer });

    return container;
}

// salva um documento em qualquer container do cosmos db
// nomeContainer é opcional — padrão é 'conversas'
// assim a mesma função serve pra salvar conversa E lead:
//   salvarConversa(dados)           -> salva em 'conversas'
//   salvarConversa(dados, 'leads')  -> salva em 'leads'
async function salvarConversa(dados, nomeContainer = containerConversas) {
    // se cosmos não está configurado, apenas loga e segue em frente
    // isso permite desenvolver localmente sem precisar do azure configurado
    if (!cosmosDisponivel) {
        console.log(`[MOCK] Documento não salvo (Cosmos DB não configurado) | container: ${nomeContainer}`, dados);
        return null;
    }

    try {
        const container = await getContainer(nomeContainer);

        // cria o documento com todos os campos necessarios
        const documento = {
            ...dados,
            // _ts é adicionado automaticamente pelo cosmos db (timestamp Unix)
            // mas adicionamos nosso proprio timestamp legivel em ISO 8601
            timestamp: new Date().toISOString(),
        };

        // .items.create() equivale a um INSERT no SQL / .save() no Django ORM
        const { resource } = await container.items.create(documento);
        console.log(`Documento salvo no Cosmos DB | container: ${nomeContainer} | id: ${resource.id}`);
        return resource; // retorna o documento criado (com id gerado pelo cosmos)

    } catch (erro) {
        // não deixamos o erro do banco derrubar a resposta ao usuário
        // o chatbot/api ainda responde normalmente, mesmo se o BD falhar
        console.error('Erro ao salvar no Cosmos DB: ', erro.message);
        return null;
    }
}

// exporta as funções para uso nas rotas
module.exports = {
    salvarConversa,
    getContainer,
    cosmosDisponivel,
};
