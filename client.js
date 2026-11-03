window.__ModuleLoader__.load({
  id: '@local/coze-flow-generator',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    let styles = null;
    try { styles = require('styles'); } catch (e) { styles = null; }

    // ------------------------------------------------------------------
    // 行业工作流模板库（32 个行业，6 大类）
    // node: [type, 名称, 说明]  type: start|end|llm|plugin|code|cond|loop|kb
    // tips: 该行业搭建时的专属注意事项
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
      { id: 'ecom', group: '零售贸易', name: '电商客服工作流', desc: '订单查询、退换货、物流跟进与售前咨询', tips: ['订单插件需店铺授权后才能返回真实数据，无授权时在提示词里让模型请用户提供订单号并致歉'], nodes: [
        ['start', '开始', '接收用户消息与订单号（可选）'],
        ['cond', '意图判断', '区分：订单查询 / 退换货 / 物流 / 售前'],
        ['plugin', '订单查询插件', '按订单号拉取订单状态与物流轨迹'],
        ['llm', '客服应答生成', '结合政策知识库生成安抚性与解决方案话术'],
        ['cond', '是否需人工', '退款纠纷或情绪激烈时转人工'],
        ['end', '结束', '输出回复并记录工单'],
      ]},
      { id: 'cross', group: '零售贸易', name: '跨境电商工作流', desc: '平台规则问答、选品思路与物流收款流程', tips: ['平台规则时效性强，知识库文档要标注更新日期，提示词要求模型注明“依据截止X日规则”'], nodes: [
        ['start', '开始', '接收平台（Amazon/Shopee 等）与问题'],
        ['kb', '平台规则检索', '检索目标平台最新规则与费率'],
        ['llm', '方案生成', '输出选品、Listing、物流与收款建议'],
        ['code', '汇率换算', '按实时汇率换算成本与利润率'],
        ['end', '结束', '输出结构化运营建议卡'],
      ]},
      { id: 'second', group: '零售贸易', name: '二手交易工作流', desc: '定价思路、防骗要点与验货清单', tips: [], nodes: [
        ['start', '开始', '接收品类、成色描述与期望价'],
        ['plugin', '行情查询', '抓取同款在售/成交价分布'],
        ['llm', '定价建议', '给出挂牌价区间与议价空间'],
        ['llm', '风险提示', '生成该品类常见骗局与验货清单'],
        ['end', '结束', '输出定价卡 + 防坑清单'],
      ]},
      { id: 'luxury', group: '零售贸易', name: '奢侈品管家工作流', desc: '名表名包养护、真伪鉴别要点与选购思路', tips: ['提示词必须注明“鉴别要点仅供参考，权威鉴定请送官方售后”'], nodes: [
        ['start', '开始', '接收品牌、型号、诉求'],
        ['kb', '品牌知识检索', '检索品牌型号库与养护手册'],
        ['llm', '鉴别要点生成', '输出该型号真伪鉴别关键点位'],
        ['llm', '养护方案', '生成保养周期与存放建议'],
        ['end', '结束', '输出管家建议报告'],
      ]},
      { id: 'travel', group: '生活服务', name: '旅行规划工作流', desc: '定制行程、交通住宿与预算规划', tips: ['预算校验分支：条件器判断代码输出的总额是否大于用户预算，超了走“降级重排”LLM 节点再回到行程编排'], nodes: [
        ['start', '开始', '接收目的地、天数、预算与偏好'],
        ['plugin', '天气与机票查询', '查询目的地天气与往返票价'],
        ['plugin', '景点兴趣点检索', '拉取景点、美食与开放时间'],
        ['llm', '行程编排', '按天生成路线并估算预算'],
        ['cond', '预算校验', '超出预算时降级住宿/交通档位重排'],
        ['end', '结束', '输出逐日行程表与预算表'],
      ]},
      { id: 'food', group: '生活服务', name: '美食菜谱工作流', desc: '家常菜谱、宴客菜单与烹饪技巧答疑', tips: [], nodes: [
        ['start', '开始', '接收食材、人数与场合'],
        ['llm', '菜单设计', '生成荤素搭配菜单与份量'],
        ['kb', '菜谱检索', '检索对应菜谱步骤与火候'],
        ['code', '用量换算', '按人数换算配料用量'],
        ['end', '结束', '输出购物清单 + 分步菜谱'],
      ]},
      { id: 'pet', group: '生活服务', name: '宠物养护工作流', desc: '喂养、行为训练与就医引导', tips: ['急症关键词表写在条件器里：吐血、抽搐、误食、呼吸困难等，命中直接跳转就医提示，不再走后面的节点'], nodes: [
        ['start', '开始', '接收宠物种类、年龄与症状/行为'],
        ['cond', '紧急判断', '出现急症关键词时直接引导就医'],
        ['kb', '养护知识检索', '检索品种习性、喂养与训练方法'],
        ['llm', '方案生成', '输出喂养计划或行为矫正步骤'],
        ['end', '结束', '输出养护建议与就医提醒'],
      ]},
      { id: 'wedding', group: '生活服务', name: '婚礼策划工作流', desc: '婚礼流程、预算、场地与备婚时间线', tips: [], nodes: [
        ['start', '开始', '接收婚期、城市、预算与风格'],
        ['plugin', '场地与档期查询', '查询酒店/草坪场地与均价'],
        ['llm', '方案生成', '生成主题、流程与分工表'],
        ['code', '预算分配', '按比例拆分四大金刚/场地/布置预算'],
        ['end', '结束', '输出备婚甘特线 + 预算表'],
      ]},
      { id: 'interior', group: '生活服务', name: '家装设计工作流', desc: '风格选择、布局建议、预算与避坑清单', tips: [], nodes: [
        ['start', '开始', '接收户型、面积、人口与预算'],
        ['llm', '风格匹配', '推荐 2-3 套风格与配色方案'],
        ['llm', '布局建议', '给出动线与收纳改造要点'],
        ['code', '预算拆分', '按硬装/主材/软装/家电拆分'],
        ['end', '结束', '输出方案卡 + 避坑清单'],
      ]},
      { id: 'edu', group: '教育成长', name: 'K12 学科辅导工作流', desc: '数理化英答疑、知识点讲解与错题分析', tips: ['举一反三用循环节点：循环体里放一个“生成1道同考点变式题”LLM，循环次数设 3，输出自动拼成数组'], nodes: [
        ['start', '开始', '接收学科、年级与题目/错题'],
        ['llm', '解题与讲解', '分步解题并讲解涉及知识点'],
        ['kb', '考点知识库', '检索考纲考点与常见陷阱'],
        ['code', '错题归因', '统计错题类型并定位薄弱点'],
        ['loop', '举一反三', '生成同考点变式题循环练习'],
        ['end', '结束', '输出讲解 + 练习集'],
      ]},
      { id: 'study', group: '教育成长', name: '留学申请工作流', desc: '选校定位、时间线、文书思路与签证流程', tips: [], nodes: [
        ['start', '开始', '接收本科院校、GPA、语言与目标国家'],
        ['plugin', '院校数据查询', '拉取院校录取均分与截止日期'],
        ['llm', '选校定位', '生成冲/稳/保三档选校清单'],
        ['llm', '文书思路', '按专业生成文书主线与素材清单'],
        ['end', '结束', '输出申请时间线 + 文书提纲'],
      ]},
      { id: 'music', group: '教育成长', name: '音乐启蒙工作流', desc: '乐器入门路径、乐理科普与考级规划', tips: ['每次时长按年龄硬性约束写进提示词：≤8岁20-30分钟，9-12岁30-45分钟，避免模型给出超量练习'], nodes: [
        ['start', '开始', '接收年龄、兴趣乐器与基础'],
        ['llm', '路径规划', '推荐乐器与入门学习路径'],
        ['kb', '乐理知识库', '检索乐理知识点与练习曲'],
        ['code', '练习计划', '生成每周练习时长与曲目安排'],
        ['end', '结束', '输出学习路径 + 考级规划表'],
      ]},
      { id: 'career', group: '教育成长', name: '职场成长工作流', desc: '职业规划、简历面试与晋升策略', tips: [], nodes: [
        ['start', '开始', '接收岗位、年限与目标'],
        ['llm', '现状诊断', '分析竞争力与能力缺口'],
        ['plugin', '岗位行情查询', '拉取目标岗位 JD 与薪资分布'],
        ['llm', '成长路线', '输出技能补齐与晋升策略'],
        ['end', '结束', '输出 6-12 个月行动计划'],
      ]},
      { id: 'legal', group: '专业服务', name: '法律咨询工作流', desc: '婚姻家事、劳动纠纷、合同审查解答', tips: ['结束输出必须附免责声明“本分析不构成正式法律意见”，写进结束节点说明或最后一段提示词'], nodes: [
        ['start', '开始', '接收案情描述与证据材料'],
        ['cond', '风险分级', '涉诉讼时效或重大财产时提示紧急'],
        ['kb', '法条检索', '检索相关法条与同类判例'],
        ['llm', '意见生成', '输出法律分析、维权路径与文书要点'],
        ['end', '结束', '输出咨询意见（附免责声明）'],
      ]},
      { id: 'tax', group: '专业服务', name: '财税记账工作流', desc: '个税社保问答、记账报税流程与发票规范', tips: ['税率政策经常变，插件节点优先选官方/可配置更新的税率插件，或用知识库定期更新'], nodes: [
        ['start', '开始', '接收纳税人类型与问题'],
        ['plugin', '税率政策查询', '查询最新税率、起征点与优惠政策'],
        ['code', '税额试算', '按收入结构试算个税/增值税'],
        ['llm', '流程指引', '生成申报步骤与发票合规要点'],
        ['end', '结束', '输出计算结果 + 操作指引'],
      ]},
      { id: 'ins', group: '专业服务', name: '保险规划工作流', desc: '险种科普、家庭保障方案与条款解读', tips: ['保费测算公式写死在代码节点里（保额≈年收入10倍、保费≤年收入10%等经验公式），不要让模型心算'], nodes: [
        ['start', '开始', '接收家庭成员、收入与既有保单'],
        ['llm', '缺口分析', '识别寿险/重疾/医疗/意外缺口'],
        ['kb', '产品条款库', '检索候选产品条款与免责项'],
        ['code', '保费测算', '按年龄性别测算年保费与保额'],
        ['end', '结束', '输出家庭保障方案表'],
      ]},
      { id: 'fin', group: '专业服务', name: '理财知识工作流', desc: '理财科普、资产配置思路与知识问答', tips: ['合规校验分支：条件器判断输出是否含“保证收益/推荐个股”等词，命中则改写为教育性表述'], nodes: [
        ['start', '开始', '接收风险偏好、期限与资金规模'],
        ['llm', '风险画像', '评估风险承受等级'],
        ['code', '配置计算', '按股债比例生成配置方案'],
        ['cond', '合规校验', '过滤具体荐股与收益承诺表述'],
        ['end', '结束', '输出教育性配置思路（非投资建议）'],
      ]},
      { id: 'estate', group: '专业服务', name: '购房顾问工作流', desc: '政策解读、区域分析、贷款计算与看房要点', tips: ['等额本息月供公式：M = P×r×(1+r)^n / ((1+r)^n−1)，写进代码节点，不要让模型算数'], nodes: [
        ['start', '开始', '接收城市、预算、购房资格情况'],
        ['plugin', '政策查询', '查询限购、利率与税费政策'],
        ['code', '贷款试算', '计算月供、利息与首付方案'],
        ['llm', '区域与看房建议', '输出区域对比与看房核查清单'],
        ['end', '结束', '输出购房决策报告'],
      ]},
      { id: 'auto', group: '专业服务', name: '买车用车工作流', desc: '选车对比、养护、保险与过户流程', tips: [], nodes: [
        ['start', '开始', '接收预算、用途与候选车型'],
        ['plugin', '车型参数查询', '拉取车型参数、口碑与保值率'],
        ['llm', '对比分析', '生成多车对比表与推荐结论'],
        ['code', '养车成本', '估算保险、油/电与保养年成本'],
        ['end', '结束', '输出选车报告 + 用车成本表'],
      ]},
      { id: 'hr', group: '专业服务', name: 'HR 智能助手工作流', desc: '简历优化、面试准备与劳动法规问答', tips: ['条件器三分支用表达式模式：contains(input,"简历") / contains(input,"面试") / 默认，三分支分别接对应节点'], nodes: [
        ['start', '开始', '接收简历/JD 或劳动纠纷问题'],
        ['cond', '分支路由', '简历优化 / 面试准备 / 法规问答'],
        ['llm', '简历优化', '按 JD 关键词改写经历与量化成果'],
        ['kb', '法规检索', '检索劳动法条文与地方规定'],
        ['end', '结束', '输出优化简历或问答结论'],
      ]},
      { id: 'health', group: '医疗健康', name: '健康生活工作流', desc: '健康科普、体检报告解读建议与就医引导', tips: ['红线筛查条件器必须放在开始节点之后第一个位置，命中“胸痛/呼吸困难/意识模糊”等直接输出就医提醒'], nodes: [
        ['start', '开始', '接收健康问题或体检指标'],
        ['cond', '红线筛查', '危急值关键词触发立即就医提示'],
        ['kb', '医学知识库', '检索指标含义与科室归属'],
        ['llm', '解读生成', '通俗解读指标并给出生活建议'],
        ['end', '结束', '输出解读报告（非诊断，附就医科室）'],
      ]},
      { id: 'psych', group: '医疗健康', name: '心理陪伴工作流', desc: '情绪疏导、压力管理与倾听陪伴', tips: ['危机识别条件器放最前，命中自伤/伤人关键词立即输出心理援助热线，后续节点全部跳过'], nodes: [
        ['start', '开始', '接收情绪表达'],
        ['cond', '危机识别', '识别自伤/伤人风险并给出热线'],
        ['llm', '共情回应', '倾听式回应与情绪命名'],
        ['kb', '自助方法库', '推荐呼吸、书写等自助练习'],
        ['end', '结束', '输出陪伴回应 + 专业求助指引'],
      ]},
      { id: 'fitness', group: '医疗健康', name: '健身教练工作流', desc: '训练计划、动作讲解与饮食搭配', tips: ['TDEE 用 Mifflin-St Jeor 公式写在代码节点：(10×体重kg)+(6.25×身高cm)−(5×年龄)+s，男性s=5，女性s=−161'], nodes: [
        ['start', '开始', '接收目标、体能水平与场地器械'],
        ['llm', '计划生成', '按周期化生成每周训练安排'],
        ['kb', '动作库检索', '检索动作要领与常见错误'],
        ['code', '热量计算', '计算 TDEE 并生成饮食宏量分配'],
        ['end', '结束', '输出训练表 + 饮食方案'],
      ]},
      { id: 'senior', group: '医疗健康', name: '养老照护工作流', desc: '日常照护、适老化改造、政策与机构选择', tips: [], nodes: [
        ['start', '开始', '接收老人身体状况与家庭诉求'],
        ['kb', '政策检索', '检索当地养老补贴与长护险政策'],
        ['llm', '照护方案', '生成日常照护与安全注意事项'],
        ['llm', '机构筛选', '给出养老机构考察评估清单'],
        ['end', '结束', '输出照护指引 + 政策要点'],
      ]},
      { id: 'mom', group: '医疗健康', name: '科学育儿工作流', desc: '婴幼儿喂养、睡眠引导、护理与早教建议', tips: ['就医判断条件器放最前：发热≥39.5℃、拒奶、囟门凸起等红旗症状直接引导就医'], nodes: [
        ['start', '开始', '接收宝宝月龄与问题'],
        ['cond', '就医判断', '发热/拒奶等红旗症状引导就医'],
        ['kb', '育儿知识库', '检索月龄发育里程碑与护理指南'],
        ['llm', '建议生成', '输出喂养/睡眠/早教月龄方案'],
        ['end', '结束', '输出分月龄育儿建议'],
      ]},
      { id: 'dev', group: '产业运营', name: '编程开发工作流', desc: '代码答疑、Bug 定位、代码审查与最佳实践', tips: ['工作流里没有真沙箱，验证节点改为让 LLM 走查测试用例，输出每条用例的预期结果'], nodes: [
        ['start', '开始', '接收代码片段与报错信息'],
        ['llm', '问题定位', '分析根因并给出最小修复'],
        ['code', '片段验证', '构造测试用例验证修复逻辑'],
        ['llm', '审查建议', '输出规范、性能与安全改进点'],
        ['end', '结束', '输出修复代码 + 审查报告'],
      ]},
      { id: 'media', group: '产业运营', name: '新媒体爆款工作流', desc: '小红书/抖音/公众号选题与文案创作', tips: ['多平台改写用循环节点：平台数组["小红书","抖音","公众号"]循环，循环体是“按平台风格改写”LLM'], nodes: [
        ['start', '开始', '接收赛道、平台与目标人群'],
        ['plugin', '热点抓取', '抓取平台热搜与对标账号选题'],
        ['llm', '选题生成', '批量生成标题与选题角度'],
        ['llm', '文案创作', '按平台风格生成正文与标签'],
        ['loop', '多平台改写', '循环改写适配不同平台'],
        ['end', '结束', '输出选题库 + 平台文案包'],
      ]},
      { id: 'news', group: '产业运营', name: '新闻解读工作流', desc: '热点新闻五段式深度解读', tips: ['五段式=核心概括/事件脉络/背景科普/影响分析/理性提醒，在最后 LLM 的提示词里明确写出五个小标题'], nodes: [
        ['start', '开始', '接收新闻链接或关键词'],
        ['plugin', '资讯抓取', '抓取多源报道与时间线'],
        ['llm', '核心概括', '提炼事件脉络与关键事实'],
        ['kb', '背景知识检索', '检索政策与行业背景'],
        ['llm', '影响分析', '输出影响分析与理性提醒'],
        ['end', '结束', '输出五段式解读文章'],
      ]},
      { id: 'game', group: '产业运营', name: '游戏上分工作流', desc: '版本理解、英雄攻略与上分思路', tips: [], nodes: [
        ['start', '开始', '接收游戏、段位与本命英雄'],
        ['plugin', '版本数据查询', '拉取当前版本强度榜与改动'],
        ['llm', '攻略生成', '输出出装、对线与运营思路'],
        ['llm', '复盘建议', '根据对局描述给出改进点'],
        ['end', '结束', '输出版本攻略卡'],
      ]},
      { id: 'agri', group: '产业运营', name: '农技服务工作流', desc: '种植管理、病虫害识别与农事建议', tips: ['用药建议提示词要求区分“农业防治/物理防治/化学防治”三档，化学防治注明安全间隔期'], nodes: [
        ['start', '开始', '接收作物、生育期与症状照片/描述'],
        ['plugin', '气象查询', '查询未来一周农事气象'],
        ['kb', '植保知识库', '检索病虫害特征与防治方案'],
        ['llm', '诊断思路', '给出疑似病害与用药/农事建议'],
        ['end', '结束', '输出农事指导单'],
      ]},
      { id: 'logi', group: '产业运营', name: '物流快递管家工作流', desc: '快递查询指引、运费说明与理赔协助', tips: ['异常判断条件器：轨迹里含“滞留/退回/丢失”或超72小时未更新即命中理赔分支'], nodes: [
        ['start', '开始', '接收运单号与诉求'],
        ['plugin', '物流轨迹查询', '查询各承运商轨迹与时效'],
        ['cond', '异常判断', '滞留/丢件触发理赔流程'],
        ['llm', '理赔指引', '生成理赔材料清单与话术'],
        ['end', '结束', '输出物流状态 + 解决路径'],
      ]},
      { id: 'gov', group: '产业运营', name: '政务服务工作流', desc: '社保、公积金、证件办理流程指引', tips: ['政策类答案提示词要求“标注政策来源与咨询热线”，并提醒用户以当地政务大厅答复为准'], nodes: [
        ['start', '开始', '接收事项类型与所在城市'],
        ['plugin', '政务信息查询', '查询办理条件、材料与网点'],
        ['kb', '政策知识库', '检索最新社保公积金政策'],
        ['llm', '流程指引', '生成办理步骤与材料清单'],
        ['end', '结束', '输出办事指南卡'],
      ]},
      { id: 'housekeep', group: '生活服务', name: '家政保洁工作流', desc: '保洁报价、阿姨筛选与验收清单', tips: ['报价用代码节点按面积×项目单价表计算，不要让模型估数'], nodes: [
        ['start', '开始', '接收面积、户型、服务类型（日常/开荒/深度）'],
        ['code', '报价计算', '按面积与项目单价表计算价格区间'],
        ['kb', '服务标准检索', '检索服务流程与验收标准'],
        ['llm', '方案生成', '输出服务清单、时长预估与阿姨筛选问题清单'],
        ['end', '结束', '输出报价卡 + 验收清单'],
      ]},
      { id: 'rent', group: '专业服务', name: '租房顾问工作流', desc: '房源比对、合同避坑与押金攻略', tips: ['合同避坑要点提示词要求覆盖：押金退还条件、转租条款、维修责任、水电燃气承担方'], nodes: [
        ['start', '开始', '接收城市、区域、预算、通勤需求'],
        ['plugin', '房源价格查询', '查询区域租金水平与均价'],
        ['llm', '房源比对', '生成候选房源对比表与看房核查要点'],
        ['kb', '合同知识检索', '检索租房合同常见陷阱条款'],
        ['end', '结束', '输出租房决策卡 + 避坑清单'],
      ]},
      { id: 'garden', group: '生活服务', name: '园艺花卉工作流', desc: '植物养护、病虫害处理与造景建议', tips: ['养护方案提示词要求结合光照/浇水/施肥/修剪四要素，并注明季节差异'], nodes: [
        ['start', '开始', '接收植物种类、养护环境与问题'],
        ['kb', '植物养护检索', '检索植物习性、浇水周期与常见病害'],
        ['cond', '环境适配', '光照/通风条件不适宜时给出更换建议'],
        ['llm', '养护方案', '输出养护日历与病害处理步骤'],
        ['end', '结束', '输出养护卡 + 造景建议'],
      ]},
      { id: 'digital', group: '零售贸易', name: '数码选购工作流', desc: '手机/电脑/耳机选购对比与避坑', tips: ['对比表用表格输出：型号/芯片/内存/屏幕/续航/价格六列；提示词禁止虚构型号参数'], nodes: [
        ['start', '开始', '接收品类、预算、用途与候选机型'],
        ['plugin', '参数行情查询', '查询机型参数、跑分与价格走势'],
        ['llm', '对比分析', '生成多机型对比表与按用途推荐结论'],
        ['cond', '需求校验', '用途与预算明显不匹配时给出调整建议'],
        ['end', '结束', '输出选购报告 + 验机清单'],
      ]},
      { id: 'live', group: '零售贸易', name: '直播电商工作流', desc: '直播脚本、话术设计与复盘分析', tips: ['话术提示词要求符合广告法：禁用“最/第一/ cure”等绝对化用语，写进负面清单'], nodes: [
        ['start', '开始', '接收品类、平台、目标人群与直播目标'],
        ['plugin', '竞品数据查询', '查询同类直播间玩法与价格带'],
        ['llm', '脚本生成', '按开播流程生成脚本：憋单/逼单/转款/留人话术'],
        ['cond', '合规审查', '过滤绝对化用语与虚假承诺表述'],
        ['end', '结束', '输出脚本 + 合规话术包'],
      ]},
      { id: 'tcm', group: '医疗健康', name: '中医养生工作流', desc: '体质科普、节气养生与食疗思路', tips: ['红线筛查放最前：急症症状直接引导就医；提示词注明“体质判断仅供参考，调理请咨询执业中医师”'], nodes: [
        ['start', '开始', '接收身体困扰、作息饮食习惯'],
        ['cond', '急症筛查', '急症关键词直接引导就医'],
        ['kb', '养生知识检索', '检索体质分类、节气养生与食疗知识'],
        ['llm', '养生方案', '输出作息/饮食/运动养生建议'],
        ['end', '结束', '输出养生建议卡（附免责声明）'],
      ]},
      { id: 'nutrition', group: '医疗健康', name: '营养配餐工作流', desc: '膳食评估、减脂/增肌配餐与食谱', tips: ['热量与三大营养素计算写进代码节点（BMR 用 Mifflin-St Jeor），提示词只负责生成食谱'], nodes: [
        ['start', '开始', '接收身高体重年龄、活动量与目标'],
        ['code', '热量营养计算', '计算 BMR/TDEE 与蛋白质碳水脂肪配比'],
        ['cond', '禁忌筛查', '疾病相关饮食禁忌（如糖尿病控糖）时调整方案'],
        ['llm', '食谱生成', '按配比生成一周食谱与外食替代建议'],
        ['end', '结束', '输出配餐表 + 采购清单'],
      ]},
      { id: 'company', group: '专业服务', name: '企业注册顾问工作流', desc: '公司注册、股权架构与开户流程', tips: ['提示词要求按城市给出差异（注册资本认缴、地址要求），并注明政策以当地市监局为准'], nodes: [
        ['start', '开始', '接收城市、行业、股东结构与业务规划'],
        ['kb', '注册政策检索', '检索注册流程、材料与行业前置审批'],
        ['llm', '架构建议', '输出类型选择、股权分配思路与注意事项'],
        ['llm', '流程指引', '生成注册步骤、时间线与费用预估'],
        ['end', '结束', '输出注册路线图'],
      ]},
      { id: 'loan', group: '专业服务', name: '贷款规划工作流', desc: '房贷/消费贷方案对比与月供试算', tips: ['等额本息/等额本金月供公式写进代码节点；提示词要求对比总利息差并提醒“提前还款违约金需查合同”'], nodes: [
        ['start', '开始', '接收贷款类型、金额、期限与利率'],
        ['plugin', '利率政策查询', '查询最新 LPR 与各渠道利率水平'],
        ['code', '月供试算', '分别计算等额本息/等额本金的月供与总利息'],
        ['llm', '方案对比', '生成对比表与适配建议（现金流/总利息视角）'],
        ['end', '结束', '输出贷款方案对比卡'],
      ]},
      { id: 'retire', group: '专业服务', name: '退休养老规划工作流', desc: '养老金测算、储蓄缺口与配置思路', tips: ['复利终值计算写进代码节点 FV=PV×(1+r)^n；提示词注明“社保测算为估算，以社保局账单为准”'], nodes: [
        ['start', '开始', '接收年龄、收入、缴费情况与期望退休生活'],
        ['code', '缺口测算', '估算社保养老金区间，用复利公式算储蓄缺口'],
        ['kb', '养老政策检索', '检索养老金计发办法与个人养老金账户政策'],
        ['cond', '合规校验', '过滤具体产品推荐与收益承诺表述'],
        ['llm', '规划生成', '输出三支柱配置思路与每月储蓄建议'],
        ['end', '结束', '输出养老规划卡（非投资建议）'],
      ]},
      { id: 'fund', group: '专业服务', name: '基金定投工作流', desc: '定投计划、组合思路与止盈纪律', tips: ['必须输出“定投不能保证盈利”提示；止盈目标线写进提示词而不是让模型拍脑袋'], nodes: [
        ['start', '开始', '接收每月可投金额、期限与风险偏好'],
        ['llm', '组合思路', '按风险偏好输出股债比例与宽基指数思路'],
        ['code', '定投测算', '按历史年化假设区间测算定投终值范围'],
        ['cond', '合规校验', '过滤具体基金代码推荐与预期收益率承诺'],
        ['end', '结束', '输出定投计划卡 + 止盈止损纪律（教育性）'],
      ]},
      { id: 'claim', group: '专业服务', name: '保险理赔协助工作流', desc: '理赔流程、材料清单与拒赔应对', tips: ['提示词要求区分险种（重疾/医疗/意外/车险）给材料清单，并提醒“拒赔争议可向银保监投诉或诉讼”'], nodes: [
        ['start', '开始', '接收险种、出险情况与保单状态'],
        ['cond', '时效判断', '超过报案/索赔时效时给出补救路径'],
        ['kb', '条款理赔检索', '检索该险种理赔条件与免责条款'],
        ['llm', '流程指引', '生成材料清单、报案话术与拒赔申诉思路'],
        ['end', '结束', '输出理赔行动清单'],
      ]},
      { id: 'finreport', group: '专业服务', name: '企业财报分析工作流', desc: '三大报表解读与财务比率体检', tips: ['流动比率/毛利率/ROE 等公式写进代码节点；提示词要求“先列公式再解读，数据不足时说明缺口”'], nodes: [
        ['start', '开始', '接收资产负债表/利润表/现金流量表数据'],
        ['code', '比率计算', '计算偿债、营运、盈利、成长四类财务比率'],
        ['kb', '行业基准检索', '检索所在行业的健康比率参考区间'],
        ['llm', '解读生成', '对比行业基准输出财务体检报告与风险点'],
        ['end', '结束', '输出财报分析卡'],
      ]},
      { id: 'credit', group: '专业服务', name: '信用卡管理工作流', desc: '账单管理、分期成本与用卡优化', tips: ['分期真实年化用代码节点算（名义费率×1.8 左右才是近似年化）；提示词禁止鼓励套现等违规用卡行为'], nodes: [
        ['start', '开始', '接收各卡账单、分期情况与用卡习惯'],
        ['code', '成本计算', '计算分期真实年化利率、最低还款利息成本'],
        ['llm', '优化方案', '输出账单日/还款日安排与免息期最大化策略'],
        ['cond', '风险提示', '存在逾期或以卡养卡倾向时输出风险警告'],
        ['end', '结束', '输出用卡优化方案'],
      ]},
      { id: 'stockedu', group: '专业服务', name: '股票知识科普工作流', desc: '交易规则、K线术语与开户费率科普', tips: ['纯科普定位：提示词明确“不推荐任何个股、不预测涨跌”；交易规则（T+1、涨跌幅限制、费率）写进知识库保证准确'], nodes: [
        ['start', '开始', '接收概念问题（如“什么是集合竞价”）'],
        ['kb', '交易规则检索', '检索交易规则、费率结构与术语解释'],
        ['cond', '荐股拦截', '识别“帮我推荐股票/能涨多少”类请求并礼貌拒绝'],
        ['llm', '科普讲解', '用生活化例子解释概念，附风险提示'],
        ['end', '结束', '输出科普卡片'],
      ]},
      { id: 'stockreview', group: '专业服务', name: '股票复盘分析工作流', desc: '大盘/持仓复盘框架与交易纪律检查', tips: ['只做复盘方法论：提示词要求基于用户提供的交易记录分析行为偏差（追涨杀跌/满仓梭哈），禁止给出买卖建议'], nodes: [
        ['start', '开始', '接收大盘数据、持仓记录或交易流水'],
        ['code', '交易统计', '统计胜率、盈亏比、最大回撤与换手频率'],
        ['cond', '行为偏差识别', '识别追涨杀跌、频繁交易、重仓单票等模式'],
        ['llm', '复盘报告', '输出行为分析、仓位管理建议与交易纪律清单'],
        ['end', '结束', '输出复盘报告 + 纪律卡（非投资建议）'],
      ]},
      { id: 'stockfund', group: '专业服务', name: '个股基本面速读工作流', desc: '财报要点速查与基本面分析框架', tips: ['教学框架定位：输出“分析框架”而非“买卖结论”；提示词要求标注数据来源与报告期，禁止编造财务数据'], nodes: [
        ['start', '开始', '接收公司名称与最新财报数据'],
        ['plugin', '行情数据查询', '查询市值、市盈率、行业排名等基础数据'],
        ['kb', '分析方法检索', '检索基本面分析框架（护城河/成长性/估值法）'],
        ['llm', '框架解读', '按框架逐项解读，指出数据缺口与待验证问题'],
        ['end', '结束', '输出基本面分析框架卡（附投资风险提示）'],
      ]},
    ];

    const GROUPS = ['零售贸易', '生活服务', '教育成长', '专业服务', '医疗健康', '产业运营'];

    // ------------------------------------------------------------------
    // 傻瓜式搭建教程（通用 7 步）
    // ------------------------------------------------------------------
    const TUTORIAL = [
      { t: '第 1 步', d: '打开工作流编辑器：登录 coze.cn → 左侧进入「工作空间」→ 顶部点「资源库」→ 右上角「+ 资源」→ 选择「工作流」→ 填名称（如 ecom_service，只能用字母数字下划线）和描述 → 确定，进入画布。画布默认有「开始」「结束」两个节点并用线连着。' },
      { t: '第 2 步', d: '配置开始节点：双击「开始」→ 右侧面板点「+」新增输入参数 → 参数名 input，类型 String → 描述抄本插件里“开始”节点的说明。此后所有节点都能引用变量 {{start.input}}。' },
      { t: '第 3 步', d: '逐个添加节点：鼠标移到开始→结束的连线上，点出现的「+」在中间插入节点；类型对照徽章：大模型 / 插件 / 条件器 / 代码 / 知识库 / 循环。每加一个节点，展开本插件里该节点的“配置方法”照着填。' },
      { t: '第 4 步', d: '引用上游变量：任何输入框里打 {{ 就会弹出上游输出列表，选即可。铁律：每个节点的入参必须来自「开始节点」或其上游节点的输出——引用不存在的变量是试运行报错的第一大原因。' },
      { t: '第 5 步', d: '配置结束节点：双击「结束」→ 返回变量「+」→ 变量名 plan → 值选最后一个输出节点的 output。结束节点是流程终点，后面不能再接任何节点。' },
      { t: '第 6 步', d: '试运行调试：右上角「试运行」→ 按开始节点描述填一条真实输入 → 运行 → 逐节点看绿勾/红叉。红叉点开看报错：变量未定义就检查引用；超时就调小 max tokens 或精简提示词。' },
      { t: '第 7 步', d: '发布并绑定智能体：试运行通过后点「发布」→ 回到智能体编辑页 → 技能区「+」→「工作流」→ 勾选刚发布的工作流 → 保存。之后对话中一句话即可触发。' },
    ];

    // 每种节点类型的傻瓜式配置方法
    const TYPE_GUIDE = {
      start: '双击「开始」节点 → 右侧面板「+」新增输入参数 → 名称 input，类型 String → 把本节点说明文字抄进“描述”（试运行时它会提示你填什么）。',
      end: '双击「结束」节点 → 返回变量「+」→ 变量名 plan（或 result）→ 值选上游最终输出节点的 output。结束节点是流程终点，后面不能再接节点。',
      llm: '连线上点「+」→ 选「大模型」→ 模型用默认，温度 0.4-0.7 → 系统提示词（System）写角色与要求；用户提示词（User）里引用上游变量：打 {{ 从弹出列表选。模板：“你是{角色}。请根据以下信息完成任务：{{上游变量}}。要求：1.… 2.… 3.…，用 Markdown 输出。”',
      plugin: '连线上点「+」→ 选「插件」→ 插件商店搜索本节点说明中的功能（如“物流查询”“天气”）→ 添加后进入入参映射页 → 每个入参下拉选上游输出变量 → 输出自动带出插件返回字段，供下游引用。',
      code: '连线上点「+」→ 选「代码」→ 语言 JavaScript → 输入参数「+」逐个加上游变量 → 编辑器里写处理逻辑，最后 return 一个对象，如 return { result: text }; → 下游用 {{代码.result}} 引用。',
      cond: '连线上点「+」→ 选「条件器」→ 点「+ if」新增分支 → 关系选“包含/等于/大于”等 → 比较对象引用上游变量 → 满足走 IF 分支（接后续节点），不满足走 ELSE（接兜底节点或直接跳结束）。',
      loop: '连线上点「+」→ 选「循环」→ 类型“指定数组”，数组引用上游列表变量（没有就先用代码节点造一个）→ 循环体放一个 LLM 节点处理每一项 → 每轮结果自动聚合成数组输出。',
      kb: '先建知识库：Coze 首页「知识库」→「+ 新建」→ 上传文档（规则/菜谱/法条/曲谱等）→ 回到工作流 → 连线上点「+」→ 选「知识库」→ 选刚建的库 → query 引用上游问题变量 → 检索条数 3-5。',
    };

    function nodeGuide(w, nd, i) {
      const base = TYPE_GUIDE[nd[0]];
      const ref = i === 0 ? '' : ' 输入可引用上游：输入框打 {{ 选 node_' + i + ' 的 output。';
      const check = nd[0] === 'start' ? '' : ' 自查：试运行时该节点变绿勾、输出预览有内容即通过。';
      return base + ref + check;
    }

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
      if (w.tips && w.tips.length) {
        lines.push('# 搭建要点：');
        w.tips.forEach((tp) => lines.push('#  - ' + tp));
      }
      lines.push('nodes:');
      w.nodes.forEach((nd, i) => {
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
.cfg-wrap { display: flex; align-items: flex-start; gap: 8px; margin-top: 4px; }
.cfg-icon { width: 28px; height: 28px; min-width: 28px; border-radius: 50%; border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1); cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; }
.cfg-icon:hover { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-brand-primary); }
.cfg-icon svg { display: block; }
.cfg-panel { flex: 1; min-width: 0; max-width: 680px; background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px;
  padding: 12px 16px; max-height: 460px; overflow: auto; }
.cfg-toolbar { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin: 10px 0; }
.cfg-search { border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary);
  border-radius: 8px; padding: 4px 10px; font-size: 12px; width: 200px; outline: none; }
