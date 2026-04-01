(function () {
  function initMap() {
    var el = document.getElementById('roesterei-map');
    if (!el || typeof L === 'undefined') return;

    var map = L.map('roesterei-map', {
      center: [50.8, 10.4],
      zoom: 6,
      minZoom: 5,
      maxZoom: 14,
      scrollWheelZoom: false,
      attributionControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    var roestereien = [
      {
        name: 'Kaffeekommune Mainz',
        description: 'Specialty-Pionierin seit 2010',
        city: 'Mainz',
        url: '/roestereien/kaffeekommune-mainz/',
        lat: 49.9929,
        lon: 8.2473
      },
      {
        name: 'Maldaner Coffee Roasters',
        description: '165 Jahre Kaffeetradition, neu gedacht',
        city: 'Wiesbaden',
        url: '/roestereien/maldaner-wiesbaden/',
        lat: 50.0782,
        lon: 8.2398
      },
      {
        name: 'Onoma Kaffee',
        description: 'Flensburgs erste Specialty-Rösterei',
        city: 'Flensburg',
        url: '/roestereien/onoma-flensburg/',
        lat: 54.7833,
        lon: 9.4333
      },
      {
        name: 'Unbound Coffee Roasters',
        description: 'Farm-to-Cup aus den Swarovski-Hallen',
        city: 'Innsbruck',
        url: '/roestereien/unbound-coffee-innsbruck/',
        lat: 47.2692,
        lon: 11.4041
      },
      {
        name: 'Südseite',
        description: 'Rösterei, Bäckerei & Café am Neckar',
        city: 'Heidelberg',
        url: '/roestereien/suedseite-heidelberg/',
        lat: 49.3988,
        lon: 8.6724
      },
      {
        name: 'Epitome Coffee Co',
        description: 'Klimaneutrale Small-Batch-Röstung',
        city: 'Erfurt',
        url: '/roestereien/epitome-erfurt/',
        lat: 50.9787,
        lon: 11.0328
      },
      {
        name: 'MAK Afrika',
        description: 'Farm-to-Cup vom Mount Meru',
        city: 'Augsburg',
        url: '/roestereien/mak-coffee-augsburg/',
        lat: 48.3705,
        lon: 10.8978
      }
    ];

    var icon = L.divIcon({
      className: 'rm-marker',
      html: '<div class="rm-pin"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      tooltipAnchor: [11, 0]
    });

    roestereien.forEach(function (r) {
      var marker = L.marker([r.lat, r.lon], { icon: icon }).addTo(map);

      var tooltip = '<strong style="font-family: Lora, Georgia, serif; font-size: 0.92rem;">'
        + r.name + '</strong>'
        + '<br><span style="color: rgba(253,248,243,0.65); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em;">' + r.city + '</span>'
        + '<br><span style="color: rgba(253,248,243,0.8);">' + r.description + '</span>';

      marker.bindTooltip(tooltip, {
        className: 'rm-tooltip',
        direction: 'top',
        offset: [0, -14]
      });

      marker.on('mouseover', function () {
        el.style.cursor = 'pointer';
        this.openTooltip();
      });
      marker.on('mouseout', function () {
        el.style.cursor = '';
      });
      marker.on('click', function () {
        window.location.href = r.url;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
