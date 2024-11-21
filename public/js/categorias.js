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
        categoryName.value = document.getElementById(`category-name-${id}`).textContent;
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

    if (!name) {
        showNotification("O nome da categoria é obrigatório!", "error");
        return;
    }

    const categoryData = { nome: name };

    if (id) {
        updateCategory(id, categoryData);
    } else {
        createCategory(categoryData);
    }
}

function createCategory(category) {
    fetch('http://localhost:8000/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
    })
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showNotification(data.erro, "error");
            } else {
                loadCategories();
                closeCategoryModal();
                showNotification("Categoria criada com sucesso!", "success");
            }
        })
        .catch(error => console.error("Erro ao criar categoria:", error));
}

function updateCategory(id, category) {
    fetch(`http://localhost:8000/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
    })
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showNotification(data.erro, "error");
            } else {
                loadCategories();
                closeCategoryModal();
                showNotification("Categoria atualizada com sucesso!", "success");
            }
        })
        .catch(error => console.error("Erro ao atualizar categoria:", error));
}

function deleteCategory(id) {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
        fetch(`http://localhost:8000/categorias/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    showNotification(data.erro, "error");
                } else {
                    loadCategories();
                    showNotification("Categoria excluída com sucesso!", "success");
                }
            })
            .catch(error => console.error("Erro ao excluir categoria:", error));
    }
}

function loadCategories() {
    fetch('http://localhost:8000/categorias')
        .then(response => response.json())
        .then(categories => renderCategories(categories))
        .catch(error => console.error("Erro ao carregar categorias:", error));
}

function renderCategories(categories) {
    const tbody = document.getElementById('categoryTableBody');
    tbody.innerHTML = ''; // Limpa a tabela antes de renderizar

    categories.forEach(category => {
        const row = document.createElement('tr');
        row.id = `row-${category.id}`;
        row.innerHTML = `
            <td>${category.id}</td>
            <td id="category-name-${category.id}">${category.nome}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="openCategoryModal(${category.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
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
