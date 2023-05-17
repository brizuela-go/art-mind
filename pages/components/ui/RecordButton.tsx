import React, { CSSProperties, useState, useEffect } from "react";
import { motion, useAnimation, Variants } from "framer-motion";

const RED_COLOR = `#FF214D`;

const outerCircleVariants: Variants = {
  circle: {
    transform: "scale(1)",
    opacity: 0.5,
    boxShadow: `0px 0px 0px 10px ${RED_COLOR}`,
  },
  largeCircle: {
    transform: "scale(2)",
    opacity: 1,
    boxShadow: `0px 0px 0px 10px ${RED_COLOR}`,
  },
  pulseIn: {
    transform: "scale(2)",
    opacity: 1,
    boxShadow: `0px 0px 0px 20px ${RED_COLOR}`,
  },
  pulseOut: {
    transform: "scale(2)",
    opacity: 1,
    boxShadow: `0px 0px 0px 10px ${RED_COLOR}`,
  },
};

const innerCircleVariants: Variants = {
  circle: {
    transform: "scale(1)",
    borderRadius: "100%",
  },
  square: {
    transform: "scale(0.8)",
    borderRadius: "30%",
  },
  invisible: {
    transform: "scale(0)",
    borderRadius: "100%",
  },
};

interface Props {
  startRecording: () => void;
  recording: boolean;
  stopRecording: () => void;
}

export const RecordButton: React.FC<Props> = ({
  startRecording,
  recording,
  stopRecording,
}) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const innerCircleAnimation = useAnimation();
  const outerCircleAnimation = useAnimation();

  useEffect(() => {
    (async () => {
      if (recording) {
        await outerCircleAnimation.start("largeCircle");
        await outerCircleAnimation.start(["pulseOut", "pulseIn"], {
          repeat: Infinity,
          repeatType: "mirror",
        });
      } else {
        await outerCircleAnimation.start("circle");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  useEffect(() => {
    (async () => {
      if (recording) {
        await innerCircleAnimation.start("square");
        await innerCircleAnimation.start("invisible");
      } else {
        await innerCircleAnimation.start("circle");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  return (
    <motion.button
      drag
      onClick={() => {
        if (!recording) {
          setClicked(true);
          startRecording();
        }
        // on click again, stop recording
        if (recording) {
          setClicked(false);
          stopRecording();
        }
      }}
      className="animate__animated animate__bounceIn mt-28 text-white tracking-tight font-semibold"
      style={styles.container}
    >
      {recording && <p className="text-2xl">Parar Grabación</p>}
      <motion.div
        initial="circle"
        animate={outerCircleAnimation}
        variants={outerCircleVariants}
        style={{ ...styles.circle, ...styles.outerCircle }}
      ></motion.div>
      <motion.div
        initial="circle"
        animate={innerCircleAnimation}
        variants={innerCircleVariants}
        style={{ ...styles.circle, ...styles.innerCircle }}
      />
    </motion.button>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
  },
  circle: {
    position: "absolute",
  },
  outerCircle: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 9999,
  },
  innerCircle: {
    width: "90%",
    height: "90%",
    overflow: "hidden",
    backgroundColor: RED_COLOR,
  },
};
