const TEXT = {
  hy: {
    lead: "Բաց տվյալների նախագծեր, որոնք Հայաստանի մասին տեղեկատվությունը դարձնում են թափանցիկ և վերօգտագործելի։",
    projects: "Նախագծեր",
    open: "Բացել",
    source: "Կոդ և տվյալներ",
    error: "Չհաջողվեց բեռնել նախագծերի ցանկը։",
    footer: "Կոդը՝ MIT, տվյալները՝ CC BY 4.0, եթե այլ բան նշված չէ նախագծում։",
    other: "EN",
  },
  en: {
    lead: "Open data projects that make information about Armenia transparent and reusable.",
    projects: "Projects",
    open: "Open",
    source: "Code and data",
    error: "Could not load the project list.",
    footer: "Code under MIT, data under CC BY 4.0, unless a project says otherwise.",
    other: "ՀԱՅ",
  },
};

/** Language from ?lang=, then the saved choice, then Armenian. */
function initialLang() {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "hy") return q;
  try { return localStorage.getItem("lang") === "en" ? "en" : "hy"; } catch { return "hy"; }
}

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function card(p, lang, t) {
  return el("li", { className: "card" },
    el("h3", {}, el("a", { href: p.url }, p.title[lang])),
    el("p", {}, p.description[lang]),
    el("p", { className: "tags" }, ...(p.tags?.[lang] || []).map((x) => el("span", {}, x))),
    el("p", { className: "links" },
      el("a", { href: p.url, className: "primary" }, `${t.open} →`),
      el("a", { href: p.repo }, t.source)));
}

function render(projects, lang) {
  const t = TEXT[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-t]").forEach((n) => { n.textContent = t[n.dataset.t]; });
  document.getElementById("lang").textContent = t.other;
  document.getElementById("projects").replaceChildren(...projects.map((p) => card(p, lang, t)));
}

async function main() {
  let lang = initialLang();
  let projects = [];
  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    projects = await res.json();
  } catch (err) {
    console.error(err);
    document.getElementById("error").hidden = false;
  }
  render(projects, lang);
  document.getElementById("lang").addEventListener("click", () => {
    lang = lang === "hy" ? "en" : "hy";
    try { localStorage.setItem("lang", lang); } catch { /* private mode */ }
    render(projects, lang);
  });
}

main();
