/* ==========================================================================
   APEX ATHLETIC — CORE APPLICATION ENGINE
   Design System: Deep Navy (#131b2e), Electric Orange (#fd933d), Crisp White (#ffffff), Slate Gray
   Typography: Oswald (Headlines) & Inter (Body/Labels) — Strict Zero Emojis
   ========================================================================== */

// --- 1. PRODUCT CATALOG DATA REPOSITORY ---
const PRODUCTS = [
  {
    id: "cable-tower",
    title: "Apex CT-1X2 Industrial Cable Tower",
    category: "hardware",
    badge: "Flagship Anchor",
    badgeType: "gold",
    priceB2C: 2850.00,
    priceB2B: 2280.00,
    bnplMonthly: 89.00,
    image: "assets/cable_tower.jpg",
    specs: ["3x3\" 11-Ga Steel", "Dual 250lb Stacks", "10x10' Clearance", "ASTM F2276"],
    shortDesc: "Commercial dual-stack cable tower built with 11-gauge USA structural steel. 2:1 pulley mechanical ratio."
  },
  {
    id: "compression-suit",
    title: "Apex AeroVent Pro Compression Suit",
    category: "apparel",
    badge: "20-25 mmHg",
    badgeType: "gold",
    priceB2C: 145.00,
    priceB2B: 116.00,
    bnplMonthly: 12.00,
    image: "assets/compression.jpg",
    specs: ["82% Polyamide 6.6", "Graduated Venous Map", "MVTR Vented", "OEKO-TEX 100"],
    shortDesc: "Millimetric graduated pressure mapped to enhance venous return, dampen muscle oscillation, and reduce DOMS."
  },
  {
    id: "carbon-shoe",
    title: "Apex Strata Pro Carbon Racer",
    category: "footwear",
    badge: "World Athletics Legal",
    badgeType: "ice",
    priceB2C: 265.00,
    priceB2B: 212.00,
    bnplMonthly: 22.00,
    image: "assets/carbon_shoe.jpg",
    specs: ["Dual-Fork Carbon", "8mm Heel Drop", "182g Dry Weight", "PEBA Supercritical"],
    shortDesc: "Full-length carbon composite FlyPlate embedded in dual-density PEBA supercritical microfoam."
  },
  {
    id: "barbell-cerakote",
    title: "Apex Cerakote Olympic Barbell 20kg",
    category: "hardware",
    badge: "190K PSI",
    badgeType: "dark",
    priceB2C: 385.00,
    priceB2B: 295.00,
    bnplMonthly: 32.00,
    image: "assets/hero.jpg",
    specs: ["190,000 PSI Steel", "Cerakote Finish", "Dual Knurl Marks", "Bronze Bushings"],
    shortDesc: "Precision-machined Olympic bar with corrosion-proof Cerakote coating and calibrated whip response."
  },
  {
    id: "urethane-bumpers",
    title: "Apex Mil-Spec Urethane Bumper Set (320 lbs)",
    category: "hardware",
    badge: "Shore A 90",
    badgeType: "dark",
    priceB2C: 495.00,
    priceB2B: 395.00,
    bnplMonthly: 41.00,
    image: "assets/cable_tower.jpg",
    specs: ["Solid Steel Hub", "Precision Durometer", "Zero Odor Urethane", "Dead-Blow Bounce"],
    shortDesc: "Commercial grade urethane bumper plates engineered for extreme high-impact drop tolerance."
  },
  {
    id: "cryo-boots",
    title: "Apex CryoFlow Pneumatic Compression Boots",
    category: "recovery",
    badge: "4-Chamber Active",
    badgeType: "ice",
    priceB2C: 680.00,
    priceB2B: 544.00,
    bnplMonthly: 56.00,
    image: "assets/compression.jpg",
    specs: ["Sequential Gradient", "120 mmHg Peak", "Lithium-Ion 4hr", "Wireless App Sync"],
    shortDesc: "High-pressure dynamic air compression boots that flush metabolic waste and accelerate athletic recovery."
  }
];

// Bundle Items Data
const BUNDLE_ITEMS = [
  { id: "b-rig", title: "Apex CT-1X2 Cable Tower", price: 2850.00, image: "assets/cable_tower.jpg", checked: true },
  { id: "b-bar", title: "Olympic Cerakote Barbell 20kg", price: 385.00, image: "assets/hero.jpg", checked: true },
  { id: "b-plates", title: "320lb Urethane Bumper Set", price: 495.00, image: "assets/cable_tower.jpg", checked: true },
  { id: "b-bench", title: "Commercial Incline/Decline Bench", price: 340.00, image: "assets/cable_tower.jpg", checked: false },
  { id: "b-suit", title: "AeroVent Pro Compression Suit", price: 145.00, image: "assets/compression.jpg", checked: true },
  { id: "b-shoe", title: "Strata Pro Carbon Racer", price: 265.00, image: "assets/carbon_shoe.jpg", checked: false }
];

