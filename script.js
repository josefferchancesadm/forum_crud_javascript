const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sId = document.querySelector("#m-id");
const sDescricao = document.querySelector("#m-descricao");
const sPreco = document.querySelector("#m-preco");
const btnSalvar = document.querySelector("#btnSalvar");

const url =
  "https://my-json-server.typicode.com/josefferchancesadm/banco/product";

let itens = [];
let id;
let item;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sId.value = itens[index].id;
    sDescricao.value = itens[index].descricao;
    sPreco.value = itens[index].preco;
    id = index;
  } else {
    sId.value = "";
    sDescricao.value = "";
    sPreco.value = "";
  }
  item = {
    id: sId.value,
    descricao: sDescricao.value,
    preco: sPreco.value,
  };
}

function editItem(index) {
  openModal(true, index);
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.id}</td>
    <td>${item.descricao}</td>
    <td>R$ ${item.preco}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = (e) => {
  if (sDescricao.value == "" || sPreco.value == "") {
    return;
  }

  e.preventDefault();

  item = {
    id: sId.value,
    descricao: sDescricao.value,
    preco: sPreco.value,
  };

  if (id !== undefined) {
    itens[id].id = sId.value;
    itens[id].descricao = sDescricao.value;
    itens[id].preco = sPreco.value;
    atualizarItem(item);
  } else {
    //sId.value = retornaSequencia();

    novoItem(item);
  }

  modal.classList.remove("active");
  //loadItens();
  id = undefined;
};

function loadItens() {
  itens = getItensBD();
}

function retornaSequencia() {
  let id = 1;
  itens.forEach((item, index) => {
    if (item.id >= id) {
      id = Number(item.id) + 1;
    }
  });
  return id;
}

async function getItensBD() {
  //JSON.parse(localStorage.getItem('dbfunc')) ?? []

  return await fetch(url)
    .then((response) => response.json())
    .then((json) => {
      itens = json;
      tbody.innerHTML = "";
      itens.forEach((item, index) => {
        insertItem(item, index);
      });
    })
    .catch((e) => {
      alert(`Houve uma falha ao carregar dados do servidor! ${e.message}`);
    });
}
const setItensBD = (item) => {
  //localStorage.setItem("dbfunc", JSON.stringify(itens));
};

async function novoItem(value) {
  value.id = await retornaSequencia();

  //console.log(value);

  await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: value.id,
      descricao: value.descricao,
      preco: value.preco,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      itens.push(json);
      tbody.innerHTML = "";
      itens.forEach((item, index) => {
        insertItem(item, index);
      });

      alert("Gravado com sucesso!");
      item = undefined;
    })
    .catch((e) => {
      alert(`Houve uma erro ao gravar dados no servidor! ${e.message}`);
      item = undefined;
    });
}

async function atualizarItem(value) {
  await fetch(`${url}/${value.id}`, {
    method: "PUT",
    body: JSON.stringify({
      id: value.id,
      descricao: value.descricao,
      preco: value.preco,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      tbody.innerHTML = "";
      itens.forEach((item, index) => {
        insertItem(item, index);
      });

      alert("Atualizado com sucesso!");
      item = undefined;
    })
    .catch((e) => {
      alert(`Houve uma erro ao gravar dados no servidor! ${e.message}`);
      item = undefined;
    });
}

async function deleteItem(value) {
  //console.log(value);
  item = itens.filter((vl, index) => {
    return index == value;
  })[0];

  //console.log(item.id);

  if (item.id) {
    await fetch(`${url}/${item.id}`, {
      method: "DELETE",
    })
      .then(() => {
        itens.splice(index, 1);
        tbody.innerHTML = "";
        itens.forEach((item, index) => {
          insertItem(item, index);
        });

        alert("Excluido com sucesso!");
        item = undefined;
      })
      .catch((e) => {
        alert(`Houve uma erro ao excluir dados no servidor! ${e.message}`);
        item = undefined;
      });
  }
}

loadItens();
