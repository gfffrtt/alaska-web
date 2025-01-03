const R = (e, t) => e === t, O = {
  equals: R
};
let V = I;
const w = 1, A = 2, L = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var h = null;
let $ = null, H = null, u = null, a = null, g = null, x = 0;
function M(e, t) {
  const s = u, n = h, l = e.length === 0, i = t === void 0 ? n : t, r = l ? L : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, o = l ? e : () => e(() => N(() => y(r)));
  h = r, u = null;
  try {
    return S(o, !0);
  } finally {
    u = s, h = n;
  }
}
function Q(e, t) {
  t = t ? Object.assign({}, O, t) : O;
  const s = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, n = (l) => (typeof l == "function" && (l = l(s.value)), P(s, l));
  return [W.bind(s), n];
}
function T(e, t, s) {
  const n = J(e, t, !1, w);
  _(n);
}
function N(e) {
  if (u === null) return e();
  const t = u;
  u = null;
  try {
    return e();
  } finally {
    u = t;
  }
}
function W() {
  if (this.sources && this.state)
    if (this.state === w) _(this);
    else {
      const e = a;
      a = null, S(() => C(this), !1), a = e;
    }
  if (u) {
    const e = this.observers ? this.observers.length : 0;
    u.sources ? (u.sources.push(this), u.sourceSlots.push(e)) : (u.sources = [this], u.sourceSlots = [e]), this.observers ? (this.observers.push(u), this.observerSlots.push(u.sources.length - 1)) : (this.observers = [u], this.observerSlots = [u.sources.length - 1]);
  }
  return this.value;
}
function P(e, t, s) {
  let n = e.value;
  return (!e.comparator || !e.comparator(n, t)) && (e.value = t, e.observers && e.observers.length && S(() => {
    for (let l = 0; l < e.observers.length; l += 1) {
      const i = e.observers[l], r = $ && $.running;
      r && $.disposed.has(i), (r ? !i.tState : !i.state) && (i.pure ? a.push(i) : g.push(i), i.observers && j(i)), r || (i.state = w);
    }
    if (a.length > 1e6)
      throw a = [], new Error();
  }, !1)), t;
}
function _(e) {
  if (!e.fn) return;
  y(e);
  const t = x;
  X(
    e,
    e.value,
    t
  );
}
function X(e, t, s) {
  let n;
  const l = h, i = u;
  u = h = e;
  try {
    n = e.fn(t);
  } catch (r) {
    return e.pure && (e.state = w, e.owned && e.owned.forEach(y), e.owned = null), e.updatedAt = s + 1, q(r);
  } finally {
    u = i, h = l;
  }
  (!e.updatedAt || e.updatedAt <= s) && (e.updatedAt != null && "observers" in e ? P(e, n) : e.value = n, e.updatedAt = s);
}
function J(e, t, s, n = w, l) {
  const i = {
    fn: e,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: h,
    context: h ? h.context : null,
    pure: s
  };
  return h === null || h !== L && (h.owned ? h.owned.push(i) : h.owned = [i]), i;
}
function k(e) {
  if (e.state === 0) return;
  if (e.state === A) return C(e);
  if (e.suspense && N(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < x); )
    e.state && t.push(e);
  for (let s = t.length - 1; s >= 0; s--)
    if (e = t[s], e.state === w)
      _(e);
    else if (e.state === A) {
      const n = a;
      a = null, S(() => C(e, t[0]), !1), a = n;
    }
}
function S(e, t) {
  if (a) return e();
  let s = !1;
  t || (a = []), g ? s = !0 : g = [], x++;
  try {
    const n = e();
    return K(s), n;
  } catch (n) {
    s || (g = null), a = null, q(n);
  }
}
function K(e) {
  if (a && (I(a), a = null), e) return;
  const t = g;
  g = null, t.length && S(() => V(t), !1);
}
function I(e) {
  for (let t = 0; t < e.length; t++) k(e[t]);
}
function C(e, t) {
  e.state = 0;
  for (let s = 0; s < e.sources.length; s += 1) {
    const n = e.sources[s];
    if (n.sources) {
      const l = n.state;
      l === w ? n !== t && (!n.updatedAt || n.updatedAt < x) && k(n) : l === A && C(n, t);
    }
  }
}
function j(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const s = e.observers[t];
    s.state || (s.state = A, s.pure ? a.push(s) : g.push(s), s.observers && j(s));
  }
}
function y(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const s = e.sources.pop(), n = e.sourceSlots.pop(), l = s.observers;
      if (l && l.length) {
        const i = l.pop(), r = s.observerSlots.pop();
        n < l.length && (i.sourceSlots[r] = n, l[n] = i, s.observerSlots[n] = r);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) y(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) y(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Y(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function q(e, t = h) {
  throw Y(e);
}
function Z(e, t) {
  return N(() => e(t || {}));
}
function z(e, t, s) {
  let n = s.length, l = t.length, i = n, r = 0, o = 0, f = t[l - 1].nextSibling, c = null;
  for (; r < l || o < i; ) {
    if (t[r] === s[o]) {
      r++, o++;
      continue;
    }
    for (; t[l - 1] === s[i - 1]; )
      l--, i--;
    if (l === r) {
      const p = i < n ? o ? s[o - 1].nextSibling : s[i - o] : f;
      for (; o < i; ) e.insertBefore(s[o++], p);
    } else if (i === o)
      for (; r < l; )
        (!c || !c.has(t[r])) && t[r].remove(), r++;
    else if (t[r] === s[i - 1] && s[o] === t[l - 1]) {
      const p = t[--l].nextSibling;
      e.insertBefore(s[o++], t[r++].nextSibling), e.insertBefore(s[--i], p), t[l] = s[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let d = o;
        for (; d < i; ) c.set(s[d], d++);
      }
      const p = c.get(t[r]);
      if (p != null)
        if (o < p && p < i) {
          let d = r, m = 1, B;
          for (; ++d < l && d < i && !((B = c.get(t[d])) == null || B !== p + m); )
            m++;
          if (m > p - o) {
            const G = t[r];
            for (; o < p; ) e.insertBefore(s[o++], G);
          } else e.replaceChild(s[o++], t[r++]);
        } else r++;
      else t[r++].remove();
    }
  }
}
const D = "_$DX_DELEGATE";
function ee(e, t, s, n = {}) {
  let l;
  return M((i) => {
    l = i, t === document ? e() : F(t, e(), t.firstChild ? null : void 0, s);
  }, n.owner), () => {
    l(), t.textContent = "";
  };
}
function te(e, t, s) {
  let n;
  const l = () => {
    const r = document.createElement("template");
    return r.innerHTML = e, r.content.firstChild;
  }, i = () => (n || (n = l())).cloneNode(!0);
  return i.cloneNode = i, i;
}
function se(e, t = window.document) {
  const s = t[D] || (t[D] = /* @__PURE__ */ new Set());
  for (let n = 0, l = e.length; n < l; n++) {
    const i = e[n];
    s.has(i) || (s.add(i), t.addEventListener(i, ne));
  }
}
function F(e, t, s, n) {
  if (s !== void 0 && !n && (n = []), typeof t != "function") return E(e, t, n, s);
  T((l) => E(e, t(), l, s), n);
}
function ne(e) {
  let t = e.target;
  const s = `$$${e.type}`, n = e.target, l = e.currentTarget, i = (f) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: f
  }), r = () => {
    const f = t[s];
    if (f && !t.disabled) {
      const c = t[`${s}Data`];
      if (c !== void 0 ? f.call(t, c, e) : f.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, o = () => {
    for (; r() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const f = e.composedPath();
    i(f[0]);
    for (let c = 0; c < f.length - 2 && (t = f[c], !!r()); c++) {
      if (t._$host) {
        t = t._$host, o();
        break;
      }
      if (t.parentNode === l)
        break;
    }
  } else o();
  i(n);
}
function E(e, t, s, n, l) {
  for (; typeof s == "function"; ) s = s();
  if (t === s) return s;
  const i = typeof t, r = n !== void 0;
  if (e = r && s[0] && s[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === s))
      return s;
    if (r) {
      let o = s[0];
      o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), s = b(e, s, n, o);
    } else
      s !== "" && typeof s == "string" ? s = e.firstChild.data = t : s = e.textContent = t;
  } else if (t == null || i === "boolean")
    s = b(e, s, n);
  else {
    if (i === "function")
      return T(() => {
        let o = t();
        for (; typeof o == "function"; ) o = o();
        s = E(e, o, s, n);
      }), () => s;
    if (Array.isArray(t)) {
      const o = [], f = s && Array.isArray(s);
      if (v(o, t, s, l))
        return T(() => s = E(e, o, s, n, !0)), () => s;
      if (o.length === 0) {
        if (s = b(e, s, n), r) return s;
      } else f ? s.length === 0 ? U(e, o, n) : z(e, s, o) : (s && b(e), U(e, o));
      s = o;
    } else if (t.nodeType) {
      if (Array.isArray(s)) {
        if (r) return s = b(e, s, n, t);
        b(e, s, null, t);
      } else s == null || s === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      s = t;
    }
  }
  return s;
}
function v(e, t, s, n) {
  let l = !1;
  for (let i = 0, r = t.length; i < r; i++) {
    let o = t[i], f = s && s[e.length], c;
    if (!(o == null || o === !0 || o === !1)) if ((c = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      l = v(e, o, f) || l;
    else if (c === "function")
      if (n) {
        for (; typeof o == "function"; ) o = o();
        l = v(
          e,
          Array.isArray(o) ? o : [o],
          Array.isArray(f) ? f : [f]
        ) || l;
      } else
        e.push(o), l = !0;
    else {
      const p = String(o);
      f && f.nodeType === 3 && f.data === p ? e.push(f) : e.push(document.createTextNode(p));
    }
  }
  return l;
}
function U(e, t, s = null) {
  for (let n = 0, l = t.length; n < l; n++) e.insertBefore(t[n], s);
}
function b(e, t, s, n) {
  if (s === void 0) return e.textContent = "";
  const l = n || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let r = t.length - 1; r >= 0; r--) {
      const o = t[r];
      if (l !== o) {
        const f = o.parentNode === e;
        !i && !r ? f ? e.replaceChild(l, o) : e.insertBefore(l, s) : f && o.remove();
      } else i = !0;
    }
  } else e.insertBefore(l, s);
  return [l];
}
var le = /* @__PURE__ */ te('<div class=mt-12><p class=mb-5>Count: </p><button class="border px-2 py-1 rounded-md border-black">Increment</button><button class="border px-2 py-1 rounded-md border-black">Decrement');
const ie = () => {
  const [e, t] = Q(0);
  return (() => {
    var s = le(), n = s.firstChild;
    n.firstChild;
    var l = n.nextSibling, i = l.nextSibling;
    return F(n, e, null), l.$$click = () => t(e() + 1), i.$$click = () => t(e() - 1), s;
  })();
};
ee(() => Z(ie, {}), document.getElementById("counter"));
se(["click"]);
