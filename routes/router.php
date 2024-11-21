<?php

use App\Controllers\CategoriaController;
use App\Controllers\ReceitaController;

require_once './app/controllers/CategoriaController.php';
require_once './app/controllers/ReceitaController.php';

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

function getRoutePath($uri) {
    return parse_url($uri, PHP_URL_PATH);
}

switch (getRoutePath($requestUri)) {
    
    case '/categorias':
        if ($requestMethod === 'GET') {
            echo CategoriaController::listarCategorias();
        } elseif ($requestMethod === 'POST') {
            $dados = json_decode(file_get_contents("php://input"), true);
            echo CategoriaController::criarCategoria($dados);
        }
        break;

    case (preg_match('/^\/categorias\/(\d+)$/', getRoutePath($requestUri), $matches) ? true : false):
        $categoriaId = $matches[1];
        if ($requestMethod === 'GET') {
            echo CategoriaController::listarCategoriaPorId($categoriaId);
        } elseif ($requestMethod === 'PUT') {
            $dados = json_decode(file_get_contents("php://input"), true);
            echo CategoriaController::atualizarCategoria($categoriaId, $dados);
        } elseif ($requestMethod === 'DELETE') {
            echo CategoriaController::excluirCategoria($categoriaId);
        }
        break;

    case '/receitas':
        if ($requestMethod === 'GET') {
            echo ReceitaController::listarReceitas();
        } elseif ($requestMethod === 'POST') {
            $dados = json_decode(file_get_contents("php://input"), true);
            echo ReceitaController::criarReceita($dados);
        }
        break;

    case (preg_match('/^\/receitas\/(\d+)$/', getRoutePath($requestUri), $matches) ? true : false):
        $receitaId = $matches[1];
        if ($requestMethod === 'GET') {
            echo ReceitaController::listarReceitaPorId($receitaId);
        } elseif ($requestMethod === 'PUT') {
            $dados = json_decode(file_get_contents("php://input"), true);
            echo ReceitaController::atualizarReceita($receitaId, $dados);
        } elseif ($requestMethod === 'DELETE') {
            echo ReceitaController::excluirReceita($receitaId);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["erro" => "Rota não encontrada"]);
        break;
}
