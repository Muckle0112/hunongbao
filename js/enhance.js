/* =========================================================
   云上护农宝 · 功能完善模块（动态详情与交互增强）
   ========================================================= */
(function () {
  if (!window.ENHACE_LOADED) {
    window.ENHACE_LOADED = true;
  } else {
    return;
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var LS_FAV = 'yhhn_favs';
  function getFavs() {
    try { return JSON.parse(localStorage.getItem(LS_FAV)) || []; } catch (e) { return []; }
  }
  function setFavs(arr) { localStorage.setItem(LS_FAV, JSON.stringify(arr)); }
  function isFav(key) { return getFavs().indexOf(key) !== -1; }

  /* ===== 数据 ===== */
  var VIDEOS = [
    { id: 'v1', cat: '粮食购销', title: '咱屯卖粮被压价，咋整？（东北话版）', view: '1.2万', time: '08:26', color: '#4c9dd0',
      desc: '本集用东北话讲解粮食收购压价时的应对方法：如何固定价格证据、签订书面购销合同、遇到压价可向市场监管部门反映。' },
    { id: 'v2', cat: '合同违约', title: '签了订单不出货，违约啦？（黑龙江方言）', view: '8600', time: '05:41', color: '#5aa77e',
      desc: '本集解读订单农业中的违约情形：对方不按约定收货或拒收时，如何主张违约金、保留证据并主张差价损失。' },
    { id: 'v3', cat: '消费维权', title: '直播间买到假种子，能退吗？（东北话版）', view: '1.5万', time: '06:58', color: '#b08a3a',
      desc: '本集讲解网购农资消费维权：识别假种子、保留购买凭证、依据消费者权益保护法主张退一赔三。' },
    { id: 'v4', cat: '劳动报酬', title: '给人家打短工，工钱咋要？（龙江话版）', view: '6300', time: '04:20', color: '#7a6ac0',
      desc: '本集讲解务工报酬追讨：保留工时记录、工资约定，遇到拖欠可向劳动监察部门投诉或申请调解。' }
  ];
  var CASES = [
    { id: 'c1', tag: '购销纠纷', tagCls: 'tag-trade', title: '收购商赊账跑路，农户如何拿回货款？',
      points: ['案情回顾：保留欠条、转账记录、微信聊天', '法律依据：民法典合同编 · 欠款追偿', '处理结果：诉前调解成功，货款如期到账'],
      detail: '农户李某将粮食卖给收购商，对方赊账后失联。通过留存欠条、微信聊天与转账记录，联合司法所调解，最终拿回全部货款。启示：大宗交易务必签订书面合同并保留凭证。' },
    { id: 'c2', tag: '土地流转', tagCls: 'tag-land', title: '流转合同未备案，承包地还能收回吗？',
      points: ['案情回顾：口头约定期限，未签书面合同', '法律依据：土地承包经营法 · 备案要求', '处理结果：补签合同并备案，双方权益受保护'],
      detail: '农户口头将土地流转给合作社，未签书面合同也未备案，引发期限争议。经指导补签书面合同并到乡镇备案，双方权益都得到保障。' },
    { id: 'c3', tag: '电商直播', tagCls: 'tag-ecom', title: '直播带货过度承诺，被判惩罚性赔偿',
      points: ['案情回顾：夸大"有机""零残留"宣传语', '法律依据：广告法 · 消费者权益保护法', '处理结果：承担三倍赔偿，主播账号被封'],
      detail: '农户直播带货时使用"有机""零残留"等无法证明的宣传语，被消费者起诉。法院认定构成虚假宣传，判令三倍赔偿并封禁账号。启示：宣传务必有据可依。' }
  ];
  var CLASSES = [
    { id: 'k1', no: '01', title: '春耕时节 · 农资采购防坑指南', meta: '每周更新 · 视频+图文', tag: '春耕农资',
      outline: ['学会识别假种子、假化肥', '保留购买凭证与票据', '遇到农资纠纷的维权步骤'] },
    { id: 'k2', no: '02', title: '秋收卖粮 · 货款结算风险防范', meta: '每月专题 · 案例+互动', tag: '秋收购销',
      outline: ['签订规范化购销合同的要点', '货款结算与欠条管理', '购销纠纷的应对方法'] },
    { id: 'k3', no: '03', title: '土地法规 · 承包与流转要点速懂', meta: '专题课程 · 附实用表单', tag: '土地法规',
      outline: ['土地承包经营权常识', '土地流转合同与备案', '常见土地争议案例'] },
    { id: 'k4', no: '04', title: '电商经营 · 直播带货合法边界', meta: '与高校法援联合录制', tag: '电商直播',
      outline: ['直播宣传用词红线', '商品质量问题责任', '网络交易纠纷处理'] }
  ];
  var TEMPLATES = [
    { name: '农产品购销合同', badge: '通用', feat: ['标的物及质量标准', '交货方式与地点', '货款结算与支付', '违约责任'],
      desc: '适用于农户与收购商之间的农产品买卖，包含交易条款、价款支付与违约责任，帮助降低购销纠纷风险。',
      fields: [
        { label: '甲方（卖方/农户）', key: 'seller', ph: '如：黑龙江省XX县 张三' },
        { label: '乙方（收购方）', key: 'buyer', ph: '如：XX食品收购公司' },
        { label: '标的物及质量标准', key: 'goods', ph: '如：秋玉米，含水率≤14%，无霉变' },
        { label: '数量与价格', key: 'qty', ph: '如：玉米50吨 × 2400元/吨' },
        { label: '交货方式与地点', key: 'delivery', ph: '如：XX村晒场，乙方自提' },
        { label: '货款结算', key: 'pay', ph: '如：验收合格后7日内一次性结清' }
      ] },
    { name: '粮食购销合同', badge: '通用', feat: ['粮食品种与等级', '计量与验收', '价格与结算', '违约处理'],
      desc: '针对粮食收购场景设计的规范化合同模板，明确质量、数量、价格及结算方式，避免口头约定纠纷。',
      fields: [
        { label: '甲方（卖方/农户）', key: 'seller', ph: '如：黑龙江省XX县 李四' },
        { label: '乙方（收购方）', key: 'buyer', ph: '如：XX粮库' },
        { label: '粮食品种与等级', key: 'goods', ph: '如：粳稻，国标二等' },
        { label: '数量与价格', key: 'qty', ph: '如：稻谷30吨 × 3200元/吨' },
        { label: '计量与验收地点', key: 'delivery', ph: '如：XX粮库过磅验收' },
        { label: '货款结算', key: 'pay', ph: '如：验收后5日内结清' }
      ] },
    { name: '鲜活农产品购销合同', badge: '通用', feat: ['鲜活品标准', '运输与损耗', '退换货约定', '质量责任'],
      desc: '适用果蔬、肉类等鲜活农产品，重点约定验收、保鲜、损耗与损耗责任划分。',
      fields: [
        { label: '甲方（供货方/农户）', key: 'seller', ph: '如：XX蔬菜种植合作社' },
        { label: '乙方（采购方）', key: 'buyer', ph: '如：XX生鲜超市' },
        { label: '鲜活品名称与标准', key: 'goods', ph: '如：有机黄瓜，规格一级' },
        { label: '数量与价格', key: 'qty', ph: '如：黄瓜2吨 × 2.5元/斤' },
        { label: '交货与验收', key: 'delivery', ph: '如：凌晨运抵XX批发市场验收' },
        { label: '损耗与退换约定', key: 'pay', ph: '如：运输损耗≤5%，超出部分甲方补货' }
      ] },
    { name: '土地承包经营权流转合同', badge: '通用', feat: ['流转期限', '流转用途', '价款支付', '备案手续'],
      desc: '指导土地承包经营权依法流转，明确期限、用途、价款与登记备案要求。',
      fields: [
        { label: '流出方（农户）', key: 'seller', ph: '如：XX村 王五' },
        { label: '流入方', key: 'buyer', ph: '如：XX种粮大户/合作社' },
        { label: '流转地块位置与面积', key: 'goods', ph: '如：XX村XX地块，共10亩' },
        { label: '流转期限', key: 'qty', ph: '如：自2026年1月1日起3年' },
        { label: '流转价款与支付', key: 'pay', ph: '如：每亩500元/年，每年11月前支付' }
      ] },
    { name: '农业劳务用工合同', badge: '通用', feat: ['用工内容', '劳务报酬', '安全责任', '合同解除'],
      desc: '适用于农业季节性用工，明确工作内容、报酬结算、安全管理与责任划分。',
      fields: [
        { label: '用工方（甲方）', key: 'seller', ph: '如：XX农场' },
        { label: '劳务者（乙方）', key: 'buyer', ph: '如：张三，身份证号XXXX' },
        { label: '用工内容与期限', key: 'goods', ph: '如：秋收装车，工期15天' },
        { label: '劳务报酬', key: 'pay', ph: '如：每天200元，工作结束3日内结清' },
        { label: '工作地点', key: 'delivery', ph: '如：XX农场晒场' }
      ] },
    { name: '农机租赁合同', badge: '通用', feat: ['租赁物与期限', '租金支付', '维护责任', '损坏赔偿'],
      desc: '约定农业机械租赁双方的权利义务，包括租金、保养、损坏赔偿等条款。',
      fields: [
        { label: '出租方（甲方）', key: 'seller', ph: '如：XX农机合作社' },
        { label: '承租方（乙方）', key: 'buyer', ph: '如：农户 李四' },
        { label: '租赁农机与期限', key: 'goods', ph: '如：联合收割机，租赁10天' },
        { label: '租金与支付', key: 'pay', ph: '如：每天800元，用毕结清' },
        { label: '作业地点', key: 'delivery', ph: '如：XX村周边地块' }
      ] },
    { name: '对俄农产品出口购销合同', badge: '对俄版', rus: true, feat: ['中俄双语条款', '货物标准', '支付方式', '争议解决'],
      desc: '面向对俄农产品出口场景的中俄双语合同模板，明确货物标准、支付、运输与争议解决方式。',
      fields: [
        { label: '出口方（甲方）', key: 'seller', ph: '如：黑龙江省XX贸易公司' },
        { label: '俄方采买方（乙方）', key: 'buyer', ph: '如：ООО «XX»（俄罗斯）' },
        { label: '货物名称与标准', key: 'goods', ph: '如：大豆，符合出口检验标准' },
        { label: '数量与价格', key: 'qty', ph: '如：100吨 × USD 520/吨' },
        { label: '支付与运输', key: 'pay', ph: '如：信用证/电汇，FOB满洲里' },
        { label: '争议解决方式', key: 'delivery', ph: '如：协商不成提交XX仲裁' }
      ] },
    { name: '对俄农业合作框架协议', badge: '对俄版', rus: true, feat: ['合作范围', '双方义务', '知识产权', '适用法律'],
      desc: '对俄农业合作的框架性协议模板，适用于建立长期合作的场景，含法律适用条款。',
      fields: [
        { label: '合作甲方', key: 'seller', ph: '如：XX农业投资公司' },
        { label: '合作乙方', key: 'buyer', ph: '如：ООО «XX»（俄罗斯）' },
        { label: '合作范围', key: 'goods', ph: '如：大豆种植技术合作与采购' },
        { label: '合作期限', key: 'qty', ph: '如：自签署之日起2年' },
        { label: '适用法律', key: 'pay', ph: '如：中华人民共和国法律及国际惯例' }
      ] }
  ];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function genDraft(t, values) {
    values = values || {};
    function get(k, fb) { return (values[k] && String(values[k]).trim()) || fb; }
    var lines = [];
    lines.push('《' + t.name + '》合同草稿');
    lines.push('（生成日期：' + today() + '，仅供参考，签署前建议请律师审核）');
    lines.push('');
    lines.push('甲方：' + get('seller', '＿＿＿＿＿＿'));
    lines.push('乙方：' + get('buyer', '＿＿＿＿＿＿'));
    lines.push('');
    lines.push('一、主要约定');
    lines.push('1. ' + (t.feat || []).join('；') + '。');
    lines.push('');
    lines.push('二、具体条款填写');
    var i = 1;
    (t.fields || []).forEach(function (f) {
      lines.push(i + '. ' + f.label + '：' + get(f.key, '（待填写）'));
      i++;
    });
    lines.push('');
    lines.push('三、违约责任与争议解决（以双方书面补充条款为准）');
    lines.push('提示：本模板为通用参考文本，涉及重大金额或跨境交易时，务必由专业律师审核后再行签署。');
    return lines.join('\n');
  }

  /* ===== 首页轮播 ===== */
  (function () {
    var track = $('#carouselTrack');
    var dotsBox = $('#carouselDots');
    if (!track) return;
    var slides = $all('.banner', track);
    var idx = 0;
    var timer = null;
    slides.forEach(function (_, i) {
      var d = document.createElement('span');
      d.className = 'dot' + (i === 0 ? ' on' : '');
      d.addEventListener('click', function () { show(i); });
      dotsBox.appendChild(d);
    });
    function show(i) {
      idx = (i + slides.length) % slides.length;
      var w = slides[0].offsetWidth;
      track.style.transform = 'translateX(' + (-idx * (w + 14)) + 'px)';
      $all('.dot', dotsBox).forEach(function (d, j) {
        d.classList.toggle('on', j === idx);
      });
    }
    function next() { show(idx + 1); }
    function start() { timer = setInterval(next, 4000); }
    start();
  })();

  /* ===== 通用弹窗 ===== */
  var overlay = $('#sheetOverlay');
  function openSheet(title, html) {
    $('#sheetTitle').textContent = title;
    $('#sheetBody').innerHTML = html;
    overlay.classList.add('open');
    $('#sheetBody').scrollTop = 0;
    var skip = ['我的收藏', '咨询记录', '浏览历史'];
    if (title && skip.indexOf(title) === -1) noteView(title);
  }
  function closeSheet() { overlay.classList.remove('open'); }
  $all('[data-close-sheet]').forEach(function (el) {
    el.addEventListener('click', closeSheet);
  });

  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show';
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.className = 'toast'; }, 1800);
  }

  /* 收藏切换 */
  function favBtn(key, name) {
    var on = isFav(key);
    return '<button class="fav-btn ' + (on ? 'on' : '') + '" data-fav="' + key + '" data-favname="' + name + '">' +
      (on ? '★ 已收藏' : '☆ 收藏') + '</button>';
  }

  /* ===== 视频详情 ===== */
  $all('.video-card').forEach(function (card, i) {
    card.addEventListener('click', function () {
      var v = VIDEOS[i];
      if (!v) return;
      openSheet('方言普法短剧', '\
        <div class="play-bg" style="background:linear-gradient(135deg,' + v.color + ',' + v.color + '88)">\
          <div class="play-ic">▶</div><div class="play-time">' + v.time + '</div>\
        </div>\
        <div class="dt-cat">' + v.cat + '</div>\
        <div class="dt-title">' + v.title + '</div>\
        <div class="dt-meta">👀 ' + v.view + ' 次播放 · ' + v.time + '</div>\
        <div class="dt-desc">' + v.desc + '</div>\
        <div class="dt-actions">' + favBtn('v' + v.id, v.title) + '<button class="fav-btn ghost" data-toast="已加入播放列表 ▶">加入播放列表</button></div>\
      ');
    });
  });

  /* ===== 案例详情 ===== */
  $all('.case-card').forEach(function (card, i) {
    card.addEventListener('click', function () {
      var c = CASES[i];
      if (!c) return;
      openSheet('典型案例拆解', '\
        <div class="case-tag ' + c.tagCls + '">' + c.tag + '</div>\
        <div class="dt-title" style="margin-top:8px">' + c.title + '</div>\
        <div class="case-points" style="margin-top:12px">' + c.points.map(function (p) {
          return '<div class="cp"><span class="cp-ico">💡</span><span>' + p + '</span></div>';
        }).join('') + '</div>\
        <div class="dt-sec-head">案情解析</div>\
        <div class="dt-desc">' + c.detail + '</div>\
        <div class="dt-actions">' + favBtn('c' + c.id, c.title) + '<button class="fav-btn ghost" data-nav="page-consult">咨询同类问题</button></div>\
      ');
    });
  });

  /* ===== 课程报名 ===== */
  $all('.class-item').forEach(function (item, i) {
    item.addEventListener('click', function (e) {
      if (e.target.closest('.class-btn')) return;
      var k = CLASSES[i];
      if (!k) return;
      openSheet('龙江普法课堂', '\
        <div class="cl-no">第 ' + k.no + ' 讲</div>\
        <div class="dt-title">' + k.title + '</div>\
        <div class="dt-meta">🎓 龙江普法小课堂 · ' + k.meta + '</div>\
        <div class="dt-sec-head">课程大纲</div>\
        <ul class="outline">' + k.outline.map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ul>\
        <button class="enroll-btn" data-enroll="' + k.no + '">立即报名学习</button>\
      ');
    });
    var btn = $('.class-btn', item);
    if (btn) {
      btn.addEventListener('click', function () {
        var k = CLASSES[i];
        toast('已报名《' + k.title + '》，开课时通知您 📅');
      });
    }
  });

  /* 课程报名动态按钮 */
  $all('.enroll-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      b.textContent = '✓ 已报名，开课提醒';
      b.classList.add('done');
      toast('报名成功，开课时提醒您 🎉');
    });
  });

  /* ===== 合同模板：预览 ===== */
  $all('.tpl-row').forEach(function (row) {
    if (row.classList.contains('tpl-more')) return;
    var name = (row.querySelector('.tpl-name') || {}).textContent || '';
    var tplObj = TEMPLATES.filter(function (t) { return t.name === name; })[0];
    if (!tplObj) return;
    row.querySelector('.tpl-dl').addEventListener('click', function (e) {
      e.stopPropagation();
      toast('《' + tplObj.name + '》已下载，保存到本地 📥');
      bumpDownload();
    });
    row.addEventListener('click', function (e) {
      if (e.target.closest('.tpl-dl')) return;
      openSheet('合同模板预览', '\
        <div class="tpl-pv-head">📄 ' + tplObj.name + ' <span class="tpl-badge ' + (tplObj.rus ? 'rus-badge' : '') + '">' + tplObj.badge + '</span></div>\
        <div class="dt-desc" style="margin-top:10px">' + tplObj.desc + '</div>\
        <div class="dt-sec-head">主要条款</div>\
        <ul class="outline">' + tplObj.feat.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>\
        <div class="dt-sec-head">📝 填写信息，生成合同草稿</div>\
        <div class="fill-fields">' +
          (tplObj.fields || []).map(function (f) {
            return '<div class="fill-row"><div class="fill-label">' + f.label + '</div>' +
              '<input class="tpl-fill-input" data-fill="' + f.key + '" placeholder="' + f.ph + '" /></div>';
          }).join('') +
        '</div>\
        <button class="primary-btn tpl-gen-draft" data-tplname="' + tplObj.name + '" style="width:100%">生成合同草稿</button>\
        <div class="tpl-draft-out" id="tplDraftOut" style="display:none;white-space:pre-wrap"></div>\
        <div class="dt-actions">' + favBtn('tpl' + tplObj.name, tplObj.name) + '<button class="fav-btn ghost" data-tpl-dl>下载模板</button></div>\
      ');
    });
  });

  document.addEventListener('click', function (e) {
    var dl = e.target.closest('[data-tpl-dl]');
    if (dl) { toast('模板下载完成 📥'); bumpDownload(); }
    var fv = e.target.closest('[data-fav]');
    if (fv) {
      var key = fv.getAttribute('data-fav');
      var favs = getFavs();
      if (isFav(key)) {
        favs.splice(favs.indexOf(key), 1);
        toast('已取消收藏');
      } else {
        favs.push(key);
        toast('已收藏 ⭐');
      }
      setFavs(favs);
      fv.textContent = isFav(key) ? '★ 已收藏' : '☆ 收藏';
      fv.classList.toggle('on', isFav(key));
      bumpCollect();
    }
  });

  /* ===== 合同草稿生成 ===== */
  document.addEventListener('click', function (e) {
    var gen = e.target.closest('.tpl-gen-draft');
    if (!gen) return;
    var name = gen.getAttribute('data-tplname');
    var tpl = TEMPLATES.filter(function (t) { return t.name === name; })[0];
    if (!tpl) return;
    var values = {};
    $all('.tpl-fill-input', $('#sheetBody')).forEach(function (inp) {
      values[inp.getAttribute('data-fill')] = inp.value;
    });
    var out = document.getElementById('tplDraftOut');
    out.style.display = 'block';
    out.textContent = genDraft(tpl, values);
    toast('合同草稿已生成 📝');
  });

  /* ===== 我的收藏列表 ===== */
  var collectRow = $('.me-row[data-toast]');
  // 双击"我的收藏"行可查看收藏 (通过专门入口，这里保持简单)

  /* ===== 个人中心计数联动 ===== */
  function bumpCollect() {
    var el = document.getElementById('statCol');
    if (el) el.textContent = getFavs().length;
  }
  function bumpDownload() {
    var el = document.getElementById('statDl');
    if (el) el.textContent = (parseInt(el.textContent || '0', 10)) + 1;
  }

  /* ===== 定制合同审核表单 ===== */
  var auditBtn = $('.official-card');
  var auditApplies = $all('.primary-btn[data-nav="page-consult"]');
  // 在普法教育页的"立即申请定制审核"上覆盖表单
  var eduApply = $all('.primary-btn').filter(function (b) {
    return b.textContent.indexOf('定制审核') !== -1;
  });
  eduApply.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openSheet('定制合同审核', '\
        <div class="form-label">合同类型</div>\
        <div class="form-options">\
          <span class="opt-chip active">购销</span><span class="opt-chip">土地流转</span>\
          <span class="opt-chip">劳务用工</span><span class="opt-chip">对俄贸易</span><span class="opt-chip">其他</span>\
        </div>\
        <div class="form-label">合同名称</div><div class="tpl-input" contenteditable="true">如：与XX合作社的玉米购销合同</div>\
        <div class="form-label">合同内容（可粘贴文本）</div><div class="tpl-input tall" contenteditable="true">粘贴或输入合同正文…</div>\
        <button class="primary-btn audit-submit">提交审阅（律师1-3个工作日反馈）</button>\
        <div class="rule-tip" style="margin:10px 0 0">💡 您可以同时上传证据与材料，详见资源对接-证据留存</div>\
      ');
    });
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('.audit-submit')) {
      var b = e.target.closest('.audit-submit');
      b.textContent = '已提交，律师审阅中 ✓';
      b.classList.add('done');
      toast('审核申请提交成功，1-3个工作日内反馈 🎉');
      bumpAudit();
    }
  });
  function bumpAudit() {
    var el = document.getElementById('statConsult');
    if (el) el.textContent = (parseInt(el.textContent || '0', 10)) + 1;
  }

  /* ===== 纠纷类型向导弹窗（资源对接） ===== */
  var assistCards = $all('.assist-card');
  assistCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var title = (card.querySelector('.assist-title') || {}).textContent || '';
      if (title.indexOf('货款') !== -1) {
        openSheet('货款拖欠纠纷指引', '\
          <div class="wizard">\
            <div class="wz-step"><b>1</b><span>整理欠款证据：欠条/合同/转账记录/聊天记录</span></div>\
            <div class="wz-step"><b>2</b><span>发送催款告知，保留送达凭证</span></div>\
            <div class="wz-step"><b>3</b><span>联系乡镇司法所调解</span></div>\
            <div class="wz-step"><b>4</b><span>必要时申请法院支付令或起诉</span></div>\
          </div>\
          <div class="dt-actions"><button class="fav-btn" data-nav-page="page-consult">申请协助</button><button class="fav-btn ghost" data-toast="已收藏纠纷指引">收藏指引</button></div>\
        ');
      } else if (title.indexOf('退货') !== -1) {
        openSheet('退货纠纷指引', '\
          <div class="wizard">\
            <div class="wz-step"><b>1</b><span>判断退货理由是否合理（质量问题/违约）</span></div>\
            <div class="wz-step"><b>2</b><span>对货物拍照留存证据</span></div>\
            <div class="wz-step"><b>3</b><span>与收购方协商，明确退货与费用承担</span></div>\
            <div class="wz-step"><b>4</b><span>协商不成，请求司法所或法援调解</span></div>\
          </div>\
          <div class="dt-actions"><button class="fav-btn" data-nav-page="page-consult">申请协助</button></div>\
        ');
      } else if (title.indexOf('采购') !== -1 || title.indexOf('物流') !== -1) {
        openSheet('产销对接', '\
          <div class="form-label">农产品信息</div><div class="tpl-input" contenteditable="true">如：有机玉米 xx 吨，产地 xx</div>\
          <div class="form-label">期望对接资源</div>\
          <div class="form-options"><span class="opt-chip active">采购商</span><span class="opt-chip">批发市场</span><span class="opt-chip">物流冷链</span><span class="opt-chip">电商平台</span></div>\
          <button class="primary-btn audit-submit2">发布产销需求</button>\
        ');
      }
    });
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('.audit-submit2')) {
      toast('产销需求已发布，将为您对接资源 🚀');
    }
    // 弹窗内 data-nav-page
    var np = e.target.closest('[data-nav-page]');
    if (np) {
      navigate(np.getAttribute('data-nav-page'));
      closeSheet();
    }
  });

  // 暴露 navigate 供 enhance.js 使用（app.js 内部私有的全局路由）
  var appNav = window.__yhhnNavigate;
  function navigate(id) {
    if (appNav) appNav(id);
  }

  /* ===== 证据上传交互 ===== */
  var evidActions = $('.evid-actions');
  if (evidActions) {
    var pills = $all('.pill-btn', evidActions);
    // 已有 data-toast，这里增强为可交互
  }

  /* 弹窗内通用按钮委托 */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-sheet]')) closeSheet();
  });

  /* ===== 语音识别（Web Speech API）+ 首页搜索 ===== */
  (function () {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognizer = null;
    var voiceActive = false;
    var activeBtn = null;
    var activeTip = null;

    function setTip(el, text) { if (el) el.textContent = text; }
    function clearActive() {
      voiceActive = false;
      if (activeBtn) activeBtn.classList.remove('rec');
    }

    function startVoice(onText, tipEl, btn) {
      if (!SR) {
        setTip(tipEl, '当前浏览器不支持语音，请直接输入');
        toast('当前浏览器不支持语音识别');
        return;
      }
      // 再次点击则停止
      if (voiceActive) {
        stopVoice();
        return;
      }
      activeBtn = btn;
      activeTip = tipEl;
      if (btn) btn.classList.add('rec');
      setTip(tipEl, '正在聆听…请说话');
      if (!recognizer) {
        recognizer = new SR();
        recognizer.lang = 'zh-CN';
        recognizer.continuous = false;
        recognizer.interimResults = true;
        recognizer.onresult = function (e) {
          var text = '';
          for (var i = e.resultIndex; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
          }
          if (onText) onText(text);
        };
        recognizer.onend = function () {
          clearActive();
          setTip(tipEl, '识别结束 ✓');
        };
        recognizer.onerror = function () {
          clearActive();
          setTip(tipEl, '未能识别，请重试');
        };
      }
      voiceActive = true;
      try { recognizer.start(); }
      catch (e) { clearActive(); setTip(tipEl, '启动失败'); }
    }

    function stopVoice() {
      if (recognizer && voiceActive) {
        try { recognizer.stop(); } catch (e) {}
      }
      clearActive();
    }

    // ---- 在线咨询：语音描述问题 ----
    var cbtn = $('#consultVoiceBtn');
    if (cbtn) {
      var ctext = $('#consultTextarea');
      var ctip = $('#consultVoiceTip');
      cbtn.addEventListener('click', function () {
        startVoice(function (text) {
          if (text && text.trim()) {
            ctext.textContent = text.trim();
            ctext.style.color = '#26322b';
          }
        }, ctip, cbtn);
      });
    }

    // ---- 首页搜索：建立索引 + 过滤 + 结果显示 ----
    var homeSearch = $('#homeSearch');
    var resBox = $('#homeSearchResults');
    var homeTip = $('#homeSearchTip');
    var micBtn = $('#homeMicBtn');

    function buildIndex() {
      var idx = [];
      (VIDEOS || []).forEach(function (v) {
        idx.push({ type: '视频', icon: '📺', title: v.title, tag: v.cat, url: 'page-law' });
      });
      (CASES || []).forEach(function (c) {
        idx.push({ type: '案例', icon: '🧩', title: c.title, tag: c.tag, url: 'page-law' });
      });
      (TEMPLATES || []).forEach(function (t) {
        idx.push({ type: '模板', icon: '📄', title: '《' + t.name + '》', tag: t.badge || '模板', url: 'page-edu' });
      });
      return idx;
    }
    var INDEX = buildIndex();

    function renderResults(list) {
      if (!resBox) return;
      resBox.style.display = 'block';
      if (!list || !list.length) {
        resBox.innerHTML = '<div class="s-empty">未找到相关内容，换个说法试试</div>';
        return;
      }
      resBox.innerHTML = list.slice(0, 10).map(function (r) {
        return '<div class="s-res-item" data-nav="' + r.url + '">' +
          '<span class="s-ico">' + r.icon + '</span>' +
          '<div class="s-info"><div class="s-title">' + r.title + '</div>' +
          '<div class="s-tag">' + r.type + ' · ' + r.tag + '</div></div>' +
          '<span class="list-arrow">›</span></div>';
      }).join('');
    }

    function doSearch(kw) {
      kw = (kw || '').trim().toLowerCase();
      if (!kw) { if (resBox) resBox.style.display = 'none'; return; }
      var hits = INDEX.filter(function (r) {
        return r.title.toLowerCase().indexOf(kw) !== -1 ||
          (r.tag || '').toLowerCase().indexOf(kw) !== -1;
      });
      renderResults(hits);
    }

    if (homeSearch) {
      homeSearch.addEventListener('input', function () { doSearch(homeSearch.value); });
      homeSearch.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); doSearch(homeSearch.value); }
      });
    }
    if (resBox) {
      resBox.addEventListener('click', function () {
        setTimeout(function () {
          resBox.style.display = 'none';
          if (homeSearch) homeSearch.value = '';
        }, 60);
      });
    }

    // ---- 首页语音搜索 ----
    if (micBtn) {
      micBtn.addEventListener('click', function () {
        startVoice(function (text) {
          var t = text ? text.trim() : '';
          if (t && homeSearch) {
            homeSearch.value = t;
            doSearch(t);
          }
        }, homeTip, micBtn);
      });
    }
  })();

  /* ===== 咨询 FAQ 自动解答 与 历史记录 ===== */
  (function () {
    var FAQS = [
      { q: '收购商赊账不还，货款怎么要？', a: '保留欠条、转账记录与微信聊天作为证据；可先与对方协商并出具书面对账单；协商不成，可向乡镇司法所申请调解，或依法向法院起诉主张货款及逾期利息。' },
      { q: '口头卖粮没合同，出了纠纷咋办？', a: '尽快补签书面合同或出具对账单固定数量、价格与结算时间；保留银行卡/微信转账流水作为交易凭证，作为纠纷应对的关键证据。' },
      { q: '流转的土地年限没写清，算不算数？', a: '土地承包经营权流转应当签署书面合同并约定明确期限、用途与价款；未写清的部分依法按国家有关规定及当地标准处理，建议补签并进行备案。' },
      { q: '打工被拖欠工钱，可以找谁？', a: '保留考勤、工资金额约定与微信聊天记录；可向当地劳动监察部门投诉，或申请人民调解、劳动仲裁，必要时依据证据主张工资报酬。' },
      { q: '买农机/农资到假货，能退吗？', a: '保留购买凭证、包装与检测结果；依据消费者权益保护法与产品质量法，经营者应承担退换与赔偿责任，可向市场监管部门投诉。' }
    ];
    var LS_KEY = 'yhhn_consult_history';

    function getHist() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch (e) { return []; } }
    function setHist(arr) { localStorage.setItem(LS_KEY, JSON.stringify(arr)); }

    function renderHist() {
      var box = document.getElementById('consultHistory');
      var clearBtn = document.getElementById('consultHistoryClear');
      if (!box) return;
      var h = getHist();
      if (h.length) {
        box.innerHTML = '<div class="history-item">' + h.map(function (it) {
          return '<div class="history-row"><div class="history-top">' +
            '<span class="history-type">' + it.type + '</span>' +
            '<span class="history-time">' + it.time + '</span></div>' +
            '<div class="history-content">' + it.content + '</div></div>';
        }).join('') + '</div>';
      } else {
        box.innerHTML = '<div class="history-empty">还没有咨询记录，提交后会自动保存在这里</div>';
      }
      if (clearBtn) clearBtn.style.display = h.length ? 'block' : 'none';
    }

    document.addEventListener('click', function (e) {
      var item = e.target.closest('.faq-item');
      if (item) {
        var f = FAQS[parseInt(item.getAttribute('data-faq'), 10)];
        if (f) {
          var tarea = document.getElementById('consultTextarea');
          if (tarea) { tarea.textContent = f.q; tarea.className = 'consult-textarea has-text'; }
          var ans = document.getElementById('consultFaqAnswer');
          var body = document.getElementById('consultFaqAnswerBody');
          if (ans && body) { body.textContent = f.a; ans.style.display = 'block'; }
          toast('已给出自动解答，可再补充提交');
        }
      }
      var sub = e.target.closest('.consult-submit');
      if (sub) {
        var ta2 = document.getElementById('consultTextarea');
        var content = ta2 ? (ta2.textContent || '').replace(/\s+/g, ' ').trim() : '';
        if (!content || content.indexOf('请简明描述') === 0) return;
        var activeChip = $('.opt-chip.active');
        recordHistory({
          time: new Date().toLocaleString('zh-CN', { hour12: false }),
          type: activeChip ? activeChip.textContent.trim() : '法律问题',
          content: content
        });
      }
    });

    function recordHistory(payload) {
      var h = getHist();
      h.unshift(payload);
      if (h.length > 10) h = h.slice(0, 10);
      setHist(h);
      renderHist();
    }

    var clearBtn = document.getElementById('consultHistoryClear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        localStorage.removeItem(LS_KEY);
        renderHist();
        toast('已清空咨询记录');
      });
    }

    renderHist();
  })();

  /* ===== 我的收藏 / 咨询记录 / 浏览历史 ===== */
  var LS_VIEW = 'yhhn_view_history';

  function favInfo(key) {
    var out = { key: key, title: '未知收藏', cat: '其他', type: 'tpl', ic: '📄' };
    if (key.indexOf('v') === 0) {
      var v = VIDEOS.filter(function (x) { return 'v' + x.id === key; })[0];
      if (v) { out.title = v.title; out.cat = v.cat; out.type = 'video'; out.ic = '📺'; }
    } else if (key.indexOf('c') === 0) {
      var c = CASES.filter(function (x) { return 'c' + x.id === key; })[0];
      if (c) { out.title = c.title; out.cat = c.tag; out.type = 'case'; out.ic = '🧩'; }
    } else {
      var t = TEMPLATES.filter(function (x) { return 'tpl' + x.name === key; })[0];
      if (t) { out.title = '《' + t.name + '》'; out.cat = '合同模板'; out.type = 'tpl'; out.ic = '📄'; }
    }
    return out;
  }

  function renderCollect(filter) {
    var keys = getFavs();
    var list = keys.map(favInfo);
    if (filter && filter !== 'all') list = list.filter(function (f) { return f.type === filter; });
    var chips = '<div class="collect-chips">' + ['all|全部', 'video|视频', 'case|案例', 'tpl|模板'].map(function (c) {
      var p = c.split('|');
      return '<span class="collect-chip ' + (filter === p[0] ? 'on' : '') + '" data-cfilter="' + p[0] + '">' + p[1] + '</span>';
    }).join('') + '</div>';
    var items = list.length
      ? list.map(function (f) {
          return '<div class="collect-item"><span class="collect-ic">' + f.ic + '</span>' +
            '<span class="collect-info"><span class="collect-title">' + f.title + '</span>' +
            '<span class="collect-cat">' + f.cat + '</span></span>' +
            '<button class="collect-del" data-cdel="' + f.key + '">移除</button></div>';
        }).join('')
      : '<div class="history-empty">还没有收藏，去普法/案例/模板页点「收藏」吧</div>';
    openSheet('我的收藏', chips + items);
    var count = document.getElementById('meCollectCount');
    if (count) count.textContent = getFavs().length;
  }

  function renderConsultHist() {
    var h = [];
    try { h = JSON.parse(localStorage.getItem('yhhn_consult_history')) || []; } catch (e) {}
    var html = h.length
      ? h.map(function (it) {
          return '<div class="history-row"><div class="history-top"><span class="history-type">' + it.type + '</span>' +
            '<span class="history-time">' + it.time + '</span></div>' +
            '<div class="history-content">' + it.content + '</div></div>';
        }).join('')
      : '<div class="history-empty">还没有咨询记录，提交咨询后会自动保存</div>';
    openSheet('咨询记录', '<div class="history-card" style="margin:0">' + html + '</div>');
  }

  function getViews() { try { return JSON.parse(localStorage.getItem(LS_VIEW)) || []; } catch (e) { return []; } }
  function setViews(arr) { localStorage.setItem(LS_VIEW, JSON.stringify(arr)); }

  function noteView(title) {
    if (!title) return;
    var skip = { '我的收藏': 1, '咨询记录': 1, '浏览历史': 1 };
    if (skip[title]) return;
    var h = getViews();
    h = h.filter(function (x) { return x.title !== title; });
    h.unshift({
      title: title,
      cat: (title.indexOf('《') === 0 || title.indexOf('合同') !== -1) ? '合同模板' : '浏览',
      time: new Date().toLocaleString('zh-CN', { hour12: false })
    });
    if (h.length > 20) h = h.slice(0, 20);
    setViews(h);
  }

  function renderViews() {
    var h = getViews();
    var html = h.length
      ? h.map(function (it) {
          return '<div class="history-row"><div class="history-top"><span class="history-type">' + it.cat + '</span>' +
            '<span class="history-time">' + it.time + '</span></div>' +
            '<div class="history-content">' + it.title + '</div></div>';
        }).join('')
      : '<div class="history-empty">还没有浏览记录，去看看普法小视频或合同模板吧</div>';
    openSheet('浏览历史', '<div class="history-card" style="margin:0">' + html + '</div>');
  }

  (function () {
    var _cfilter = 'all';

    document.addEventListener('click', function (e) {
      var c = e.target.closest('[data-collect]');
      if (c) { renderCollect(_cfilter); return; }
      var hc = e.target.closest('[data-hist-consult]');
      if (hc) { renderConsultHist(); return; }
      var hv = e.target.closest('[data-hist-browse]');
      if (hv) { renderViews(); return; }
      var cf = e.target.closest('.collect-chip');
      if (cf) { _cfilter = cf.getAttribute('data-cfilter'); renderCollect(_cfilter); return; }
      var cd = e.target.closest('[data-cdel]');
      if (cd) {
        var key = cd.getAttribute('data-cdel');
        var favs = getFavs();
        var i = favs.indexOf(key);
        if (i > -1) { favs.splice(i, 1); setFavs(favs); }
        toast('已移除收藏');
        renderCollect(_cfilter);
        bumpCollect();
      }
    });

    var count = document.getElementById('meCollectCount');
    if (count) count.textContent = getFavs().length;
  })();

  /* ===== 二级页补强：工具计算/规则详解/群提问/预约/调研历史 ===== */
  (function () {
    var RULES = [
      '电商平台开店规则：<br><br>一、入驻资质。经营主体需提供营业执照及与经营品类相符的资质（食品经营/生产许可等）。<br><br>二、保证金。按平台规则缴纳，合作终止且无违规可申请退回。<br><br>三、售后与退换。明确退换货规则、物流责任与纠纷处理时限。<br><br>四、提示：不同平台细则有差异，务必以官方公示为准，谨防非官方渠道收费。',
      '直播平台带货规范：<br><br>一、商品上架。如实填写产地、规格、保质期，禁止夸大或虚构。<br><br>二、虚假宣传。广告语须有依据，「纯天然」「包治百病」「零残留」等绝对化、无依据用语属违规高发区。<br><br>三、信用分。违规会扣信用分、限流甚至封号。<br><br>四、建议：宣传前自查用语，留档产品检测与资质证明。',
      '农产品质量安全法要点：<br><br>一、生产记录。如实记录生产与用药情况。<br><br>二、用药规范。严格执行农药安全间隔期，禁止使用禁用农药。<br><br>三、包装标识。如实标注生产日期、保质期、生产者信息，不得伪造产地与品质。<br><br>四、提示：违规生产销售可能面临罚款乃至刑事追责，务必合规经营。'
    ];

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    document.addEventListener('click', function (e) {
      var rc = e.target.closest('[data-ruleindex]');
      if (rc) {
        var n = parseInt(rc.getAttribute('data-ruleindex'), 10) || 0;
        openSheet('规则详解', '<div class="rule-detail">' + RULES[n] + '</div>');
      }
    });

    var btnInt = document.getElementById('intCalc');
    if (btnInt) btnInt.addEventListener('click', function () {
      var p = parseFloat(document.getElementById('intPrincipal').value) || 0;
      var r = parseFloat(document.getElementById('intRate').value) || 0;
      var d = parseInt(document.getElementById('intDays').value, 10) || 0;
      var out = document.getElementById('intResult');
      if (p <= 0 || d <= 0) { out.textContent = '请填写本金与逾期天数'; out.style.display = 'block'; return; }
      var interest = p * (r / 1000) * d;
      out.innerHTML = '逾期利息：<b>' + interest.toFixed(2) + '</b> 元<br>（按日利率 ' + r + '‰、逾期 ' + d + ' 天计）';
      out.style.display = 'block';
    });

    var btnY = document.getElementById('yCalc');
    if (btnY) btnY.addEventListener('click', function () {
      var a = parseFloat(document.getElementById('yArea').value) || 0;
      var per = parseFloat(document.getElementById('yPer').value) || 0;
      var price = parseFloat(document.getElementById('yPrice').value) || 0;
      var out = document.getElementById('yResult');
      if (a <= 0 || per <= 0 || price <= 0) { out.textContent = '请填写面积、亩产量与单价'; out.style.display = 'block'; return; }
      var total = a * per * price;
      out.innerHTML = '预计总收益：<b>' + total.toFixed(2) + '</b> 元<br>（' + a + ' 亩 × 亩产 ' + per + ' 斤 × 单价 ' + price + ' 元/斤）';
      out.style.display = 'block';
    });

    var groupInput = document.getElementById('groupInput');
    var groupSend = document.getElementById('groupSend');
    var groupPosted = document.getElementById('groupPosted');
    if (groupSend && groupInput) groupSend.addEventListener('click', function () {
      var t = (groupInput.value || '').trim();
      if (!t) { toast('请先输入要咨询的问题'); return; }
      var d = new Date().toLocaleString('zh-CN', { hour12: false });
      var row = '<div class="group-posted-item"><span class="history-type">已发送到群</span>' +
        '<span class="group-posted-time">' + d + '</span><div class="group-posted-text">' + esc(t) + '</div></div>';
      var first = groupPosted.querySelector('.group-posted-item');
      if (first) first.insertAdjacentHTML('beforebegin', row); else groupPosted.innerHTML = row;
      groupInput.value = '';
      toast('已发送到群，请留意老师回复');
    });

    var staffBtn = document.getElementById('staffBookBtn');
    if (staffBtn) staffBtn.addEventListener('click', function () {
      openSheet('预约上门服务',
        '<div class="bk-label">选择机构</div>' +
        '<div class="bk-chips">' +
        '<span class="bk-chip" data-bkorg="0">村干部联络点</span>' +
        '<span class="bk-chip" data-bkorg="1">高校法援师生团队</span>' +
        '</div>' +
        '<div class="bk-label">期望日期</div>' +
        '<input class="bk-input" id="bkDate" type="date" />' +
        '<div class="bk-label">您的称呼</div>' +
        '<input class="bk-input" id="bkName" placeholder="如：张大姐" maxlength="20" />' +
        '<div class="bk-label">联系电话（选填）</div>' +
        '<input class="bk-input" id="bkPhone" type="tel" placeholder="便于联系您" maxlength="11" />' +
        '<button class="primary-btn" id="bkSubmit" type="button" style="width:100%;margin-top:24px">确认预约</button>');
    });

    document.addEventListener('click', function (e) {
      var chip = e.target.closest('.bk-chip');
      if (chip) {
        $all('.bk-chip').forEach(function (x) { x.classList.remove('on'); });
        $(chip).classList.add('on');
        return;
      }
      var sub = e.target.closest('#bkSubmit');
      if (sub) {
        var orgEl = $('.bk-chips .bk-chip.on');
        if (!orgEl) { toast('请先选择要预约的机构'); return; }
        var bkNameEl = $('#bkName');
        if (!bkNameEl || !(bkNameEl.value || '').trim()) { toast('请填写您的称呼'); return; }
        closeSheet();
        toast('预约成功，工作人员将尽快联系');
      }
    });

    var sPH = {
      biz: ($('#surveyBiz') || {}).textContent || '',
      adv: ($('#surveyAdvice') || {}).textContent || ''
    };
    function ceText(el, ph) {
      if (!el) return '';
      var t = (el.textContent || '').trim();
      return (t && t !== ph) ? t : '';
    }
    function renderSurveyHist() {
      var box = document.getElementById('surveyHistory');
      if (!box) return;
      var h = []; try { h = JSON.parse(localStorage.getItem('yhhn_survey_history')) || []; } catch (x) {}
      box.innerHTML = h.length
        ? h.map(function (it) {
            return '<div class="history-row"><div class="history-top"><span class="history-type">' + esc(it.need) + '</span>' +
              '<span class="history-time">' + esc(it.time) + '</span></div><div class="history-content">' + esc(it.biz) + ' · ' + esc(it.name) + '</div></div>';
          }).join('')
        : '<div class="history-empty">还没有提交过需求反馈，提交后会自动保存在这里</div>';
      var clr = document.getElementById('surveyHistoryClear');
      if (clr) clr.style.display = h.length ? 'block' : 'none';
    }
    var sSubmit = document.getElementById('surveySubmit');
    if (sSubmit) sSubmit.addEventListener('click', function () {
      var chips = $all('#page-survey .form-card .opt-chip.active');
      if (!chips.length) { toast('请至少选择一项需求'); return; }
      var need = chips.map(function (c) { return c.textContent.trim(); }).join('、');
      var biz = ceText($('#surveyBiz'), sPH.biz) || '未填写';
      var nameEl = $('#surveyName');
      var name = (nameEl && nameEl.value.trim()) || '匿名';
      var item = {
        need: need, biz: biz, name: name,
        time: new Date().toLocaleString('zh-CN', { hour12: false })
      };
      var h = []; try { h = JSON.parse(localStorage.getItem('yhhn_survey_history')) || []; } catch (x) {}
      h.unshift(item); if (h.length > 10) h = h.slice(0, 10);
      localStorage.setItem('yhhn_survey_history', JSON.stringify(h));
      renderSurveyHist();
      chips.forEach(function (c) { c.classList.remove('active'); });
      if ($('#surveyName')) $('#surveyName').value = '';
      if ($('#surveyPhone')) $('#surveyPhone').value = '';
      if ($('#surveyBiz')) $('#surveyBiz').textContent = sPH.biz;
      if ($('#surveyAdvice')) $('#surveyAdvice').textContent = sPH.adv;
      toast('反馈已提交，感谢参与');
    });
    var sClr = document.getElementById('surveyHistoryClear');
    if (sClr && sClr.addEventListener) sClr.addEventListener('click', function () {
      localStorage.removeItem('yhhn_survey_history');
      renderSurveyHist();
      toast('已清空反馈记录');
    });
    renderSurveyHist();
  })();

})();
