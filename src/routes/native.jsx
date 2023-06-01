import AudioRecorder from "../components/AudioRecorder";

export default function Native() {
    return (
        <div className={`wrapper`}>
            <AudioRecorder />

            <div className={`back-links`}>
                <a href={`/`}>Назад</a>
            </div>
        </div>
    )
}