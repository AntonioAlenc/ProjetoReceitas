document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

function openCategoryModal(id = null) {
    const modalTitle = document.getElementById('categoryModalLabel');
    const categoryId = document.getElementById('categoryId');
    const categoryName = document.getElementById('categoryName');
    
    if (id) {
        modalTitle.textContent = 'Editar Categoria';
        categoryId.value = id;
        categoryName.value = document.getElementById(`category-${id}`).textContent;
    } else {
        modalTitle.textContent = 'Adicionar Categoria';
        categoryId.value = '';
        categoryName.value = '';
    }

    document.getElementById('categoryModal').style.display = 'flex';
}

function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
}

function saveCategory(event) {
    event.preventDefault();
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value;

    if (id) {
        updateCategory(id, name);
    } else {
        createCategory(name);
    }
    closeCategoryModal();
}

function createCategory() {

    let nome = document.getElementById("categoryName").value

    if(nome) {
        const categoryJson = {
            "nome": nome
        }
    
        fetch(`http://localhost:8000/categorias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryJson)
        })
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showNotification(data.erro, "error");
            } else {
                showNotification("Categoria criada com sucesso!", "success");
                document.getElementById("categoryName").value = ''
            }
        })
        .catch(error => console.error("Erro ao listar categorias:", error));
    } else {
        showNotification("Preencha o nome antes de cadastrar!", "error");
    }  
}

function updateCategory(id, name) {
    $.ajax({
        url: `/categorias/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ name }),
        success: (updatedCategory) => {
            document.getElementById(`category-${id}`).textContent = updatedCategory.name;
            closeCategoryModal();
        },
        error: (xhr, status, error) => {
            console.error("Erro ao atualizar categoria:", error);
        }
    });
}

function deleteCategory(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {

        fetch(`http://localhost:8000/categorias/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showNotification(data.erro, "error");
            } else {
                showNotification("Categoria deletada com sucesso!", "success");
                loadCategories()
            }
        })
        .catch(error => console.error("Erro ao deletar categoria:", error));
    }
}

function loadCategories() {

    fetch(`http://localhost:8000/categorias`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            showNotification(data.erro, "error");
        } else {
            if(document.getElementById('tbdoy-categorias')) {

                let tbody = document.getElementById('tbdoy-categorias')
                tbody.innerHTML = ''

                data.forEach(cat => {
                    tbody.appendChild( preencheTabelaCat(cat))
                })               
            }

            if(document.getElementById('recipeCategory')) {
                preencheComboCat(data)
            }
           
        }
    })
    .catch(error => console.error("Erro ao listar categorias:", error));
}

function addCategoryToTable(category) {
    const tbody = document.getElementById('categoryTableBody');
    const row = document.createElement('tr');
    row.id = `row-${category.id}`;
    row.innerHTML = `
        <td id="category-${category.id}">${category.name}</td>
        <td>
            <button class="btn btn-sm btn-secondary" onclick="openCategoryModal(${category.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">Excluir</button>
        </td>
    `;
    tbody.appendChild(row);
}

function preencheComboCat (categories) {
    let comboCat = document.getElementById('recipeCategory')
    comboCat.innerHTML = ''

    categories.forEach(element => {
        comboCat.innerHTML += `<option value = ${element.id}>${element.nome}</option`  
    })
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function preencheTabelaCat (categoria) {

    let row = document.createElement('tr')

    let tdCode = document.createElement('td')
    let tdName = document.createElement('td')
    let tdActions = document.createElement('td')
    let divButtons = document.createElement('div')
    let btnEditar = document.createElement('button')
    let btnExcluir = document.createElement('button')

    btnEditar.innerText = 'Editar'
    btnExcluir.innerText = 'Excluir'

    divButtons.classList = 'divBtnTable'

    divButtons.appendChild(btnEditar)
    divButtons.appendChild(btnExcluir)

    tdActions.appendChild(divButtons)

    tdCode.innerText = categoria.id
    tdName.innerText = categoria.nome

    btnExcluir.onclick = function () {
        deleteCategory(categoria.id)
    }

    row.appendChild(tdCode)
    row.appendChild(tdName)
    row.appendChild(tdActions)

    return row
}
