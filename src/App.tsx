import { useEffect, useRef, useState } from "react";
import "./App.css";
import { FaFileUpload } from "react-icons/fa";
import {
    IoDownloadOutline,
    IoSunnyOutline,
    IoMoonOutline,
} from "react-icons/io5";
import { downloadAsPng, downloadAsTxt } from "./download";

function App() {
    const [ascii, setAscii] = useState("");
    const [width, setWidth] = useState(100);
    const [toggleTheme, setToggleTheme] = useState(
        localStorage.getItem("theme")
    );
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const imgRef = useRef<HTMLInputElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const setTheme = (themeName: string) => {
        localStorage.setItem("theme", themeName);
        setToggleTheme(localStorage.getItem("theme"));
        document.documentElement.className = themeName;
    };

    const keepTheme = () => {
        if (localStorage.getItem("theme")) {
            if (localStorage.getItem("theme") === "theme-dark") {
                setTheme("theme-dark");
            } else if (localStorage.getItem("theme") === "theme-light") {
                setTheme("theme-light");
            }
        } else {
            setTheme("theme-dark");
        }
    };

    const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const img = new Image();
        img.onload = () => setImg(img);
        img.src = URL.createObjectURL(file);
    };

    const convertToAscii = (img: HTMLImageElement, width: number) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");
        const aspectRatio = img.height / img.width;
        const height = Math.floor(width * aspectRatio * 0.5);

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const imageData = ctx?.getImageData(0, 0, width, height);
        const data = imageData?.data;

        let asciiString = "";
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const x = (i * width + j) * 4;

                const r = data![x];
                const g = data![x + 1];
                const b = data![x + 2];

                const gray = 0.299 * r + 0.587 * g + 0.114 * b;

                asciiString += getAsciiCharacter(gray);
            }
            asciiString += "\n";
        }
        setAscii(asciiString);
    };

    const getAsciiCharacter = (gray: number): string => {
        const asciiCharaters = "@%#*+=-:. ";
        const i = Math.floor((gray / 255) * (asciiCharaters.length - 1));
        return asciiCharaters[i];
    };

    const handleToggleTheme = () => {
        if (localStorage.getItem("theme") === "theme-dark") {
            setTheme("theme-light");
        } else {
            setTheme("theme-dark");
        }
    };

    useEffect(() => {
        if (img) {
            convertToAscii(img, width);
        }
    }, [img, width]);

    useEffect(() => {
        keepTheme();
    });

    return (
        <div className="app">
            <h1>Image to ASCII</h1>
            <button
                className="upload-button"
                onClick={() => imgRef.current?.click()}
            >
                <FaFileUpload /> Pick an Image File
            </button>
            <input
                type="file"
                accept="image/*"
                onChange={handleImg}
                ref={imgRef}
                hidden
            />
            <div className="settings-container">
                <div className="width-slider">
                    <label>Width: {width}</label>
                    <input
                        type="range"
                        min="20"
                        max="400"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                    />
                </div>

                <button
                    className="download-button"
                    onClick={() => downloadAsTxt(ascii)}
                    disabled={!ascii}
                >
                    <IoDownloadOutline size={25} /> txt
                </button>
                <button
                    className="download-button"
                    onClick={() => downloadAsPng(ascii, toggleTheme!)}
                    disabled={!ascii}
                >
                    <IoDownloadOutline size={25} /> PNG
                </button>
                <button className="toggle-button" onClick={handleToggleTheme}>
                    <span
                        className={`icon-wrapper ${
                            toggleTheme === "theme-light"
                                ? "slide-out"
                                : "slide-in"
                        }`}
                    >
                        <IoMoonOutline size={25} />
                    </span>
                    <span
                        className={`icon-wrapper ${
                            toggleTheme === "theme-light"
                                ? "slide-in"
                                : "slide-out"
                        }`}
                    >
                        <IoSunnyOutline size={25} />
                    </span>
                </button>
            </div>
            <div className="image-container">
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <pre
                    style={{
                        whiteSpace: "pre",
                        fontFamily: "monospace",
                        fontSize: "10px",
                    }}
                >
                    {ascii}
                </pre>
            </div>
        </div>
    );
}

export default App;
