const { OpenAI } = require('openai')


// Función para crear una historia.
// Le pasamos por parámetros los temas de la historia.
exports.historyCreate = async (temas) => {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await client.chat.completions.create({
        model: 'chatgpt-4o-latest',
        messages: [
            { role: 'system', content: 'Eres un bot de telegram que cuenta historias.' },
            { role: 'assistant', content: 'Debes responder como si la historia fueses una persona muy cómica.' },
            { role: 'user', content: `Crea una historia con estos temas: ${temas}. Que esté limitada a tres párrafos.` }
        ]
    });
    const history = response.choices[0].message.content

    const responseImage = await client.images.generate({
        model: 'dall-e-3',
        prompt: `Crea una imagen adecuada para esta historia: ${history}`,
        n: 1,
        size: '1024x1024'
    })
    const image = responseImage.data[0].url;

    return [history, image] // Retornamos por un lado el texto y por otro la url de la imagen.
}

exports.normalResponse = async (mensaje) => {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await client.chat.completions.create({
        model: 'chatgpt-4o-latest',
        messages: [
            { role: 'system', content: 'Eres un bot asistente a través de telegram. Te llamas @peque' },
            { role: 'assistant', content: 'Debes responder sin excederte demasiado, no más de 1 párrafo, a todos los mensajes que te lleguen e intentar ayudar en la medida de lo posible.' },
            { role: 'user', content: `Responde al siguiente mensaje: ${mensaje}.` }
        ]
    });
    return response.choices[0].message.content;

}