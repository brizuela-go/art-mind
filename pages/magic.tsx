import React from "react";
import AudioRecorder from "./components/AudioRecorder";

type Props = {};

const magic = (props: Props) => {
  return (
    <section className={`${"animate__bounceIn animate__animated"}`}>
      <AudioRecorder />
    </section>
  );
};

export default magic;
