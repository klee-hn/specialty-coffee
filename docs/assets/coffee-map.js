(function () {
  function initMap() {
    var el = document.getElementById('coffee-map');
    if (!el || typeof L === 'undefined') return;

    var map = L.map('coffee-map', {
      center: [5, 25],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    var regions = [
      {
        name: 'Äthiopien',
        subtitle: 'Die Heimat des Kaffees',
        url: '/anbaugebiete/aethiopien/',
        color: '#c8963c',
        latlngs: [
          [14.9, 37.5], [14.2, 39.5], [12.5, 42.5], [10.0, 44.0],
          [8.5, 47.5], [6.0, 44.5], [4.0, 41.5], [3.5, 38.5],
          [4.5, 35.5], [7.0, 33.0], [11.5, 33.5], [13.5, 35.5]
        ]
      },
      {
        name: 'Kolumbien',
        subtitle: 'Zwei Ernten pro Jahr',
        url: '/anbaugebiete/kolumbien/',
        color: '#8c5035',
        latlngs: [
          [12.5, -73.0], [11.5, -71.0], [11.0, -68.5], [8.5, -66.5],
          [4.5, -67.0], [0.5, -67.5], [-4.0, -69.5], [-4.5, -76.5],
          [0.5, -79.5], [4.5, -77.5], [7.5, -77.0], [10.5, -74.5]
        ]
      },
      {
        name: 'Kenia',
        subtitle: 'Komplexe Säurestrukturen',
        url: '/anbaugebiete/kenia/',
        color: '#e0a840',
        latlngs: [
          [4.5, 34.0], [4.0, 36.5], [3.5, 38.5], [1.0, 41.5],
          [-1.5, 41.5], [-4.5, 40.0], [-4.5, 37.0], [-1.0, 34.0],
          [1.0, 33.5]
        ]
      },
      {
        name: 'Brasilien',
        subtitle: 'Das größte Kaffeeanbauland',
        url: '/anbaugebiete/brasilien/',
        color: '#6b3a2a',
        latlngs: [
          [5.0, -61.5], [5.0, -52.0], [2.5, -50.5], [-5.0, -35.0],
          [-10.0, -37.5], [-16.0, -39.0], [-23.5, -43.5],
          [-30.0, -50.5], [-33.5, -53.0], [-30.0, -57.5],
          [-20.0, -57.5], [-15.0, -60.0], [-10.0, -67.5],
          [-4.5, -73.0], [0.5, -70.5], [4.5, -63.0]
        ]
      },
      {
        name: 'Guatemala',
        subtitle: 'Vulkanische Böden',
        url: '/anbaugebiete/guatemala/',
        color: '#4a8cb5',
        latlngs: [
          [17.8, -91.5], [17.8, -88.5], [15.5, -88.5],
          [13.5, -89.5], [13.5, -92.5], [15.5, -92.5]
        ]
      }
    ];

    // Indonesien als Multi-Polygon (Inseln)
    var indonesien = {
      name: 'Indonesien',
      subtitle: 'Erdige Tiefe und Körper',
      url: '/anbaugebiete/indonesien/',
      color: '#4ab580',
      islands: [
        // Sumatra
        [[-6.0, 105.5], [-3.5, 103.0], [0.5, 103.5], [5.5, 98.0],
         [5.5, 96.0], [2.0, 98.5], [-3.0, 103.0], [-6.0, 105.0]],
        // Java
        [[-8.5, 106.0], [-6.5, 106.5], [-6.5, 111.5],
         [-8.5, 114.5], [-9.0, 111.5], [-8.5, 106.5]],
        // Sulawesi
        [[-5.5, 120.0], [-1.5, 119.5], [1.5, 120.5], [0.5, 124.0],
         [-2.5, 125.5], [-5.5, 124.5], [-6.0, 121.0]]
      ]
    };

    function makeTooltip(r) {
      return '<strong style="font-family: Lora, Georgia, serif; font-size: 0.95rem;">'
        + r.name + '</strong><br>'
        + '<span style="color: rgba(253,248,243,0.75);">' + r.subtitle + '</span>';
    }

    function stylePoly(color) {
      return { color: color, fillColor: color, fillOpacity: 0.4, weight: 1.5, opacity: 0.75 };
    }

    function attachEvents(poly, region) {
      poly.bindTooltip(makeTooltip(region), { className: 'coffee-map-tooltip', sticky: true });
      poly.on('mouseover', function () {
        this.setStyle({ fillOpacity: 0.65, weight: 2.5 });
        el.style.cursor = 'pointer';
      });
      poly.on('mouseout', function () {
        this.setStyle({ fillOpacity: 0.4, weight: 1.5 });
        el.style.cursor = '';
      });
      poly.on('click', function () {
        window.location.href = region.url;
      });
    }

    regions.forEach(function (region) {
      var poly = L.polygon(region.latlngs, stylePoly(region.color)).addTo(map);
      attachEvents(poly, region);
    });

    indonesien.islands.forEach(function (latlngs) {
      var poly = L.polygon(latlngs, stylePoly(indonesien.color)).addTo(map);
      attachEvents(poly, indonesien);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
