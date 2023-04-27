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
    const audioSource = useRef(null);
    const [reverb, setReverb] = useState(false);
    const [playback, setPlayback] = useState(true);

    let audioContext = useRef(null);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        autoGainControl: false,
                        noiseSuppression: false,
                        latency: 0.003
                    },
                    video: false,
                }).then(function (stream) {
                    setPermission(true);
                    setStream(stream);
                }).catch(function (error) {
                    alert(error);
                });

            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    /*const playMetronome = (i = 0) => {
        if (i > 4) {
            return
        }

        const osc = new OscillatorNode(audioSource.current, {
            frequency: 440,
            type: 'sine',
        })
        osc.connect(audioSource.current.destination)
        osc.start()
        osc.stop(audioSource.current.currentTime + 0.1)

        setTimeout(() => {
            playMetronome(i + 1)
        }, 500)
    }*/

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });


        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();


        if (playback) {
            audioContext.current = new AudioContext({latencyHint: 0});
            audioSource.current = audioContext.current.createMediaStreamSource(stream);

            //playMetronome();
        }

        if (reverb && playback) {
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
        } else if (playback) {
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

            if (playback) {
                audioSource.current = null;
                audioContext.current.close();
            }
        };
    };

    const changeReverb = (val) => {
        setReverb(val.target.checked);
    }

    const changePlayback = (val) => {
        setPlayback(val.target.checked);
        if (!val.target.checked) {
            setReverb(false);
        }
    }

    return (
        <div>
            <h2>Тест записи вокала</h2>
            <main>
                <div className='mb-2'>
                    <div className="form-check form-switch">
                        <input checked={playback} onChange={changePlayback} className="form-check-input" type="checkbox" role="switch" id="add-playback" />
                        <label className="form-check-label" htmlFor="add-playback">
                            Воспроизводить realtime
                        </label>
                    </div>
                </div>
                <div className='mb-2'>
                    <div className="form-check form-switch">
                        <input checked={reverb} onChange={changeReverb} className="form-check-input" type="checkbox" role="switch" id="add-reverb" />
                            <label className="form-check-label" htmlFor="add-reverb">
                                Добавлять ревер
                            </label>
                    </div>
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