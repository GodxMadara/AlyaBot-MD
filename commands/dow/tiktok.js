import fetch from 'node-fetch';

export default {
  command: ['tiktok', 'tt'],
  category: 'downloader',
  run: async (client, m, args, command) => {
    const botId = (client?.user?.id?.split(':')[0] || global.client.user.id.split(':')[0]) + '@s.whatsapp.net'
    const isOficialBot = botId === global.client.user.id.split(':')[0] + '@s.whatsapp.net'
    const isPremiumBot = global.db.data.settings[botId]?.botprem === true
    const isModBot = global.db.data.settings[botId]?.botmod === true

    if (!isOficialBot && !isPremiumBot && !isModBot) {
      return client.reply(m.chat, `🌽 El comando *${command}* no está disponible en *Sub-Bots.*`, m)
    }

    if (!args.length) {
      return m.reply(`🍒 Ingresa un *término* o *enlace* de TikTok.`)
    }

    const urls = args.filter(arg => arg.includes("tiktok.com"))

    if (urls.length) {
      if (urls.length > 1) {
        const medias = []
        for (const url of urls.slice(0, 10)) {
          try {
            const apiUrl = `${api.url}/dl/tiktok?url=${url}&key=${api.key}`
            const res = await fetch(apiUrl)
            if (!res.ok) throw new Error(`El servidor respondió con ${res.status}`)
            const json = await res.json()
            const data = json.data
            if (!data) continue

            const {
              title = 'Sin título',
              dl,
              duration,
              author = {},
              stats = {},
              music = {},
            } = data

            const caption =
              `ㅤ۟∩　ׅ　★ ໌　ׅ　🅣𝗂𝗄𝖳𝗈𝗄 🅓ownload　ׄᰙ\n\n` +
              `𖣣ֶㅤ֯⌗ 🌽 ⬭ *Título:* ${title}\n` +
              `𖣣ֶㅤ֯⌗ 🍒 ⬭ *Autor:* ${author.nickname || author.unique_id || 'Desconocido'}\n` +
              `𖣣ֶㅤ֯⌗ 🍓 ⬭ *Duración:* ${duration || 'N/A'}\n` +
              `𖣣ֶㅤ֯⌗ 🦩 ⬭ *Likes:* ${(stats.likes || 0).toLocaleString()}\n` +
              `𖣣ֶㅤ֯⌗ 🌺 ⬭ *Comentarios:* ${(stats.comments || 0).toLocaleString()}\n` +
              `𖣣ֶㅤ֯⌗ 🌾 ⬭ *Vistas:* ${(stats.views || stats.plays || 0).toLocaleString()}\n` +
              `𖣣ֶㅤ֯⌗ 🪶 ⬭ *Compartidos:* ${(stats.shares || 0).toLocaleString()}\n` +
              `𖣣ֶㅤ֯⌗ 🐢 ⬭ *Audio:* ${music.title ? music.title + ' -' : 'Desconocido'} ${music.author || ''}`

            medias.push({
              type: 'video',
              data: { url: dl },
              caption
            })
          } catch (e) {
            continue
          }
        }
        if (medias.length) {
          await client.sendAlbumMessage(m.chat, medias, { quoted: m })
        } else {
          await m.reply(`🌽 No se pudieron procesar los enlaces.`)
        }
      } else {
        const url = urls[0]
        try {
          const apiUrl = `${api.url}/dl/tiktok?url=${url}&key=${api.key}`
          const res = await fetch(apiUrl)
          if (!res.ok) throw new Error(`El servidor respondió con ${res.status}`)
          const json = await res.json()
          const data = json.data
          if (!data) return m.reply(`🍒 No se encontraron resultados para: ${url}`)

          const {
            title = 'Sin título',
            dl,
            duration,
            author = {},
            stats = {},
            music = {},
          } = data

          const caption =
            `ㅤ۟∩　ׅ　★ ໌　ׅ　🅣𝗂𝗄𝖳𝗈𝗄 🅓ownload　ׄᰙ\n\n` +
            `𖣣ֶㅤ֯⌗ 🌽 ⬭ *Título:* ${title}\n` +
            `𖣣ֶㅤ֯⌗ 🍒 ⬭ *Autor:* ${author.nickname || author.unique_id || 'Desconocido'}\n` +
            `𖣣ֶㅤ֯⌗ 🍓 ⬭ *Duración:* ${duration || 'N/A'}\n` +
            `𖣣ֶㅤ֯⌗ 🦩 ⬭ *Likes:* ${(stats.likes || 0).toLocaleString()}\n` +
            `𖣣ֶㅤ֯⌗ 🌺 ⬭ *Comentarios:* ${(stats.comments || 0).toLocaleString()}\n` +
            `𖣣ֶㅤ֯⌗ 🌾 ⬭ *Vistas:* ${(stats.views || stats.plays || 0).toLocaleString()}\n` +
            `𖣣ֶㅤ֯⌗ 🪶 ⬭ *Compartidos:* ${(stats.shares || 0).toLocaleString()}\n` +
            `𖣣ֶㅤ֯⌗ 🐢 ⬭ *Audio:* ${music.title ? music.title + ' -' : 'Desconocido'} ${music.author || ''}`

          await client.sendMessage(m.chat, { video: { url: dl }, caption }, { quoted: m })
        } catch (e) {
          await m.reply(msgglobal)
        }
      }
    } else {
      const query = args.join(" ")
      try {
        const apiUrl = `${api.url}/search/tiktok?query=${encodeURIComponent(query)}&key=${api.key}`
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`El servidor respondió con ${res.status}`)
        const json = await res.json()
        const results = json.data

        if (!results || results.length === 0) {
          return m.reply(`🌽 No se encontraron resultados para: ${query}`)
        }

        const checked = results.slice(0, 5)
        const medias = checked.map(data => {
          const {
            title = 'Sin título',
            dl,
            duration,
            author = {},
            stats = {},
            music = {},
          } = data

          const caption =
            `ㅤ۟∩　ׅ　★ ໌　ׅ　🅣𝗂𝗄𝖳𝗈𝗄 🅓ownload　ׄᰙ\n\n` +
            `𖣣ֶㅤ֯⌗ 🌽 ⬭ *Título:* ${title}\n` +
            `𖣣ֶㅤ֯⌗ 🍒 ⬭ *Autor:* ${author.nickname || author.unique_id || 'Desconocido'}\n` +
            `𖣣ֶㅤ֯⌗ 🍓 ⬭ *Duración:* ${duration || 'N/A'}\n` +
            `𖣣ֶㅤ֯⌗ 🦩 ⬭ *Likes:* ${(stats.likes || 0).toLocaleString()}\n` +
            `𖣣ֶㅤ֯⌗ 🌺 ⬭ *Comentarios:* ${(stats.comments || 0).toLocaleString()}\n` +
            `𖣣ֶㅤ֯⌗ 🌾 ⬭ *Vistas:* ${(stats.views || stats.plays || 0).toLocaleString()}\n` +
            `𖣣ֶㅤ֯⌗ 🪶 ⬭ *Compartidos:* ${(stats.shares || 0).toLocaleString()}\n` +
            `𖣣ֶㅤ֯⌗ 🐢 ⬭ *Audio:* ${music.title ? music.title + ' -' : 'Desconocido'} ${music.author || ''}`

          return {
            type: 'video',
            data: { url: dl },
            caption
          }
        })

        await client.sendAlbumMessage(m.chat, medias, { quoted: m })
      } catch (e) {
        m.reply(msgglobal)
      }
    }
  },
};