const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const photoOutput = document.getElementById('photo-output');
const layoutOptions = document.querySelectorAll('.layout-option');
const colorPicker = document.getElementById('color-picker');
const downloadBtn = document.getElementById('download-btn');

let currentLayout = 1;
let selectedBackground = "#ffffff"; // Default: Warna putih

// Mulai kamera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing the camera: ", err);
        alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin dan kamera tersedia.");
    }
}

// Ambil foto
function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth; // Sesuaikan dengan lebar video
    canvas.height = video.videoHeight; // Sesuaikan dengan tinggi video

    // Gambar background dengan warna yang dipilih
    context.fillStyle = selectedBackground;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar foto di atas background
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simpan foto ke output
    const imageDataUrl = canvas.toDataURL('image/png', 1.0); // Kualitas maksimal
    const imgElement = document.createElement('img');
    imgElement.src = imageDataUrl;
    imgElement.alt = "Foto Anda";
    photoOutput.appendChild(imgElement);

    // Sesuaikan jumlah foto berdasarkan layout
    adjustPhotoOutput();
}

// Sesuaikan jumlah foto berdasarkan layout
function adjustPhotoOutput() {
    const maxPhotos = currentLayout * 4; // Maksimal 4 baris
    const photos = photoOutput.querySelectorAll('img');

    if (photos.length > maxPhotos) {
        for (let i = maxPhotos; i < photos.length; i++) {
            photoOutput.removeChild(photos[i]);
        }
    }
}

// Ubah layout
function changeLayout(layout) {
    photoOutput.setAttribute('data-layout', layout);
    currentLayout = layout;
    adjustPhotoOutput();
}

// Pilih warna background
colorPicker.addEventListener('input', (e) => {
    selectedBackground = e.target.value;
    // Ubah warna background .photo-output
    photoOutput.style.backgroundColor = selectedBackground;
});

// Unduh layout foto
function downloadLayout() {
    // Gunakan html2canvas dengan opsi scale
    html2canvas(photoOutput, {
        scale: 2, // Tingkatkan skala untuk resolusi yang lebih tinggi
        useCORS: true, // Izinkan penggunaan gambar cross-origin
        logging: true, // Aktifkan logging untuk debugging
    }).then((canvas) => {
        // Konversi canvas ke gambar dan unduh
        const link = document.createElement('a');
        link.download = 'layout-foto.png';
        link.href = canvas.toDataURL('image/png', 1.0); // Kualitas maksimal
        link.click();
    });
}

// Event listener untuk tombol ambil foto
captureBtn.addEventListener('click', capturePhoto);

// Event listener untuk pilihan layout
layoutOptions.forEach(option => {
    option.addEventListener('click', () => {
        const layout = option.getAttribute('data-layout');
        changeLayout(layout);
    });
});

// Event listener untuk tombol unduh
downloadBtn.addEventListener('click', downloadLayout);

// Mulai kamera saat halaman dimuat
startCamera();