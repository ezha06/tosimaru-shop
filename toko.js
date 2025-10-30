<!DOCTYPE html>
<html>
<body>
<script>
navigator.geolocation.getCurrentPosition(pos => {
  window.parent.postMessage({
    lat: pos.coords.latitude,
    lon: pos.coords.longitude
  }, "*");
}, err => {
  window.parent.postMessage({ error: err.message }, "*");
});
</script>
</body>
</html>