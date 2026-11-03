window.__ModuleLoader__.load({
  id: '@local/coze-flow-generator',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    let styles = null;
    try { styles = require('styles'); } catch (e) { styles = null; }

    // ------------------------------------------------------------------
    // 行业工作流模板库（32 个行业，6 大类）
    // node: [type, 名称, 说明]
    // type: start | end | llm | plugin | code | cond | loop | kb
    // ------------------------------------------------------------------
    const N = {
      start: { label: '开始', color: '#22a06b' },
      end: { label: '结束', color: '#8a8f98' },
      llm: { label: '大模型', color: '#4f6ef7' },
      plugin: { label: '插件', color: '#9256d9' },
      code: { label: '代码', color: '#d97a1f' },
      cond: { label: '条件', color: '#c9a30f' },
      loop: { label: '循环', color: '#0f9aa3' },
      kb: { label: '知识库', color: '#4b5bd7' },
    };

    const WORKFLOWS = [
      { id: 'ecom', group: '零售贸易', name: '电商客服工作流', desc: '订单查询、退换货、物流跟进与售前咨询', nodes: [
        ['start', '开始', '接收用户消息与订单号（可选）'],
        ['cond', '意图判断', '区分：订单查询 / 退换货 / 物流 / 售前'],
        ['plugin', '订单查询插件', '按订单号拉取订单状态与物流轨迹'],
        ['llm', '客服应答生成', '结合政策知识库生成安抚性与解决方案话术'],
        ['cond', '是否需人工', '退款纠纷或情绪激烈时转人工'],
        ['end', '结束', '输出回复并记录工单'],
      ]},
      { id: 'cross', group: '零售贸易', name: '跨境电商工作流', desc: '平台规则问答、选品思路与物流收款流程', nodes: [
        ['start', '开始', '接收平台（Amazon/Shopee 等）与问题'],
        ['kb', '平台规则检索', '检索目标平台最新规则与费率'],
        ['llm', '方案生成', '输出选品、Listing、物流与收款建议'],
        ['code', '汇率换算', '按实时汇率换算成本与利润率'],
        ['end', '结束', '输出结构化运营建议卡'],
      ]},
      { id: 'second', group: '零售贸易', name: '二手交易工作流', desc: '定价思路、防骗要点与验货清单', nodes: [
        ['start', '开始', '接收品类、成色描述与期望价'],
        ['plugin', '行情查询', '抓取同款在售/成交价分布'],
        ['llm', '定价建议', '给出挂牌价区间与议价空间'],
        ['llm', '风险提示', '生成该品类常见骗局与验货清单'],
        ['end', '结束', '输出定价卡 + 防坑清单'],
      ]},
      { id: 'luxury', group: '零售贸易', name: '奢侈品管家工作流', desc: '名表名包养护、真伪鉴别要点与选购思路', nodes: [
        ['start', '开始', '接收品牌、型号、诉求'],
        ['kb', '品牌知识检索', '检索品牌型号库与养护手册'],
        ['llm', '鉴别要点生成', '输出该型号真伪鉴别关键点位'],
        ['llm', '养护方案', '生成保养周期与存放建议'],
        ['end', '结束', '输出管家建议报告'],
      ]},
      { id: 'travel', group: '生活服务', name: '旅行规划工作流', desc: '定制行程、交通住宿与预算规划', nodes: [
        ['start', '开始', '接收目的地、天数、预算与偏好'],
        ['plugin', '天气与机票查询', '查询目的地天气与往返票价'],
        ['plugin', '景点兴趣点检索', '拉取景点、美食与开放时间'],
        ['llm', '行程编排', '按天生成路线并估算预算'],
        ['cond', '预算校验', '超出预算时降级住宿/交通档位重排'],
        ['end', '结束', '输出逐日行程表与预算表'],
      ]},
      { id: 'food', group: '生活服务', name: '美食菜谱工作流', desc: '家常菜谱、宴客菜单与烹饪技巧答疑', nodes: [
        ['start', '开始', '接收食材、人数与场合'],
        ['llm', '菜单设计', '生成荤素搭配菜单与份量'],
        ['kb', '菜谱检索', '检索对应菜谱步骤与火候'],
        ['code', '用量换算', '按人数换算配料用量'],
        ['end', '结束', '输出购物清单 + 分步菜谱'],
      ]},
      { id: 'pet', group: '生活服务', name: '宠物养护工作流', desc: '喂养、行为训练与就医引导', nodes: [
        ['start', '开始', '接收宠物种类、年龄与症状/行为'],
        ['cond', '紧急判断', '出现急症关键词时直接引导就医'],
        ['kb', '养护知识检索', '检索品种习性、喂养与训练方法'],
        ['llm', '方案生成', '输出喂养计划或行为矫正步骤'],
        ['end', '结束', '输出养护建议与就医提醒'],
      ]},
      { id: 'wedding', group: '生活服务', name: '婚礼策划工作流', desc: '婚礼流程、预算、场地与备婚时间线', nodes: [
        ['start', '开始', '接收婚期、城市、预算与风格'],
        ['plugin', '场地与档期查询', '查询酒店/草坪场地与均价'],
        ['llm', '方案生成', '生成主题、流程与分工表'],
        ['code', '预算分配', '按比例拆分四大金刚/场地/布置预算'],
        ['end', '结束', '输出备婚甘特线 + 预算表'],
      ]},
      { id: 'interior', group: '生活服务', name: '家装设计工作流', desc: '风格选择、布局建议、预算与避坑清单', nodes: [
        ['start', '开始', '接收户型、面积、人口与预算'],
        ['llm', '风格匹配', '推荐 2-3 套风格与配色方案'],
        ['llm', '布局建议', '给出动线与收纳改造要点'],
        ['code', '预算拆分', '按硬装/主材/软装/家电拆分'],
        ['end', '结束', '输出方案卡 + 避坑清单'],
      ]},
      { id: 'edu', group: '教育成长', name: 'K12 学科辅导工作流', desc: '数理化英答疑、知识点讲解与错题分析', nodes: [
        ['start', '开始', '接收学科、年级与题目/错题'],
        ['llm', '解题与讲解', '分步解题并讲解涉及知识点'],
        ['kb', '考点知识库', '检索考纲考点与常见陷阱'],
        ['code', '错题归因', '统计错题类型并定位薄弱点'],
        ['loop', '举一反三', '生成同考点变式题循环练习'],
        ['end', '结束', '输出讲解 + 练习集'],
      ]},
      { id: 'study', group: '教育成长', name: '留学申请工作流', desc: '选校定位、时间线、文书思路与签证流程', nodes: [
        ['start', '开始', '接收本科院校、GPA、语言与目标国家'],
        ['plugin', '院校数据查询', '拉取院校录取均分与截止日期'],
        ['llm', '选校定位', '生成冲/稳/保三档选校清单'],
        ['llm', '文书思路', '按专业生成文书主线与素材清单'],
        ['end', '结束', '输出申请时间线 + 文书提纲'],
      ]},
      { id: 'music', group: '教育成长', name: '音乐启蒙工作流', desc: '乐器入门路径、乐理科普与考级规划', nodes: [
        ['start', '开始', '接收年龄、兴趣乐器与基础'],
        ['llm', '路径规划', '推荐乐器与入门学习路径'],
        ['kb', '乐理知识库', '检索乐理知识点与练习曲'],
        ['code', '练习计划', '生成每周练习时长与曲目安排'],
        ['end', '结束', '输出学习路径 + 考级规划表'],
      ]},
      { id: 'career', group: '教育成长', name: '职场成长工作流', desc: '职业规划、简历面试与晋升策略', nodes: [
        ['start', '开始', '接收岗位、年限与目标'],
        ['llm', '现状诊断', '分析竞争力与能力缺口'],
        ['plugin', '岗位行情查询', '拉取目标岗位 JD 与薪资分布'],
        ['llm', '成长路线', '输出技能补齐与晋升策略'],
        ['end', '结束', '输出 6-12 个月行动计划'],
      ]},
      { id: 'legal', group: '专业服务', name: '法律咨询工作流', desc: '婚姻家事、劳动纠纷、合同审查解答', nodes: [
        ['start', '开始', '接收案情描述与证据材料'],
        ['cond', '风险分级', '涉诉讼时效或重大财产时提示紧急'],
        ['kb', '法条检索', '检索相关法条与同类判例'],
        ['llm', '意见生成', '输出法律分析、维权路径与文书要点'],
        ['end', '结束', '输出咨询意见（附免责声明）'],
      ]},
      { id: 'tax', group: '专业服务', name: '财税记账工作流', desc: '个税社保问答、记账报税流程与发票规范', nodes: [
        ['start', '开始', '接收纳税人类型与问题'],
        ['plugin', '税率政策查询', '查询最新税率、起征点与优惠政策'],
        ['code', '税额试算', '按收入结构试算个税/增值税'],
        ['llm', '流程指引', '生成申报步骤与发票合规要点'],
        ['end', '结束', '输出计算结果 + 操作指引'],
      ]},
      { id: 'ins', group: '专业服务', name: '保险规划工作流', desc: '险种科普、家庭保障方案与条款解读', nodes: [
        ['start', '开始', '接收家庭成员、收入与既有保单'],
        ['llm', '缺口分析', '识别寿险/重疾/医疗/意外缺口'],
        ['kb', '产品条款库', '检索候选产品条款与免责项'],
        ['code', '保费测算', '按年龄性别测算年保费与保额'],
        ['end', '结束', '输出家庭保障方案表'],
      ]},
      { id: 'fin', group: '专业服务', name: '理财知识工作流', desc: '理财科普、资产配置思路与知识问答', nodes: [
        ['start', '开始', '接收风险偏好、期限与资金规模'],
        ['llm', '风险画像', '评估风险承受等级'],
        ['code', '配置计算', '按股债比例生成配置方案'],
        ['cond', '合规校验', '过滤具体荐股与收益承诺表述'],
        ['end', '结束', '输出教育性配置思路（非投资建议）'],
      ]},
      { id: 'estate', group: '专业服务', name: '购房顾问工作流', desc: '政策解读、区域分析、贷款计算与看房要点', nodes: [
        ['start', '开始', '接收城市、预算、购房资格情况'],
        ['plugin', '政策查询', '查询限购、利率与税费政策'],
        ['code', '贷款试算', '计算月供、利息与首付方案'],
        ['llm', '区域与看房建议', '输出区域对比与看房核查清单'],
        ['end', '结束', '输出购房决策报告'],
      ]},
      { id: 'auto', group: '专业服务', name: '买车用车工作流', desc: '选车对比、养护、保险与过户流程', nodes: [
        ['start', '开始', '接收预算、用途与候选车型'],
        ['plugin', '车型参数查询', '拉取车型参数、口碑与保值率'],
        ['llm', '对比分析', '生成多车对比表与推荐结论'],
        ['code', '养车成本', '估算保险、油/电与保养年成本'],
        ['end', '结束', '输出选车报告 + 用车成本表'],
      ]},
      { id: 'hr', group: '专业服务', name: 'HR 智能助手工作流', desc: '简历优化、面试准备与劳动法规问答', nodes: [
        ['start', '开始', '接收简历/JD 或劳动纠纷问题'],
        ['cond', '分支路由', '简历优化 / 面试准备 / 法规问答'],
        ['llm', '简历优化', '按 JD 关键词改写经历与量化成果'],
        ['kb', '法规检索', '检索劳动法条文与地方规定'],
        ['end', '结束', '输出优化简历或问答结论'],
      ]},
      { id: 'health', group: '医疗健康', name: '健康生活工作流', desc: '健康科普、体检报告解读建议与就医引导', nodes: [
        ['start', '开始', '接收健康问题或体检指标'],
        ['cond', '红线筛查', '危急值关键词触发立即就医提示'],
        ['kb', '医学知识库', '检索指标含义与科室归属'],
        ['llm', '解读生成', '通俗解读指标并给出生活建议'],
        ['end', '结束', '输出解读报告（非诊断，附就医科室）'],
      ]},
      { id: 'psych', group: '医疗健康', name: '心理陪伴工作流', desc: '情绪疏导、压力管理与倾听陪伴', nodes: [
        ['start', '开始', '接收情绪表达'],
        ['cond', '危机识别', '识别自伤/伤人风险并给出热线'],
        ['llm', '共情回应', '倾听式回应与情绪命名'],
        ['kb', '自助方法库', '推荐呼吸、书写等自助练习'],
        ['end', '结束', '输出陪伴回应 + 专业求助指引'],
      ]},
      { id: 'fitness', group: '医疗健康', name: '健身教练工作流', desc: '训练计划、动作讲解与饮食搭配', nodes: [
        ['start', '开始', '接收目标、体能水平与场地器械'],
        ['llm', '计划生成', '按周期化生成每周训练安排'],
        ['kb', '动作库检索', '检索动作要领与常见错误'],
        ['code', '热量计算', '计算 TDEE 并生成饮食宏量分配'],
        ['end', '结束', '输出训练表 + 饮食方案'],
      ]},
      { id: 'senior', group: '医疗健康', name: '养老照护工作流', desc: '日常照护、适老化改造、政策与机构选择', nodes: [
        ['start', '开始', '接收老人身体状况与家庭诉求'],
        ['kb', '政策检索', '检索当地养老补贴与长护险政策'],
        ['llm', '照护方案', '生成日常照护与安全注意事项'],
        ['llm', '机构筛选', '给出养老机构考察评估清单'],
        ['end', '结束', '输出照护指引 + 政策要点'],
      ]},
      { id: 'mom', group: '医疗健康', name: '科学育儿工作流', desc: '婴幼儿喂养、睡眠引导、护理与早教建议', nodes: [
        ['start', '开始', '接收宝宝月龄与问题'],
        ['cond', '就医判断', '发热/拒奶等红旗症状引导就医'],
        ['kb', '育儿知识库', '检索月龄发育里程碑与护理指南'],
        ['llm', '建议生成', '输出喂养/睡眠/早教月龄方案'],
        ['end', '结束', '输出分月龄育儿建议'],
      ]},
      { id: 'dev', group: '产业运营', name: '编程开发工作流', desc: '代码答疑、Bug 定位、代码审查与最佳实践', nodes: [
        ['start', '开始', '接收代码片段与报错信息'],
        ['llm', '问题定位', '分析根因并给出最小修复'],
        ['code', '片段验证', '构造测试用例验证修复逻辑'],
        ['llm', '审查建议', '输出规范、性能与安全改进点'],
        ['end', '结束', '输出修复代码 + 审查报告'],
      ]},
      { id: 'media', group: '产业运营', name: '新媒体爆款工作流', desc: '小红书/抖音/公众号选题与文案创作', nodes: [
        ['start', '开始', '接收赛道、平台与目标人群'],
        ['plugin', '热点抓取', '抓取平台热搜与对标账号选题'],
        ['llm', '选题生成', '批量生成标题与选题角度'],
        ['llm', '文案创作', '按平台风格生成正文与标签'],
        ['loop', '多平台改写', '循环改写适配不同平台'],
        ['end', '结束', '输出选题库 + 平台文案包'],
      ]},
      { id: 'news', group: '产业运营', name: '新闻解读工作流', desc: '热点新闻五段式深度解读', nodes: [
        ['start', '开始', '接收新闻链接或关键词'],
        ['plugin', '资讯抓取', '抓取多源报道与时间线'],
        ['llm', '核心概括', '提炼事件脉络与关键事实'],
        ['kb', '背景知识检索', '检索政策与行业背景'],
        ['llm', '影响分析', '输出影响分析与理性提醒'],
        ['end', '结束', '输出五段式解读文章'],
      ]},
      { id: 'game', group: '产业运营', name: '游戏上分工作流', desc: '版本理解、英雄攻略与上分思路', nodes: [
        ['start', '开始', '接收游戏、段位与本命英雄'],
        ['plugin', '版本数据查询', '拉取当前版本强度榜与改动'],
        ['llm', '攻略生成', '输出出装、对线与运营思路'],
        ['llm', '复盘建议', '根据对局描述给出改进点'],
        ['end', '结束', '输出版本攻略卡'],
      ]},
      { id: 'agri', group: '产业运营', name: '农技服务工作流', desc: '种植管理、病虫害识别与农事建议', nodes: [
        ['start', '开始', '接收作物、生育期与症状照片/描述'],
        ['plugin', '气象查询', '查询未来一周农事气象'],
        ['kb', '植保知识库', '检索病虫害特征与防治方案'],
        ['llm', '诊断思路', '给出疑似病害与用药/农事建议'],
        ['end', '结束', '输出农事指导单'],
      ]},
      { id: 'logi', group: '产业运营', name: '物流快递管家工作流', desc: '快递查询指引、运费说明与理赔协助', nodes: [
        ['start', '开始', '接收运单号与诉求'],
        ['plugin', '物流轨迹查询', '查询各承运商轨迹与时效'],
        ['cond', '异常判断', '滞留/丢件触发理赔流程'],
        ['llm', '理赔指引', '生成理赔材料清单与话术'],
        ['end', '结束', '输出物流状态 + 解决路径'],
      ]},
      { id: 'gov', group: '产业运营', name: '政务服务工作流', desc: '社保、公积金、证件办理流程指引', nodes: [
        ['start', '开始', '接收事项类型与所在城市'],
        ['plugin', '政务信息查询', '查询办理条件、材料与网点'],
        ['kb', '政策知识库', '检索最新社保公积金政策'],
        ['llm', '流程指引', '生成办理步骤与材料清单'],
        ['end', '结束', '输出办事指南卡'],
      ]},
    ];

    const GROUPS = ['零售贸易', '生活服务', '教育成长', '专业服务', '医疗健康', '产业运营'];

    // ------------------------------------------------------------------
    // YAML 生成
    // ------------------------------------------------------------------
    function toYaml(w) {
      const lines = [];
      lines.push('# Coze 工作流设计稿 - 由 DSH 插件 Coze 工作流生成器 生成');
      lines.push('# 用法：在 Coze 工作流画布中按节点清单搭建，或作为导入/核对参考');
      lines.push('name: ' + w.name);
      lines.push('description: ' + w.desc);
      lines.push('industry: ' + w.group);
      lines.push('nodes:');
      w.nodes.forEach((nd, i) => {
        const t = N[nd[0]];
        lines.push('  - id: node_' + (i + 1));
        lines.push('    type: ' + nd[0]);
        lines.push('    title: ' + nd[1]);
        lines.push('    desc: ' + nd[2]);
        if (i > 0) lines.push('    from: node_' + i);
      });
      lines.push('edges:');
      for (let i = 1; i < w.nodes.length; i++) {
        lines.push('  - {from: node_' + i + ', to: node_' + (i + 1) + '}');
      }
      return lines.join('\n');
    }

    // ------------------------------------------------------------------
    // 样式（仅使用 --dsw-alias-* 主题令牌）
    // ------------------------------------------------------------------
    const CSS = `
.cfg-wrap { border-top: 1px solid var(--dsw-alias-border-l1); margin-top: 8px; }
.cfg-wrap.cfg-collapsed { border-top: none; margin-top: 0; display: flex; justify-content: flex-end; }
.cfg-pill { border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-secondary);
  border-radius: 999px; width: 26px; height: 26px; font-size: 13px; line-height: 1; cursor: pointer; opacity: .55; }
.cfg-pill:hover { opacity: 1; border-color: var(--dsw-alias-brand-primary); }
.cfg-bar { display: flex; align-items: center; gap: 8px; padding: 8px 4px; }
.cfg-bar-title { font-size: 12px; color: var(--dsw-alias-label-secondary); display: flex; align-items: center; gap: 6px; }
.cfg-toggle { border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary);
  border-radius: 8px; padding: 3px 10px; font-size: 12px; cursor: pointer; }
.cfg-toggle:hover { background: var(--dsw-alias-bg-layer-2); }
.cfg-panel { background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px;
  padding: 12px; max-height: 420px; overflow: auto; }
.cfg-toolbar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 10px; }
.cfg-search { border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary);
  border-radius: 8px; padding: 4px 10px; font-size: 12px; width: 180px; outline: none; }
.cfg-chip { border: 1px solid var(--dsw-alias-border-l1); background: transparent; color: var(--dsw-alias-label-secondary);
  border-radius: 999px; padding: 2px 10px; font-size: 12px; cursor: pointer; }
.cfg-chip.active { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); font-weight: 600; }
.cfg-count { font-size: 11px; color: var(--dsw-alias-label-secondary); margin-left: auto; }
.cfg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 8px; }
.cfg-card { text-align: left; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary);
  border-radius: 10px; padding: 8px 10px; cursor: pointer; display: flex; flex-direction: column; gap: 2px; }
.cfg-card:hover { border-color: var(--dsw-alias-brand-primary); }
.cfg-card.active { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-bg-layer-2); }
.cfg-card-name { font-size: 13px; font-weight: 600; }
.cfg-card-desc { font-size: 11px; color: var(--dsw-alias-label-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.cfg-card-meta { font-size: 10px; color: var(--dsw-alias-label-secondary); margin-top: 2px; }
.cfg-detail { margin-top: 12px; border-top: 1px dashed var(--dsw-alias-border-l1); padding-top: 10px; }
.cfg-detail-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cfg-detail-title { font-size: 14px; font-weight: 700; color: var(--dsw-alias-label-primary); }
.cfg-detail-group { font-size: 11px; color: var(--dsw-alias-brand-primary); border: 1px solid var(--dsw-alias-brand-primary);
  border-radius: 999px; padding: 1px 8px; }
.cfg-detail-desc { font-size: 12px; color: var(--dsw-alias-label-secondary); margin: 4px 0 8px; }
.cfg-flow { display: flex; flex-direction: column; gap: 0; margin-bottom: 10px; }
.cfg-node { display: flex; gap: 10px; align-items: flex-start; }
.cfg-node-main { display: flex; gap: 8px; align-items: flex-start; padding: 6px 8px; border-radius: 8px; background: var(--dsw-alias-bg-base);
  border: 1px solid var(--dsw-alias-border-l1); flex: 1; }
.cfg-badge { font-size: 10px; color: #fff; border-radius: 4px; padding: 2px 6px; white-space: nowrap; font-weight: 600; }
.cfg-node-name { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary); }
.cfg-node-desc { font-size: 11px; color: var(--dsw-alias-label-secondary); }
.cfg-arrow { width: 14px; display: flex; justify-content: center; color: var(--dsw-alias-label-secondary); font-size: 10px; padding: 1px 0; }
.cfg-actions { display: flex; gap: 8px; margin-bottom: 8px; }
.cfg-btn { border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary);
  border-radius: 8px; padding: 4px 12px; font-size: 12px; cursor: pointer; }
.cfg-btn.primary { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.cfg-yaml { background: var(--dsw-alias-bg-base); border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  padding: 10px; font-family: ui-monospace, Consolas, monospace; font-size: 11px; line-height: 1.5;
  color: var(--dsw-alias-label-primary); white-space: pre-wrap; max-height: 220px; overflow: auto; }
.cfg-back { border: none; background: transparent; color: var(--dsw-alias-brand-primary); font-size: 12px; cursor: pointer; padding: 0; }
`;

    // ------------------------------------------------------------------
    // 组件
    // ------------------------------------------------------------------
    function Panel() {
      const [open, setOpen] = React.useState(() => {
        try { return localStorage.getItem('coze-flow-generator-open') === '1'; } catch (e) { return false; }
      });
      const [group, setGroup] = React.useState('全部');
      const [q, setQ] = React.useState('');
      const [sel, setSel] = React.useState(null);
      const [copied, setCopied] = React.useState(false);

      function setOpenPersist(next) {
        setOpen(next);
        try { localStorage.setItem('coze-flow-generator-open', next ? '1' : '0'); } catch (e) {}
      }

      const list = WORKFLOWS.filter((w) =>
        (group === '全部' || w.group === group) &&
        (!q || w.name.includes(q) || w.desc.includes(q) || w.group.includes(q)));

      function copyYaml() {
        const text = toYaml(sel);
        const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1500); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
        } else fallbackCopy(text, done);
      }
      function fallbackCopy(text, done) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
      function downloadYaml() {
        const blob = new Blob([toYaml(sel)], { type: 'text/yaml;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = sel.id + '-workflow.yaml';
        a.click(); URL.revokeObjectURL(a.href);
      }

      if (!open) {
        return h('div', { className: 'cfg-wrap cfg-collapsed' },
          h('button', { className: 'cfg-pill', title: 'Coze 工作流生成器',
            onClick: () => setOpenPersist(true) }, '🧩'));
      }

      return h('div', { className: 'cfg-wrap' },
        h('div', { className: 'cfg-bar' },
          h('span', { className: 'cfg-bar-title' }, '🧩 Coze 工作流生成器 · 32 个行业模板'),
          h('button', { className: 'cfg-toggle', onClick: () => setOpenPersist(false) }, '收起 ▲')),
        open && h('div', { className: 'cfg-panel' },
          h('div', { className: 'cfg-toolbar' },
            h('input', { className: 'cfg-search', placeholder: '搜索行业或场景…', value: q,
              onChange: (e) => setQ(e.target.value) }),
            ['全部'].concat(GROUPS).map((g) =>
              h('button', { key: g, className: 'cfg-chip' + (group === g ? ' active' : ''),
                onClick: () => { setGroup(g); setSel(null); } }, g)),
            h('span', { className: 'cfg-count' }, list.length + ' 个行业工作流')),
          !sel && h('div', { className: 'cfg-grid' },
            list.map((w) => h('button', { key: w.id, className: 'cfg-card', onClick: () => setSel(w) },
              h('span', { className: 'cfg-card-name' }, w.name),
              h('span', { className: 'cfg-card-desc' }, w.desc),
              h('span', { className: 'cfg-card-meta' }, w.group + ' · ' + w.nodes.length + ' 节点')))),
          sel && h('div', { className: 'cfg-detail' },
            h('div', { className: 'cfg-detail-head' },
              h('button', { className: 'cfg-back', onClick: () => setSel(null) }, '← 返回列表'),
              h('span', { className: 'cfg-detail-title' }, sel.name),
              h('span', { className: 'cfg-detail-group' }, sel.group)),
            h('div', { className: 'cfg-detail-desc' }, sel.desc + ' ｜ 共 ' + sel.nodes.length + ' 个节点，流程如下：'),
            h('div', { className: 'cfg-flow' },
              sel.nodes.map((nd, i) => {
                const t = N[nd[0]];
                return h('div', { key: i, className: 'cfg-node' },
                  h('div', { className: 'cfg-node-main' },
                    h('span', { className: 'cfg-badge', style: { background: t.color } }, t.label),
                    h('div', null,
                      h('div', { className: 'cfg-node-name' }, (i + 1) + '. ' + nd[1]),
                      h('div', { className: 'cfg-node-desc' }, nd[2]))),
                  h('div', { className: 'cfg-arrow' + (i < sel.nodes.length - 1 ? '' : ' hidden') }, '↓'));
              })),
            h('div', { className: 'cfg-actions' },
              h('button', { className: 'cfg-btn primary', onClick: copyYaml }, copied ? '✓ 已复制' : '复制 YAML'),
              h('button', { className: 'cfg-btn', onClick: downloadYaml }, '下载 .yaml')),
            h('pre', { className: 'cfg-yaml' }, toYaml(sel)))));
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        const disposeCss = styles ? styles.insert(CSS) : null;
        ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
          name: 'conversation.input.dock', id: 'coze-flow-generator', order: 3,
          label: 'Coze Workflow Generator',
        }, Panel));
        return () => { if (disposeCss) disposeCss(); };
      },
    };
  },
});
