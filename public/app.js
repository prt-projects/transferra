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

    if(!fileInput.files.length) return;

    progressContainer.style.display = "block";
    document.querySelector(".status").innerText = "Uploading...";

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = `${percent}%`;
            progressPercent.innerText = percent;
            progressBar.style.boxShadow = `
            0 0 ${10 + percent/5}px #00d9ff,
            0 0 ${20 + percent/3}px #00d9ff
            `;

            if(percent >= 100){
                document.querySelector(".status").innerText = "Processing...";
            }
        }
    };

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                document.querySelector(".status").innerText = "Transfer Complete ⚡";
                const response = JSON.parse(xhr.response);
                showOutput(response.file);
            } else {
                document.querySelector(".status").innerText = "Error in transfer!";
            }
        }
    };

    xhr.open("POST", "/api/files");
    xhr.send(formData);
}

// SHOW RESULT

function showOutput(url){

    sharingContainer.style.display =
    "block";

    fileURL.value = url;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
    qrCode.src = qrUrl;

    downloadBtn.onclick = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = "Transferra-QR.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading QR code:", error);
        }
    };

    toast.innerText = "File Uploaded Successfully ⚡";
    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },3000);

}

// COPY

copyBtn.addEventListener("click", () => {

    fileURL.select();

    // Use modern Clipboard API with fallback
    if (navigator.clipboard) {
        navigator.clipboard.writeText(fileURL.value).then(() => {
            toast.innerText = "Link copied to clipboard ✅";
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        });
    } else {
        document.execCommand("copy");
        toast.innerText = "Link copied to clipboard ✅";
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
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