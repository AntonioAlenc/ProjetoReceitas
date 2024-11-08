<?php
namespace Config;

use PDO;
use PDOException;
class database {

    private static $host = 'localhost';
    private static $dbName = 'projeto_receitas'; 
    private static $username = 'postgres'; 
    private static $password = 'unigran'; 
    private static $port = '5432'; 


    private static $conn;

    public static function conectar() {
        if (!isset(self::$conn)) {
            try {
                self::$conn = new PDO("pgsql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . self::$dbName, self::$username, self::$password);
                self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$conn->exec("SET NAMES 'utf8'");
            } catch (PDOException $e) {
                die("Erro de conexão: " . $e->getMessage());
            }
        }
        return self::$conn;
    }

    public static function desconectar() {
        self::$conn = null;
    }
}
?>
