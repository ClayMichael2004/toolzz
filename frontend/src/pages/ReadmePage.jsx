import { useState } from "react";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

function ReadmePage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [readme, setReadme] = useState("");

    const handleGenerate = async () => {
        if (!file) {
            alert("Please choose a ZIP file.");
            return;
        }

        const formData = new FormData();
        formData.append("project", file);

        try {
            setLoading(true);

            const response = await api.post(
                "/readme/generate",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setReadme(response.data.readme);
        } catch (error) {
            console.error(error);
            alert("Failed to generate README.");
        } finally {
            setLoading(false);
        }
    };

    const copyReadme = async () => {
        try {
            await navigator.clipboard.writeText(readme);
            alert("README copied successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to copy README.");
        }
    };

    const downloadReadme = () => {
        const blob = new Blob([readme], {
            type: "text/markdown",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "README.md";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="page">
            <h1>AI README Generator</h1>

            <input
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <br />
            <br />

            <button
                onClick={handleGenerate}
                disabled={loading}
            >
                {loading ? "Generating README..." : "Generate README"}
            </button>

            {readme && (
                <>
                    <br />
                    <br />

                    <button onClick={copyReadme}>
                        Copy README
                    </button>

                    <button
                        onClick={downloadReadme}
                        style={{ marginLeft: "10px" }}
                    >
                        Download README
                    </button>

                    <hr />

                    <div className="readme-preview">
                        <ReactMarkdown>
                            {readme}
                        </ReactMarkdown>
                    </div>
                </>
            )}
        </div>
    );
}

export default ReadmePage;
