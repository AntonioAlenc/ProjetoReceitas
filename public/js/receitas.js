document.addEventListener('DOMContentLoaded', () => {
    loadAllRecipes();
    loadCategories(); // Carregar categorias ao iniciar
});

// Função para carregar todas as receitas
function loadAllRecipes() {
    fetch('http://localhost:8000/receitas')
        .then(response => response.json())
        .then(recipes => renderRecipes(recipes))
        .catch(error => console.error('Erro ao carregar receitas:', error));
}

// Renderiza as receitas na tabela
function renderRecipes(recipes) {
    const tbody = document.getElementById('recipeTableBody');
    tbody.innerHTML = ''; // Limpa a tabela antes de renderizar

    recipes.forEach(recipe => {
        const row = document.createElement('tr');
        row.id = `row-${recipe.id}`;
        row.innerHTML = `
            <td>${recipe.nome}</td>
            <td>${recipe.ingredientes}</td>
            <td>${recipe.modo_preparo}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="openRecipeModal(${recipe.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecipe(${recipe.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Carrega categorias e preenche o combo box
function loadCategories() {
    fetch('http://localhost:8000/categorias')
        .then(response => response.json())
        .then(categories => {
            preencheComboCat(categories); // Preenche o combo box
        })
        .catch(error => console.error("Erro ao carregar categorias:", error));
}

function preencheComboCat(categories) {
    console.log("oiii")
    const recipeCategory = document.getElementById('recipeCategory');
    
    if (!recipeCategory) {
        console.error('Elemento recipeCategory não encontrado no DOM');
        return;
    }

    recipeCategory.innerHTML = '<option value="" disabled selected>Selecione uma Categoria</option>';
    
    categories.forEach(category => {
        recipeCategory.innerHTML += `<option value="${category.id}">${category.nome}</option>`;
    });
}

function openRecipeModal(id = null) {
    const modalTitle = document.getElementById('recipeModalLabel');
    const recipeId = document.getElementById('recipeId');
    const recipeName = document.getElementById('recipeName');
    const recipeIngredients = document.getElementById('recipeIngredients');
    const recipePreparation = document.getElementById('recipePreparation');
    const recipeCategory = document.getElementById('recipeCategory');

    if (id) {
        modalTitle.textContent = 'Editar Receita';
        recipeId.value = id;

        fetch(`http://localhost:8000/receitas/${id}`)
            .then(response => response.json())
            .then(recipe => {
                recipeName.value = recipe.nome;
                recipeIngredients.value = recipe.ingredientes;
                recipePreparation.value = recipe.modo_preparo;
                recipeCategory.value = recipe.categoria_id;
            })
            .catch(error => console.error("Erro ao carregar a receita:", error));
    } else {
        modalTitle.textContent = 'Adicionar Receita';
        recipeId.value = '';
        recipeName.value = '';
        recipeIngredients.value = '';
        recipePreparation.value = '';
        recipeCategory.value = '';
    }

    document.getElementById('recipeModal').style.display = 'flex';
}

function closeRecipeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

function saveRecipe(event) {
    event.preventDefault();
    const id = document.getElementById('recipeId').value;
    const name = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('recipeIngredients').value;
    const preparation = document.getElementById('recipePreparation').value;
    const categoryId = document.getElementById('recipeCategory').value;

    if (!name || !ingredients || !preparation || !categoryId) {
        showNotification("Todos os campos são obrigatórios", "error");
        return;
    }

    const recipeData = {
        nome: name,
        ingredientes: ingredients,
        modo_preparo: preparation,
        categoria_id: categoryId
    };

    if (id) {
        updateRecipe(id, recipeData);
    } else {
        createRecipe(recipeData);
    }
}

function createRecipe(recipe) {
    fetch('http://localhost:8000/receitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe)
    })
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            showNotification(data.erro, "error");
        } else {
            loadAllRecipes();
            closeRecipeModal();
            showNotification("Receita criada com sucesso!", "success");
        }
    })
    .catch(error => console.error("Erro ao criar receita:", error));
}

function updateRecipe(id, recipe) {
    fetch(`http://localhost:8000/receitas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe)
    })
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            showNotification(data.erro, "error");
        } else {
            loadAllRecipes();
            closeRecipeModal();
            showNotification("Receita atualizada com sucesso!", "success");
        }
    })
    .catch(error => console.error("Erro ao atualizar receita:", error));
}

function deleteRecipe(id) {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
        fetch(`http://localhost:8000/receitas/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showNotification(data.erro, "error");
            } else {
                document.getElementById(`row-${id}`).remove();
                showNotification("Receita excluída com sucesso!", "success");
            }
        })
        .catch(error => console.error("Erro ao excluir receita:", error));
    }
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
