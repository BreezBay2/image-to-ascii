export const downloadAsTxt = (ascii: string) => {
    const blob = new Blob([ascii], { type: "text/plain;charset-utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ascii.txt";
    link.click();
    URL.revokeObjectURL(url);
};

export const downloadAsPng = (ascii: string, theme: string) => {
    if (!theme) return;
    const lines = ascii.split("\n");
    const fontSize = 10;
    const lineHeight = fontSize * 1.2;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxLineWidth = Math.max(...lines.map((line) => line.length));
    canvas.width = maxLineWidth * fontSize * 0.6;
    canvas.height = lines.length * lineHeight;

    if (!ctx) {
        return;
    }

    ctx.fillStyle = theme === "theme-dark" ? "#1d232a" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = theme === "theme-dark" ? "#ecf9ff" : "#18181b";
    lines.forEach((line, i) => {
        ctx?.fillText(line, 0, lineHeight * (i + 1));
    });

    const link = document.createElement("a");
    link.download = "ascii.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
};
