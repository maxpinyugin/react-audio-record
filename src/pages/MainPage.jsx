import React from "react";
import AudioRecorder from "../components/AudioRecorder";

export default function MainPage()
{
    return (
        <div className="card m-3 p-3">
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
        </div>
    )
}