/* J7 · Manager y publicista de Josh.P — burbuja de chat (vanilla, sin dependencias).
   Habla con el Worker multi-sitio de J7 (site: "josh"). */
(function () {
  "use strict";
  var ENDPOINT = "https://chat.sietess.com/chat";
  var TEXTS = {
    es: {
      title: "J7 · Manager de Josh.P",
      subtitle: "Manager y publicista oficial · SwMusic",
      greeting:
        "¡Hola! Soy J7, manager y publicista de Josh.P. Puedo contarte sobre su música y sus géneros, cómo nacieron sus canciones, sus videos y dónde escucharlas. ¿Qué quieres saber?",
      placeholder: "Pregúntale a J7…",
      send: "Enviar",
      open: "Abrir el chat de J7, manager de Josh.P",
      thinking: "J7 está escribiendo…",
      error: "Uy, se cortó la conexión un momento. Inténtalo de nuevo, aquí sigo.",
      note: "Asistente con IA de Josh.P · SwMusic. Prensa y booking: Instagram @josh.p.artist o el press kit de esta página.",
      chips: ["¿Qué géneros hace Josh.P?", "¿Cómo nació «Leading Me Back Home»?", "¿Dónde lo escucho?", "¿Qué es el Electro Hip Metal?"],
    },
    en: {
      title: "J7 · Josh.P's Manager",
      subtitle: "Official manager & publicist · SwMusic",
      greeting:
        "Hi! I'm J7, Josh.P's manager and publicist. I can tell you about his music and genres, how his songs were created, his videos and where to listen. What would you like to know?",
      placeholder: "Ask J7…",
      send: "Send",
      open: "Open the chat with J7, Josh.P's manager",
      thinking: "J7 is typing…",
      error: "Oops, the connection dropped for a second. Try again, I'm still here.",
      note: "Josh.P's AI assistant · SwMusic. Press & booking: Instagram @josh.p.artist or this site's press kit.",
      chips: ["What genres does Josh.P make?", "How was Leading Me Back Home created?", "Where can I listen?", "What is Electro Hip Metal?"],
    },
  };
  var LANG = (document.documentElement.lang || navigator.language || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en";
  var T = TEXTS[LANG];

  var style = document.createElement("style");
  style.textContent = [
    "@keyframes j7josh-breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.55}50%{transform:translate(-50%,-50%) scale(1.28);opacity:.9}}",
    "@keyframes j7josh-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}",
    "@keyframes j7josh-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
    "@keyframes j7josh-dot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-3px);opacity:1}}",
    ".j7josh-btn{position:fixed;right:20px;bottom:20px;z-index:60;width:64px;height:64px;border-radius:50%;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;animation:j7josh-float 5.5s ease-in-out infinite;background:radial-gradient(circle at 32% 28%,#eafffb 0%,#8ff5e9 22%,#29e6d8 48%,#ff5fa2 82%,#160a1e 100%);box-shadow:0 0 30px rgba(41,230,216,.45),0 10px 24px rgba(0,0,0,.5),inset 0 -8px 14px rgba(0,0,0,.45),inset 0 5px 10px rgba(255,255,255,.35)}",
    ".j7josh-core{position:absolute;top:50%;left:50%;width:32px;height:32px;border-radius:50%;background:#d9fffa;filter:blur(8px);animation:j7josh-breathe 3.4s ease-in-out infinite;pointer-events:none}",
    ".j7josh-core.fast{animation-duration:1.15s}",
    ".j7josh-orbit{position:absolute;inset:0;animation:j7josh-spin 9s linear infinite;pointer-events:none}",
    ".j7josh-orbit.fast{animation-duration:2.2s}",
    ".j7josh-orbit i{position:absolute;border-radius:50%;background:#ffd7ea;filter:blur(1px)}",
    ".j7josh-shine{position:absolute;top:15%;left:21%;width:20px;height:14px;border-radius:50%;background:rgba(255,255,255,.8);filter:blur(3px);transform:rotate(-20deg);pointer-events:none}",
    ".j7josh-j7{position:relative;z-index:2;font-weight:800;font-size:19px;color:#08131a;text-shadow:0 1px 1px rgba(255,255,255,.55);font-family:Georgia,'Times New Roman',serif}",
    ".j7josh-panel{position:fixed;right:20px;bottom:96px;z-index:60;width:min(88vw,350px);height:min(58vh,480px);display:flex;flex-direction:column;overflow:hidden;border-radius:18px;border:1px solid rgba(255,255,255,.12);background:#0d0d18;box-shadow:0 24px 60px rgba(0,0,0,.55);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f2f2f7}",
    "@media(min-width:640px){.j7josh-panel{height:min(64vh,530px)}}",
    ".j7josh-head{padding:12px 16px;background:#07070d;border-bottom:1px solid rgba(255,255,255,.09)}",
    ".j7josh-head b{display:block;font-size:15.5px;font-family:Georgia,'Times New Roman',serif}",
    ".j7josh-head span{font-size:12px;color:#a7a7bb}",
    ".j7josh-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}",
    ".j7josh-m{max-width:88%;padding:8px 12px;border-radius:16px;font-size:14px;line-height:1.55;white-space:pre-wrap;word-break:break-word}",
    ".j7josh-a{align-self:flex-start;background:#1c1c30;border-bottom-left-radius:6px}",
    ".j7josh-u{align-self:flex-end;background:#29e6d8;color:#04121a;border-bottom-right-radius:6px}",
    ".j7josh-m a{color:inherit;font-weight:600;text-decoration:underline dotted;text-underline-offset:2px}",
    ".j7josh-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 4px}",
    ".j7josh-chip{border:1px solid rgba(255,255,255,.14);background:#12121f;color:#d8d8e6;border-radius:999px;padding:6px 11px;font-size:12.5px;cursor:pointer}",
    ".j7josh-chip:hover{border-color:rgba(41,230,216,.6);color:#f2f2f7}",
    ".j7josh-typing{align-self:flex-start;background:#1c1c30;border-radius:16px;border-bottom-left-radius:6px;padding:12px 14px;display:flex;gap:6px}",
    ".j7josh-typing i{width:6px;height:6px;border-radius:50%;background:#ff5fa2;animation:j7josh-dot 1.2s ease-in-out infinite}",
    ".j7josh-note{padding:4px 12px 0;font-size:11px;line-height:1.45;color:#a7a7bb}",
    ".j7josh-form{display:flex;gap:8px;padding:12px}",
    ".j7josh-in{flex:1;min-width:0;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:#12121f;color:#f2f2f7;padding:9px 15px;font-size:14px;outline:none}",
    ".j7josh-in:focus{border-color:rgba(41,230,216,.6)}",
    ".j7josh-in::placeholder{color:#a7a7bb}",
    ".j7josh-send{border:0;border-radius:999px;background:#29e6d8;color:#04121a;font-weight:700;padding:9px 16px;font-size:14px;cursor:pointer}",
    ".j7josh-send:disabled{opacity:.4;cursor:default}",
    "@media (prefers-reduced-motion: reduce){.j7josh-btn,.j7josh-core,.j7josh-orbit,.j7josh-typing i{animation:none}}",
  ].join("\n");
  document.head.appendChild(style);

  var msgs = [];
  var loading = false;

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "j7josh-btn";
  btn.setAttribute("aria-label", T.open);
  btn.setAttribute("aria-expanded", "false");
  var core = document.createElement("span");
  core.className = "j7josh-core";
  var orbit = document.createElement("span");
  orbit.className = "j7josh-orbit";
  [["18%", "30%", 5], ["58%", "72%", 4], ["72%", "26%", 3]].forEach(function (p) {
    var dot = document.createElement("i");
    dot.style.top = p[0];
    dot.style.left = p[1];
    dot.style.width = p[2] + "px";
    dot.style.height = p[2] + "px";
    orbit.appendChild(dot);
  });
  var shine = document.createElement("span");
  shine.className = "j7josh-shine";
  var label = document.createElement("span");
  label.className = "j7josh-j7";
  label.textContent = "J7";
  btn.appendChild(core);
  btn.appendChild(orbit);
  btn.appendChild(shine);
  btn.appendChild(label);
  document.body.appendChild(btn);

  var panel = null;
  var msgsEl = null;
  var inputEl = null;
  var sendBtn = null;
  var typingEl = null;
  var chipsEl = null;

  function linkify(container, text) {
    var parts = text.split(/(https?:\/\/[^\s)]+)/g);
    parts.forEach(function (part) {
      if (/^https?:\/\//.test(part)) {
        var a = document.createElement("a");
        a.href = part;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = part.replace("https://", "");
        container.appendChild(a);
      } else {
        container.appendChild(document.createTextNode(part));
      }
    });
  }

  // Vista previa dentro del chat: los enlaces de Spotify/YouTube que trae la
  // respuesta se convierten en reproductores embebidos (máx. 1 de cada tipo).
  function addMedia(text) {
    var wrap = document.createElement("div");
    wrap.style.cssText = "align-self:flex-start;width:min(88%,320px);display:flex;flex-direction:column;gap:8px";
    var found = false;
    var sp = text.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/);
    if (sp) {
      var f1 = document.createElement("iframe");
      f1.src = "https://open.spotify.com/embed/track/" + sp[1] + "?utm_source=generator&theme=0";
      f1.style.cssText = "width:100%;height:152px;border:0;border-radius:12px";
      f1.loading = "lazy";
      f1.allow = "encrypted-media";
      f1.title = "Spotify";
      wrap.appendChild(f1);
      found = true;
    }
    var yt = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (yt) {
      var f2 = document.createElement("iframe");
      f2.src = "https://www.youtube-nocookie.com/embed/" + yt[1];
      f2.style.cssText = "width:100%;aspect-ratio:16/9;border:0;border-radius:12px";
      f2.loading = "lazy";
      f2.allow = "accelerometer; encrypted-media; picture-in-picture";
      f2.allowFullscreen = true;
      f2.title = "YouTube";
      wrap.appendChild(f2);
      found = true;
    }
    if (found) msgsEl.appendChild(wrap);
  }

  function addMsg(role, content) {
    if (role !== "user") content = content.replace(/\\n/g, "\n");
    var div = document.createElement("div");
    div.className = "j7josh-m " + (role === "user" ? "j7josh-u" : "j7josh-a");
    linkify(div, content);
    msgsEl.appendChild(div);
    if (role !== "user") addMedia(content);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function setLoading(v) {
    loading = v;
    core.classList.toggle("fast", v);
    orbit.classList.toggle("fast", v);
    sendBtn.disabled = v || !inputEl.value.trim();
    if (v) {
      typingEl = document.createElement("div");
      typingEl.className = "j7josh-typing";
      typingEl.setAttribute("role", "status");
      typingEl.setAttribute("aria-label", T.thinking);
      for (var i = 0; i < 3; i++) {
        var d = document.createElement("i");
        d.style.animationDelay = i * 0.18 + "s";
        typingEl.appendChild(d);
      }
      msgsEl.appendChild(typingEl);
    } else if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function ask(text) {
    var clean = (text || "").trim();
    if (!clean || loading) return;
    if (chipsEl) chipsEl.style.display = "none";
    msgs.push({ role: "user", content: clean });
    addMsg("user", clean);
    inputEl.value = "";
    setLoading(true);
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: clean,
        locale: "es",
        site: "josh",
        history: msgs.slice(0, -1).slice(-6),
      }),
    })
      .then(function (res) {
        return res.json().catch(function () {
          return {};
        }).then(function (data) {
          if (!res.ok || typeof data.reply !== "string") throw new Error("bad");
          return data.reply;
        });
      })
      .then(function (reply) {
        msgs.push({ role: "assistant", content: reply });
        setLoading(false);
        addMsg("assistant", reply);
      })
      .catch(function () {
        setLoading(false);
        addMsg("assistant", T.error);
      });
  }

  function buildPanel() {
    panel = document.createElement("div");
    panel.className = "j7josh-panel";
    var head = document.createElement("div");
    head.className = "j7josh-head";
    var b = document.createElement("b");
    b.textContent = T.title;
    var s = document.createElement("span");
    s.textContent = T.subtitle;
    head.appendChild(b);
    head.appendChild(s);
    panel.appendChild(head);

    msgsEl = document.createElement("div");
    msgsEl.className = "j7josh-msgs";
    panel.appendChild(msgsEl);
    addMsg("assistant", T.greeting);
    msgs.push({ role: "assistant", content: T.greeting });

    chipsEl = document.createElement("div");
    chipsEl.className = "j7josh-chips";
    T.chips.forEach(function (chip) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "j7josh-chip";
      c.textContent = chip;
      c.addEventListener("click", function () {
        ask(chip);
      });
      chipsEl.appendChild(c);
    });
    panel.appendChild(chipsEl);

    var note = document.createElement("p");
    note.className = "j7josh-note";
    note.textContent = T.note;
    panel.appendChild(note);

    var form = document.createElement("form");
    form.className = "j7josh-form";
    inputEl = document.createElement("input");
    inputEl.className = "j7josh-in";
    inputEl.maxLength = 600;
    inputEl.placeholder = T.placeholder;
    inputEl.setAttribute("aria-label", T.placeholder);
    inputEl.addEventListener("input", function () {
      sendBtn.disabled = loading || !inputEl.value.trim();
    });
    sendBtn = document.createElement("button");
    sendBtn.type = "submit";
    sendBtn.className = "j7josh-send";
    sendBtn.textContent = T.send;
    sendBtn.disabled = true;
    form.appendChild(inputEl);
    form.appendChild(sendBtn);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      ask(inputEl.value);
    });
    panel.appendChild(form);
    document.body.appendChild(panel);
  }

  function toggle(force) {
    var willOpen = typeof force === "boolean" ? force : !panel;
    if (willOpen && !panel) buildPanel();
    if (!willOpen && panel) {
      panel.remove();
      panel = null;
    }
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  }

  btn.addEventListener("click", function () {
    toggle();
  });
  document.addEventListener("pointerdown", function (e) {
    if (!panel) return;
    if (panel.contains(e.target) || btn.contains(e.target)) return;
    toggle(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel) toggle(false);
  });
})();