// --- 2. GLOBAL APPLICATION STATE ---
let appState = {
  mode: "b2c",
  cart: [],
  selectedStore: "austin",
  stravaSynced: false,
  thermalActive: false,
  hardwareAttachments: { spotter: true, dip: false },
  selectedApparelSize: "L",
  selectedShoeSize: "10.0",
  inventoryHoldSeconds: 599
};

// --- 3. INITIALIZATION ON DOM READY ---
document.addEventListener("DOMContentLoaded", () => {
  renderCatalogGrid("all");
  renderBundleBuilder();
  startInventoryHoldTimer();
  initRoomPlannerCanvas();
  initThermalHeatmapCanvas();
  calculateReGenQuote();
  calculateB2BQuote(25);
  updateCartBadge();
});

// --- 4. B2B & B2C COMMERCE MODE SWITCHER ---
function switchCommerceMode(newMode) {
  appState.mode = newMode;
  const b2cBtn = document.getElementById("modeB2C");
  const b2bBtn = document.getElementById("modeB2B");
  const brandSub = document.getElementById("brandSubTag");
  
  if (newMode === "b2b") {
    document.body.classList.add("b2b-active");
    b2bBtn.classList.add("active");
    b2cBtn.classList.remove("active");
    brandSub.textContent = "INSTITUTIONAL COMMERCE // B2B WHOLESALE";
    showNotification("[B2B MODE] Institutional Wholesale Activated. Volume Tier Discounts Applied.");
  } else {
    document.body.classList.remove("b2b-active");
    b2cBtn.classList.add("active");
    b2bBtn.classList.remove("active");
    brandSub.textContent = "HUMAN OUTPUT SYSTEMS // B2C";
    showNotification("[RETAIL MODE] Retail Athlete Mode Activated.");
  }

  renderCatalogGrid(getActiveCategoryFilter());
  updateHeroAnchorPrice();
  renderCartItems();
}

function updateHeroAnchorPrice() {
  const priceDisplay = document.getElementById("heroAnchorPriceDisplay");
  const bnplDisplay = document.getElementById("heroAnchorBnplDisplay");
  if (appState.mode === "b2b") {
    priceDisplay.textContent = "$2,280.00";
    bnplDisplay.textContent = "$190.00/mo [Net-30 Terms]";
  } else {
    priceDisplay.textContent = "$2,850.00";
    bnplDisplay.textContent = "$89/mo with Affirm (0% APR)";
  }
}

function getActiveCategoryFilter() {
  const activeTab = document.querySelector("#filterTabsContainer .filter-tab.active");
  if (!activeTab) return "all";
  const text = activeTab.textContent.toLowerCase();
  if (text.includes("heavy hardware")) return "hardware";
  if (text.includes("compression")) return "apparel";
  if (text.includes("carbon")) return "footwear";
  if (text.includes("recovery")) return "recovery";
  return "all";
}

// --- 5. CATALOG MATRIX RENDERING & FILTERING ---
function filterCatalog(category, buttonEl) {
  if (buttonEl) {
    document.querySelectorAll("#filterTabsContainer .filter-tab").forEach(tab => tab.classList.remove("active"));
    buttonEl.classList.add("active");
  }
  renderCatalogGrid(category);
}

