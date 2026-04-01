(function () {
  var el = document.getElementById('roesterei-map');
  if (!el) return;

  // ── Projektion ────────────────────────────────────────────────
  // Equirectangular, gebunden auf DACH-Region
  var W = 900, H = 580;
  var LON0 = 5.0, LON1 = 18.0;   // West- und Ostgrenze
  var LAT0 = 45.0, LAT1 = 56.0;  // Süd- und Nordgrenze

  function px(lonlat) {
    return [
      (lonlat[0] - LON0) / (LON1 - LON0) * W,
      (LAT1 - lonlat[1]) / (LAT1 - LAT0) * H
    ];
  }

  function geomToPath(geometry) {
    var polys = geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.coordinates;
    return polys.map(function (poly) {
      return poly.map(function (ring) {
        return ring.map(function (c, i) {
          var p = px(c);
          return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1);
        }).join('') + 'Z';
      }).join('');
    }).join('');
  }

  // ── SVG aufbauen ──────────────────────────────────────────────
  var NS = 'http://www.w3.org/2000/svg';

  function el$(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var svg = el$('svg', {
    viewBox: '0 0 ' + W + ' ' + H,
    xmlns: NS,
    'aria-hidden': 'true'
  });
  svg.style.cssText = 'display:block;width:100%;height:auto;';

  var gCountries = el$('g', { 'class': 'rm-countries' });
  var gCities    = el$('g', { 'class': 'rm-cities',   'pointer-events': 'none' });
  var gMarkers   = el$('g', { 'class': 'rm-markers' });

  svg.appendChild(gCountries);
  svg.appendChild(gCities);
  svg.appendChild(gMarkers);
  el.appendChild(svg);

  // ── Tooltip ───────────────────────────────────────────────────
  var tip = document.createElement('div');
  tip.className = 'rm-tooltip';
  el.appendChild(tip);

  function showTip(e, r) {
    tip.innerHTML =
      '<strong>' + r.name + '</strong>' +
      '<span class="rm-tip-city">' + r.city + '</span>' +
      '<span class="rm-tip-desc">' + r.description + '</span>';
    tip.classList.add('is-visible');
    moveTip(e);
  }

  function moveTip(e) {
    var rect = el.getBoundingClientRect();
    var x = e.clientX - rect.left + 14;
    var y = e.clientY - rect.top  - 48;
    if (x + 200 > rect.width) x = e.clientX - rect.left - 200;
    tip.style.left = x + 'px';
    tip.style.top  = y + 'px';
  }

  function hideTip() { tip.classList.remove('is-visible'); }

  // ── Länderdaten ───────────────────────────────────────────────
  var dach = [
    { iso: 'DEU', fill: '#d6c4a4', label: 'Deutschland', lp: [10.2, 51.5] },
    { iso: 'AUT', fill: '#ccb896', label: 'Österreich',  lp: [14.0, 47.55] },
    { iso: 'CHE', fill: '#c8b28e', label: 'Schweiz',     lp: [8.25, 46.9]  }
  ];

  var loaded = 0;

  dach.forEach(function (c) {
    fetch('https://cdn.jsdelivr.net/gh/johan/world.geo.json/countries/' + c.iso + '.geo.json')
      .then(function (r) { return r.json(); })
      .then(function (geo) {
        geo.features.forEach(function (f) {
          gCountries.appendChild(el$('path', {
            d: geomToPath(f.geometry),
            fill: c.fill,
            stroke: '#8c6a48',
            'stroke-width': '1',
            'stroke-linejoin': 'round'
          }));
        });

        var lp = px(c.lp);
        var t = el$('text', {
          x: lp[0], y: lp[1],
          'class': 'rm-country-label',
          'text-anchor': 'middle'
        });
        t.textContent = c.label;
        gCities.appendChild(t);
      })
      .catch(function () {})
      .then(function () {
        if (++loaded === dach.length) onReady();
      });
  });

  // ── Großstädte ────────────────────────────────────────────────
  function onReady() {
    [
      { name: 'Berlin',    lon: 13.40, lat: 52.52, dx:  6, dy: -4 },
      { name: 'Hamburg',   lon:  9.99, lat: 53.55, dx:  6, dy: -4 },
      { name: 'München',   lon: 11.58, lat: 48.14, dx:  6, dy:  4 },
      { name: 'Köln',      lon:  6.96, lat: 50.94, dx: -6, dy: -4, anchor: 'end' },
      { name: 'Frankfurt', lon:  8.68, lat: 50.11, dx:  6, dy: -4 },
      { name: 'Stuttgart', lon:  9.18, lat: 48.78, dx:  6, dy:  4 },
      { name: 'Leipzig',   lon: 12.37, lat: 51.34, dx:  6, dy: -4 },
      { name: 'Dresden',   lon: 13.74, lat: 51.05, dx:  6, dy: -4 },
      { name: 'Wien',      lon: 16.37, lat: 48.21, dx:  6, dy: -4 },
      { name: 'Zürich',    lon:  8.54, lat: 47.38, dx:  6, dy:  5 },
      { name: 'Bern',      lon:  7.45, lat: 46.95, dx: -6, dy:  5, anchor: 'end' }
    ].forEach(function (c) {
      var p = px([c.lon, c.lat]);
      gCities.appendChild(el$('circle', {
        cx: p[0], cy: p[1], r: '2',
        fill: '#6a4a2a', opacity: '0.55'
      }));
      var t = el$('text', {
        x: p[0] + c.dx, y: p[1] + c.dy,
        'class': 'rm-city-label',
        'text-anchor': c.anchor || 'start'
      });
      t.textContent = c.name;
      gCities.appendChild(t);
    });

    addMarkers();
  }

  // ── Rösterei-Marker ───────────────────────────────────────────
  function addMarkers() {
    [
      { name: 'Kaffeekommune', city: 'Mainz',      description: 'Specialty-Pionierin seit 2010',        url: '/roestereien/kaffeekommune-mainz/',      lon:  8.2473, lat: 49.9929 },
      { name: 'Maldaner',      city: 'Wiesbaden',  description: '165 Jahre Kaffeetradition, neu gedacht',url: '/roestereien/maldaner-wiesbaden/',        lon:  8.2698, lat: 50.0832 },
      { name: 'Onoma Kaffee',  city: 'Flensburg',  description: 'Flensburgs erste Specialty-Rösterei',  url: '/roestereien/onoma-flensburg/',           lon:  9.4333, lat: 54.7833 },
      { name: 'Unbound',       city: 'Innsbruck',  description: 'Farm-to-Cup aus den Swarovski-Hallen', url: '/roestereien/unbound-coffee-innsbruck/',  lon: 11.4041, lat: 47.2692 },
      { name: 'Südseite',      city: 'Heidelberg', description: 'Rösterei, Bäckerei & Café am Neckar',  url: '/roestereien/suedseite-heidelberg/',      lon:  8.6724, lat: 49.3988 },
      { name: 'Epitome',       city: 'Erfurt',     description: 'Klimaneutrale Small-Batch-Röstung',    url: '/roestereien/epitome-erfurt/',            lon: 11.0328, lat: 50.9787 },
      { name: 'MAK Afrika',    city: 'Augsburg',   description: 'Farm-to-Cup vom Mount Meru',           url: '/roestereien/mak-coffee-augsburg/',       lon: 10.8978, lat: 48.3705 },
      { name: '19grams',       city: 'Berlin',     description: 'Berliner Specialty-Pionier',           url: '/roestereien/19grams-berlin/',            lon: 13.4050, lat: 52.5200 },
      { name: 'Rösterei Heer', city: 'Thun',       description: 'Bio-Kaffee in kleinen Chargen',        url: '/roestereien/heer-thun/',                 lon:  7.6280, lat: 46.7580 }
    ].forEach(function (r) {
      var p = px([r.lon, r.lat]);
      var g = el$('g', { 'class': 'rm-marker', role: 'button', 'aria-label': r.name });
      g.style.cursor = 'pointer';

      g.appendChild(el$('circle', {
        cx: p[0], cy: p[1], r: '11',
        fill: '#c8963c', stroke: '#fff', 'stroke-width': '2.5',
        'class': 'rm-pin'
      }));

      g.addEventListener('mouseover', function (e) { showTip(e, r); });
      g.addEventListener('mousemove', moveTip);
      g.addEventListener('mouseout',  hideTip);
      g.addEventListener('click',     function () { window.location.href = r.url; });

      gMarkers.appendChild(g);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {});
  }
})();
