import { useEffect, useState } from "react";

type TextWriterProps = {
    text: string;
    delay: number;
};

const TextWriter: React.FC<TextWriterProps> = ({ text, delay }) => {
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentChar = text?.charAt(index);
            const nextChar = text?.charAt(index + 1);
            setDisplayText((prevDisplayText) => {
                if (currentChar === "." && nextChar !== " ") {
                    return prevDisplayText + currentChar + " ";
                }
                return prevDisplayText + currentChar;
            });
            setIndex((prevIndex) => prevIndex + 1);
        }, delay);

        return () => clearInterval(timer);
    }, [text, delay, index]);

    return <div>{displayText}</div>;
};

export default TextWriter;