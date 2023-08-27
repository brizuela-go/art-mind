import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [hovered, setHovered] = useState(false);

  return (
    <section className={`${"animate__fadeIn animate__animated mt-20 "}`}>
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">📄 Instrucciones</h3>
          <p className="py-4">
            <ol className="list-decimal list-inside">
              <li className="py-2">Haz click en empezar</li>
              <li className="py-2">
                Después haz click en el botón de grabar ⏺️
              </li>
              <li className="py-2">
                Habla y cuando termines haz click en el botón de parar ⏹️
              </li>
              <li className="py-2">Haz click en el botón de convertir</li>
              <li className="py-2">Espera a que se genere la imagen</li>
              <li className="py-2">¡Listo! Ya puedes descargar la imagen</li>
            </ol>
          </p>
          <div className="modal-action">
            <label htmlFor="my_modal_6" className="btn">
              ¡Entendido!
            </label>
          </div>
        </div>
      </div>
      <h1 className=" text-center bg-gradient-to-r from-red-500 via-yellow-300 to-orange-700 text-transparent bg-clip-text text-9xl font-bold  tracking-tighter shadow-xl">
        Art{" "}
        <span className="bg-gradient-to-r from-indigo-200 via-blue-400 to-indigo-500 text-transparent bg-clip-text ">
          Mind
        </span>
      </h1>
      <h2 className="text-3xl font-bold text-center mt-10 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-sky-100 to-gray-300 tracking-tight">
        Convierte tu hermosa voz en una imagen{" "}
        <span
          className={`${
            hovered && "text-black transition duration-200 ease-in-out  "
          } `}
        >
          🪄
        </span>
      </h2>

      <div className="flex flex-row justify-center space-x-10 mt-12">
        <label
          htmlFor="my_modal_6"
          className="btn btn-outline hover:shadow-2xl border-red-400 hover:bg-gradient-to-r hover:border-red-400 hover:from-red-400    hover:to-orange-400 hover:text-white hover:shadow-red-400"
        >
          📄 Instrucciones
        </label>
        <Link
          href="/magic"
          className="btn btn-outline border-indigo-400 hover:bg-gradient-to-r hover:border-indigo-400 hover:from-indigo-200 hover:via-blue-400 hover:to-indigo-400 hover:shadow-2xl hover:shadow-indigo-400"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          🎤 Empezar
        </Link>
      </div>
    </section>
  );
}
