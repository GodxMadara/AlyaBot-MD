import fetch from 'node-fetch';
import FormData from 'form-data';

async function uploadImage(media, mime) {
  const body = new FormData()
  body.append('files[]', buffer, `file.${mime.split('/')[1]}`)
  const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body, headers: body.getHeaders() })
  const json = await res.json()
  return json.files?.[0]?.url
}

export default {
  command: ['setbanner', 'setmenubanner'],
  category: 'socket',
  run: async (client, m, args) => { 
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const config = global.db.data.settings[idBot];
    const isOwner2 = [idBot, ...global.owner.map((number) => number + '@s.whatsapp.net')].includes(m.sender);
    if (!isOwner2 && m.sender !== owner) return m.reply(mess.socket);

    const value = args.join(' ').trim();

    if (
      !value &&
      !m.quoted &&
      !m.message.imageMessage &&
      !m.message.videoMessage
    )
      return m.reply('🍒 Debes enviar o citar una imagen o video para cambiar el banner del bot.');

    if (value.startsWith('http')) {
      config.banner = value;
      return m.reply(`🌾 Se ha actualizado el banner de *${config.namebot2}*!`);
    }

    const q = m.quoted ? m.quoted : m.message.imageMessage ? m : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/image\/(png|jpe?g|gif)|video\/mp4/.test(mime))
      return m.reply('🍒 Responde a una imagen o video válido.');

    const media = await q.download();
    if (!media) return m.reply(',🍒 No se pudo descargar el archivo.');

    const link = await uploadToCatbox(media, mime);
    config.banner = link;

    return m.reply(`🌾 Se ha actualizado el banner de *${config.namebot2}*!`);
  },
};
