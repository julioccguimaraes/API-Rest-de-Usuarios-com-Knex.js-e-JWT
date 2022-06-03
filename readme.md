## table model
```
CREATE TABLE `users` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
 `email` varchar(128) COLLATE utf8mb4_bin NOT NULL,
 `password` varchar(256) COLLATE utf8mb4_bin NOT NULL,
 `role` int(11) NOT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
```