// ==========================
// TABS
// ==========================
function showTab(event, tabId) {

    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}


// ==========================
// FILE UPLOAD
// ==========================
const fileInput = document.getElementById("file");
const fileNameText = document.getElementById("file-name");
const audioPlayer = document.getElementById("audio-player");
const resultPlayer = document.getElementById("result-player");

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file &&
        !file.type.startsWith("audio/") &&
        !file.type.startsWith("video/")) {

        alert("Please upload audio or video 🎧🎥");
        this.value = "";
        return;
    }

    if (file) {
        fileNameText.textContent = file.name;

        const audioURL = URL.createObjectURL(file);
        audioPlayer.src = audioURL;
        audioPlayer.style.display = "block";
    }
});


// ==========================
// VOICE CARDS
// ==========================
let selectedVoice = "male";

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("click", () => {

        cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        // selectedVoice = card.dataset.effect;
        selectedVoice = card.getAttribute("data-effect");
        console.log("Selected:", selectedVoice);

        document.getElementById("dashboardTitle").textContent =
            card.querySelector("h3").textContent + " Parameters";
    });
});


// ==========================
// APPLY EFFECT (BACKEND CALL)
// ==========================
const applyBtn = document.getElementById("applyBtn");
const downloadBtn = document.getElementById("downloadBtn");

applyBtn.addEventListener('click', async () => {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload audio first 🎧");
        return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("effect", selectedVoice);

    // 🎚️ sliders
    formData.append("pitch", pitchSlider.value);
    formData.append("speed", timeSlider.value / 100);
    formData.append("cutoff", filterSlider.value);
    formData.append("reverb", reverbSlider.value / 100);

    applyBtn.disabled = true;

    try {
        const response = await fetch("/process", {
            method: "POST",
            body: formData
        });

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        resultPlayer.src = url;
        resultPlayer.style.display = "block";

        downloadBtn.href = url;
        downloadBtn.download = selectedVoice + "_voice.wav";

    } catch (err) {
        console.error(err);
        alert("Error processing audio 😢");
    }

    applyBtn.disabled = false;
});


// ==========================
// SLIDERS
// ==========================
const pitchSlider = document.getElementById('pitchSlider');
const timeSlider = document.getElementById('timeSlider');
const filterSlider = document.getElementById('filterSlider');
const reverbSlider = document.getElementById('reverbSlider');

const pitchValue = document.getElementById('pitchValue');
const timeValue = document.getElementById('timeValue');
const filterValue = document.getElementById('filterValue');
const reverbValue = document.getElementById('reverbValue');

function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) /
        (slider.max - slider.min) * 100;

    slider.style.background =
        `linear-gradient(to right, rgb(94,36,36) ${value}%, #ecf0f1 ${value}%)`;
}

// events
pitchSlider.addEventListener('input', e => {
    pitchValue.textContent = e.target.value;
    updateSliderBackground(pitchSlider);
});

timeSlider.addEventListener('input', e => {
    timeValue.textContent = (e.target.value / 100).toFixed(2);
    updateSliderBackground(timeSlider);
});

filterSlider.addEventListener('input', e => {
    filterValue.textContent = e.target.value;
    updateSliderBackground(filterSlider);
});

reverbSlider.addEventListener('input', e => {
    reverbValue.textContent = e.target.value;
    updateSliderBackground(reverbSlider);
});

// init
updateSliderBackground(pitchSlider);
updateSliderBackground(timeSlider);
updateSliderBackground(filterSlider);
updateSliderBackground(reverbSlider);