import { useState, useRef, ChangeEvent } from "react";
import { RecordButton } from "./ui/RecordButton";
import TextWriter from "./TextWriter";

const mimeType = "audio/webm";

const AudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const mediaRecorder = useRef<any>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState<any>(null);
  const [convertedText, setConvertedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [audioBlob, setAudioBlob] = useState<any>(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData: any = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream as any, { type: mimeType } as any);
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media as any;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [] as any;
    mediaRecorder.current.ondataavailable = (event: any) => {
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
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioBlob(audioBlob);
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const sendAudio = async () => {
    setLoading(true);

    // Convert audioBlob to a readable format
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);

    console.log(reader);

    const base64data = reader.result;

    // Create a new FormData instance and append the audio data
    const data = new FormData();
    data.append("audio", base64data as string);
    data.append("model", "whisper-1");
    data.append("language", "en");
    setFormData(data);

    try {
      const res = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // Replace YOUR_API_KEY with your actual API key
          },
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      console.log(result);
      setConvertedText(result.text);
    } catch (error) {
      console.error("Error sending audio:", error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  const [hovered, setHovered] = useState(false);

  return (
    <div>
      {/* <ul className="steps">
          <li className="step step-primary">Register</li>
          <li className="step step-primary">Choose plan</li>
          <li className="step">Purchase</li>
          <li className="step">Receive Product</li>
        </ul> */}
      {!audio ? (
        <>
          <h2 className=" text-center bg-gradient-to-r from-red-500 via-yellow-300 to-orange-700 text-transparent bg-clip-text text-6xl font-bold  tracking-tighter shadow-xl mb-8">
            Graba tu hermosa voz{" "}
            <span
              className={`${
                hovered && "text-black transition duration-200 ease-in-out  "
              } `}
            >
              🎤
            </span>
          </h2>
          <div className="flex justify-center items-center">
            {!permission ? (
              <button
                onClick={getMicrophonePermission}
                type="button"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="btn btn-outline hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300 hover:border-none "
              >
                Empezar
              </button>
            ) : null}
            {permission && recordingStatus === "inactive" ? (
              <RecordButton
                startRecording={startRecording}
                recording={false}
                stopRecording={stopRecording}
              />
            ) : null}
            {recordingStatus === "recording" ? (
              <RecordButton
                startRecording={startRecording}
                recording={true}
                stopRecording={stopRecording}
              />
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center">
            <button
              onClick={sendAudio}
              type="button"
              className="btn btn-outline hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300 hover:border-none "
            >
              Convertir
            </button>
            <audio src={audio} controls />
          </div>
          {loading && (
            <h1 className="text-3xl font-bold text-center">Loading...</h1>
          )}
          {!loading && <h2>sdfsdsf</h2>}
          {!loading && convertedText && (
            <>
              <TextWriter text={convertedText} delay={10} />
            </>
          )}
        </>
      )}
    </div>
  );
};
export default AudioRecorder;
