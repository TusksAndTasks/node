# Запуск

## 1 -  eventModule  
Из src:

cd eventModule

npx ts-node index

Для проверки метода RemoveListener, раскомментировать 46 строчку.
Для проверки типизации, раскомментировать 53-55 строчки, выдаст ошибки.

## 2 - streamModule
Из src: 

cd streamModule 

node index 

Дождаться окончания появления промпта из файла content.txt, ввести любую строчку в консоль. Появится файл new.txt c строчкой

## 3 - httpModule
Из src: 

cd httpModule 

node index 

Запустится два процесса, один отпарвит 3 запроса на сервер, развернутый во втором. В консоли появится контент из getContent.txt и появится 2 файла postContent.txt и formContent.txt с данными переданными из первоого процесса.  
