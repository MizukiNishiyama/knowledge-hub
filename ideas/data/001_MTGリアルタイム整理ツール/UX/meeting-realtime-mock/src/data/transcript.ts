export interface TranscriptEntry {
  id: string;
  speaker: string;
  speakerRole: string;
  text: string;
  timestamp: string;
  delayMs: number; // ms after start to show this entry
  tag: StatementTag; // 発話の性質タグ
}

export type StatementTag =
  | "agenda"      // アジェンダ提示
  | "fact"        // 現状共有・事実報告
  | "example"     // 例示・具体例
  | "proposal"    // 提案
  | "opinion"     // 意見・主張
  | "question"    // 質問・確認
  | "concern"     // 懸念・リスク指摘
  | "agreement"   // 同意・賛成
  | "decision"    // 決定・合意
  | "action";     // アクション・タスク

export interface MindMapUpdate {
  triggeredByTranscriptId: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  suggestions?: SuggestionItem[];
}

export interface MindMapNode {
  id: string;
  label: string;
  type: StatementTag;
  parentId?: string;
  detail?: string;
  speaker?: string;      // 発言者名
  summary?: string;      // 主張・論点の要約
  evidence?: string;     // 根拠・データ
  richType?: "comparisonTable" | "ganttChart" | "metricsCard";
  richData?: Record<string, any>;
}

export interface MindMapEdge {
  source: string;
  target: string;
  label?: string;
}

export interface SuggestionItem {
  nodeId: string;
  text: string;
  type: "question" | "concern" | "next-step";
}

export const tagLabels: Record<StatementTag, { label: string; color: string; bgColor: string; borderColor: string }> = {
  agenda:    { label: "アジェンダ",  color: "#6366f1", bgColor: "#eef2ff", borderColor: "#c7d2fe" },
  fact:      { label: "現状共有",    color: "#0284c7", bgColor: "#e0f2fe", borderColor: "#7dd3fc" },
  example:   { label: "例示",       color: "#0891b2", bgColor: "#ecfeff", borderColor: "#67e8f9" },
  proposal:  { label: "提案",       color: "#7c3aed", bgColor: "#f5f3ff", borderColor: "#c4b5fd" },
  opinion:   { label: "意見",       color: "#4f46e5", bgColor: "#eef2ff", borderColor: "#a5b4fc" },
  question:  { label: "質問",       color: "#d97706", bgColor: "#fffbeb", borderColor: "#fcd34d" },
  concern:   { label: "懸念",       color: "#dc2626", bgColor: "#fef2f2", borderColor: "#fca5a5" },
  agreement: { label: "同意",       color: "#059669", bgColor: "#ecfdf5", borderColor: "#6ee7b7" },
  decision:  { label: "決定",       color: "#059669", bgColor: "#ecfdf5", borderColor: "#6ee7b7" },
  action:    { label: "アクション",  color: "#7c3aed", bgColor: "#f5f3ff", borderColor: "#c4b5fd" },
};

export interface Participant {
  name: string;
  role: string;
  color: string;
}

export const participants: Participant[] = [
  { name: "田中 (PM)", role: "プロダクトマネージャー", color: "#3b82f6" },
  { name: "鈴木 (UXR)", role: "UXリサーチャー", color: "#7c3aed" },
  { name: "山田 (Eng)", role: "テックリード", color: "#059669" },
  { name: "佐藤 (Biz)", role: "事業開発", color: "#d97706" },
];

