import AudioRecorderWasm from "../components/AudioRecorderWasm";

export default function Wasm() {
    return (
        <div className={`wrapper`}>
            <AudioRecorderWasm />

            <div className={`back-links`}>
                <a href={`/`}>Назад</a>
            </div>
        </div>
    )
}