import { youtubemp3 } from 'lib/youtubemp3';
import { Button, Form, Schema, Notification, toaster } from 'rsuite';
import { useState } from 'react';

const { StringType } = Schema.Types;

const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch|youtu\.?be\/).+$/;

const model = Schema.Model({
    url: StringType()
        .addRule((value, data) => {
            // verifica si la url es de un video de youtube con una expresion regular
            if (youtubeRegex.test(value)) {
                return true;
            } else {
                return false;
            }
        }, 'Enlace no valido')
        .isRequired('Este campo es requerido')
});

const DownloadForm = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();

    // pinta en pantalla el widget de descarga
    const startDownload = async () => {


        const url = document.querySelector('input[name="url"]').value;
        if (!youtubeRegex.test(url) || url === '') return;

        setLoading(() => true);


        const result = await youtubemp3(url);

        setLoading(() => false);

        if (result) {
            setData(() => result);
        } else {
            toaster.push(<Notification type="error" header="Ah ocurrido un error" />, { placement: 'topEnd' });
        }

    }

    return (
        <>
            <Form model={model} className="youtubemp3-form" onSubmit={startDownload}>
                <h3 className="center">YouTube MP3</h3>
                <hr />
                <Form.Group controlId="url">
                    <Form.Control className="youtubemp3-input" placeholder="Url de youtube" name="url" />
                </Form.Group>
                <div className="youtubemp3-button">
                    <Button type="submit" loading={loading}>
                        Descargar
                    </Button>
                </div>
            </Form>

            {data && (
                <div className="video-card">
                    <img src={data.info.thumbnail_url} alt="Portada" />

                    <h4>{data.info.title}</h4>
                    <p>{data.info.author_name}s</p>

                    {data.links.map((link, i) => (
                        <a key={i} href={link.url} className="audio-link">
                            <i data-icon="file_download"></i> Descargar en {link.bitrate} Kbps
                        </a>
                    ))}
                </div>
            )}
        </>
    )
}

export default DownloadForm;