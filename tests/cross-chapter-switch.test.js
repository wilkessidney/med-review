const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class Element {
  constructor() {
    this.children = [];
    this.classList = { add() {}, remove() {}, toggle() {} };
    this.files = [];
  }

  appendChild(child) { this.children.push(child); return child; }
  querySelectorAll() { return []; }
}

function startApp() {
  const elements = new Map();
  let onReady;
  const document = {
    addEventListener(event, listener) { if (event === "DOMContentLoaded") onReady = listener; },
    createElement() { return new Element(); },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new Element());
      return elements.get(id);
    },
    querySelectorAll() { return []; }
  };
  const sandbox = {
    window: { innerWidth: 1440 },
    document,
    localStorage: { getItem() { return null; }, setItem() {} },
    Date,
    JSON,
    String,
    Object,
    Array,
    Math,
    setTimeout,
    clearTimeout,
    console
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const file of ["data/biochem.js", "data/physiol.js", "data/patho.js", "data/internal.js", "data/surgery.js", "assets/app.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), sandbox, { filename: file });
  }
  onReady();
  return elements;
}

test("点击其他章节的知识点后，应渲染该知识点而非原章节空态", () => {
  const elements = startApp();
  const tree = elements.get("tree");
  const secondChapter = tree.children[1];
  const tmPoint = secondChapter.children.find(child => String(child.innerHTML).includes("核酸的变性与Tm"));

  assert.ok(tmPoint, "应能在第二章找到 Tm 知识点");
  tmPoint.onclick();

  assert.match(elements.get("content").innerHTML, /核酸的变性与Tm/);

  const firstChapter = tree.children[0];
  const proteinPoint = firstChapter.children.find(child => String(child.innerHTML).includes("蛋白质二级结构"));
  assert.ok(proteinPoint, "应能在第一章找到蛋白质二级结构知识点");
  proteinPoint.onclick();

  assert.match(elements.get("content").innerHTML, /蛋白质二级结构/);
});
