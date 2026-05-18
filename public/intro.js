const video =
document.getElementById("introVideo");

const intro =
document.getElementById("intro");

const welcomePage =
document.getElementById("welcomePage");

// VIDEO END

video.onended = () => {

    intro.style.opacity = "0";

    setTimeout(() => {

        intro.style.display = "none";

        welcomePage.classList.add("show");

    },1500);

};