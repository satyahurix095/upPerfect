import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

const Thumbnail = ({ file }) => {
  return (
    <div className="thumbnail">
      <img src={URL.createObjectURL(file)} alt="thumbnail" />
    </div>
  );
};

export default function App() {
  return (
    <div className="Max-container">
      <div className="link-block">
        <Link to="/">Home</Link>
        <br />
        <Link to="/uploadfiles">Upload</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/uploadfiles" element={<FileUpload />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div>
      <br />
      <img
        src="https://i.pinimg.com/originals/bd/da/fc/bddafc029d86df72bef91bba70973c71.jpg"
        alt="welcome"
      />
    </div>
  );
}

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progressMap, setProgressMap] = useState({}); // Map to store progress for each file
  const [error, setError] = useState("");

  const allowedFormats = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/bmp",
    "image/webp",
  ];
  const maxFileSize = 5 * 1024 * 1024;

  const handleFileChange = (event) => {
    setError("");
    const files = Array.from(event.target.files);
    const selected = files.filter(
      (file) =>
        allowedFormats.includes(file.type) && file.size <= maxFileSize
    );

    if (selected.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...selected]);
    } else {
      setError("Invalid file format or size.");
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setError("");
    const files = Array.from(event.dataTransfer.files);
    const selected = files.filter(
      (file) =>
        allowedFormats.includes(file.type) && file.size <= maxFileSize
    );

    if (selected.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...selected]);
    } else {
      setError("Invalid file format or size.");
    }
  };

  const handleUpload = async () => {
    setError("");
    setUploading(true);
    const totalFiles = selectedFiles.length;

    if (totalFiles === 0) {
      setError("No files selected for upload.");
      setUploading(false);
      return;
    }

    for (const [index, file] of selectedFiles.entries()) {
      const formData = new FormData();
      formData.append("file", file);

      setProgressMap((prevProgressMap) => ({
        ...prevProgressMap,
        [index]: 0,
      }));

      const totalChunks = 10; // You can adjust the number of chunks as needed

      for (let chunk = 1; chunk <= totalChunks; chunk++) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setProgressMap((prevProgressMap) => ({
            ...prevProgressMap,
            [index]: (chunk * 100) / totalChunks,
          }));
        } catch (error) {
          setError("Error uploading file.");
        }
      }
    }

    setUploading(false);
    setSelectedFiles([]);
    setProgressMap({});
  };

  const handleCancel = () => {
    setUploading(false); // Stop the upload process
    setSelectedFiles([]); // Clear selected files
    setProgressMap({}); // Clear progress
    setError(""); // Clear error
    // Reloads the page
  };

  return (
    <div className="cont">
      <h1>File upload functionality</h1>

      <div className="file-upload-container">
        <div
          className={`file-dropzone ${error && "error"}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <label className="browse-button">
            Browse
            <input
              type="file"
              accept=".jpeg, .png, .jpg, .bmp, .webp"
              multiple
              onChange={handleFileChange}
            />
          </label>
          <br />
          <br />
          <p>Drag & Drop files here or click to browse</p>
        </div>
        <div className="selected-files">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <Thumbnail file={file} />
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${progressMap[index] || 0}%` }}
                  >
                    {Math.round(progressMap[index] || 0)}%
                  </div>
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="button-container">
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
          >
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
};
