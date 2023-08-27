import { useState, useRef, useEffect } from "react";
import { RecordButton } from "./ui/RecordButton";
import TextWriter from "./TextWriter";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import Confetti from "react-confetti";
import { PropagateLoader } from "react-spinners";

const mimeType = "audio/mp3";

const AudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const mediaRecorder = useRef<any>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState<any>(null);
  const [convertedText, setConvertedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<any>(null);

  const [magicPromptData, setMagicPromptData] = useState<string>("");
  const [imageData, setImageData] = useState<string>("");

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

    // Wait for the reader to load
    const base64data: any = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
    });

    // fix the padding in the base64 string
    const base64dataFixed = base64data
      .toString()
      .replace("data:audio/mp3;base64,", "");

    const bodyData = {
      base64: base64dataFixed,
    };

    try {
      const res1 = await fetch("http://localhost:5001/transcribe", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bodyData),
      });

      const result1 = await res1.json();

      setConvertedText(result1.text);
    } catch (error) {
      console.error("Error sending audio:", error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  const magicPrompting = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/magic", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ text: convertedText }),
      });
      const result = await res.json();
      console.log(result);
      setMagicPromptData(result.new_prompt);
    } catch (error) {
      console.error("Error sending audio:", error);
      // Handle error state
    }
  };

  const generateImage = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/draw", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ text: magicPromptData }),
      });
      const result = await res.json();
      console.log(result);
      setImageData(result.image);
      localStorage.setItem("imageData", imageData);
    } catch (error) {
      console.error("Error sending audio:", error);
      // Handle error state
    }
  };

  useEffect(() => {
    if (convertedText) {
      magicPrompting();
    }
  }, [convertedText]);

  useEffect(() => {
    if (magicPromptData) {
      generateImage();
    }
  }, [magicPromptData]);

  const [hovered, setHovered] = useState(false);

  if (!imageData)
    return (
      <div className="animate__animated animate__fadeInUp">
        {!audio ? (
          <>
            <h2 className=" text-center bg-gradient-to-r from-red-500 via-yellow-300 to-orange-700 text-transparent bg-clip-text text-6xl font-bold  tracking-tighter shadow-xl mb-8 ">
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
            {!loading && !convertedText && (
              <div className="flex justify-center items-center flex-col gap-8">
                <audio src={audio} controls />
                <div className="flex justify-center items-center gap-8">
                  <button
                    onClick={() => setAudio(null)}
                    type="button"
                    className="btn btn-outline btn-error hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300 hover:border-none "
                  >
                    Volver a grabar
                  </button>
                  <button
                    onClick={sendAudio}
                    type="button"
                    className="btn btn-outline hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300 hover:border-none "
                  >
                    Convertir
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <h4 className="text-6xl font-bold text-center tracking-tight animate-pulse">
                Cargando...
              </h4>
            )}
            {!loading && convertedText && (
              <>
                <div
                  className={`text-center text-3xl font-semibold tracking-tight   ${
                    convertedText &&
                    "textarea textarea-bordered animate__fadeInUp animate__animated"
                  }`}
                >
                  <TextWriter text={convertedText} delay={10} />
                </div>
                <div className="mt-10 flex justify-center items-center">
                  <PropagateLoader
                    className="mt-4 text-center "
                    color={"#a6adbb"}
                    loading={!loading}
                    size={30}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    );

  return (
    <>
      <Confetti
        className="w-full h-full"
        width={450}
        height={450}
        // stop animation after 5 seconds
        run={true}
        recycle={false}
        numberOfPieces={2000}
        gravity={0.1}
        initialVelocityX={10}
        initialVelocityY={10}
        tweenDuration={5000}
      />
      <h1 className="text-6xl text-center font-bold ">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-blue-400 to-indigo-500">
          Aquí está tu obra de arte
        </span>{" "}
        <span className="text-dark">🎨</span>
      </h1>
      <div className=" mt-10 flex justify-center items-center gap-14">
        <Image
          className=" rounded-md"
          src={imageData}
          priority
          quality={100}
          alt="image"
          width={350}
          height={350}
        />
        {/* qr for image data  */}
        <QRCode value={imageData} size={350} />
      </div>

      <Link href="/">
        <button className="btn btn-outline hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300 hover:border-none mt-10 shadow-2xl hover:shadow-indigo-400">
          Generar Nueva Imagen
        </button>
      </Link>
      <Link href="https://github.com/brizuela-go">
        <button className="shadow-2xl text-sm btn fixed bottom-7 right-5">
          Hecho con ❤️ por brizuela-go
        </button>
      </Link>
    </>
  );
};
export default AudioRecorder;
