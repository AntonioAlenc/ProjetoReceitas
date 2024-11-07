<?php
require_once __DIR__ . '/../config/database.php';

class Categoria {
    private $id;
    private $nome;
    private $descricao;

    public function __construct($id = null, $nome = null, $descricao = null) {
        $this->id = $id;
        $this->nome = $nome;
        $this->descricao = $descricao;
    }

    public function getId() {
        return $this->id;
    }

    public function getNome() {
        return $this->nome;
    }

    public function setNome($nome) {
        $this->nome = $nome;
    }

    public function getDescricao() {
        return $this->descricao;
    }

    public function setDescricao($descricao) {
        $this->descricao = $descricao;
    }

    public static function listarCategorias() {
        global $pdo;
        $sql = "SELECT * FROM Categorias";
        $stmt = $pdo->query($sql);
        $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $categoriaObjects = [];
        foreach ($categorias as $categoria) {
            $categoriaObjects[] = new Categoria($categoria['id'], $categoria['nome'], $categoria['descricao']);
        }
        
        return $categoriaObjects;
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
