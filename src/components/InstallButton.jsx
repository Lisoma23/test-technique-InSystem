import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const ColorButton = styled(Button)(({ theme }) => ({
    color: "#ABC4FF",
    width: "2vw",
    minWidth: "0vw",
  }));

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the default prompt
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the installation prompt");
        } else {
          console.log("User dismissed the installation prompt");
        }
      });
      setDeferredPrompt(null);
    }
  };

  return (
    deferredPrompt && (
      <ColorButton
        onClick={handleInstall}
        variant="outlined"
        aria-label="DownloadIcon"
      >
        <DownloadIcon />
      </ColorButton>
    )
  );
}
