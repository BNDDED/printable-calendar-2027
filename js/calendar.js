/**
 * Printable Calendar 2027 — client-side grid rendering.
 * Holidays from data/holidays-2027.js (OPM observed dates).
 */
(function () {
  "use strict";

  var YEAR = 2027;
  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var MONTH_FILES = [
    "january.html", "february.html", "march.html", "april.html",
    "may.html", "june.html", "july.html", "august.html",
    "september.html", "october.html", "november.html", "december.html"
  ];
  var DOW_SUN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DOW_MON = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  var STORAGE_WEEK = "pc2027-weekStart";
  var STORAGE_HOLIDAYS = "pc2027-showHolidays";

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  /** JS getDay(): 0=Sun … 6=Sat */
  function firstWeekday(year, monthIndex) {
    return new Date(year, monthIndex, 1).getDay();
  }

  function holidayMap() {
    var map = {};
    var list = window.HOLIDAYS_2027 || [];
    for (var i = 0; i < list.length; i++) {
      var h = list[i];
      var key = h.month + "-" + h.day;
      map[key] = h;
    }
    return map;
  }

  function getWeekStart() {
    try {
      var v = localStorage.getItem(STORAGE_WEEK);
      if (v === "mon" || v === "sun") return v;
    } catch (e) { /* ignore */ }
    return "sun";
  }

  function setWeekStart(v) {
    try { localStorage.setItem(STORAGE_WEEK, v); } catch (e) { /* ignore */ }
  }

  function getShowHolidays() {
    try {
      var v = localStorage.getItem(STORAGE_HOLIDAYS);
      if (v === "0") return false;
      if (v === "1") return true;
    } catch (e) { /* ignore */ }
    return true;
  }

  function setShowHolidays(on) {
    try { localStorage.setItem(STORAGE_HOLIDAYS, on ? "1" : "0"); } catch (e) { /* ignore */ }
  }

  function applyHolidayVisibility(show) {
    document.body.classList.toggle("hide-holidays", !show);
  }

  /**
   * Build calendar cells for one month.
   * weekStart: "sun" | "mon"
   * compact: boolean — mini year overview style
   */
  function buildMonthGrid(monthIndex, weekStart, compact) {
    var holidays = holidayMap();
    var dim = daysInMonth(YEAR, monthIndex);
    var first = firstWeekday(YEAR, monthIndex); // 0=Sun
    var offset = weekStart === "mon" ? (first + 6) % 7 : first;
    var headers = weekStart === "mon" ? DOW_MON : DOW_SUN;

    var table = document.createElement("table");
    table.className = "calendar" + (compact ? " compact" : "");
    table.setAttribute("role", "grid");
    table.setAttribute("aria-label", MONTH_NAMES[monthIndex] + " " + YEAR);

    var thead = document.createElement("thead");
    var hr = document.createElement("tr");
    for (var h = 0; h < 7; h++) {
      var th = document.createElement("th");
      th.scope = "col";
      th.textContent = headers[h];
      hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    var day = 1;
    var totalCells = Math.ceil((offset + dim) / 7) * 7;

    for (var i = 0; i < totalCells; i++) {
      if (i % 7 === 0) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
      }
      var td = document.createElement("td");
      var col = i % 7;

      if (i < offset || day > dim) {
        td.className = "empty";
        td.setAttribute("aria-hidden", "true");
      } else {
        var wd = weekStart === "mon" ? (col === 6 ? 0 : col + 1) : col;
        if (wd === 0 || wd === 6) td.classList.add("weekend");

        var num = document.createElement("span");
        num.className = "day-num";
        num.textContent = String(day);
        td.appendChild(num);

        var key = (monthIndex + 1) + "-" + day;
        var hol = holidays[key];
        if (hol) {
          td.classList.add("holiday-day");
          var label = document.createElement("span");
          label.className = "holiday-label";
          var text = hol.name;
          if (hol.observed) text += " (observed)";
          label.textContent = text;
          label.title = hol.note || text;
          td.appendChild(label);
          td.title = text + (hol.note ? " — " + hol.note : "");
        }
        day++;
      }
      tbody.lastChild.appendChild(td);
    }
    table.appendChild(tbody);
    return table;
  }

  function renderYearOverview(container) {
    if (!container) return;
    container.textContent = "";
    var weekStart = getWeekStart();

    for (var m = 0; m < 12; m++) {
      var card = document.createElement("article");
      card.className = "mini-month";

      var h3 = document.createElement("h3");
      var link = document.createElement("a");
      link.href = MONTH_FILES[m];
      link.textContent = MONTH_NAMES[m] + " " + YEAR;
      h3.appendChild(link);
      card.appendChild(h3);

      var wrap = document.createElement("div");
      wrap.className = "cal-wrap";
      wrap.appendChild(buildMonthGrid(m, weekStart, true));
      card.appendChild(wrap);

      container.appendChild(card);
    }
  }

  function renderMonthPage(container, monthIndex) {
    if (!container) return;
    container.textContent = "";
    var weekStart = getWeekStart();
    var wrap = document.createElement("div");
    wrap.className = "cal-wrap";
    wrap.appendChild(buildMonthGrid(monthIndex, weekStart, false));
    container.appendChild(wrap);
  }

  function wireToolbar() {
    var weekSelect = document.getElementById("week-start");
    var holidayToggle = document.getElementById("show-holidays");
    var printBtn = document.getElementById("print-btn");

    if (weekSelect) {
      weekSelect.value = getWeekStart();
      weekSelect.addEventListener("change", function () {
        setWeekStart(weekSelect.value);
        refresh();
      });
    }

    if (holidayToggle) {
      holidayToggle.checked = getShowHolidays();
      applyHolidayVisibility(holidayToggle.checked);
      holidayToggle.addEventListener("change", function () {
        setShowHolidays(holidayToggle.checked);
        applyHolidayVisibility(holidayToggle.checked);
      });
    } else {
      applyHolidayVisibility(getShowHolidays());
    }

    if (printBtn) {
      printBtn.addEventListener("click", function () {
        window.print();
      });
    }
  }

  function refresh() {
    var yearEl = document.getElementById("year-overview");
    if (yearEl) renderYearOverview(yearEl);

    var monthEl = document.getElementById("month-calendar");
    if (monthEl) {
      var mi = parseInt(monthEl.getAttribute("data-month"), 10);
      if (!isNaN(mi) && mi >= 0 && mi <= 11) {
        renderMonthPage(monthEl, mi);
      }
    }
  }

  function init() {
    wireToolbar();
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.PC2027 = {
    refresh: refresh,
    MONTH_NAMES: MONTH_NAMES,
    MONTH_FILES: MONTH_FILES
  };
})();
