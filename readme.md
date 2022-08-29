# LOHEALTHY GAMES

## ENDPOINTS PUBLICAS

[POST] /user/create -> Te permite crear un usuario en la aplicación

[POST] /user/login -> Te devuelve un token si hacer login con un usuario existente.

[GET] /games/ -> Te devuelve una lista de juegos.

[GET] /games/id/:idGame -> Te devuelve el juego con la id enviada.

[GET] /games/filter/:filterGame -> Te devuelve la lista de juegos que coincida con el filtro.

## ENDPOINTS CON TOKEN

[POST] /games/create -> Te permite crear un juego en la base de datos.

[DELETE] /games/delete/:idGame -> Elimina el juego si la id coincide.

[PATCH] /games/update/:idGame -> Actualiza la información de un juego.

[GET] /games/mylist -> Te entrega la lista de juegos que hayas creado.
