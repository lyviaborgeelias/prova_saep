create database saep_db;
use saep_db;

create table api_produto(
	ID INT PRIMARY KEY auto_increment,    
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    especificacao VARCHAR(200),
    quantidade int,
    preco decimal(10,2),
    estoque_atual int,
    estoque_minimo int,
    data_cadastro datetime
);

create table api_usuario(
	ID INT PRIMARY KEY auto_increment,  
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(10) NOT NULL
);

create table api_movimentacao(
	ID INT PRIMARY KEY auto_increment, 
    quantidade int,
    tipo enum('Entrada', 'Saida'),
    data_operacao datetime,
    id_produto INT,
    foreign key (ProdutoID) references Produto(ID),
    id_usuario INT,
    foreign key (ResponsavelID) references Usuario(ID),
);

INSERT INTO api_produto (nome, tipo, especificacao, quantidade, preco, estoque_atual, estoque_minimo, data_cadastro) VALUES
('Notebook Dell Inspiron', 'Eletrônico', 'Intel i5, 8GB RAM, SSD 256GB', 10, 3500.00, 10, 2, '2026-03-01 10:00:00'),
('Mouse Logitech', 'Periférico', 'Mouse óptico USB', 50, 80.00, 50, 10, '2026-03-02 11:30:00'),
('Teclado Mecânico Redragon', 'Periférico', 'Switch Blue, RGB', 20, 250.00, 20, 5, '2026-03-03 09:15:00'),
('Monitor LG 24"', 'Eletrônico', 'Full HD IPS HDMI', 15, 900.00, 15, 3, '2026-03-04 14:20:00'),
('HD Externo Seagate 1TB', 'Armazenamento', 'USB 3.0 portátil', 12, 420.00, 12, 4, '2026-03-05 16:45:00');

INSERT INTO api_usuario (nome, Login) VALUES
('Administrador', 'admin'),
('Carlos Silva', 'csilva'),
('Ana Souza', 'asouza'),
('Marcos Lima', 'mlima'),
('Juliana Rocha', 'jrocha');

INSERT INTO api_movimentacao (quantidade, tipo, data_operacao, id_produto, id_usuario) VALUES
(1, 'Entrada',  '2026-03-06 10:00:00', 5, 2),
(2, 'Saida','2026-03-06 11:15:00', 3, 2),
(3, 'Entrada', '2026-03-07 09:40:00', 5, 3),
(2, 'Saida', '2026-03-07 14:10:00', 4, 4),
(4, 'Entrada', '2026-03-08 16:25:00', 5, 5);

