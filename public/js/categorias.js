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

function createCategory(name) {
    $.ajax({
        url: '/categorias',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name }),
        success: (newCategory) => {
            addCategoryToTable(newCategory);
            closeCategoryModal();
        },
        error: (xhr, status, error) => {
            console.error("Erro ao criar categoria:", error);
        }
    });
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
        $.ajax({
            url: `/categorias/${id}`,
            method: 'DELETE',
            success: () => {
                document.getElementById(`row-${id}`).remove();
            },
            error: (xhr, status, error) => {
                console.error("Erro ao excluir categoria:", error);
            }
        });
    }
}

function loadCategories() {
    $.ajax({
        url: '/categorias',
        method: 'GET',
        success: (categories) => {
            categories.forEach(category => addCategoryToTable(category));
        },
        error: (xhr, status, error) => {
            console.error("Erro ao carregar categorias:", error);
        }
    });
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