function renderCatalogGrid(category) {
  const container = document.getElementById("productGridContainer");
  if (!container) return;

  const filtered = category === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category || (category === "neutral" && p.category === "footwear"));

  container.innerHTML = filtered.map(p => {
    const isB2B = appState.mode === "b2b";
    const currentPrice = isB2B ? p.priceB2B : p.priceB2C;
    const priceStr = `$${currentPrice.toFixed(2)}`;
    
    return `
      <div class="product-card" id="card-${p.id}">
        <div class="product-card-thumb" onclick="openPdpModal('${p.id}')">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <div class="product-card-badges">
            <span class="badge-pill ${p.badgeType}">${p.badge}</span>
            ${isB2B ? '<span class="badge-pill dark">B2B -20%</span>' : ''}
          </div>
          <div class="quick-action-overlay">
            <button class="btn-card-quick" onclick="event.stopPropagation(); openPdpModal('${p.id}')">
              Inspect Blueprint
            </button>
            <button class="btn-card-quick" onclick="event.stopPropagation(); quickAddToCart('${p.id}')">
              + Quick Add
            </button>
          </div>
        </div>
        <div class="product-card-body">
          <span class="product-category-tag">${p.category.toUpperCase()} SPECIFICATION</span>
          <h3 class="product-card-title">${p.title}</h3>
          <div class="product-spec-chips">
            ${p.specs.map(s => `<span class="spec-chip">${s}</span>`).join("")}
          </div>
          <div class="product-card-footer">
            <div class="product-card-price-wrap">
              <span class="card-price-main">${priceStr}</span>
              ${isB2B ? '<span class="b2b-tier-note">Tier 2 Commercial Quote</span>' : `<span style="font-size:0.7rem; color:var(--slate-muted);">$${p.bnplMonthly}/mo with BNPL</span>`}
            </div>
            <button class="btn-primary" style="padding:7px 12px; font-size:0.75rem;" onclick="openPdpModal('${p.id}')">
              Configure
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function handleInstantSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    renderCatalogGrid("all");
    return;
  }
  const filtered = PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.specs.some(s => s.toLowerCase().includes(q)) ||
    p.shortDesc.toLowerCase().includes(q)
  );

  const container = document.getElementById("productGridContainer");
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; color:var(--slate-muted);">
        <h3>No matching technical specifications found for "${query}"</h3>
        <p style="margin-top:6px; font-size:0.85rem;">Try searching for "11-gauge", "compression", "carbon", "PEBA", or "ASTM".</p>
      </div>
    `;
  } else {
    container.innerHTML = filtered.map(p => {
      const isB2B = appState.mode === "b2b";
      const currentPrice = isB2B ? p.priceB2B : p.priceB2C;
      return `
        <div class="product-card" onclick="openPdpModal('${p.id}')">
          <div class="product-card-thumb">
            <img src="${p.image}" alt="${p.title}">
            <div class="product-card-badges">
              <span class="badge-pill ${p.badgeType}">${p.badge}</span>
            </div>
          </div>
          <div class="product-card-body">
            <span class="product-category-tag">${p.category.toUpperCase()}</span>
            <h3 class="product-card-title">${p.title}</h3>
            <div class="product-spec-chips">
              ${p.specs.map(s => `<span class="spec-chip">${s}</span>`).join("")}
            </div>
            <div class="product-card-footer">
              <span class="card-price-main">$${currentPrice.toFixed(2)}</span>
              <button class="btn-primary" style="padding:7px 12px; font-size:0.75rem;">Inspect</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}

// --- 6. DYNAMIC GAMIFIED BUNDLE BUILDER ---
function renderBundleBuilder() {
  const container = document.getElementById("bundleItemsGrid");
  if (!container) return;

  container.innerHTML = BUNDLE_ITEMS.map((item, index) => `
    <div class="builder-item-card ${item.checked ? 'selected' : ''}" onclick="toggleBundleItem(${index})">
      <input type="checkbox" ${item.checked ? 'checked' : ''} onclick="event.stopPropagation(); toggleBundleItem(${index})">
      <img src="${item.image}" alt="${item.title}" class="builder-item-img">
      <div class="builder-item-title">${item.title}</div>
      <div class="builder-item-price">$${item.price.toFixed(2)}</div>
    </div>
  `).join("");

  updateBundleCalculations();
}

function toggleBundleItem(index) {
  BUNDLE_ITEMS[index].checked = !BUNDLE_ITEMS[index].checked;
  renderBundleBuilder();
}

function updateBundleCalculations() {
  let subtotal = 0;
  BUNDLE_ITEMS.forEach(i => {
    if (i.checked) subtotal += i.price;
  });

  let discountPct = 0;
  let giftText = "Select gear to unlock rewards";
  let progressPct = 0;

  if (subtotal >= 1000) {
    discountPct = 25;
    progressPct = 100;
    giftText = "UNLOCKED: Pro Shaker + Straps + Duffel + White Glove Freight";
  } else if (subtotal >= 600) {
    discountPct = 20;
    progressPct = 75;
    giftText = "UNLOCKED: Pro Shaker + Straps + Tactical Duffel";
  } else if (subtotal >= 350) {
    discountPct = 15;
    progressPct = 50;
    giftText = "UNLOCKED: Pro Shaker + Velocity Straps";
  } else if (subtotal >= 150) {
    discountPct = 10;
    progressPct = 25;
    giftText = "UNLOCKED: Complimentary Pro Shaker Bottle";
  } else {
    progressPct = Math.min(20, (subtotal / 150) * 20);
  }

  const fill = document.getElementById("bundleProgressBarFill");
  if (fill) fill.style.width = `${progressPct}%`;

  document.getElementById("tierMarker1")?.classList.toggle("achieved", subtotal >= 150);
  document.getElementById("tierMarker2")?.classList.toggle("achieved", subtotal >= 350);
  document.getElementById("tierMarker3")?.classList.toggle("achieved", subtotal >= 600);
  document.getElementById("tierMarker4")?.classList.toggle("achieved", subtotal >= 1000);

  const discountAmount = subtotal * (discountPct / 100);
  const finalTotal = subtotal - discountAmount;

  document.getElementById("bundleConfiguredTotal").textContent = `$${finalTotal.toFixed(2)}`;
  document.getElementById("bundleDiscountSummary").textContent = `${discountPct}% Discount ($${discountAmount.toFixed(2)} Saved)`;
  document.getElementById("bundleGiftsSummary").textContent = giftText;
}

function addBundleToCart() {
  const selected = BUNDLE_ITEMS.filter(i => i.checked);
  if (selected.length === 0) {
    showNotification("[ALERT] Please select at least one item in the bundle.");
    return;
  }
  selected.forEach(item => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      variant: "Custom Bundle Package"
    });
  });
  showNotification(`[CONFIRMED] Bundle with ${selected.length} items added with tiered savings.`);
  toggleCartDrawer(true);
}

// --- 7. B2B BULK CALCULATOR & PO GENERATOR ---
function calculateB2BQuote(qty) {
  const quantity = parseInt(qty, 10);
  document.getElementById("b2bQtyDisplay").textContent = `${quantity} Units`;

  const basePrice = 145.00;
  let unitPrice = basePrice;
  let discountPct = 0;

  if (quantity >= 50) {
    discountPct = 35;
    unitPrice = basePrice * 0.65;
  } else if (quantity >= 10) {
    discountPct = 20;
    unitPrice = basePrice * 0.80;
  }

  const totalPrice = unitPrice * quantity;
  const savings = (basePrice * quantity) - totalPrice;

  document.getElementById("b2bUnitPriceDisplay").textContent = `$${unitPrice.toFixed(2)} / ea`;
  document.getElementById("b2bSavingsDisplay").textContent = `-$${savings.toFixed(2)} [${discountPct}% OFF]`;
  document.getElementById("b2bTotalPriceDisplay").textContent = `$${totalPrice.toFixed(2)}`;
}

function addB2BOrderToCart() {
  const qty = parseInt(document.getElementById("b2bQuantitySlider").value, 10);
  const org = document.getElementById("b2bOrgType").selectedOptions[0].text;
  let unitPrice = 145.00;
  if (qty >= 50) unitPrice = 145.00 * 0.65;
  else if (qty >= 10) unitPrice = 145.00 * 0.80;

  addToCart({
    id: `b2b-aerovent-${Date.now()}`,
    title: `AeroVent Pro Institutional Outfitting (${qty}x)`,
    price: unitPrice * qty,
    image: "assets/compression.jpg",
    variant: `B2B Institutional PO (${org})`
  });

  showNotification(`[B2B PO CREATED] Institutional Purchase Order for ${qty} Units Added.`);
  toggleCartDrawer(true);
}

function generateMockQuotePDF() {
  showNotification("[QUOTE GENERATED] Official PDF RFQ #APX-B2B-2026 Issued with Net-30 Terms.");
}

function openTaxExemptUploadModal() {
  showNotification("[PORTAL] State Resale Certificate & Tax-Exempt Verification Portal Initialized.");
}

// --- 8. ATHLETIC LOYALTY & ACTIVITY SYNC ---
function simulateStravaSync() {
  const btn = document.getElementById("stravaConnectBtn");
  btn.textContent = "Connecting to Strava / HealthKit API...";
  btn.disabled = true;

  setTimeout(() => {
    appState.stravaSynced = true;
    btn.textContent = "Telemetry Synchronized [Verified]";
    btn.style.background = "var(--secondary-container)";
    btn.style.color = "#000000";
    btn.disabled = false;

    document.getElementById("stravaMileage").textContent = "84.4 KM";
    document.getElementById("stravaDeadlift").textContent = "525 LBS";
    document.getElementById("stravaTier").textContent = "TIER 4 [LEGEND]";

    const badge = document.getElementById("dropStatusBadge");
    badge.textContent = "[UNLOCKED: MEMBER ACCESS GRANTED]";
    badge.className = "badge-pill gold";

    showNotification("[VERIFIED] Athlete telemetry verified. Exclusive Sub-3 Shadow Carbon Drop Unlocked.");
  }, 1200);
}

function claimStravaDrop() {
  if (!appState.stravaSynced) {
    showNotification("[ACCESS RESTRICTED] Synchronize verified marathon or strength metrics first.");
    simulateStravaSync();
    return;
  }
  openPdpModal("carbon-shoe");
}

// --- 9. CIRCULAR ECONOMY (APEX RE-GEN) CALCULATOR ---
function calculateReGenQuote() {
  const itemVal = parseFloat(document.getElementById("regenItemSelect").value);
  const conditionMult = parseFloat(document.getElementById("regenConditionSelect").value);
  const quote = itemVal * conditionMult;
  document.getElementById("regenValuationDisplay").textContent = `$${quote.toFixed(2)}`;
}

function claimReGenCredit() {
  const quote = document.getElementById("regenValuationDisplay").textContent;
  showNotification(`[TRADE-IN APPROVED] ${quote} Digital Gift Card & Prepaid UPS Waybill Dispatched.`);
}

// --- 10. OMNICHANNEL BOPIS & OMS ROUTING ---
function selectStoreHub(storeId, el) {
  appState.selectedStore = storeId;
  document.querySelectorAll("#bopisStoreList .builder-item-card").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");

  const statusText = storeId === "austin" 
    ? "HUB: AUSTIN CENTRAL FLAGSHIP [4.2 MI • 47-MIN READY]"
    : "HUB: DALLAS REGIONAL CENTER [194 MI • NEXT-DAY DISPATCH]";

  document.getElementById("bopisStatusText").textContent = statusText;
  showNotification(`[DISTRIBUTION NODE] Hub updated: ${storeId.toUpperCase()} selected for local staging.`);
}

function switchOmsAlgorithm(type) {
  const box = document.getElementById("omsExplanationBox");
  const shipTab = document.getElementById("omsShipmentsTab");
  const distTab = document.getElementById("omsDistanceTab");

  if (type === "shipments") {
    shipTab.classList.add("active");
    distTab.classList.remove("active");
    box.innerHTML = `
      <strong style="color:var(--secondary);">Active Engine: Minimize Shipments Algorithm (Greedy)</strong>
      <p style="margin-top:4px; color:var(--on-surface-variant);">
        Consolidates 200lb hardware stacks and lightweight compression apparel from Austin Hub into a single dispatch. Eliminates $38.50 in split-package handling fees.
      </p>
    `;
  } else {
    distTab.classList.add("active");
    shipTab.classList.remove("active");
    box.innerHTML = `
      <strong style="color:var(--primary);">Active Engine: Minimize Distance Algorithm (Area-Cluster)</strong>
      <p style="margin-top:4px; color:var(--on-surface-variant);">
        Routes order line-items to the closest regional retail staging node within 15 miles. Slashes last-mile transit delivery times to under 4 hours.
      </p>
    `;
  }
}

// --- 11. MODAL CONTROLS & PDP LAUNCHERS ---
function openPdpModal(productId, subView) {
  closeAllModals();

  if (productId === "cable-tower" || productId === "barbell-cerakote" || productId === "urethane-bumpers") {
    const modal = document.getElementById("hardwareModal");
    modal.classList.add("active");
    updateHardwarePrice();
    setTimeout(initRoomPlannerCanvas, 100);
  } else if (productId === "compression-suit" || productId === "cryo-boots") {
    const modal = document.getElementById("apparelModal");
    modal.classList.add("active");
    const priceDisplay = document.getElementById("apparelModalPrice");
    const b2bNote = document.getElementById("apparelB2BNote");
    
    if (appState.mode === "b2b") {
      priceDisplay.textContent = "$116.00";
      b2bNote.style.display = "block";
    } else {
      priceDisplay.textContent = "$145.00";
      b2bNote.style.display = "none";
    }

    if (subView === "thermal-view") {
      toggleThermalHeatmap(true);
    }
  } else if (productId === "carbon-shoe") {
    const modal = document.getElementById("footwearModal");
    modal.classList.add("active");
  }
}

function openAiSizingModal() {
  closeAllModals();
  document.getElementById("aiSizingModal").classList.add("active");
  runAiSizingCalculation();
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
}

function toggleStrategyDrawer(open) {
  const drawer = document.getElementById("strategyDrawer");
  if (open) drawer.classList.add("open");
  else drawer.classList.remove("open");
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById("cartDrawer");
  if (open) {
    renderCartItems();
    drawer.classList.add("open");
  } else {
    drawer.classList.remove("open");
  }
}

// --- 12. HARDWARE PDP LOGIC & 10x10ft ROOM CLEARANCE CANVAS ---
function updateHardwarePrice() {
  let base = appState.mode === "b2b" ? 2280.00 : 2850.00;
  const spotter = document.getElementById("attachSpotter")?.checked;
  const dip = document.getElementById("attachDip")?.checked;

  if (spotter) base += 140.00;
  if (dip) base += 120.00;

  const display = document.getElementById("hardwareModalPrice");
  if (display) display.textContent = `$${base.toFixed(2)}`;
  initRoomPlannerCanvas();
}

function initRoomPlannerCanvas() {
  const canvas = document.getElementById("roomPlannerCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  canvas.width = canvas.parentElement.clientWidth || 380;
  canvas.height = canvas.parentElement.clientHeight || 260;

  const w = canvas.width;
  const h = canvas.height;

  // Background Deep Navy Grid
  ctx.fillStyle = "#0a0f1d";
  ctx.fillRect(0, 0, w, h);

  // Precision architectural grid
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;
  const gridSize = 20;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 10x10ft Safe Perimeter (Slate Outline)
  const roomW = w * 0.75;
  const roomH = h * 0.75;
  const roomX = (w - roomW) / 2;
  const roomY = (h - roomH) / 2;

  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(roomX, roomY, roomW, roomH);
  ctx.setLineDash([]);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.fillText("10' x 10' MANDATORY SAFETY BUFFER", roomX + 8, roomY + 14);

  // Equipment Footprint (Electric Orange)
  const eqW = roomW * 0.55;
  const eqH = roomH * 0.45;
  const eqX = (w - eqW) / 2;
  const eqY = (h - eqH) / 2;

  ctx.fillStyle = "rgba(253, 147, 61, 0.18)";
  ctx.fillRect(eqX, eqY, eqW, eqH);
  ctx.strokeStyle = "#fd933d";
  ctx.lineWidth = 2;
  ctx.strokeRect(eqX, eqY, eqW, eqH);

  // Upright corner posts
  ctx.fillStyle = "#fd933d";
  const postSize = 6;
  ctx.fillRect(eqX - postSize/2, eqY - postSize/2, postSize, postSize);
  ctx.fillRect(eqX + eqW - postSize/2, eqY - postSize/2, postSize, postSize);
  ctx.fillRect(eqX - postSize/2, eqY + eqH - postSize/2, postSize, postSize);
  ctx.fillRect(eqX + eqW - postSize/2, eqY + eqH - postSize/2, postSize, postSize);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px 'Oswald', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("APEX CT-1X2 [64\" x 48\"]", w / 2, h / 2);
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#fd933d";
  ctx.fillText("ASTM F2276 11-GAUGE STEEL", w / 2, (h / 2) + 14);
}

function addHardwareToCart() {
  const spotter = document.getElementById("attachSpotter")?.checked;
  const dip = document.getElementById("attachDip")?.checked;
  let price = appState.mode === "b2b" ? 2280.00 : 2850.00;
  let title = "Apex CT-1X2 Industrial Cable Tower";
  
  if (spotter) { price += 140; title += " + Spotter Arms"; }
  if (dip) { price += 120; title += " + Dip Horns"; }

  addToCart({
    id: `ct-1x2-${Date.now()}`,
    title: title,
    price: price,
    image: "assets/cable_tower.jpg",
    variant: "Industrial 11-Ga Package"
  });

  closeAllModals();
  showNotification("[CART] Industrial Cable Tower added to deployment cart.");
  toggleCartDrawer(true);
}

function openAssemblyGuide() {
  showNotification("[CAD SYSTEM] Interactive 3D Exploded Blueprint Assembly Guide Initialized.");
}

// --- 13. APPAREL PDP & THERMAL HEATMAP ENGINE ---
function initThermalHeatmapCanvas() {
  const canvas = document.getElementById("thermalCanvasLayer");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  canvas.width = canvas.parentElement.clientWidth || 380;
  canvas.height = canvas.parentElement.clientHeight || 400;

  const w = canvas.width;
  const h = canvas.height;

  const grad = ctx.createRadialGradient(w/2, h*0.4, 25, w/2, h*0.5, 170);
  grad.addColorStop(0, "rgba(234, 88, 12, 0.6)"); 
  grad.addColorStop(0.45, "rgba(253, 147, 61, 0.5)");
  grad.addColorStop(0.8, "rgba(56, 189, 248, 0.45)");
  grad.addColorStop(1, "rgba(253, 147, 61, 0.3)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function toggleThermalHeatmap(forceState) {
  appState.thermalActive = forceState !== undefined ? forceState : !appState.thermalActive;
  const layer = document.getElementById("thermalCanvasLayer");
  const legend = document.getElementById("thermalLegend");
  const btn = document.getElementById("toggleThermalBtn");

  if (appState.thermalActive) {
    layer.classList.add("active");
    legend.style.display = "flex";
    btn.style.background = "var(--secondary-container)";
    btn.style.color = "#000000";
    btn.textContent = "Thermal Layer Active [-4.2°C Aeration]";
  } else {
    layer.classList.remove("active");
    legend.style.display = "none";
    btn.style.background = "transparent";
    btn.style.color = "var(--primary)";
    btn.textContent = "Toggle Thermal MVTR Layer";
  }
}

function selectApparelSize(size, el) {
  appState.selectedApparelSize = size;
  document.querySelectorAll("#apparelSizeSelector .filter-tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
}

function addApparelToCart() {
  const price = appState.mode === "b2b" ? 116.00 : 145.00;
  addToCart({
    id: `aerovent-${Date.now()}`,
    title: "Apex AeroVent Pro Compression Suit",
    price: price,
    image: "assets/compression.jpg",
    variant: `Size ${appState.selectedApparelSize} (20-25 mmHg)`
  });
  closeAllModals();
  showNotification(`[CART] AeroVent Suit (Size ${appState.selectedApparelSize}) added to cart.`);
  toggleCartDrawer(true);
}

// --- 14. AI SIZING & FIT ADVISOR ENGINE ---
function runAiSizingCalculation() {
  const height = parseInt(document.getElementById("aiInputHeight").value, 10);
  const weight = parseInt(document.getElementById("aiInputWeight").value, 10);
  const build = document.getElementById("aiInputBuild").value;

  let recommended = "L";
  let confidence = 96.4;
  let returnRisk = 2.1;
  let waist = "33-35\"";
  let chest = "41-43\"";

  if (weight < 160) {
    recommended = "S";
    confidence = 94.8;
    returnRisk = 2.8;
    waist = "28-30\"";
    chest = "36-38\"";
  } else if (weight < 185) {
    recommended = "M";
    confidence = 97.1;
    returnRisk = 1.9;
    waist = "30-32\"";
    chest = "38-40\"";
  } else if (weight <= 210) {
    recommended = "L";
    confidence = 96.4;
    returnRisk = 2.1;
    waist = "33-35\"";
    chest = "41-43\"";
  } else if (weight <= 235) {
    recommended = "XL";
    confidence = 95.2;
    returnRisk = 2.5;
    waist = "36-38\"";
    chest = "44-46\"";
  } else {
    recommended = "2XL";
    confidence = 93.9;
    returnRisk = 3.2;
    waist = "39-42\"";
    chest = "47-50\"";
  }

  document.getElementById("aiRecommendedSizeDisplay").textContent = `SIZE ${recommended} RECOMMENDED`;
  document.getElementById("aiConfidenceScoreText").textContent = `${confidence}% Fit Confidence • <${returnRisk}% Predicted Return Risk`;
  appState.aiCalculatedSize = recommended;
}

function applyAiSizeToSelection() {
  const rec = appState.aiCalculatedSize || "L";
  appState.selectedApparelSize = rec;
  closeAllModals();
  openPdpModal("compression-suit");
  showNotification(`[FIT LOCKED] Size ${rec} applied with 96% AI confidence.`);
}

// --- 15. FOOTWEAR 360° SPIN & CART LOGIC ---
function rotateShoe360(degrees) {
  const img = document.getElementById("shoeSpinImg");
  const degDisplay = document.getElementById("shoeDegreeDisplay");
  degDisplay.textContent = `${degrees}° Angle`;

  const deg = parseInt(degrees, 10);
  const rotY = (deg % 360) - 180;
  img.style.transform = `perspective(800px) rotateY(${rotY * 0.4}deg) scale(${1 + Math.sin(deg * Math.PI / 180) * 0.05})`;
}

function selectShoeSize(size, el) {
  appState.selectedShoeSize = size;
  document.querySelectorAll("#shoeSizeSelector .filter-tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
}

function addShoeToCart() {
  const price = appState.mode === "b2b" ? 212.00 : 265.00;
  addToCart({
    id: `strata-${Date.now()}`,
    title: "Apex Strata Pro Carbon Racer",
    price: price,
    image: "assets/carbon_shoe.jpg",
    variant: `US Unisex Size ${appState.selectedShoeSize}`
  });
  closeAllModals();
  showNotification(`[CART] Strata Carbon Racer (Size ${appState.selectedShoeSize}) added.`);
  toggleCartDrawer(true);
}

// --- 16. CART & ACCELERATED CHECKOUT ENGINE ---
function quickAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const isB2B = appState.mode === "b2b";
  const price = isB2B ? product.priceB2B : product.priceB2C;

  addToCart({
    id: `${product.id}-${Date.now()}`,
    title: product.title,
    price: price,
    image: product.image,
    variant: isB2B ? "Commercial Tier 1" : "Standard Specification"
  });

  showNotification(`[CONFIRMED] ${product.title} added to deployment cart.`);
  toggleCartDrawer(true);
}

function addToCart(item) {
  appState.cart.push(item);
  updateCartBadge();
  renderCartItems();
}

function removeFromCart(index) {
  appState.cart.splice(index, 1);
  updateCartBadge();
  renderCartItems();
}

function updateCartBadge() {
  const badge = document.getElementById("cartCountBadge");
  const countText = document.getElementById("cartItemCountText");
  const count = appState.cart.length;

  if (badge) badge.textContent = count;
  if (countText) countText.textContent = `${count} Items Selected`;
}

function renderCartItems() {
  const container = document.getElementById("cartItemsContainer");
  const subtotalDisplay = document.getElementById("cartSubtotalDisplay");
  if (!container) return;

  if (appState.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:36px 20px; color:var(--slate-muted);">
        <p>No gear configured yet.</p>
        <button class="btn-secondary" style="border-color:var(--primary); color:var(--primary); margin-top:12px; font-size:0.75rem;" onclick="toggleCartDrawer(false)">Explore Matrix</button>
      </div>
    `;
    subtotalDisplay.textContent = "$0.00";
    return;
  }

  let subtotal = 0;
  container.innerHTML = appState.cart.map((item, index) => {
    subtotal += item.price;
    return `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 style="font-size:0.95rem; color:var(--primary); font-family:var(--font-headline);">${item.title}</h4>
          <span style="font-size:0.68rem; color:var(--slate-muted); font-family:var(--font-mono);">${item.variant}</span>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
            <span style="font-weight:700; font-family:var(--font-headline); color:var(--secondary); font-size:1.1rem;">$${item.price.toFixed(2)}</span>
            <button style="color:#ba1a1a; font-size:0.68rem; font-weight:700; text-transform:uppercase;" onclick="removeFromCart(${index})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
}

function executeAcceleratedCheckout(method) {
  if (appState.cart.length === 0) {
    showNotification("[ALERT] Deployment cart is currently empty.");
    return;
  }
  const total = document.getElementById("cartSubtotalDisplay").textContent;
  showNotification(`[ORDER PROCESSED] 1-Click ${method} Gateway (${total}). Order #APX-7740 Dispatched.`);
  appState.cart = [];
  updateCartBadge();
  toggleCartDrawer(false);
}

function startInventoryHoldTimer() {
  const display = document.getElementById("holdTimerDisplay");
  setInterval(() => {
    if (appState.inventoryHoldSeconds > 0) {
      appState.inventoryHoldSeconds--;
      const mins = Math.floor(appState.inventoryHoldSeconds / 60);
      const secs = appState.inventoryHoldSeconds % 60;
      if (display) {
        display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
  }, 1000);
}

// --- 17. NOTIFICATION TOAST (HIGH CONTRAST DEEP NAVY + ELECTRIC ORANGE) ---
function showNotification(msg) {
  let toast = document.getElementById("apexToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "apexToast";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--primary);
      color: #ffffff;
      border: 1px solid var(--secondary-container);
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 700;
      font-family: var(--font-mono);
      box-shadow: 0 12px 36px rgba(19, 27, 46, 0.4);
      z-index: 9999;
      transform: translateY(16px);
      opacity: 0;
      transition: all 220ms ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = "translateY(0)";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.transform = "translateY(16px)";
    toast.style.opacity = "0";
  }, 3200);
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
