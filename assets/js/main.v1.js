
(function () {
  'use strict';
  var WA = 'https://wa.me/375296822216';
  var DEC = { dub: '#C08F58', white: '#F1EEE8', grafit: '#31302D', oreh: '#6C452B' };
  var NAMES = { dub: 'дуб натуральный', white: 'белый матовый', grafit: 'графит', oreh: 'орех' };

  function initDrawer() {
    var d = document.getElementById('drawer');
    var b = document.querySelector('.header .burger');
    if (!d || !b) return;
    var last = null;
    function open() {
      last = document.activeElement;
      d.hidden = false; d.setAttribute('data-open', '');
      b.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var f = d.querySelector('a, button'); if (f) f.focus({ preventScroll: true });
    }
    function close() {
      d.hidden = true; d.removeAttribute('data-open');
      b.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (last) last.focus({ preventScroll: true });
    }
    b.addEventListener('click', function () { d.hidden ? open() : close(); });
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target.closest('a') || !e.target.closest('.drawer__in')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !d.hidden) close();
      if (e.key === 'Tab' && !d.hidden) {
        var it = d.querySelectorAll('a, button, input');
        if (!it.length) return;
        var f = it[0], l = it[it.length - 1];
        if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
        else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1024 && !d.hidden) close(); });
  }

  function initCfg() {
    var svg = document.getElementById('cfgSvg');
    if (!svg) return;
    var st = { type: 'vstroen', w: 2, h: 2.4, doors: 2, rail: true, shelf: true, drawer: false, top: false, dec: 'dub' };
    var out = {
      spec: document.getElementById('cfgSpec'), note: document.getElementById('cfgNote'),
      go: document.getElementById('cfgGo'), axH: document.getElementById('axH'), axW: document.getElementById('axW'),
      vW: document.getElementById('vW'), vH: document.getElementById('vH')
    };
    function m(v) { return String(Math.round(v * 100) / 100).replace('.', ','); }
    function single(id, key, cast) {
      var box = document.getElementById(id);
      if (!box) return;
      box.addEventListener('click', function (e) {
        var btn = e.target.closest('button'); if (!btn || !box.contains(btn)) return;
        var v = btn.getAttribute('data-v');
        st[key] = cast === 'int' ? parseInt(v, 10) : v;
        [].forEach.call(box.children, function (c) { c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'); });
        draw();
      });
    }
    function toggles(id) {
      var box = document.getElementById(id);
      if (!box) return;
      box.addEventListener('click', function (e) {
        var btn = e.target.closest('button'); if (!btn || !box.contains(btn)) return;
        var k = btn.getAttribute('data-v');
        if (!(k in st)) return;
        st[k] = !st[k];
        btn.setAttribute('aria-pressed', st[k] ? 'true' : 'false');
        draw();
      });
    }
    function draw() {
      var hex = DEC[st.dec] || DEC.dub;
      var light = st.dec === 'white';
      var edge = light ? '#D9D2C6' : 'rgba(255,255,255,.28)';
      var ink = light ? '#8A8074' : 'rgba(255,255,255,.62)';
      var X0 = 60, Y0 = 40, MAXW = 500, MAXH = 320;
      var sc = Math.min(MAXW / st.w, MAXH / st.h);
      var w = st.w * sc, h = st.h * sc;
      var x = X0, y = Y0 + (MAXH - h);
      var n = st.doors, dw = w / n;
      var parts = [];
      parts.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="none" stroke="#2B241D" stroke-width="1.5"/>');
      parts.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + hex + '"/>');
      parts.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#grain)" opacity="' + (light ? '.18' : '.35') + '"/>');
      var inner = [];
      var topY = y + 6;
      if (st.top) { topY = y + h * 0.22; inner.push('<line x1="' + (x + 6) + '" y1="' + topY + '" x2="' + (x + w - 6) + '" y2="' + topY + '" stroke="' + ink + '" stroke-width="1" stroke-dasharray="4 4"/>'); }
      if (st.shelf) {
        for (var k = 1; k <= 3; k++) {
          var sy = topY + ((y + h - 10 - topY) / 4) * k;
          inner.push('<line x1="' + (x + 8) + '" y1="' + sy + '" x2="' + (x + w - 8) + '" y2="' + sy + '" stroke="' + ink + '" stroke-width="1" stroke-dasharray="5 5"/>');
        }
      }
      if (st.rail) inner.push('<line x1="' + (x + 14) + '" y1="' + (topY + 14) + '" x2="' + (x + w - 14) + '" y2="' + (topY + 14) + '" stroke="' + ink + '" stroke-width="2" stroke-dasharray="12 5"/>');
      if (st.drawer) {
        inner.push('<rect x="' + (x + w * 0.08) + '" y="' + (y + h * 0.62) + '" width="' + (w * 0.34) + '" height="' + (h * 0.3) + '" fill="none" stroke="' + ink + '" stroke-dasharray="4 4"/>');
        inner.push('<rect x="' + (x + w * 0.56) + '" y="' + (y + h * 0.62) + '" width="' + (w * 0.34) + '" height="' + (h * 0.3) + '" fill="none" stroke="' + ink + '" stroke-dasharray="4 4"/>');
      }
      parts = parts.concat(inner);
      for (var i = 0; i < n; i++) {
        var dx = x + i * dw;
        parts.push('<rect x="' + (dx + 1) + '" y="' + (y + 1) + '" width="' + (dw - 2) + '" height="' + (h - 2) + '" fill="none" stroke="' + edge + '" stroke-width="1.2"/>');
        var hx = i % 2 === 0 ? dx + dw - 9 : dx + 9;
        parts.push('<line x1="' + hx + '" y1="' + (y + h * 0.42) + '" x2="' + hx + '" y2="' + (y + h * 0.58) + '" stroke="' + (light ? '#7A7268' : '#F6F1E8') + '" stroke-width="2.5" stroke-linecap="round"/>');
      }
      parts.push('<line x1="' + x + '" y1="' + (y + h + 16) + '" x2="' + (x + w) + '" y2="' + (y + h + 16) + '" stroke="#8A8074" stroke-width="1"/>');
      parts.push('<line x1="' + x + '" y1="' + (y + h + 11) + '" x2="' + x + '" y2="' + (y + h + 21) + '" stroke="#8A8074"/>');
      parts.push('<line x1="' + (x + w) + '" y1="' + (y + h + 11) + '" x2="' + (x + w) + '" y2="' + (y + h + 21) + '" stroke="#8A8074"/>');
      parts.push('<text x="' + (x + w / 2) + '" y="' + (y + h + 34) + '" text-anchor="middle" font-family="monospace" font-size="11" fill="#6F6459">' + m(st.w) + ' м</text>');
      parts.push('<line x1="' + (x - 16) + '" y1="' + y + '" x2="' + (x - 16) + '" y2="' + (y + h) + '" stroke="#8A8074" stroke-width="1"/>');
      parts.push('<text x="' + (x - 22) + '" y="' + (y + h / 2) + '" text-anchor="middle" font-family="monospace" font-size="11" fill="#6F6459" transform="rotate(-90 ' + (x - 22) + ' ' + (y + h / 2) + ')">' + m(st.h) + ' м</text>');
      parts.push('<text x="' + x + '" y="' + (Y0 - 14) + '" font-family="monospace" font-size="9" letter-spacing="1.5" fill="#8A8074">' + (st.type === 'vstroen' ? 'ВСТРОЕННЫЙ' : 'КОРПУСНЫЙ') + ' · ' + n + ' ДВЕРИ · ' + NAMES[st.dec].toUpperCase() + '</text>');
      svg.innerHTML = '<defs><linearGradient id="grain" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>' + parts.join('');

      var area = st.w * st.h;
      var shelves = st.shelf ? 3 : 0;
      var rails = st.rail ? 1 : 0;
      var drawers = st.drawer ? 2 : 0;
      var panels = 2 + shelves + n + (st.top ? 1 : 0);
      var depth = st.type === 'vstroen' ? 0.6 : 0.58;
      var rows = [
        ['Тип', st.type === 'vstroen' ? 'встроенный' : 'корпусный'],
        ['Габарит', m(st.w) + ' × ' + m(st.h) + ' × ' + m(depth) + ' м'],
        ['Двери', n + ' шт., купе'],
        ['Полок', shelves + ' шт.'],
        ['Штанг', rails + ' шт.'],
        ['Ящиков', drawers + ' шт.'],
        ['Антресоль', st.top ? 'да' : 'нет'],
        ['Площадь фасадов', m(area) + ' м²'],
        ['Деталей в раскрое', panels + ' шт.'],
        ['Декор', NAMES[st.dec]]
      ];
      out.spec.innerHTML = rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('');
      out.axH.textContent = m(st.h) + ' м';
      out.axW.textContent = m(st.w) + ' м';
      out.vW.textContent = m(st.w);
      out.vH.textContent = m(st.h);
      var dsw = document.getElementById('decors');
      if (dsw) [].forEach.call(dsw.children, function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-dec') === st.dec ? 'true' : 'false'); });

      out.note.textContent = 'Ориентир по прайсу для типового шкафа: от 1 250 р. Итог зависит от размера, декора, фурнитуры и наполнения, его считаем после замера.';
      out.go.href = WA + '?text=' + encodeURIComponent(
        'Заявка с сайта ТиК-мебель: шкаф.\nТип: ' + (st.type === 'vstroen' ? 'встроенный' : 'корпусный') +
        '\nШирина: ' + m(st.w) + ' м\nВысота: ' + m(st.h) + ' м\nДвери: ' + n +
        '\nНаполнение: ' + [st.rail ? 'штанга' : '', st.shelf ? 'полки' : '', st.drawer ? 'ящики' : '', st.top ? 'антресоль' : ''].filter(Boolean).join(', ') +
        '\nДекор: ' + NAMES[st.dec] + '\n\nПришлю фото стены и точные размеры.');
    }
    single('cType', 'type'); single('cDoors', 'doors', 'int'); single('cDec', 'dec');
    toggles('cFill');
    var cW = document.getElementById('cW'), cH = document.getElementById('cH');
    if (cW) cW.addEventListener('input', function () { st.w = parseFloat(cW.value); draw(); });
    if (cH) cH.addEventListener('input', function () { st.h = parseFloat(cH.value); draw(); });
    var decs = document.getElementById('decors');
    if (decs) {
      decs.addEventListener('click', function (e) {
        var b = e.target.closest('.dsw'); if (!b) return;
        var k = b.getAttribute('data-dec');
        if (DEC[k]) { st.dec = k; draw(); }
        [].forEach.call(decs.children, function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
        var box = document.getElementById('cDec');
        if (box) [].forEach.call(box.children, function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-v') === k ? 'true' : 'false'); });
      });
    }
    draw();
  }

  function initLead() {
    var f = document.getElementById('lead');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('lName'), t = document.getElementById('lTel');
      var what = document.getElementById('lWhat'), room = document.getElementById('lRoom'), task = document.getElementById('lTask');
      var bad = false;
      [n, t].forEach(function (el) {
        if (!el.value.trim()) { el.style.borderColor = '#A26A3C'; bad = true; } else { el.style.borderColor = ''; }
      });
      if (bad) return;
      var msg = 'Заявка с сайта ТиК-мебель.\nИмя: ' + n.value.trim() + '\nТелефон: ' + t.value.trim() +
        (what && what.value.trim() ? '\nИзделие: ' + what.value.trim() : '') +
        (room && room.value.trim() ? '\nПомещение: ' + room.value.trim() : '') +
        (task && task.value.trim() ? '\nПожелания: ' + task.value.trim() : '') +
        '\n\nФото прикреплю следом.';
      window.open(WA + '?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDrawer(); initCfg(); initLead();
    var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
  });
})();
