document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

// Função para exibir notificações de sucesso ou erro
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Função para carregar receitas da categoria selecionada
function loadRecipesByCategory(categoryId) {
    $.ajax({
        url: `/receitas/categoria/${categoryId}`,
        method: 'GET',
        success: (recipes) => {
            renderRecipes(recipes);
        },
        error: () => {
            showNotification("Erro ao carregar receitas. Tente novamente.", "error");
        }
    });
}

// Renderiza as receitas na tabela
function renderRecipes(recipes) {
    const tbody = document.getElementById('recipeTableBody');
    tbody.innerHTML = ''; // Limpa a tabela antes de renderizar

    recipes.forEach(recipe => {
        const row = document.createElement('tr');
        row.id = `row-${recipe.id}`;
        row.innerHTML = `
            <td id="recipe-name-${recipe.id}">${recipe.name}</td>
            <td id="recipe-desc-${recipe.id}">${recipe.description}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="openRecipeModal(${recipe.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecipe(${recipe.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Abre o modal para adicionar ou editar receita
function openRecipeModal(id = null) {
    const modalTitle = document.getElementById('recipeModalLabel');
    const recipeId = document.getElementById('recipeId');
    const recipeName = document.getElementById('recipeName');
    const recipeDescription = document.getElementById('recipeDescription');

    if (id) {
        modalTitle.textContent = 'Editar Receita';
        recipeId.value = id;
        recipeName.value = document.getElementById(`recipe-name-${id}`).textContent;
        recipeDescription.value = document.getElementById(`recipe-desc-${id}`).textContent;
    } else {
        modalTitle.textContent = 'Adicionar Receita';
        recipeId.value = '';
        recipeName.value = '';
        recipeDescription.value = '';
    }

    document.getElementById('recipeModal').style.display = 'flex';
}

// Fecha o modal de receita
function closeRecipeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

// Função para salvar uma receita (criar ou atualizar)
function saveRecipe(event) {
    event.preventDefault();
    const id = document.getElementById('recipeId').value;
    const name = document.getElementById('recipeName').value;
    const description = document.getElementById('recipeDescription').value;

    if (id) {
        updateRecipe(id, { name, description });
    } else {
        createRecipe({ name, description });
    }
    closeRecipeModal();
}

// Cria uma nova receita
function createRecipe(recipe) {
    $.ajax({
        url: '/receitas',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(recipe),
        success: (newRecipe) => {
            renderRecipes([newRecipe]);
            closeRecipeModal();
            showNotification("Receita adicionada com sucesso!");
        },
        error: () => {
            showNotification("Erro ao criar receita. Tente novamente.", "error");
        }
    });
}

// Atualiza uma receita existente
function updateRecipe(id, recipe) {
    $.ajax({
        url: `/receitas/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(recipe),
        success: (updatedRecipe) => {
            document.getElementById(`recipe-name-${id}`).textContent = updatedRecipe.name;
            document.getElementById(`recipe-desc-${id}`).textContent = updatedRecipe.description;
            closeRecipeModal();
            showNotification("Receita atualizada com sucesso!");
        },
        error: () => {
            showNotification("Erro ao atualizar receita. Tente novamente.", "error");
        }
    });
}

// Exclui uma receita
function deleteRecipe(id) {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
        $.ajax({
            url: `/receitas/${id}`,
            method: 'DELETE',
            success: () => {
                document.getElementById(`row-${id}`).remove();
                showNotification("Receita excluída com sucesso!");
            },
            error: () => {
                showNotification("Erro ao excluir receita. Tente novamente.", "error");
            }
        });
    }
}
