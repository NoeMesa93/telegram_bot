# Openweathermap

COMANDO: - /tiempo Madrid - /tiempo Valencia - /tiempo Santiago de compostela

- Respuesta:
  - Información sobre temperatura actual, mínima, máxima y humedad

TODO:

1. Generar el comando. ¡Me aseguro que responde!
2. Del mensaje (ctx.message.text) extraigo la ciudad
3. (investigación) Mediante el uso de **axios** realizamos la siguiente petición:
   - Método: GET
   - Url: https://api.openweathermap.org/data/2.5/weather?q=CIUDADINCLUIDAENELCOMANDO&appid=12cc61f3282afaca14152a6185f43de0&units=metric
4. Con la respuesta de la petición creamos la respuesta del BOT

# Historias

COMANDO

- /historia lobo, manzana, arbol, coche eléctrico
