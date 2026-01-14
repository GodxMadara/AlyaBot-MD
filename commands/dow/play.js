import yts from 'yt-search'
import fetch from 'node-fetch'
import { getBuffer } from '../../lib/message.js'
import { toPTT } from '../../lib/converter.js'

const isYTUrl = (url) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url)

export default {
  command: ['play', 'mp3', 'ytmp3', 'ytaudio', 'playaudio'],
  category: 'downloader',
  run: async (client, m, args) => {
    try {
      if (!args[0]) {
        return m.reply('🫛 Por favor, menciona el nombre o URL del video que deseas descargar')
      }

      const query = args.join(' ')
      let url, title, videoInfo

      if (!isYTUrl(query)) {
        const search = await yts(query)
        if (!search.all.length) {
          return m.reply('🍋‍🟩 No se encontraron resultados')
        }

        videoInfo = search.all[0]
        url = videoInfo.url
        title = videoInfo.title

        const vistas = (videoInfo.views || 0).toLocaleString()
        const canal = videoInfo.author?.name || 'Desconocido'
        const infoMessage = `🍓✿⃘࣪◌ ֪  Descargando › ${title}

> 🍒✿⃘࣪◌ ֪ Canal › ${canal}
> 🍒✿⃘࣪◌ ֪ Duración › ${videoInfo.timestamp || 'Desconocido'}
> 🍒✿⃘࣪◌ ֪ Vistas › ${vistas}
> 🍒✿⃘࣪◌ ֪ Publicado › ${videoInfo.ago || 'Desconocido'}
> 🍒✿⃘࣪◌ ֪ Enlace › ${url}

𐙚 🌽 ｡ ↻ El archivo se está enviando, espera un momento... ˙𐙚`

        await client.sendContextInfoIndex(m.chat, infoMessage, {}, m, true, null, {
          banner: videoInfo.image,
          title: '仚 🎧 PLAY',
          body: title
        })
      } else {
        url = query
        title = 'YouTube Audio'
      }

      const res = await fetch(`${api.url2}/download/ytmp3?url=${encodeURIComponent(url)}&api_key=${api.key}`)
      const result = await res.json()

      if (!result.status || !result.result?.dl_url) {
        return m.reply('《✧》 No se pudo descargar el *audio*, intenta más tarde.')
      }

      const audioBuffer = await getBuffer(result.result.dl_url)
      const pttBuffer = await toPTT(audioBuffer, 'mp3')

      const mensaje = {
        audio: pttBuffer,
        mimetype: 'audio/ogg; codecs=opus',
        fileName: `${title}.ogg`,
        ptt: true
      }

      await client.sendMessage(m.chat, mensaje, { quoted: m })

    } catch (e) {
      // console.error(e)
      await m.reply(msgglobal)
    }
  }
}