import { useState, useRef } from "react";
import Tuna from 'tunajs';

const AudioRecorder = () => {
    const mimeType = "audio/webm";
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [audioMp3, setAudioMp3] = useState(null);
    const audioSource = useRef(null);
    const [reverb, setReverb] = useState(true);

    let audioContext = useRef(null);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });


        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();


        audioContext.current = new AudioContext();
        audioSource.current = audioContext.current.createMediaStreamSource(stream);

        if (reverb) {
            let tuna = new Tuna(audioContext.current);
            let effect = new tuna.Convolver({
                highCut: 22050,                         //20 to 22050
                lowCut: 20,                             //20 to 22050
                dryLevel: 1,                            //0 to 1+
                wetLevel: 1,                            //0 to 1+
                level: 1,                               //0 to 1+, adjusts total output of both wet and dry
                impulse: "../assets/impulses/impulse_rev.wav",    //the path to your impulse response
                bypass: 0
            });

            audioSource.current.connect(effect);
            effect.connect(audioContext.current.destination);
        } else {
            audioSource.current.connect(audioContext.current.destination);
        }

        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");

        //stops the recording instance
        mediaRecorder.current.stop();

        mediaRecorder.current.onstop = async () => {
            //creates a blob file from the audiochunks data

            const audioBlob = new Blob(audioChunks, { type: mimeType });
            console.log(audioBlob);

            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);

            setAudioChunks([]);

            audioSource.current = null;
            audioContext.current.close();
        };
    };

    const changeReverb = (val) => {
        setReverb(val.target.checked);
    }

    return (
        <div>
            <h2>Тест записи вокала</h2>
            <main>
                <div className='mb-2'>
                    <input type='checkbox' checked={reverb} onChange={changeReverb} id='add-reverb' />
                    &nbsp;
                    <label htmlFor='add-reverb'>Добавлять ревер</label>
                </div>
                <div className="audio-controls">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} type="button" className="btn btn-primary">
                            Подключить микрофон
                        </button>
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
                        <button onClick={startRecording} type="button" className="btn btn-success">
                            Начать запись
                        </button>
                    ) : null}
                    {recordingStatus === "recording" ? (
                        <button onClick={stopRecording} type="button" className="btn btn-danger">
                            Остановить запись
                        </button>
                    ) : null}
                </div>
                {audio ? (
                    <div className="audio-container">
                        <audio src={audio} controls></audio>
                        <br />
                        <a download href={audio} className="link link-success">
                            Скачать файл
                        </a>
                    </div>
                ) : null}
            </main>
        </div>
    );
};
export default AudioRecorder;