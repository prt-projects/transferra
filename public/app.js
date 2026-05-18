const fileInput =
document.getElementById("fileInput");

const browseBtn =
document.getElementById("browseBtn");

const progressContainer =
document.querySelector(".progress-container");

const progressBar =
document.querySelector(".progress-bar");

const progressPercent =
document.getElementById("progressPercent");

const sharingContainer =
document.querySelector(".sharing-container");

const fileURL =
document.getElementById("fileURL");

const copyBtn =
document.getElementById("copyURLBtn");

const toast =
document.querySelector(".toast");

const qrCode =
document.getElementById("qrCode");

const downloadBtn =
document.getElementById("downloadBtn");

const shareBtn =
document.getElementById("shareBtn");

// OPEN FILE

browseBtn.addEventListener("click", () => {

    fileInput.click();

});

// FILE SELECT

fileInput.addEventListener("change", () => {

    uploadFile();

});

// UPLOAD

function uploadFile(){

    progressContainer.style.display = "block";

    let percent = 0;

    const uploadAnimation =
    setInterval(() => {

        percent++;

        progressBar.style.width =
        `${percent}%`;

        progressPercent.innerText =
        percent;

        progressBar.style.boxShadow = `
        0 0 ${10 + percent/5}px #00d9ff,
        0 0 ${20 + percent/3}px #00d9ff
        `;

        if(percent >= 100){

            clearInterval(uploadAnimation);

            document.querySelector(".status")
            .innerText =
            "Transfer Complete ⚡";

            showOutput();

        }

    },35);

}

// SHOW RESULT

function showOutput(){

    sharingContainer.style.display =
    "block";

    const sampleURL =
    "https://transferra.onrender.com/files/sample";

    fileURL.value = sampleURL;

    qrCode.src =
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${sampleURL}`;

    downloadBtn.href = sampleURL;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },3000);

}

// COPY

copyBtn.addEventListener("click", () => {

    fileURL.select();

    document.execCommand("copy");

});

// SHARE API

shareBtn.addEventListener("click", async() => {

    if(navigator.share){

        await navigator.share({

            title:"Transferra File",

            text:"Download File",

            url:fileURL.value

        });

    }

});