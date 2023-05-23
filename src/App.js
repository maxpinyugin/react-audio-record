import './App.css';
import Button from "./components/Button";
import AudioRecorder from "./components/AudioRecorder";
import MainPage from "./pages/MainPage";
import AudioRecorderWasm from "./components/AudioRecorderWasm";

function App() {
  return (
      <AudioRecorderWasm />
  );
}

export default App;
