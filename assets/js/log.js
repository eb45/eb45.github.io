(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const waypoints = [...document.querySelectorAll("[data-waypoint]")];
  const progress = document.querySelector(".rail-progress");
  const here = document.querySelector(".rail-here");
  const rail = document.querySelector(".rail");

  function setHere() {
    if (!here || !rail) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const t = max > 0 ? window.scrollY / max : 0;
    const trackTop = 64;
    const trackH = Math.max(0, rail.offsetHeight - trackTop * 2);
    if (progress) progress.style.height = `${Math.round(trackH * t)}px`;
    const railRect = rail.getBoundingClientRect();
    const y = railRect.top + trackTop + trackH * t;
    here.style.top = `${Math.min(window.innerHeight - 24, Math.max(24, y))}px`;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    },
    { threshold: 0.28, rootMargin: "0px 0px -10% 0px" }
  );
  waypoints.forEach((el) => {
    if (reduced) el.classList.add("in-view");
    else io.observe(el);
  });

  window.addEventListener("scroll", setHere, { passive: true });
  window.addEventListener("resize", setHere);
  setHere();

  const TRAIL = "#4A6B5A";
  const BLUE = "#2C3E5A";
  const tiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 19,
  });

  function haversine(a, b) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  async function loadRun() {
    const mapEl = document.getElementById("run-map");
    if (!mapEl || typeof L === "undefined") return;
    const map = L.map(mapEl, { scrollWheelZoom: false, attributionControl: true });
    tiles.addTo(map);
    map.setView([36.003, -78.927], 14);

    try {
      const res = await fetch("/assets/data/runs/campus-drive.gpx");
      const xml = new DOMParser().parseFromString(await res.text(), "text/xml");
      const pts = [...xml.querySelectorAll("trkpt")].map((n) => ({
        lat: parseFloat(n.getAttribute("lat")),
        lon: parseFloat(n.getAttribute("lon")),
        ele: parseFloat(n.querySelector("ele")?.textContent || "0"),
      }));
      if (!pts.length) return;
      const latlngs = pts.map((p) => [p.lat, p.lon]);
      const line = L.polyline(latlngs, { color: TRAIL, weight: 3, opacity: 0.95 });
      line.addTo(map);
      map.fitBounds(line.getBounds(), { padding: [18, 18] });
      L.circleMarker(latlngs[0], { radius: 5, color: BLUE, fillColor: BLUE, fillOpacity: 1, weight: 0 }).addTo(map);

      let dist = 0;
      let gain = 0;
      for (let i = 1; i < pts.length; i++) {
        dist += haversine([pts[i - 1].lat, pts[i - 1].lon], [pts[i].lat, pts[i].lon]);
        const dEle = pts[i].ele - pts[i - 1].ele;
        if (dEle > 0) gain += dEle;
      }
      const km = document.querySelector("[data-stat='km']");
      const gn = document.querySelector("[data-stat='gain']");
      if (km) km.textContent = (dist / 1000).toFixed(1);
      if (gn) gn.textContent = Math.round(gain).toString();

      const spark = document.getElementById("run-spark");
      if (spark) {
        const w = 300;
        const h = 64;
        const eles = pts.map((p) => p.ele);
        const min = Math.min(...eles);
        const max = Math.max(...eles);
        const span = Math.max(1, max - min);
        const coords = eles.map((e, i) => {
          const x = (i / (eles.length - 1)) * w;
          const y = h - 6 - ((e - min) / span) * (h - 12);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        const d = `M${coords.join(" L")}`;
        const area = `${d} L${w},${h} L0,${h} Z`;
        spark.innerHTML = `<path class="fill" d="${area}"></path><path d="${d}"></path>`;
      }
    } catch (err) {
      console.warn("GPX load failed", err);
    }
  }

  const places = [
    { name: "Hobbiton", lat: -37.8721, lng: 175.6829, region: "Waikato, NZ", notes: "A walk through a built Shire — hedges, round doors, and a hill that is doing a lot of work." },
    { name: "Milford Sound", lat: -44.6714, lng: 167.9256, region: "Fiordland, NZ", notes: "Rain on vertical rock. Water falling the whole way down the wall." },
    { name: "Hooker Valley Track", lat: -43.7167, lng: 170.0944, region: "Aoraki / Mt Cook, NZ", notes: "Swingbridges, glacier water, Aoraki waiting at the end of the valley." },
    { name: "Tongariro Alpine Crossing", lat: -39.1356, lng: 175.6508, region: "Central Plateau, NZ", notes: "Volcanic alpine day: red craters, steam, emerald lakes." },
    { name: "Zealandia", lat: -41.2905, lng: 174.7533, region: "Wellington, NZ", notes: "Fenced ecosanctuary in the hills above the city — birds you do not get in town." },
    { name: "Otago Peninsula", lat: -45.847, lng: 170.733, region: "Dunedin, NZ", notes: "Peninsula roads, albatross country, harbour light on the way back." },
    { name: "Shenandoah", lat: 38.2928, lng: -78.6796, region: "Virginia, US", notes: "Skyline Drive day trips — ridgeline weather and overlooks." },
  ];

  function loadRoutes() {
    const mapEl = document.getElementById("routes-map");
    if (!mapEl || typeof L === "undefined") return;
    const map = L.map(mapEl, { scrollWheelZoom: false });
    tiles.addTo(map);
    const markers = [];
    const title = document.getElementById("trip-title");
    const region = document.getElementById("trip-region");
    const notes = document.getElementById("trip-notes");

    function openPlace(p) {
      if (title) title.textContent = p.name;
      if (region) region.textContent = p.region;
      if (notes) notes.textContent = p.notes;
    }

    places.forEach((p) => {
      const m = L.circleMarker([p.lat, p.lng], {
        radius: 6,
        color: BLUE,
        weight: 2,
        fillColor: "#F7F4EC",
        fillOpacity: 1,
      }).addTo(map);
      m.on("click", () => openPlace(p));
      m.bindTooltip(p.name, { direction: "top", opacity: 0.95 });
      markers.push(m);
    });
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.25));
  }

  loadRun();
  loadRoutes();
})();
