(function () {
  function initMap() {
    var el = document.getElementById('roesterei-map');
    if (!el || typeof L === 'undefined') return;

    var map = L.map('roesterei-map', {
      center: [50.5, 10.6],
      zoom: 6,
      minZoom: 5,
      maxZoom: 13,
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: true
    });

    // ── Länderdaten ──────────────────────────────────────────────
    var dach = [
      { iso: 'DEU', label: 'Deutschland', fill: '#d6c4a4', labelPos: [51.5, 10.2] },
      { iso: 'AUT', label: 'Österreich',  fill: '#ccb896', labelPos: [47.5, 14.0] },
      { iso: 'CHE', label: 'Schweiz',     fill: '#c8b28e', labelPos: [46.9, 8.2]  }
    ];

    var polyStyle = {
      color: '#8c6a48',
      weight: 1.5,
      opacity: 0.9,
      fillOpacity: 1
    };

    // GeoJSON laden und zeichnen
    var loaded = 0;
    dach.forEach(function (country) {
      fetch('https://cdn.jsdelivr.net/gh/johan/world.geo.json/countries/' + country.iso + '.geo.json')
        .then(function (r) { return r.json(); })
        .then(function (geo) {
          L.geoJSON(geo, {
            style: Object.assign({}, polyStyle, { fillColor: country.fill })
          }).addTo(map);

          L.marker(country.labelPos, {
            icon: L.divIcon({
              className: 'rm-country-label',
              html: country.label,
              iconAnchor: [0, 0]
            }),
            interactive: false,
            keyboard: false
          }).addTo(map);
        })
        .catch(function () {})
        .finally(function () {
          loaded++;
          if (loaded === dach.length) addRoestereien();
        });
    });

    // ── Großstädte als Orientierung ───────────────────────────────
    var cities = [
      { name: 'Berlin',    lat: 52.52, lon: 13.40 },
      { name: 'Hamburg',   lat: 53.55, lon:  9.99 },
      { name: 'München',   lat: 48.14, lon: 11.58 },
      { name: 'Köln',      lat: 50.94, lon:  6.96 },
      { name: 'Frankfurt', lat: 50.11, lon:  8.68 },
      { name: 'Stuttgart', lat: 48.78, lon:  9.18 },
      { name: 'Leipzig',   lat: 51.34, lon: 12.37 },
      { name: 'Dresden',   lat: 51.05, lon: 13.74 },
      { name: 'Wien',      lat: 48.21, lon: 16.37 },
      { name: 'Zürich',    lat: 47.38, lon:  8.54 },
      { name: 'Bern',      lat: 46.95, lon:  7.45 }
    ];

    cities.forEach(function (c) {
      L.circleMarker([c.lat, c.lon], {
        radius: 2,
        color: '#6a4a2a',
        fillColor: '#6a4a2a',
        fillOpacity: 0.7,
        weight: 0,
        interactive: false
      }).addTo(map);

      L.marker([c.lat, c.lon], {
        icon: L.divIcon({
          className: 'rm-city-label',
          html: c.name,
          iconAnchor: [-5, 6]
        }),
        interactive: false,
        keyboard: false
      }).addTo(map);
    });

    // ── Röstereien ────────────────────────────────────────────────
    function addRoestereien() {
      var roestereien = [
        {
          name: 'Kaffeekommune Mainz',
          description: 'Specialty-Pionierin seit 2010',
          city: 'Mainz',
          url: '/roestereien/kaffeekommune-mainz/',
          lat: 49.9929, lon: 8.2473
        },
        {
          name: 'Maldaner Coffee Roasters',
          description: '165 Jahre Kaffeetradition, neu gedacht',
          city: 'Wiesbaden',
          url: '/roestereien/maldaner-wiesbaden/',
          lat: 50.0782, lon: 8.2398
        },
        {
          name: 'Onoma Kaffee',
          description: 'Flensburgs erste Specialty-Rösterei',
          city: 'Flensburg',
          url: '/roestereien/onoma-flensburg/',
          lat: 54.7833, lon: 9.4333
        },
        {
          name: 'Unbound Coffee Roasters',
          description: 'Farm-to-Cup aus den Swarovski-Hallen',
          city: 'Innsbruck',
          url: '/roestereien/unbound-coffee-innsbruck/',
          lat: 47.2692, lon: 11.4041
        },
        {
          name: 'Südseite',
          description: 'Rösterei, Bäckerei & Café am Neckar',
          city: 'Heidelberg',
          url: '/roestereien/suedseite-heidelberg/',
          lat: 49.3988, lon: 8.6724
        },
        {
          name: 'Epitome Coffee Co',
          description: 'Klimaneutrale Small-Batch-Röstung',
          city: 'Erfurt',
          url: '/roestereien/epitome-erfurt/',
          lat: 50.9787, lon: 11.0328
        },
        {
          name: 'MAK Afrika',
          description: 'Farm-to-Cup vom Mount Meru',
          city: 'Augsburg',
          url: '/roestereien/mak-coffee-augsburg/',
          lat: 48.3705, lon: 10.8978
        },
        {
          name: '19grams',
          description: 'Berliner Specialty-Pionier',
          city: 'Berlin',
          url: '/roestereien/19grams-berlin/',
          lat: 52.5200, lon: 13.4050
        },
        {
          name: 'Rösterei Heer',
          description: 'Bio-Kaffee in kleinen Chargen',
          city: 'Thun',
          url: '/roestereien/heer-thun/',
          lat: 46.7580, lon: 7.6280
        }
      ];

      var icon = L.divIcon({
        className: 'rm-marker',
        html: '<div class="rm-pin"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        tooltipAnchor: [11, -11]
      });

      roestereien.forEach(function (r) {
        var marker = L.marker([r.lat, r.lon], { icon: icon }).addTo(map);

        marker.bindTooltip(
          '<strong style="font-family:Lora,Georgia,serif;font-size:.92rem;">' + r.name + '</strong>'
          + '<br><span style="color:rgba(253,248,243,.6);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;">' + r.city + '</span>'
          + '<br><span style="color:rgba(253,248,243,.85);">' + r.description + '</span>',
          { className: 'rm-tooltip', direction: 'top', offset: [0, -14] }
        );

        marker.on('mouseover', function () { el.style.cursor = 'pointer'; });
        marker.on('mouseout',  function () { el.style.cursor = ''; });
        marker.on('click',     function () { window.location.href = r.url; });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
