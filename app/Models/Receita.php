<?php
namespace App\Models;

use Config\database;
use PDO;


class Receita {

    public static function criar($dados) {
        $pdo = database::conectar();
        $stmt = $pdo->prepare("INSERT INTO receitas (nome, ingredientes, modo_preparo, categoria_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([$dados['nome'], $dados['ingredientes'], $dados['modo_preparo'], $dados['categoria_id']]);
    }

    public static function listarTodas() {
        $pdo = Database::conectar();
        $stmt = $pdo->query("SELECT * FROM receitas");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function listarPorId($id) {
        $pdo = Database::conectar();
        $stmt = $pdo->prepare("SELECT * FROM receitas WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function atualizar($id, $dados) {
        $pdo = Database::conectar();
        $stmt = $pdo->prepare("UPDATE receitas SET nome = ?, ingredientes = ?, modo_preparo = ?, categoria_id = ? WHERE id = ?");
        $stmt->execute([$dados['nome'], $dados['ingredientes'], $dados['modo_preparo'], $dados['categoria_id'], $id]);
    }

    public static function excluir($id) {
        $pdo = Database::conectar();
        $stmt = $pdo->prepare("DELETE FROM receitas WHERE id = ?");
        $stmt->execute([$id]);
    }
}
?>
