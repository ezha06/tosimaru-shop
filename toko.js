async function initLocation() {
  const lokasiBox = document.getElementById("lokasiBox");

  if (!navigator.geolocation) {
    lokasiBox.innerHTML = "❌ Browser tidak mendukung geolocation";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      lokasiBox.innerHTML = `✅ Lokasi didapat:<br>Koordinat: ${lat}, ${lng}`;
    },
    (err) => {
      lokasiBox.innerHTML = "❌ Gagal ambil lokasi: " + err.message;
    }
  );
}

// langsung jalan saat halaman dibuka
document.addEventListener("DOMContentLoaded", initLocation);