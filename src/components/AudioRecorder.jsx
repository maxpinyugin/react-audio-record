import { useState, useRef } from "react";
import Tuna from 'tunajs';

const AudioRecorder = () => {
    const mimeType = "audio/webm";
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audio, setAudio] = useState(null);
    const [reverb, setReverb] = useState(false);
    const [playback, setPlayback] = useState(true);
    const [audioChunks, setAudioChunks] = useState([]);
    const [micPermission, setMicPermission] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);

    let audioContext;
    let recorderNode;
    let mediaRecorder;
    let audioSource;

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        autoGainControl: true,
                        noiseSuppression: true,
                        latency: 0.003
                    },
                    video: false,
                }).then(function (stream) {
                    setMicPermission(true);
                    setMediaStream(stream);
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

        mediaRecorder = new MediaRecorder(mediaStream, { type: mimeType });
        audioContext = new AudioContext();
        await audioContext.audioWorklet.addModule('./worklets/recorderWorkletProcessor.js')

        recorderNode = new window.AudioWorkletNode(audioContext,
            'recorder-worklet',
            {parameterData: {numberOfChannels: 2}});

        audioSource = audioContext.createMediaStreamSource(mediaStream);
        audioSource.connect(recorderNode);
        recorderNode.connect(audioContext.destination);

        let localAudioChunks = [];
        recorderNode.port.onmessage = (e) => {
            const data = e.data;
            switch(data.eventType) {
                case "data":
                    // process pcm data; encode etc
                    const audioData = data.audioBuffer;
                    const bufferSize = data.bufferSize;


                    console.log(audioData);

                    localAudioChunks.push(audioData);

                    break;
                case "stop":
                    // recording has stopped
                    break;
            }
        };

        console.log(localAudioChunks);

        setAudioChunks(localAudioChunks);

        let isRecording = recorderNode.parameters.get('isRecording')
        isRecording.setValueAtTime(1, audioContext.currentTime);

        //audioSource.connect(audioContext.destination);
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");

        let isRecording = recorderNode.parameters.get('isRecording')
        isRecording.setValueAtTime(0, audioContext.currentTime);

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
            </main>
        </div>
    );
};
export default AudioRecorder;