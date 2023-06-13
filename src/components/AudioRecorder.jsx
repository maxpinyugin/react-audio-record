import React, {useState, useRef, useEffect} from "react";
import Tuna from 'tunajs';

const AudioRecorder = () => {
    const mimeType = "audio/webm";

    const impulses = [
        {
            name: 'Basic Reverb',
            file: 'impulse_rev.wav'
        },

        {
            name: 'Reverb Short',
            file: 'ir_rev_short.wav'
        },

        {
            name: 'Block Inside',
            file: 'Block_Inside.wav'
        },

        {
            name: 'Bottle Hall',
            file: 'Bottle_Hall.wav'
        },

        {
            name: 'Cement Blocks 1',
            file: 'Cement_Blocks_1.wav'
        },

        {
            name: 'Cement Blocks 2',
            file: 'Cement_Blocks_2.wav'
        },

        {
            name: 'Chateau de Logne Outside',
            file: 'Chateau_de_Logne_Outside.wav'
        },

        {
            name: 'Conic Long Echo Hall',
            file: 'Conic_Long_Echo_Hall.wav'
        },

        {
            name: 'Deep Space',
            file: 'Deep_Space.wav'
        },

        {
            name: 'Derlon Sanctuary',
            file: 'Derlon_Sanctuary.wav'
        },

        {
            name: 'Direct Cabinet N1',
            file: 'Direct_Cabinet_N1.wav'
        },

        {
            name: 'Direct Cabinet N2',
            file: 'Direct_Cabinet_N2.wav'
        },

        {
            name: 'Direct Cabinet N3',
            file: 'Direct_Cabinet_N3.wav'
        },

        {
            name: 'Direct Cabinet N4',
            file: 'Direct_Cabinet_N4.wav'
        },

        {
            name: 'Five Columns',
            file: 'Five_Columns.wav'
        },

        {
            name: 'Five Columns Long',
            file: 'Five_Columns_Long.wav'
        },

        {
            name: 'French 18th Century Salon',
            file: 'French_18th_Century_Salon.wav'
        },

        {
            name: 'Going Home',
            file: 'Going_Home.wav'
        },

        {
            name: 'Greek 7 Echo Hall',
            file: 'Greek_7_Echo_Hall.wav'
        },

        {
            name: 'Highly Damped Large Room',
            file: 'Highly_Damped_Large_Room.wav'
        },

        {
            name: 'In The Silo',
            file: 'In_The_Silo.wav'
        },

        {
            name: 'In The Silo Revised',
            file: 'In_The_Silo_Revised.wav'
        },

        {
            name: 'Large Bottle Hall',
            file: 'Large_Bottle_Hall.wav'
        },

        {
            name: 'Large Long Echo Hall',
            file: 'Large_Long_Echo_Hall.wav'
        },

        {
            name: 'Large Wide Echo Hall',
            file: 'Large_Wide_Echo_Hall.wav'
        },

        {
            name: 'Masonic Lodge',
            file: 'Masonic_Lodge.wav'
        },

        {
            name: 'Musikvereinsaal',
            file: 'Musikvereinsaal.wav'
        },

        {
            name: 'Narrow Bumpy Space',
            file: 'Narrow_Bumpy_Space.wav'
        },

        {
            name: 'Nice Drum Room',
            file: 'Nice_Drum_Room.wav'
        },

        {
            name: 'On a Star',
            file: 'On_a_Star.wav'
        },

        {
            name: 'Parking Garage',
            file: 'Parking_Garage.wav'
        },

        {
            name: 'Rays',
            file: 'Rays.wav'
        },

        {
            name: 'Right Glass Triangle',
            file: 'Right_Glass_Triangle.wav'
        },

        {
            name: 'Ruby Room',
            file: 'Ruby_Room.wav'
        },

        {
            name: 'Scala Milan Opera Hall',
            file: 'Scala_Milan_Opera_Hall.wav'
        },

        {
            name: 'Small Drum Room',
            file: 'Small_Drum_Room.wav'
        },

        {
            name: 'Small Prehistoric Cave',
            file: 'Small_Prehistoric_Cave.wav'
        },

        {
            name: 'St Nicolaes Church',
            file: 'St_Nicolaes_Church.wav'
        },

        {
            name: 'Sweetspot1M',
            file: 'Sweetspot1M.wav'
        },

        {
            name: 'Trig Room',
            file: 'Trig_Room.wav'
        },

        {
            name: 'Vocal Duo',
            file: 'Vocal_Duo.wav'
        }
    ];

    const [selectedImpulse, setSelectedImpulse] = useState(impulses[0]['file'])

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const audioSource = useRef(null);
    const [reverb, setReverb] = useState(false);
    const [playback, setPlayback] = useState(true);

    const [inputDevices, setInputDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("default");

    let audioContext = useRef(null);

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
                impulse: "../assets/impulses/" + selectedImpulse,    //the path to your impulse response
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

    const changeAudioDevice = (e) => {
        setSelectedDevice(e.target.value)
        setPermission(false)
    }

    const changeImpulse = (e) => {
        setSelectedImpulse(e.target.value)
    }

    return (
        <div>
            <h2>Тест записи вокала (native)</h2>
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
                    <div className='mb-2'>
                        <div className="form-check form-switch">
                            <input checked={reverb} onChange={changeReverb} className="form-check-input" type="checkbox" role="switch" id="add-reverb" />
                                <label className="form-check-label" htmlFor="add-reverb">
                                    Добавлять ревер
                                </label>
                        </div>
                    </div>

                    {reverb && (
                        <div className='mb-2'>
                            <div className="form-group">
                                <label>
                                    Выберите ревер
                                </label>
                                <select className="form-select" onChange={changeImpulse}>
                                    {impulses.map((item, index) => {
                                        return (
                                            <option selected={selectedImpulse === item.file} key={index} value={item.file}>{item.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    )}

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
                </div>
            </main>
        </div>
    );
};
export default AudioRecorder;