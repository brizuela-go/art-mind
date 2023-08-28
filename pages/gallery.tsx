import { format } from "date-fns";
import Image from "next/image";
import { es } from "date-fns/locale";
import Link from "next/link";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { GetStaticProps } from "next";
import { db } from "@/utils/firebase";

export const getStaticProps: GetStaticProps = async () => {
  const imagesCollection = collection(db, "images");

  const startDate = new Date("2023-01-01");
  const endDate = new Date();

  // Create a query with filters and ordering
  const q = query(
    imagesCollection,
    where("date", ">=", startDate),
    where("date", "<=", endDate),
    orderBy("date", "desc")
  );

  const querySnapshot = await getDocs(q);

  const galleryData = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date.toMillis(),
    };
  });

  return {
    props: { galleryData },
  };
};

interface GalleryProps {
  galleryData: {
    id: string;
    url: string;
    magicPrompt: string;
    prompt: string;
    date: number;
  }[];
}

export default function Gallery({ galleryData }: GalleryProps) {
  return (
    <div className="p-8">
      <h1 className="bg-gradient-to-r from-rose-300 via-rose-400 to-rose-800 text-transparent bg-clip-text text-8xl max-sm:text-6xl font-bold tracking-tighter shadow-xl">
        Galería
      </h1>
      <ul className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
        {galleryData.map((image, index) => (
          <li
            key={image.id}
            className={`${index === 0 ? "col-span-2" : "col-span-1"}`}
          >
            <div className="relative group overflow-hidden rounded-md shadow-lg hover:scale-105 transition duration-200 ease-in-out">
              <Image
                width={512}
                height={512}
                src={image.url}
                alt={image.magicPrompt}
                className={`w-full h-auto rounded-md ${
                  index === 0 ? "mb-6" : "mt-0"
                }`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-center">
                <p className="font-medium tracking-tight text-slate-200 text-xl">
                  {format(new Date(image.date), "dd/MM/yyyy, hh:mm:ss aaaa", {
                    locale: es,
                  })}
                </p>
                {/* <p className="text-blue-500 font-semibold mt-1">
                  Magic Prompt: {image.magicPrompt}
                </p> a */}
                <p className="text-slate-400 mt-2 font-semibold tracking-tighter text-xl">
                  {image.prompt}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/">
        <button className="btn btn-outline fixed bottom-5 right-7">
          Volver a Inicio
        </button>
      </Link>
    </div>
  );
}