// SaaS新規プロダクトの企画会議
// 問いかけ・フリを含むリアルな会話フロー
export const transcriptData: TranscriptEntry[] = [
  {
    id: "t1",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "それでは定例の新規プロダクト企画会議を始めます。今日のアジェンダは3つ。まず前回のユーザーインタビュー結果の共有、次にMVPスコープの確定、最後にQ2のロードマップについてです。では早速、鈴木さん、インタビューの結果からお願いできますか？",
    timestamp: "10:00:05",
    delayMs: 0,
    tag: "agenda",
  },
  {
    id: "t2",
    speaker: "鈴木 (UXR)",
    speakerRole: "UXリサーチャー",
    text: "はい、では共有します。先週8社のエンタープライズ顧客にヒアリングしました。一番多かった課題は、社内ナレッジが属人化していて、退職者が出るとノウハウが完全にロストするということ。8社中6社がこれを最優先課題に挙げています。",
    timestamp: "10:00:35",
    delayMs: 18000,
    tag: "fact",
  },
  {
    id: "t3",
    speaker: "鈴木 (UXR)",
    speakerRole: "UXリサーチャー",
    text: "2番目に多かったのが、SlackやTeamsの会話に重要な意思決定が埋もれてしまう問題です。具体的には、特に100人以上の組織で顕著で、「3ヶ月前にあの件どう決まったっけ？」という検索が日常的に発生しているとのことでした。",
    timestamp: "10:01:10",
    delayMs: 40000,
    tag: "example",
  },
  {
    id: "t3b",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "ありがとうございます。なるほど、かなり根深い課題ですね。山田さん、技術的な観点からこの課題に対してどう見ていますか？",
    timestamp: "10:01:35",
    delayMs: 58000,
    tag: "question",
  },
  {
    id: "t4",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "ええ、技術的には面白い課題だと思います。LLMを使ったセマンティック検索と、会話のコンテキストを保持した要約生成の組み合わせで解決できそうです。既にEmbeddingの精度はかなり上がっていて、社内実験でもRAGベースのアプローチで80%以上の適合率を出せています。",
    timestamp: "10:01:50",
    delayMs: 65000,
    tag: "proposal",
  },
  {
    id: "t4b",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "80%はかなり高いですね。佐藤さん、市場側の状況はどうですか？競合の動きとか含めて。",
    timestamp: "10:02:15",
    delayMs: 85000,
    tag: "question",
  },
  {
    id: "t5",
    speaker: "佐藤 (Biz)",
    speakerRole: "事業開発",
    text: "市場的にも追い風です。Notionが先月ナレッジベースAI機能を発表しましたが、あれはあくまでドキュメント内の検索なんですよね。リアルタイムの会話からナレッジを自動構造化するプレーヤーはまだいません。競合のGleanやGuruも、既存ドキュメントの横断検索が中心です。",
    timestamp: "10:02:30",
    delayMs: 92000,
    tag: "fact",
  },
  {
    id: "t6",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "なるほど、ポジショニング的には「会話→ナレッジの自動変換」がキーになりそうですね。皆さんの話を踏まえると方向性は見えてきたので、MVPのスコープに入りましょう。前回の議論をベースに、私の方で3つの案を用意しました。",
    timestamp: "10:02:55",
    delayMs: 115000,
    tag: "opinion",
  },
  {
    id: "t7",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "案A: 会議録画の自動要約と構造化のみ。案B: それに加えてSlack連携で会話のナレッジ抽出。案C: フルスコープでリアルタイム構造化＋ナレッジベース自動生成まで。開発工数はそれぞれ2ヶ月、4ヶ月、7ヶ月の見込みです。山田さん、エンジニアリングの観点ではどう思いますか？",
    timestamp: "10:03:25",
    delayMs: 135000,
    tag: "proposal",
  },
  {
    id: "t8",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "そうですね、エンジニアリング観点だと案Bが現実的です。案Aだと差別化が弱い。tl;dvやFirefliesと変わらなくなる。案Cは技術的にはやりたいですが、リアルタイム処理のレイテンシー問題が大きくて、ストリーミングASRの精度とLLM推論速度の両方がボトルネックになります。",
    timestamp: "10:04:00",
    delayMs: 160000,
    tag: "opinion",
  },
  {
    id: "t8b",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "わかりました。佐藤さん、ビジネスサイドからはいかがですか？",
    timestamp: "10:04:25",
    delayMs: 180000,
    tag: "question",
  },
  {
    id: "t9",
    speaker: "佐藤 (Biz)",
    speakerRole: "事業開発",
    text: "ビジネスサイドとしても案Bに賛成です。エンタープライズ向けだとSlack連携は必須ですし、会議録画だけだと月額1,500円が上限。Slack連携まで入れれば席単価3,000〜5,000円は取れると見ています。ARR1億のラインを考えると、2,000社×月5,000円で届きます。",
    timestamp: "10:04:35",
    delayMs: 188000,
    tag: "agreement",
  },
  {
    id: "t9b",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "ありがとうございます。鈴木さん、ユーザー側からの視点ではどうでしょう？懸念点とかあれば。",
    timestamp: "10:05:00",
    delayMs: 210000,
    tag: "question",
  },
  {
    id: "t10",
    speaker: "鈴木 (UXR)",
    speakerRole: "UXリサーチャー",
    text: "ユーザーの声からも案Bですね。ただ1点気になるのが、Slack連携の際のプライバシー懸念です。インタビューでも3社が「DMやプライベートチャンネルのデータがどう扱われるか不明だと導入できない」と明言しています。ここのUX設計は慎重にやる必要があります。",
    timestamp: "10:05:15",
    delayMs: 218000,
    tag: "concern",
  },
  {
    id: "t11",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "重要なポイントですね。プライバシーについてはオプトイン方式にしましょう。チャンネルごとにナレッジ抽出のON/OFFを管理者が設定できるようにして、DMは完全に対象外とする。これでFAQにも明記できます。山田さん、技術的に対応可能ですか？",
    timestamp: "10:05:45",
    delayMs: 245000,
    tag: "decision",
  },
  {
    id: "t12",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "はい、問題ありません。Slack Events APIのスコープを最小限にすればいけます。channels:historyだけ取って、groups:readやim:readは要求しない設計にすれば、OAuth認可画面でもユーザーに安心感を与えられます。あと、SOC2の観点からもデータ保持ポリシーを明確にしておきたいですね。",
    timestamp: "10:06:15",
    delayMs: 270000,
    tag: "proposal",
  },
  {
    id: "t12b",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "いいですね。ではMVPは案Bで進めましょう。次に、Q2のロードマップに移ります。佐藤さん、スケジュール感の提案をお願いします。",
    timestamp: "10:06:40",
    delayMs: 295000,
    tag: "decision",
  },
  {
    id: "t13",
    speaker: "佐藤 (Biz)",
    speakerRole: "事業開発",
    text: "はい。セキュリティは差別化にもなりますしね。Q2のロードマップとしては、4月にクローズドベータ開始で、6月末にGA（一般公開）を目標にしたいです。ベータは先ほどのインタビュー企業8社のうち、前向きだった5社に声をかけます。山田さん、このスケジュール感でエンジニアリング的にはどうですか？",
    timestamp: "10:06:55",
    delayMs: 305000,
    tag: "proposal",
  },
  {
    id: "t14",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "4月ベータだと結構タイトですね。バックエンドの設計は2週間で固められますが、Slack連携のOAuth周りとwebhookの実装に3週間。あとLLMパイプラインの構築に3週間。フロントは並行して進められるので、3月末にはベータ版を出せるかもしれません。ただしテストが足りないリスクはあります。",
    timestamp: "10:07:25",
    delayMs: 325000,
    tag: "concern",
  },
  {
    id: "t15",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "テスト不足は許容できないので、4月中旬ベータに1週間後ろ倒しでもいいかもしれません。品質で信頼を失うとエンタープライズは取り返しがつかないので。それでは最後に方針をまとめます。",
    timestamp: "10:08:00",
    delayMs: 350000,
    tag: "decision",
  },
  {
    id: "t16",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "決定事項です。MVPは案B、会議要約＋Slack連携。プライバシーはオプトイン方式、DM対象外。Q2ロードマップは4月中旬ベータ、6月末GA目標。ベータ対象は5社。アクションアイテムですが、来週までに山田さんが技術仕様のドラフト、鈴木さんがベータ企業への連絡準備、佐藤さんは価格体系の叩きをお願いします。皆さんよろしいですか？",
    timestamp: "10:08:30",
    delayMs: 375000,
    tag: "action",
  },
  {
    id: "t17",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "了解しました。来週の金曜までに技術仕様出します。",
    timestamp: "10:08:55",
    delayMs: 395000,
    tag: "agreement",
  },
  {
    id: "t18",
    speaker: "鈴木 (UXR)",
    speakerRole: "UXリサーチャー",
    text: "はい、ベータ候補の5社にはこちらから連絡入れますね。",
    timestamp: "10:09:05",
    delayMs: 402000,
    tag: "agreement",
  },
  {
    id: "t19",
    speaker: "佐藤 (Biz)",
    speakerRole: "事業開発",
    text: "承知しました。価格体系は松竹梅の3プランで叩きを作ります。",
    timestamp: "10:09:12",
    delayMs: 408000,
    tag: "agreement",
  },
  {
    id: "t20",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "ありがとうございます。では本日の会議はこれで終わりにしましょう。お疲れ様でした。",
    timestamp: "10:09:20",
    delayMs: 415000,
    tag: "agenda",
  },
];

