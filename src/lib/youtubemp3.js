import axios from "axios";

// obtiene el id del video
const getYoutubeId = (url) => {
    let regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regex);
    return (match && match[7].length === 11) ? match[7] : false;
}

// obtiene la informacion de un video
const getVideoInfo = async (id) => {
    let videoInfo = await axios.get(`https://youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}`);
    return videoInfo.data;
}

// extrae el enlace del codigo fuente
const getLink = (html, bitrate = 128) => {
	let regex = new RegExp(`https://y2convert.net/download/(.)*/mp3/${bitrate}/[0-9]*/(.*)/0`, 'g');
	
	if (regex.test(html)) {
		// usa expresiones regulares para extraer la url de 128 kbps
		let url = html.match(regex);

		return url.length > 0 ? url[0] : false;
	}

	return false;
}

// genera los enlaces de descarga a travez del codigo fuente
const generateDownloadLinks = async (id) => {

	const response = await axios.get(`https://y2convert.net/api/button/mp3/${id}`);
	const html = response.data;

	const bitrates = [64, 128, 192, 256, 320];
	let result = [];

    // itera los bitrates y comprueba si existe el enlace para tal
	for (const bitrate of bitrates) {
        const link = getLink(html, bitrate);
        
        if (link) {
            result.push({bitrate: bitrate, url: link});
        }
	}

	return result;
}

// extrae los enlaces de descarga e informacion del video
const youtubemp3 = async (url) => {
    const videoId = getYoutubeId(url);

    let videoInfo = await getVideoInfo(videoId);
    let downloadLinks = await generateDownloadLinks(videoId);

    if (downloadLinks.length > 0) {
        return {
            info: videoInfo,
            links: downloadLinks
        };
    } else {
        return false;
    }


}

export { youtubemp3 };