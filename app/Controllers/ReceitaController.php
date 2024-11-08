<?php
namespace App\Controllers;

use App\Models\Receita;


class ReceitaController {

    public static function criarReceita($dados) {
        if (empty($dados['nome']) || empty($dados['ingredientes']) || empty($dados['modo_preparo']) || empty($dados['categoria_id'])) {
            return json_encode(['erro' => 'Todos os campos são obrigatórios']);
        }
        
        Receita::criar($dados);
        return json_encode(['mensagem' => 'Receita criada com sucesso']);
    }

    public static function listarReceitas() {
        $receitas = Receita::listarTodas();
        return json_encode($receitas);
    }

    public static function listarReceitaPorId($id) {
        $receita = Receita::listarPorId($id);
        if ($receita) {
            return json_encode($receita);
        }
        return json_encode(['erro' => 'Receita não encontrada']);
    }

    public static function atualizarReceita($id, $dados) {
        if (empty($dados['nome']) || empty($dados['ingredientes']) || empty($dados['modo_preparo'])) {
            return json_encode(['erro' => 'Todos os campos são obrigatórios']);
        }
        
        Receita::atualizar($id, $dados);
        return json_encode(['mensagem' => 'Receita atualizada com sucesso']);
    }

    public static function excluirReceita($id) {
        Receita::excluir($id);
        return json_encode(['mensagem' => 'Receita excluída com sucesso']);
    }
}