.cfg-chip { border: none; background: transparent; color: var(--dsw-alias-label-secondary);
  border-radius: 999px; padding: 3px 10px; font-size: 12px; cursor: pointer; }
.cfg-chip:hover { color: var(--dsw-alias-label-primary); }
.cfg-chip.active { background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-bg-base); font-weight: 600; }
.cfg-count { font-size: 11px; color: var(--dsw-alias-label-secondary); margin-left: auto; }
.cfg-list { display: grid; grid-template-columns: 1fr; gap: 1px; }
.cfg-row { text-align: left; border: none; background: transparent; color: var(--dsw-alias-label-primary); font: inherit;
  border-radius: 8px; padding: 6px 10px; cursor: pointer; display: flex; align-items: baseline; gap: 10px; width: 100%; min-width: 0; }
.cfg-row:hover { background: var(--dsw-alias-bg-layer-2); }
.cfg-row-name { font-size: 13px; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
.cfg-row-desc { font-size: 11px; color: var(--dsw-alias-label-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.cfg-detail { margin-top: 4px; }
.cfg-detail-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 2px; }
.cfg-detail-title { font-size: 14px; font-weight: 700; color: var(--dsw-alias-label-primary); }
.cfg-detail-group { font-size: 11px; color: var(--dsw-alias-brand-primary); }
.cfg-detail-desc { font-size: 12px; color: var(--dsw-alias-label-secondary); margin: 2px 0 10px; }
.cfg-flow { display: flex; flex-direction: column; margin-bottom: 12px; }
.cfg-node { display: flex; gap: 10px; align-items: center; }
.cfg-node-main { display: flex; gap: 8px; align-items: center; padding: 5px 8px; border-radius: 8px; flex: 1; cursor: pointer; }
.cfg-node-main:hover { background: var(--dsw-alias-bg-layer-2); }
.cfg-badge { font-size: 10px; color: #fff; border-radius: 4px; padding: 1px 6px; white-space: nowrap; font-weight: 600; min-width: 44px; text-align: center; }
.cfg-node-name { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary); white-space: nowrap; }
.cfg-node-desc { font-size: 11px; color: var(--dsw-alias-label-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cfg-arrow { width: 14px; display: flex; justify-content: center; align-items: center; height: 14px; color: var(--dsw-alias-label-secondary); }
.cfg-section-toggle { width: 100%; text-align: left; border: none; background: transparent;
  color: var(--dsw-alias-brand-primary); border-radius: 8px; padding: 5px 4px; font-size: 12px; cursor: pointer; }
.cfg-section-toggle:hover { background: var(--dsw-alias-bg-layer-2); }
.cfg-guide-box { border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; background: var(--dsw-alias-bg-base);
  padding: 10px 12px; margin-bottom: 10px; }
.cfg-guide-step { display: flex; gap: 10px; padding: 6px 0; border-bottom: 1px dashed var(--dsw-alias-border-l1); }
.cfg-guide-step:last-child { border-bottom: none; }
.cfg-guide-idx { font-size: 11px; font-weight: 700; color: var(--dsw-alias-brand-primary); white-space: nowrap; min-width: 44px; }
.cfg-guide-body { font-size: 12px; color: var(--dsw-alias-label-primary); line-height: 1.6; }
.cfg-guide-title { font-size: 12px; font-weight: 700; color: var(--dsw-alias-label-primary); margin-bottom: 4px; }
.cfg-tip { font-size: 11px; color: var(--dsw-alias-state-warn-primary); background: var(--dsw-alias-bg-base);
  border: 1px solid var(--dsw-alias-border-l1); border-left: 3px solid var(--dsw-alias-state-warn-primary);
  border-radius: 6px; padding: 6px 10px; margin-bottom: 10px; }
.cfg-actions { display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
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
      const [open, setOpen] = React.useState(false);
      const [group, setGroup] = React.useState('全部');
      const [q, setQ] = React.useState('');
      const [sel, setSel] = React.useState(null);
      const [copied, setCopied] = React.useState(false);
      const [showTut, setShowTut] = React.useState(false);
      const [showGuide, setShowGuide] = React.useState(true);
      const [openNode, setOpenNode] = React.useState(-1);
      const [showYaml, setShowYaml] = React.useState(false);

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

      const ICON = h('svg', { viewBox: '0 0 64 64', width: 16, height: 16, 'aria-hidden': true },
        h('circle', { cx: 14, cy: 16, r: 8, fill: '#4f6ef7' }),
        h('circle', { cx: 50, cy: 16, r: 8, fill: '#9aa8ff' }),
        h('circle', { cx: 32, cy: 50, r: 8, fill: '#4f6ef7' }),
        h('path', { d: 'M14 16 L32 50 L50 16', fill: 'none', stroke: '#4f6ef7', 'stroke-width': 5, 'stroke-linecap': 'round' }),
        h('circle', { cx: 32, cy: 33, r: 5, fill: '#ffe08a' }));

      return h('div', { className: 'cfg-wrap' },
        h('button', { className: 'cfg-icon', title: 'Coze 工作流生成器',
          onClick: () => setOpen(!open) }, ICON),
        open && h('div', { className: 'cfg-panel' },
          h('div', { className: 'cfg-detail-head' },
            h('span', { className: 'cfg-detail-title' }, 'Coze 工作流生成器'),
            h('span', { className: 'cfg-detail-group' }, '49 个行业模板'),
            h('span', { style: { flex: 1 } }),
            h('button', { className: 'cfg-back', onClick: () => setOpen(false) }, '收起 ×')),
          h('button', { className: 'cfg-section-toggle', onClick: () => setShowTut(!showTut) },
            (showTut ? '▾ ' : '▸ ') + '从零到发布的 7 步通用教程'),
          showTut && h('div', { className: 'cfg-guide-box' },
            TUTORIAL.map((s, i) => h('div', { key: i, className: 'cfg-guide-step' },
              h('span', { className: 'cfg-guide-idx' }, s.t),
              h('div', { className: 'cfg-guide-body' }, s.d)))),
          h('div', { className: 'cfg-toolbar' },
            h('input', { className: 'cfg-search', placeholder: '搜索行业或场景…', value: q,
              onChange: (e) => setQ(e.target.value) }),
            ['全部'].concat(GROUPS).map((g) =>
              h('button', { key: g, className: 'cfg-chip' + (group === g ? ' active' : ''),
                onClick: () => { setGroup(g); setSel(null); } }, g)),
            h('span', { className: 'cfg-count' }, list.length + ' 个')),
          !sel && h('div', { className: 'cfg-list' },
            list.map((w) => h('button', { key: w.id, className: 'cfg-row', onClick: () => { setSel(w); setOpenNode(-1); setShowYaml(false); } },
              h('span', { className: 'cfg-row-name' }, w.name),
              h('span', { className: 'cfg-row-desc' }, w.desc)))),
          sel && h('div', { className: 'cfg-detail' },
            h('div', { className: 'cfg-detail-head' },
              h('button', { className: 'cfg-back', onClick: () => setSel(null) }, '← 返回'),
              h('span', { className: 'cfg-detail-title' }, sel.name),
              h('span', { className: 'cfg-detail-group' }, sel.group + ' · ' + sel.nodes.length + ' 节点')),
            h('div', { className: 'cfg-detail-desc' }, sel.desc + '。点击节点查看配置方法。'),
            sel.tips && sel.tips.length ? h('div', { className: 'cfg-tip' },
              '⚠ 搭建要点：' + sel.tips.join('；')) : null,
            h('div', { className: 'cfg-flow' },
              sel.nodes.map((nd, i) => {
                const t = N[nd[0]];
                const isOpen = showGuide && openNode === i;
                return h('div', { key: i },
                  h('div', { className: 'cfg-node' },
                    h('div', { className: 'cfg-arrow' }, isOpen ? '▾' : '▸'),
                    h('div', { className: 'cfg-node-main',
                      onClick: () => { setShowGuide(true); setOpenNode(isOpen ? -1 : i); } },
                      h('span', { className: 'cfg-badge', style: { background: t.color } }, t.label),
                      h('span', { className: 'cfg-node-name' }, nd[1]),
                      h('span', { className: 'cfg-node-desc' }, nd[2]))),
                  isOpen ? h('div', { className: 'cfg-guide-box', style: { margin: '2px 0 6px 24px' } },
                    h('div', { className: 'cfg-guide-title' }, '「' + nd[1] + '」配置方法（' + t.label + '节点）'),
                    h('div', { className: 'cfg-guide-body' }, nodeGuide(sel, nd, i))) : null);
              })),
            h('div', { className: 'cfg-actions' },
              h('button', { className: 'cfg-btn primary', onClick: copyYaml }, copied ? '✓ 已复制' : '复制 YAML'),
              h('button', { className: 'cfg-btn', onClick: downloadYaml }, '下载 .yaml'),
              h('button', { className: 'cfg-btn', onClick: () => setShowYaml(!showYaml) },
                showYaml ? '隐藏 YAML' : '查看 YAML')),
            showYaml ? h('pre', { className: 'cfg-yaml' }, toYaml(sel)) : null)));
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        let disposeCss = null;
        try {
          const stylesMod = require('styles');
          if (stylesMod && stylesMod.insert) disposeCss = stylesMod.insert(CSS);
        } catch (e) { disposeCss = null; }
        if (!disposeCss) {
          // 双保险：styles 内置模块不可用时，直接插入 <style> 标签
          const el = document.createElement('style');
          el.textContent = CSS;
          document.head.appendChild(el);
          disposeCss = () => { if (el.parentNode) el.parentNode.removeChild(el); };
        }
        ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
          name: 'conversation.input.dock', id: 'coze-flow-generator', order: 3,
          label: 'Coze Workflow Generator',
        }, Panel));
        return () => { disposeCss(); };
      },
    };
  },
});
