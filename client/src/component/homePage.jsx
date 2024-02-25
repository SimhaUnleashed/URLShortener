import React, { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "./homePage.css";
import app from "../config/axiosConfig";
import { baseURL } from "../config/axiosConfig";
import QRCode from "react-qr-code";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import { QRCodeCanvas } from "qrcode.react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontFamily: "Montserrat",
  outline: 0,
};

const HomePage = () => {
  let qrCodeRef = React.createRef();
  const [url, seturl] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [isSet, setisSet] = useState(false);

  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const result = `${baseURL}/${shortURL}`;

  const [showAlert, setShowAlert] = useState(false);

  const changeHandler = (e) => {
    seturl(e.target.value);
    setisSet(false);
  };
  const fetchData = async (e) => {
    e.preventDefault();
    try {
      const res = await app.get(`/long/${url}`);
      setShortURL(res.data.url);
      setisSet(true);
      console.log(res.data.url);
      console.log("URL: " + url);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchData(event);
    }
  };
  const downloadQR = () => {
    const canvas = document.querySelector("#qr")
    if (!canvas) throw new Error("<canvas> not found in the DOM")

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = "QR code.png"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }


  const handleURLCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
      setOpen(false);
    } catch (err) {
      console.error("Unable to copy to clipboard.", err);
      alert("Copy to clipboard failed.");
    }
  };
  useEffect(() => {
    if(window.location.pathname!='/'){
      window.location.href = baseURL + window.location.pathname;
    }
  }, []);
  return (
    <div class="homepage" onKeyDown={handleKeyDown}>
      <Alert
        severity="success"
        variant="filled"
        sx={{
          width: "30%",
          display: "flex",
          justifyContent: "center",
          margin: "0 auto 12.5% auto",
          visibility: showAlert ? "visible" : "hidden",
        }}
      >
        URL Copied to Clipboard successfully
      </Alert>
      <h1>Shorten. Share. Repeat.</h1>
      {/* <h5>Generate a new short link in a single click!</h5> */}
      <div className="text-box">
        <input
          type="url"
          placeholder="Enter the URL here"
          name="url"
          onChange={changeHandler}
          required
        />
        <div className="button" onClick={fetchData}>
          <CheckCircleIcon className="tick-mark" />
          <span className="test-url">Shorten URL</span>
        </div>
      </div>
      {isSet && (
        <div className="result">
          <h1>Your Short URL is</h1>
          <div className="shortURL">
            <a href={result}>{result}</a>
          </div>
          <div className="qrcopybuttons">
            {/* <QRCode
              size={128}
              
              value={result}
              viewBox={`0 0 256 256`}
              
            /> */}
            <QRCodeCanvas
              id="qr"
              level="H"
              size={128}
              value={result}
              style={{
                margin: "auto 0",
                height: "15%",
                maxWidth: "15%",
                width: "15%",
                cursor: "pointer",
              }}
              onClick={handleOpen}
            />
            <div
              class="button copyURL"
              style={{ margin: "1rem 1.5rem" }}
              onClick={handleURLCopy}
            >
              Copy URL
            </div>
          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            
            <Box sx={style}>
            
              <h1 style={{ textAlign: "center" }}>Your Short URL is</h1>
              <a href={result}>{result}</a>

              <QRCodeCanvas
                id="qr"
                level="H"
                size={512}
                value={result}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
                onClick={handleOpen}
              />

              <div
                class="button copyURL"
                style={{ padding: "10px" }}
                onClick={handleURLCopy}
              >
                Copy URL
              </div>
              <div
                class="button copyURL"
                style={{ padding: "10px" }}
                onClick={downloadQR}
              >
                Download QR
              </div>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default HomePage;
