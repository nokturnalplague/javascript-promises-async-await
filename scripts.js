const uploadBtn = document.getElementById("upload-btn");
const inputUpload = document.getElementById("imagem-upload");

uploadBtn.addEventListener("click", () => {
    inputUpload.click();
});

function lerConteudoDoArquivo(arquivo) { //promessa = algo que não sabemos se vai dar certo ou não | assincronicidade
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => {
            resolve({url: leitor.result, nome: arquivo.name})
        }

        leitor.onerror = () => {
            reject(`Erro na leitura do arquivo ${arquivo.name}`)
        }

        leitor.readAsDataURL(arquivo) //converte em uma URL de dados para repesentar o arquivo
    }) 
};

const imagemPrincipal = document.querySelector(".main-imagem");
const nomeDaImagem = document.querySelector(".container-imagem-nome p");

inputUpload.addEventListener("change", async (evento) => {
    const arquivo = evento.target.files[0]; //entra no evento e pega o arquivo sendo enviado

    if (arquivo) {
        try {
            const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo); //await define o que deve ser esperado antes da função
            imagemPrincipal.src = conteudoDoArquivo.url;
            nomeDaImagem.textContent = conteudoDoArquivo.nome;
        } catch (erro) {
            console.error("Erro na leitura do arquivo.");
        }
    }
});

const inputTags = document.getElementById("input-tags");
const listaTags = document.getElementById("lista-tags");

listaTags.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("remove-tag")) { //confere se tem a tag
        const tagQueQueroRemover = evento.target.parentElement; //pega o elemento pai da imagem de exclusão, ou seja, o li
        listaTags.removeChild(tagQueQueroRemover);
    }
});

const tagsDisponiveis = ["Front-end", "Programação", "Data Science", "Full-stack", "HTML", "CSS", "JavaScript"];

async function verificaTagsDisponíveis(tagTexto){
    return new Promise ((resolve) => { //PRECISA ser assíncrona | não tem reject porque está simulando um banco de dados nesse caso
        setTimeout(() => { //definir o que queremos que aconteça e quando
            resolve(tagsDisponiveis.includes(tagTexto));
        }, 1000); //define o tempo


    })
};

inputTags.addEventListener("keypress", async (evento) => { //keypress monitora as teclas do teclado
    if (evento.key === "Enter") {
        evento.preventDefault(); //evitar que a página atualize ao dar enter
        const tagTexto = inputTags.value.trim();
        if (tagTexto !== "") {
            try {
                const tagExiste = await verificaTagsDisponíveis(tagTexto);
                if (tagExiste){
                    const tagNova = document.createElement("li");
                    tagNova.innerHTML = `<p>${tagTexto}</p> <img src="./img/close-black.svg" class="remove-tag">`
                    listaTags.appendChild(tagNova);
                    inputTags.value = "";
                } else {
                    alert("Tag não foi encontrada.");
                }
            } catch (error) {
                console.error("Erro ao verificar a existência da tag" + error);
                alert("Erro ao verificar a existência da tag. Verifique o console.");
            }
        }
    }
});

const botaoPublicar = document.querySelector(".botao-publicar");

//Simulação de envio dos dados para o back-end/banco de dados
async function publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsProjeto) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const deuCerto = Math.random() > 0.5; //Para simular a resposta da promise com fator externo

            if(deuCerto) {
                resolve("Projeto publicado com sucesso.");
            } else {
                reject("Erro ao publicar o projeto");
            }
        }, 2000); //Simula a demora da internet do usuário
    })
};

botaoPublicar.addEventListener("click", async (evento) => {
    evento.preventDefault();

    const nomeDoProjeto = document.getElementById("nome").value;
    const descricaoDoProjeto = document.getElementById("descricao").value;
    const tagsProjeto = Array.from(listaTags.querySelectorAll("p")).map((tag) => tag.textContent); //lista com todos os elementos <p> que ele encontrar dentro da lista e mapeia para pegar somente o conteúdo textual
    
    try {
        const resultado = await publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsProjeto);
        console.log(resultado); //???
        alert("Projeto enviado!");
    } catch (error) {
        console.log(error);
        alert("Falha ao enviar o projeto.");
    }
});

const botaoDescartar = document.querySelector("botao-descartar");

botaoDescartar.addEventListener("click", (evento) => {
    evento.preventDefault();

    const formulario = document.querySelector("form");
    formulario.reset();

    imagemPrincipal.src = "./img/imagem1.png";
    nomeDaImagem.textContent = "imagem_projeto.png";

    listaTags.innerHTML = "";
});