import React, {useState, useEffect, useRef} from 'react';
import DSP from '../wasm';

export default function AudioRecorderWasm()
{
    const mimeType = "audio/webm";
    const [micPermission, setMicPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const audioSource = useRef(null);
    const [reverb, setReverb] = useState(false);
    const [playback, setPlayback] = useState(true);

    let audioContext = useRef(null);

    const [inputDevices, setInputDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("default");

    useEffect(() => {
        let devices = navigator.mediaDevices;
        if (devices && 'enumerateDevices' in devices) {
            let promise = devices.enumerateDevices();
            promise
                .then(function(devices) {
                    var audio = [];
                    for (let i = 0; i < devices.length; ++i) {
                        let device = devices[i];
                        switch (device.kind) {
                            case 'audioinput': audio.push(device); break;
                        }
                    }

                    setInputDevices(audio);
                });
        }
    }, [inputDevices]);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        autoGainControl: true,
                        noiseSuppression: true,
                        latency: 0.003,
                        deviceId: selectedDevice
                    },
                    video: false,
                }).then(function (stream) {
                    setMicPermission(true);
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


    const startRecording = async () => {
        setRecordingStatus("recording");


        audioContext.current = new AudioContext({latencyHint: 0});
        audioSource.current = audioContext.current.createMediaStreamSource(stream);

        let pluginURL = ".";
        let plugin = new DSP(audioContext.current, pluginURL);

        plugin.load().then((node) => {
            plugin.loadGui().then((elem) => {
                document.body.appendChild(elem);

            });
            node.connect(audioContext.current.destination);
            audioSource.current.connect(node);
        });

        /*





        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });

        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();


        if (playback) {
            audioContext.current = new AudioContext({latencyHint: 0});
            audioSource.current = audioContext.current.createMediaStreamSource(stream);
        }

        if (playback) {
            audioSource.current.connect(audioContext.current.destination);
        }

        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);*/
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");

        audioSource.current.disconnect();

        //stops the recording instance
        /*mediaRecorder.current.stop();

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
        };*/

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

    const changeAudioDevice = (e) => {
        setSelectedDevice(e.target.value)
        setMicPermission(false)
    }

    return (
        <div>
            <h2>Тест записи вокала</h2>
            <main>
                <div className="card" style={{maxWidth: 500, padding: 20, margin: 10}}>
                    <div className='mb-2'>
                        <div className="form-group">
                            <label>
                                Устройство записи
                            </label>
                            <select className="form-select" onChange={changeAudioDevice}>
                                {inputDevices.map((device, index) => {
                                    return (
                                        <option key={index} value={device.deviceId}>{device.label}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='mb-2'>
                        <div className="form-check form-switch">
                            <input checked={playback} onChange={changePlayback} className="form-check-input" type="checkbox" role="switch" id="add-playback" />
                            <label className="form-check-label" htmlFor="add-playback">
                                Воспроизводить realtime
                            </label>
                        </div>
                    </div>
                    {/*
                    <div className='mb-2'>
                        <div className="form-check form-switch">
                            <input checked={reverb} onChange={changeReverb} className="form-check-input" type="checkbox" role="switch" id="add-reverb" />
                            <label className="form-check-label" htmlFor="add-reverb">
                                Добавлять ревер
                            </label>
                        </div>
                    </div>*/ }
                    <div className="audio-controls">
                        {!micPermission ? (
                            <button onClick={getMicrophonePermission} type="button" className="btn btn-primary">
                                Подключить микрофон
                            </button>
                        ) : null}
                        {micPermission && recordingStatus === "inactive" ? (
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
                </div>
            </main>
        </div>
    );
}