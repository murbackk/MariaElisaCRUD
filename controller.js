let listaProjetos = [];
let oQueEstaFazendo = '';
let projeto = null;
bloquearAtributos(true); 
visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none', 'none');

function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaProjetos.length; i++) {
        const projeto = listaProjetos[i];
        if (projeto.id == chave) {
            projeto.posicaoNaLista = i;
            return listaProjetos[i];
        }
    }
    return null; // Não encontrou
}

// Função para procurar um projeto pela chave primária
function procure() {
    const id = document.getElementById("id").value;
    if (isNaN(id)) {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("id").focus();
        return;
    }

    if (id) { // Se digitou um Id
        projeto = procurePorChavePrimaria(id);
        if (projeto) { // Achou na lista
            mostrarDadosProjeto(projeto);
            visibilidadeDosBotoes('none', 'none', 'inline-block', 'inline-block','none', 'none'); // Habilita botões de alterar e excluir e cancelar
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { // Não achou na lista
            mostrarAviso("Não achou na lista, clique em inserir");
            limparAtributos();
            visibilidadeDosBotoes('none', 'inline', 'none', 'none', 'none', 'inline');
            
        }
    } else {
        document.getElementById("id").focus();
        mostrarAviso("Insira um ID");
        return;
    }
}

// Função para inserir um novo projeto
function inserir() {
     oQueEstaFazendo = 'inserindo'; 
     mostrarAviso("INSERINDO - Digite os atributos e clique no botão salvar");
     bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline', 'none');
   
   
    document.getElementById("id").focus();
}

// Função para alterar um projeto existente
function alterar() {
    mostrarAviso("ALTERANDO - Digite os atributos e clique no botão salvar");
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline', 'none');
    oQueEstaFazendo = 'alterando';
    
}

// Função para excluir um projeto
function excluir() {
    if (!projeto) {
        mostrarAviso("Nenhum projeto selecionado para exclusão");
        return; // Se não há projeto selecionado, não faz nada
    }
    
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique no botão salvar para confirmar a exclusão");
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline', 'none');
}

// Função para salvar um projeto (inserir, alterar ou excluir)
function salvar() {
    let id;
    if (projeto == null) {
        id = parseInt(document.getElementById("id").value);
    } else {
        id = projeto.id;
    }

    const nome = document.getElementById("nome").value;
    const area = document.getElementById("area").value;
    const presidente = document.getElementById("presidente").value;
    const dataRealizacao = document.getElementById("dataRealizacao").value;
    const anoRotario = document.getElementById("anoRotario").value;
    const local = document.getElementById("local").value;

    // Verificar se os dados estão completos
    if (id && nome && area && presidente && dataRealizacao && anoRotario && local) {
        switch (oQueEstaFazendo) {
            case 'inserindo':
                projeto = new Projeto(id, nome, area, presidente, dataRealizacao, anoRotario, local);
                listaProjetos.push(projeto);
                mostrarAviso("Projeto inserido na lista");
                limparAtributos();
                limparID()
                break;
            case 'alterando':
                let projetoAlterado = new Projeto(id, nome, area, presidente, dataRealizacao, anoRotario, local);
                listaProjetos[projeto.posicaoNaLista] = projetoAlterado;
                mostrarAviso("Projeto alterado");
                limparID()
                break;
            case 'excluindo':
                // Verifique se o projeto foi encontrado antes de excluí-lo
                if (projeto) {
                    listaProjetos.splice(projeto.posicaoNaLista, 1); // Remove o projeto da lista
                    mostrarAviso("Projeto excluído");
                    limparAtributos();
                    limparID()
                } else {
                    mostrarAviso("Nenhum projeto para excluir");
                }
                break;
            default:
                mostrarAviso("Erro desconhecido");
        }

        // Atualize a listagem e limpe os campos
        listar();
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none', 'inline');
        limparAtributos();
        document.getElementById("id").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

// Função para preparar a listagem dos projetos
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const projeto = vetor[i];
        texto += `${projeto.id} - ${projeto.nome} - ${projeto.area} - ${projeto.presidente} - ${projeto.dataRealizacao} - ${projeto.anoRotario} - ${projeto.local}<br>`;
    }
    return texto;
}

// Função para listar os projetos cadastrados
function listar() {
    document.getElementById("output").innerHTML = preparaListagem(listaProjetos);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(false);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none', 'inline');
    mostrarAviso("Operação de edição cancelada");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do projeto nos campos
function mostrarDadosProjeto(projeto) {
    document.getElementById("id").value = projeto.id;
    document.getElementById("nome").value = projeto.nome;
    document.getElementById("area").value = projeto.area;
    document.getElementById("presidente").value = projeto.presidente;
    document.getElementById("dataRealizacao").value = projeto.dataRealizacao;
    document.getElementById("anoRotario").value = projeto.anoRotario;
    document.getElementById("local").value = projeto.local;

    // Define os campos como readonly
    bloquearAtributos(true);
}

// Função para limpar os dados dos campos
function limparAtributos() {
    document.getElementById("nome").value = "";
    document.getElementById("area").value = "";
    document.getElementById("presidente").value = "";
    document.getElementById("dataRealizacao").value = "";
    document.getElementById("anoRotario").value = "";
    document.getElementById("local").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("id").readOnly = !soLeitura;
    document.getElementById("nome").readOnly = soLeitura;
    document.getElementById("area").readOnly = soLeitura;
    document.getElementById("presidente").readOnly = soLeitura;
    document.getElementById("dataRealizacao").readOnly = soLeitura;
    document.getElementById("anoRotario").readOnly = soLeitura;
    document.getElementById("local").readOnly = soLeitura;
}

// Função para alterar a visibilidade dos botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar, btCancelar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btCancelar;
    document.getElementById("id").focus();
}

function limparID(){
    document.getElementById("id").value = "";
}