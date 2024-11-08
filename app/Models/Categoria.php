<?php
namespace App\models;

use Config\database;
use PDO;

class Categoria {

    public static function criar($dados) {
        $pdo = database::conectar();
        $stmt = $pdo->prepare("INSERT INTO categorias (nome) VALUES (?)");
        $stmt->execute([$dados['nome']]);
    }

    public static function listarTodas() {
        $pdo = database::conectar();
        $stmt = $pdo->query("SELECT * FROM categorias");
  
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $res;
    }

    public static function listarPorId($id) {
        $pdo = database::conectar();
        $stmt = $pdo->prepare("SELECT * FROM categorias WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function atualizar($id, $dados) {
        $pdo = database::conectar();
        $stmt = $pdo->prepare("UPDATE categorias SET nome = ? WHERE id = ?");
        $stmt->execute([$dados['nome'], $id]);
    }

    public static function excluir($id) {
        $pdo = database::conectar();
        $stmt = $pdo->prepare("DELETE FROM categorias WHERE id = ?");
        $stmt->execute([$id]);
    }
}
?>