export const mindMapUpdates: MindMapUpdate[] = [
  {
    triggeredByTranscriptId: "t1",
    nodes: [
      { id: "root", label: "新規プロダクト企画会議", type: "agenda", speaker: "田中 (PM)", summary: "3つのアジェンダを設定して会議を開始" },
      { id: "agenda1", label: "ユーザーインタビュー結果", type: "agenda", parentId: "root" },
      { id: "agenda2", label: "MVPスコープ確定", type: "agenda", parentId: "root" },
      { id: "agenda3", label: "Q2ロードマップ", type: "agenda", parentId: "root" },
    ],
    edges: [
      { source: "root", target: "agenda1" },
      { source: "root", target: "agenda2" },
      { source: "root", target: "agenda3" },
    ],
  },
  {
    triggeredByTranscriptId: "t2",
    nodes: [
      { id: "fact1", label: "ナレッジ属人化問題", type: "fact", parentId: "agenda1", speaker: "鈴木 (UXR)", summary: "退職者が出るとノウハウが完全にロストする", evidence: "8社中6社が最優先課題として挙げた", detail: "エンタープライズ8社へのヒアリング結果" },
    ],
    edges: [
      { source: "agenda1", target: "fact1" },
    ],
    suggestions: [
      { nodeId: "fact1", text: "退職時のナレッジ移行フローは確認した？", type: "question" },
    ],
  },
  {
    triggeredByTranscriptId: "t3",
    nodes: [
      { id: "example1", label: "意思決定がチャットに埋没", type: "example", parentId: "agenda1", speaker: "鈴木 (UXR)", summary: "過去の意思決定を検索するのが日常業務になっている", evidence: "100人超の組織で顕著に発生", detail: "「3ヶ月前にあの件どう決まったっけ？」が頻発" },
    ],
    edges: [
      { source: "agenda1", target: "example1" },
    ],
    suggestions: [
      { nodeId: "example1", text: "検索にかかる時間の定量調査は？", type: "question" },
    ],
  },
  {
    triggeredByTranscriptId: "t4",
    nodes: [
      { id: "proposal1", label: "LLM + RAGで解決可能", type: "proposal", parentId: "fact1", speaker: "山田 (Eng)", summary: "セマンティック検索とコンテキスト保持型要約の組合せで解決", evidence: "社内実験でRAGベースの適合率80%以上を達成", detail: "Embedding精度が実用レベルに到達" },
    ],
    edges: [
      { source: "fact1", target: "proposal1" },
      { source: "example1", target: "proposal1", label: "技術的解決策" },
    ],
  },
  {
    triggeredByTranscriptId: "t5",
    nodes: [
      { id: "fact2", label: "競合は既存ドキュメント検索が中心", type: "fact", parentId: "agenda1", speaker: "佐藤 (Biz)", summary: "リアルタイム会話からの自動構造化プレーヤーは不在", evidence: "Notion AI, Glean, Guru いずれもドキュメント横断検索" },
      { id: "opinion1", label: "「会話→ナレッジ自動変換」が空白地帯", type: "opinion", parentId: "fact2", speaker: "佐藤 (Biz)", summary: "市場的に追い風。この領域に参入できるポジションがある" },
    ],
    edges: [
      { source: "agenda1", target: "fact2" },
      { source: "fact2", target: "opinion1" },
    ],
    suggestions: [
      { nodeId: "opinion1", text: "Notionの新AI機能との差別化を明確に定義すべき", type: "next-step" },
    ],
  },
  {
    triggeredByTranscriptId: "t7",
    nodes: [
      {
        id: "mvpTable", label: "MVP案 比較", type: "proposal", parentId: "agenda2",
        richType: "comparisonTable",
        richData: {
          headers: ["案A", "案B", "案C"],
          recommendIdx: 1,
          rows: [
            { label: "スコープ", values: ["会議要約のみ", "要約+Slack連携", "フルスコープ"] },
            { label: "開発期間", values: ["2ヶ月", "4ヶ月", "7ヶ月"] },
            { label: "差別化", values: ["低", "中〜高", "高"] },
            { label: "技術リスク", values: ["低", "中", "高"] },
          ],
        },
      },
      { id: "propA", label: "案A: 会議要約のみ", type: "proposal", parentId: "mvpTable", detail: "開発2ヶ月" },
      { id: "propB", label: "案B: 要約 + Slack連携", type: "proposal", parentId: "mvpTable", detail: "開発4ヶ月" },
      { id: "propC", label: "案C: フルスコープ", type: "proposal", parentId: "mvpTable", detail: "開発7ヶ月" },
    ],
    edges: [
      { source: "agenda2", target: "mvpTable" },
      { source: "mvpTable", target: "propA" },
      { source: "mvpTable", target: "propB" },
      { source: "mvpTable", target: "propC" },
    ],
  },
  {
    triggeredByTranscriptId: "t8",
    nodes: [
      { id: "concern1", label: "案A: 差別化不足リスク", type: "concern", parentId: "propA", speaker: "山田 (Eng)", summary: "tl;dvやFirefliesと同質化し、価格競争に陥る", detail: "既存プレーヤーと機能が被る" },
      { id: "concern2", label: "案C: レイテンシー問題", type: "concern", parentId: "propC", speaker: "山田 (Eng)", summary: "リアルタイム処理はASR精度とLLM推論速度がボトルネック", detail: "技術的にはやりたいが現時点では困難" },
    ],
    edges: [
      { source: "propA", target: "concern1" },
      { source: "propC", target: "concern2" },
    ],
    suggestions: [
      { nodeId: "propB", text: "案Bの技術的実現可能性の確認は？", type: "question" },
    ],
  },
  {
    triggeredByTranscriptId: "t9",
    nodes: [
      { id: "agree1", label: "案Bに賛成（ビジネス観点）", type: "agreement", parentId: "propB", speaker: "佐藤 (Biz)", summary: "Slack連携で席単価を大幅に引き上げられる", evidence: "会議録画のみ=1,500円上限、Slack連携込み=3,000〜5,000円" },
      {
        id: "pricingKpi", label: "価格戦略・収益目標", type: "agreement", parentId: "agree1",
        richType: "metricsCard",
        richData: {
          metrics: [
            { label: "席単価", value: "3,000〜5,000円", sub: "月額", color: "#d97706" },
            { label: "ARR目標", value: "1億円", sub: "年間経常収益", color: "#059669" },
            { label: "必要社数", value: "2,000社", sub: "月5,000円の場合", color: "#3b82f6" },
            { label: "案Aの場合", value: "1,500円上限", sub: "差別化不足", color: "#dc2626" },
          ],
        },
      },
    ],
    edges: [
      { source: "propB", target: "agree1" },
      { source: "agree1", target: "pricingKpi" },
    ],
  },
  {
    triggeredByTranscriptId: "t10",
    nodes: [
      { id: "concern3", label: "プライバシー懸念", type: "concern", parentId: "propB", speaker: "鈴木 (UXR)", summary: "Slack連携時のDM・プライベートチャンネルの扱いが導入障壁", evidence: "インタビュー3社が明確に導入不可と回答", detail: "UX設計を慎重に行う必要あり" },
    ],
    edges: [
      { source: "propB", target: "concern3" },
    ],
    suggestions: [
      { nodeId: "concern3", text: "GDPR / 個人情報保護法への対応方針は？", type: "concern" },
    ],
  },
  {
    triggeredByTranscriptId: "t11",
    nodes: [
      { id: "decision1", label: "オプトイン方式に決定", type: "decision", parentId: "concern3", speaker: "田中 (PM)", summary: "管理者がチャンネル単位でナレッジ抽出ON/OFFを設定可能にする", detail: "DMは完全対象外。FAQにも明記する方針" },
    ],
    edges: [
      { source: "concern3", target: "decision1" },
    ],
  },
  {
    triggeredByTranscriptId: "t12",
    nodes: [
      { id: "proposal2", label: "Slack API最小スコープ設計", type: "proposal", parentId: "decision1", speaker: "山田 (Eng)", summary: "channels:historyのみ取得し、groups:read/im:readは要求しない", detail: "OAuth認可画面でユーザーに安心感を与える設計" },
      { id: "action1", label: "SOC2対応・データ保持ポリシー策定", type: "action", parentId: "decision1", speaker: "山田 (Eng)", summary: "データ保持ポリシーを明確化してセキュリティを差別化要因にする" },
    ],
    edges: [
      { source: "decision1", target: "proposal2" },
      { source: "decision1", target: "action1" },
    ],
  },
  {
    triggeredByTranscriptId: "t13",
    nodes: [
      { id: "proposal3", label: "4月ベータ / 6月末GA", type: "proposal", parentId: "agenda3", speaker: "佐藤 (Biz)", summary: "4月クローズドベータ開始、6月末GA目標", detail: "ベータ対象: インタビューで前向きだった5社" },
    ],
    edges: [
      { source: "agenda3", target: "proposal3" },
    ],
    suggestions: [
      { nodeId: "proposal3", text: "ベータのKPI設定が必要", type: "next-step" },
    ],
  },
  {
    triggeredByTranscriptId: "t14",
    nodes: [
      {
        id: "gantt1", label: "Q2 開発スケジュール", type: "concern", parentId: "proposal3",
        richType: "ganttChart",
        richData: {
          totalWeeks: 16,
          months: ["3月", "4月", "5月", "6月"],
          tasks: [
            { label: "BE設計", start: 0, duration: 2, color: "#3b82f6" },
            { label: "Slack OAuth/WH", start: 2, duration: 3, color: "#8b5cf6" },
            { label: "LLMパイプライン", start: 2, duration: 3, color: "#7c3aed" },
            { label: "フロント開発", start: 1, duration: 5, color: "#0891b2" },
            { label: "テスト/QA", start: 5, duration: 2, color: "#dc2626" },
            { label: "ベータ運用", start: 7, duration: 5, color: "#059669" },
            { label: "GA準備", start: 12, duration: 4, color: "#d97706" },
          ],
          milestones: [
            { label: "ベータ開始", week: 7, color: "#059669" },
            { label: "GA", week: 16, color: "#3b82f6" },
          ],
        },
      },
      { id: "concern4", label: "テスト不足リスク", type: "concern", parentId: "gantt1", speaker: "山田 (Eng)", summary: "テスト期間が2週間では品質担保が困難", detail: "全タスク合計8週間でギリギリのスケジュール" },
    ],
    edges: [
      { source: "proposal3", target: "gantt1" },
      { source: "gantt1", target: "concern4" },
    ],
  },
  {
    triggeredByTranscriptId: "t16",
    nodes: [
      { id: "final1", label: "MVP: 案Bに決定", type: "decision", parentId: "agenda2", speaker: "田中 (PM)", summary: "会議要約＋Slack連携をMVPスコープとして決定", detail: "プライバシーはオプトイン方式、DM対象外" },
      { id: "final2", label: "ベータ: 4月中旬に後倒し", type: "decision", parentId: "agenda3", speaker: "田中 (PM)", summary: "品質確保のため1週間後ろ倒し。エンタープライズの信頼を優先" },
      { id: "task1", label: "技術仕様ドラフト作成", type: "action", parentId: "final1", speaker: "山田 (Eng)", summary: "MVPの技術仕様書を作成する", detail: "期限: 来週金曜" },
      { id: "task2", label: "ベータ企業への連絡準備", type: "action", parentId: "final1", speaker: "鈴木 (UXR)", summary: "候補5社への参加打診を準備する", detail: "期限: 来週" },
      { id: "task3", label: "価格体系の叩き作成", type: "action", parentId: "final1", speaker: "佐藤 (Biz)", summary: "松竹梅の3プランで価格体系を起案する", detail: "期限: 来週" },
    ],
    edges: [
      { source: "agenda2", target: "final1" },
      { source: "agenda3", target: "final2" },
      { source: "final1", target: "task1" },
      { source: "final1", target: "task2" },
      { source: "final1", target: "task3" },
    ],
  },
];
