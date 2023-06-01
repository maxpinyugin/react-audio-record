export default function Root() {
    return (
        <>
            <div className={`wrapper`}>
                <h1>Тест записи вокала</h1>
                <nav>
                    <ul>
                        <li>
                            <a href={`/native`}>Нативный через Chrome API</a>
                        </li>
                        <li>
                            <a href={`/wasm`}>Через библиотеку Wasm</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}