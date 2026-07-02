import { useState } from "react";
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
                        "Content-Type": "multipart/form-data"
                    }
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

    return (
        <div className="page">
            <h1>AI README Generator</h1>
            <input
                type="file"
                accept=".zip"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <br /><br />
            <button
                onClick={handleGenerate}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate README"}
            </button>
            <hr />
            <pre>
                {readme}
            </pre>
        </div>
    );
}

export default ReadmePage;
