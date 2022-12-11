## Запуск

### Подготовка датабазы
 cd node/server

 mkdir data

 sudo mongod --dbpath=data

### Первый терминал

cd node/server

npm i

npm run serve

### Второй терминал

cd node/client

npm i

npm run start
  
## Использование

1. После запуска перейти на localhost:3000. 
2. Открыть две вкладки
3. Ввести имя в первой вкладке и нажать Enter/на кнопку
4. Ввести имя во второй вкладке и нажать Enter/на кнопку
5. В обеих вкладках появится список пользователей слева. Нажать из любого окна на желаемого пользователя
6. Написать в чат справа. 
7. Ответить с другого аккаунта.
8. Дополнительно можно создать новые аккаунты и пересылать сообщения между ними. Чат отслеживает статус пользователей и хранит переписки между пользователями.