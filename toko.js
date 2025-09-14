// toko.js - siap pakai di GitHub Pages
const apiSayuran = "https://app.jagel.id/api/v2/customer/component/68b5cf157e8ee?codename=tosimaru&page=1&app_mode=1&per_page=24";

function hitungJarak(lat1, lon1, lat2, lon2){
  const R = 6371, toRad = d => d * Math.PI/180;
  const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function getUserLocation() {
  try {
    const raw = localStorage.getItem("userLocation");
    if (raw) {
      const loc = JSON.parse(raw);
      if (loc.lat && loc.lng) return { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) };
    }
  } catch(e){}

  if (navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      localStorage.setItem("userLocation", JSON.stringify(coords));
      return coords;
    } catch(e) {
      console.warn("User menolak lokasi GPS atau error:", e);
    }
  }

  return null;
}

async function getTokoDetail(view_uid){
  try {
    const res = await fetch(`https://app.jagel.id/api/v2/customer/list/${view_uid}?codename=tosimaru`);
    const json = await res.json();
    return json?.data || null;
  } catch(e){
    console.error("Gagal ambil detail toko:", e);
    return null;
  }
}

async function loadToko(){
  const grid = document.getElementById("tokoGrid");
  grid.innerHTML = "<p>Memuat toko...</p>";

  try {
    const res = await fetch(apiSayuran);
    const data = await res.json();
    const list = data?.data?.lists?.data || [];
    const tokoList = list.filter(p => p.type === 4); // hanya toko
    const userLoc = await getUserLocation();

    if (!tokoList.length) {
      grid.innerHTML = "<p>Tidak ada toko ditemukan.</p>";
      return;
    }

    const cards = [];
    for (const toko of tokoList) {
      const detail = await getTokoDetail(toko.view_uid);
      let jarak = "Lokasi tidak tersedia";
      if (detail && userLoc && detail.origin_lat && detail.origin_lng) {
        jarak = hitungJarak(userLoc.lat, userLoc.lng, parseFloat(detail.origin_lat), parseFloat(detail.origin_lng)).toFixed(2) + " km";
      }
      const imgSrc = toko.image ? `https://www.jagel.id/api/listimage/${toko.image}` : "https://via.placeholder.com/300x200.png?text=No+Image";
      const statusClass = toko.is_open ? "status-buka" : "status-tutup";
      const statusText = toko.is_open ? "Buka" : (toko.close_status || "Tutup");
      const link = toko.link_view || "#";

      cards.push(`
        <a class="card" href="${link}">
          <img src="${imgSrc}" alt="${toko.title || toko.partner_name || '-'}" loading="lazy">
          <div class="card-body">
            <div class="title">${toko.title || toko.partner_name || '-'}</div>
            <div class="meta"><span class="${statusClass}">● ${statusText}</span></div>
            <div class="meta">👤 ${toko.partner_name || '-'}</div>
            <div class="meta">📍 ${detail?.origin_address || '-'}</div>
            <div class="meta">📏 ${jarak}</div>
          </div>
        </a>
      `);
    }

    grid.innerHTML = cards.join("");
  } catch(e){
    console.error("Gagal ambil daftar toko:", e);
    grid.innerHTML = "<p>Gagal memuat toko.</p>";
  }
}

// Jalankan otomatis
loadToko();