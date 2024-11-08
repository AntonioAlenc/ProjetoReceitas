<?php

namespace App\Controllers;

use App\models\Categoria as CategoriaModel;

class CategoriaController {

    public static function criarCategoria($dados) {
        if (empty($dados['nome'])) {
            return json_encode(['erro' => 'O nome da categoria é obrigatório']);
        }

        CategoriaModel::criar($dados);
        return json_encode(['mensagem' => 'Categoria criada com sucesso']);
    }

    public static function listarCategorias() {
        $categorias = CategoriaModel::listarTodas();
        return json_encode($categorias);
    }

    public static function listarCategoriaPorId($id) {
        $categoria = CategoriaModel::listarPorId($id);
        if ($categoria) {
            return json_encode($categoria);
        }
        return json_encode(['erro' => 'Categoria não encontrada']);
    }

    public static function atualizarCategoria($id, $dados) {
        if (empty($dados['nome'])) {
            return json_encode(['erro' => 'O nome da categoria é obrigatório']);
        }

        CategoriaModel::atualizar($id, $dados);
        return json_encode(['mensagem' => 'Categoria atualizada com sucesso']);
    }

    public static function excluirCategoria($id) {
        CategoriaModel::excluir($id);
        return json_encode(['mensagem' => 'Categoria excluída com sucesso']);
    }
}
?>
