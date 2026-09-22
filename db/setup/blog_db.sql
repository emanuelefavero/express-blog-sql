-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: blog
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.24-MariaDB
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `post_tag`
--
drop table if exists `post_tag`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

create table `post_tag` (
  `post_id` int(11) not null,
  `tag_id` int(11) not null,
  primary key (`post_id`, `tag_id`),
  key `tag_id` (`tag_id`),
  constraint `post_tag_ibfk_1` foreign key (`post_id`) references `posts` (`id`) on delete cascade on update cascade,
  constraint `post_tag_ibfk_2` foreign key (`tag_id`) references `tags` (`id`) on delete cascade on update cascade
) engine = innodb default charset = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_tag`
--
lock tables `post_tag` write;

/*!40000 ALTER TABLE `post_tag` DISABLE KEYS */;

insert into
  `post_tag`
values
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (2, 3),
  (2, 4),
  (2, 5),
  (3, 3),
  (3, 6),
  (4, 1),
  (4, 3),
  (4, 7),
  (4, 8),
  (5, 1),
  (5, 2),
  (5, 3),
  (5, 4),
  (5, 9);

/*!40000 ALTER TABLE `post_tag` ENABLE KEYS */;

unlock tables;

--
-- Table structure for table `posts`
--
drop table if exists `posts`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

create table `posts` (
  `id` int(11) not null auto_increment,
  `title` varchar(255) not null,
  `content` text not null,
  `image` varchar(255) not null,
  primary key (`id`)
) engine = innodb auto_increment = 6 default charset = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--
lock tables `posts` write;

/*!40000 ALTER TABLE `posts` DISABLE KEYS */;

insert into
  `posts`
values
  (
    1,
    'Ciambellone',
    'Sarà che una volta le cose erano più semplici, ma erano anche molto buone. Come le crostate, i biscotti o il ciambellone che la nonna preparava anche all\'ultimo sapendo che sareste passati per la merenda: uova, zucchero e farina. Niente di più basic ma che tra le sue mani, mescolando e infornando, diventava una delle prelibatezze per accompagnare il succo di frutta al pomeriggio o il latte e caffè al mattino. Ecco la nostra ricetta del ciambellone a quale atmosfera si ispira, quella di casa e genuinità: con una manciata di scorze di limone o di arancia e una spolverata di zucchero a velo renderete questa soffice delizia profumata e invitante. E per una volta sarà la nonna a farvi i complimenti per aver preparato un morbido ciambellone, così buono che non passa mai di moda!',
    'ciambellone.avif'
  ),
  (
    2,
    'Cracker alla barbabietola',
    'I cracker alla barbabietola sono uno snack stuzzicante e originale da preparare in casa utilizzando ingredienti semplici e genuini. Queste sfogliette dal colore brillante non passeranno inosservate nel vostro cestino del pane e arricchiranno la tavola con il loro gusto unico e accattivante. I cracker fatti a mano sono anche un gustoso snack spezza fame, da portare in ufficio o a scuola. Venite a scoprire il nostro mix di semi e cereali per realizzare l\'impasto e divertitevi a sperimentare nuove ricette di cracker variando i semi, le farine e le spezie per gusti sempre nuovi, ecco qualche idea: Cracker di farro Cracker di lupini Cracker allo zafferano Cracker ai semi',
    'cracker_barbabietola.avif'
  ),
  (
    3,
    'Pasta barbabietola e gorgonzola',
    'La nostra ricetta della pasta barbabietola e gorgonzola vuole ricreare in questo primo piatto un abbinamento appetitoso, già proposto con la torta salata alla barbabietola! Per un pranzo veloce ma gustoso, per chi ama giocare con consistenze e colori naturali in cucina, questa pasta è perfetta! La dolcezza della barbabietola smorza il gusto deciso che caratterizza questo formaggio erborinato molto amato, un\'abbinata vincente e molto gustosa. Provate un nuovo condimento per la vostra pasta e sperimentate altre sfiziose varianti: Pasta con barbabietola e pecorino Gnocchi di barbabietola Tagliatelle alla barbabietola con asparagi',
    'pasta_barbabietola.avif'
  ),
  (
    4,
    'Pane fritto dolce',
    'Il pane fritto dolce è la versione più antica dell\'odierno french toast! Una deliziosa ricetta antispreco che le nonne preparavano ai bambini per merenda, utilizzando gli ingredienti che si avevano sempre a disposizione in casa: pane raffermo, uova, latte e zucchero, che noi abbiamo deciso di aromatizzare con un pizzico di cannella. Facile e veloce da realizzare, il pane fritto dolce vi riporterà con la mente ai sapori dell\'infanzia… gustatelo da solo o accompagnatelo con frutta fresca e yogurt per uno spuntino tanto goloso quanto genuino!',
    'pane_fritto_dolce.avif'
  ),
  (
    5,
    'Torta paesana',
    'La torta paesana è un dolce di origine lombarda e precisamente della Brianza, la zona compresa tra la provincia a nord di Milano e il lago di Lecco-Como. E\' un dolce di origine contadina, dalle infinite varianti, ma realizzata principalmente con pane raffermo bagnato nel latte. E\' infatti conosciuta anche come torta di pane o, in dialetto locale, “michelacc” ovvero mica e lac (pane e latte). A seconda dei gusti e delle disponibilità del momento, al pane ammollato ogni famiglia univa ingredienti diversi, chi l\'uvetta o chi i pinoli ad esempio. Noi vi presentiamo la nostra versione con l\'aggiunta di cacao e amaretti: perfetta da gustare per una merenda dal sapore rustico, la torta paesana è un perfetto dolce di recupero quando si ha del pane avanzato… ed è ancora più buona il giorno dopo!',
    'torta_paesana.avif'
  );

/*!40000 ALTER TABLE `posts` ENABLE KEYS */;

unlock tables;

--
-- Table structure for table `tags`
--
drop table if exists `tags`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

create table `tags` (
  `id` int(11) not null auto_increment,
  `label` varchar(100) not null,
  primary key (`id`),
  unique key `label_UNIQUE` (`label`)
) engine = innodb auto_increment = 10 default charset = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--
lock tables `tags` write;

/*!40000 ALTER TABLE `tags` DISABLE KEYS */;

insert into
  `tags`
values
  (5, 'Antipasti'),
  (1, 'Dolci'),
  (9, 'Dolci al cioccolato'),
  (7, 'Dolci veloci'),
  (6, 'Primi piatti'),
  (4, 'Ricette al forno'),
  (3, 'Ricette vegetariane'),
  (8, 'Ricette veloci'),
  (2, 'Torte');

/*!40000 ALTER TABLE `tags` ENABLE KEYS */;

unlock tables;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-20 12:44:53
