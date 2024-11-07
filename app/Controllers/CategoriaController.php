<?php
require_once __DIR__ . '/../config/database.php';

class CategoriaController {
    
    public static function listarCategorias() {
        global $pdo;
        $sql = "SELECT * FROM Categorias";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public static function criarCategoria($nome, $descricao) {
        global $pdo;
        $sql = "INSERT INTO Categorias (nome, descricao) VALUES (:nome, :descricao)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['nome' => $nome, 'descricao' => $descricao]);
    }

    public static function atualizarCategoria($id, $nome, $descricao) {
        global $pdo;
        $sql = "UPDATE Categorias SET nome = :nome, descricao = :descricao WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id, 'nome' => $nome, 'descricao' => $descricao]);
    }

    public static function excluirCategoria($id) {
        global $pdo;
        $sql = "DELETE FROM Categorias WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
    }
}
?>
