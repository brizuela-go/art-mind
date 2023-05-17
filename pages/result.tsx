import Link from "next/link";
import React from "react";

type Props = {};

import Confetti from "react-confetti";

const result = (props: Props) => {
  return (
    <>
      <Confetti
        className="w-full h-full"
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
      <Link href="/">
        <button className="btn btn-outline hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300 hover:border-none mt-10 shadow-2xl hover:shadow-indigo-400">
          Generar Nueva Imagen
        </button>
      </Link>
    </>
  );
};

export default result;
