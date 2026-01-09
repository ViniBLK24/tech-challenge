"use client";

import { useState } from "react";

export function useTransactionFile(initialUrl?: string | null) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialUrl ?? null
  );
  const [shouldRemoveFile, setShouldRemoveFile] = useState(false);

  function handleFileDrop(file: File) {
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShouldRemoveFile(false);
  }

  function removeFile() {
    setFile(null);
    setPreviewUrl(null);
    setShouldRemoveFile(true);
  }

  function resetFile() {
    setFile(null);
    setPreviewUrl(null);
    setShouldRemoveFile(false);
  }

  return {
    file,
    previewUrl,
    shouldRemoveFile,
    handleFileDrop,
    removeFile,
    resetFile,
  };
}
