<?php
// toko-terdekat.php
header('Content-Type: application/json');

// Lokasi user (bisa dari GET atau dummy dulu)
$lat = $_GET['lat'] ?? -5.1194428;
$lng = $_GET['lng'] ?? 119.4197395;

// Data toko (bisa dari database atau hardcoded dulu)
$toko = [
  ["nama" => "Toko A", "lat" => -5.017912, "lng" => 119.576591, "alamat" => "Jalan Nasrun Amrullah"],
  ["nama" => "Toko B", "lat" => -5.130000, "lng" => 119.410000, "alamat" => "Jl. Ahmad Yani"],
  ["nama" => "Toko C", "lat" => -5.090000, "lng" => 119.430000, "alamat" => "Jl. Sultan Alauddin"]
];

// Fungsi jarak Haversine
function jarak($lat1, $lng1, $lat2, $lng2) {
  $R = 6371;
  $dLat = deg2rad($lat2 - $lat1);
  $dLng = deg2rad($lng2 - $lng1);
  $a = sin($dLat/2) * sin($dLat/2) +
       cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
       sin($dLng/2) * sin($dLng/2);
  $c = 2 * atan2(sqrt($a), sqrt(1-$a));
  return $R * $c;
}

// Hitung jarak & urutkan
foreach ($toko as &$t) {
  $t['jarak'] = jarak($lat, $lng, $t['lat'], $t['lng']);
}
usort($toko, fn($a, $b) => $a['jarak'] <=> $b['jarak']);

// Ambil 5 terdekat
$output = array_slice($toko, 0, 5);

// Output JSON
echo json_encode($output);
?>