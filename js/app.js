(function () {
  var MAJOR_TABS = ['home', 'law', 'edu', 'res', 'me'];
  var tabbar = document.getElementById('tabbar');
  var tabs = Array.prototype.slice.call(tabbar.querySelectorAll('.tab'));
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var body = document.body;

  /* ===== 通用工具 ===== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function toast(msg, type) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.className = 'toast'; }, 1800);
  }

  function scrollTop(id) {
    var p = document.getElementById(id);
    if (p) p.scrollTop = 0;
  }

  /* ===== 启动页 ===== */
  var splashBtn = $('#splashBtn');
  if (splashBtn) {
    splashBtn.addEventListener('click', function () {
      var s = $('#splash');
      s.classList.add('hide');
      setTimeout(function () { s.style.display = 'none'; }, 500);
      toast('欢迎使用云上护农宝 🌾');
    });
  }

  /* ===== 页面导航 ===== */
  function showPage(id) {
    var target = document.getElementById(id);
    pages.forEach(function (p) {
      p.style.display = 'none';
    });
    if (target) target.style.display = 'block';
  }

  function setTab(activeId) {
    tabs.forEach(function (t) {
      var match = t.getAttribute('data-tab') === activeId;
      t.classList.toggle('active', match);
    });
  }

  function navigate(id) {
    var page = document.getElementById(id);
    if (!page) return;
    showPage(id);
    // 取页面标识（兼容 'home' 与 'page-home' 两种写法）
    var name = id.replace(/^page-/, '');
    if (MAJOR_TABS.indexOf(name) !== -1) {
      tabbar.style.display = 'flex';
      setTab(name);
    } else {
      tabbar.style.display = 'none';
    }
    scrollTop(id);
  }

  navigate('page-home');

  /* ===== Tab 点击 ===== */
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      navigate('page-' + t.getAttribute('data-tab'));
    });
  });

  /* ===== 全局点击：导航 / 返回 / 交互按钮 ===== */
  body.addEventListener('click', function (e) {
    // 导航
    var navEl = e.target.closest('[data-nav]');
    if (navEl) {
      var from = $('.page.active');
      if (from) from.setAttribute('data-return', from.id);
      navigate(navEl.getAttribute('data-nav'));
      return;
    }
    // 返回
    var backBtn = e.target.closest('[data-back]');
    if (backBtn) {
      var cur = $('.page.active');
      var ret = cur && cur.getAttribute('data-return');
      if (!ret || ret === cur.id || ($('#' + ret) && $('#' + ret).getAttribute('data-tab') === 'home')) {
        navigate('page-home');
      } else {
        navigate(ret);
      }
      return;
    }
    // 通用提示按钮
    var tb = e.target.closest('[data-toast]');
    if (tb) {
      e.preventDefault();
      toast(tb.getAttribute('data-toast'));
    }
  });

  /* ===== 法律服务：子页签切换 ===== */
  var lawTabs = $all('.law-tab');
  lawTabs.forEach(function (t) {
    t.addEventListener('click', function () {
      lawTabs.forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var key = t.getAttribute('data-law');
      $all('.law-panel').forEach(function (p) {
        p.classList.toggle('active', p.id === 'lawPanel-' + key);
      });
    });
  });

  /* ===== 需求调研 / 咨询：多选选项 ===== */
  $all('.opt-chip').forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('active'); });
  });

  /* ===== 在线咨询：咨询方式单选 ===== */
  var cmodes = $all('.cmode');
  cmodes.forEach(function (m) {
    m.addEventListener('click', function () {
      cmodes.forEach(function (x) { x.classList.remove('active'); });
      m.classList.add('active');
    });
  });

  /* ===== 合同模板：搜索过滤 ===== */
  (function () {
    var search = $('#tplSearch');
    if (!search) return;
    search.addEventListener('input', function () {
      var kw = search.value.trim();
      $all('.tpl-row').forEach(function (row) {
        if (row.classList.contains('tpl-more')) { row.style.display = ''; return; }
        var name = row.textContent;
        row.style.display = (kw && name.indexOf(kw) === -1) ? 'none' : '';
      });
    });
  })();

  /* ===== 合规检测：模拟结果 ===== */
  (function () {
    var checkBtn = $('#checkBtn');
    if (!checkBtn) return;
    var BAD = ['最优质', '绝对', '100%', '天然', '第一', '顶级', '安全', '根治', '特效', '包治'];
    function findBad(text) {
      var found = [];
      BAD.forEach(function (w) {
        if (text.indexOf(w) !== -1) found.push(w);
      });
      return found;
    }
    checkBtn.addEventListener('click', function () {
      var input = $('#checkInput');
      var text = input ? input.textContent || '' : '';
      var found = findBad(text);
      var score = Math.max(0, 100 - found.length * 30);
      $('#checkScore').textContent = score;
      var goodChip = $('#checkGood');
      var badChip = $('#checkBad');
      if (found.length === 0) {
        goodChip.style.display = '';
        badChip.style.display = 'none';
        toast('检测完成，未检出违禁词 ✅');
      } else {
        goodChip.style.display = 'none';
        badChip.style.display = '';
        $('#checkBadText').textContent = '检出疑似违禁词 ' + found.length + ' 个（' + found.join('、') + '）';
        toast('检测到 ' + found.length + ' 个疑似违规词 ⚠️');
      }
    });
  })();

  /* ===== 在线咨询 / 需求调研：提交反馈 ===== */
  (function () {
    var submitBtns = $all('.consult-submit, .form-submit');
    submitBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.textContent = btn.textContent.replace('提交', '已提交 ✓');
        toast('提交成功，我们会尽快与您联系 🎉');
        setTimeout(function () {
          var t = '提交' + (btn.className.indexOf('consult') !== -1 ? '咨询' : '反馈');
          btn.textContent = t;
        }, 2000);
      });
    });
  })();

  /* ===== 合同下载 / 保存等：走通用 toast（由 data-toast 处理） ===== */
  (function () {
    // 合同模板下载由 enhance.js 统一处理（含文件名与收藏联动）
  })();

  /* ===== 模拟登录 + 个人中心数据态 ===== */
  (function () {
    var LS_KEY = 'yhhn_logged_in';
    var modal = $('#loginModal');
    var loginBtn = $('#loginBtn');

    function applyState() {
      var logged = localStorage.getItem(LS_KEY) === '1';
      body.classList.toggle('logged-in', logged);
      var meName = $('#meName'), meRole = $('#meRole'), meAvatar = $('#meAvatar');
      var meStats = $('#meStats'), meRecords = $('#meRecords');
      if (logged) {
        meName.textContent = '张大姐';
        meRole.textContent = '已认证 · 黑龙江省 · 粮食种植';
        meAvatar.textContent = '👩‍🌾';
        meStats.style.display = 'flex';
        meRecords.style.display = 'block';
        $('#statCol').textContent = '6';
        $('#statConsult').textContent = '3';
        $('#statDl').textContent = '4';
        $('#statSurvey').textContent = '2';
      } else {
        meName.textContent = '未登录';
        meRole.textContent = '登录后畅享完整服务';
        meAvatar.textContent = '👨‍🌾';
        meStats.style.display = 'none';
        meRecords.style.display = 'none';
      }
    }

    // 打开 / 关闭弹窗
    function openModal() {
      modal.classList.add('open');
      var input = $('#modalPhone');
      input.textContent = '请输入手机号';
      input.style.color = '#a3aea6';
    }
    function closeModal() { modal.classList.remove('open'); }

    loginBtn.addEventListener('click', openModal);

    $all('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    // 登录提交
    var modalLoginBtn = $('#modalLoginBtn');
    if (modalLoginBtn) {
      modalLoginBtn.addEventListener('click', function () {
        var agreeCheck = modal.querySelector('input[type=checkbox]');
        if (agreeCheck && !agreeCheck.checked) {
          toast('请先勾选同意协议');
          return;
        }
        localStorage.setItem(LS_KEY, '1');
        applyState();
        closeModal();
        toast('登录成功，欢迎回来张大姐 🎉');
      });
    }

    var logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        localStorage.removeItem(LS_KEY);
        applyState();
        toast('已退出登录 👋');
      });
    }

    applyState();
  })();

  // 暴露导航接口供 enhance.js 调用
  window.__yhhnNavigate = navigate;
})();
