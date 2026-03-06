export interface TranscriptEntry {
  id: string;
  speaker: string;
  speakerRole: string;
  text: string;
  timestamp: string;
  delayMs: number; // ms after start to show this entry
}

export interface MindMapUpdate {
  triggeredByTranscriptId: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  suggestions?: SuggestionItem[];
}

export interface MindMapNode {
  id: string;
  label: string;
  type: "topic" | "decision" | "action" | "question" | "insight" | "risk";
  parentId?: string;
  detail?: string;
}

export interface MindMapEdge {
  source: string;
  target: string;
  label?: string;
}

export interface SuggestionItem {
  nodeId: string;
  text: string;
  type: "question" | "risk" | "next-step";
}

// SaaS新規プロダクトの企画会議 - かなり実務的な内容
export const transcriptData: TranscriptEntry[] = [
  {
    id: "t1",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "それでは定例の新規プロダクト企画会議を始めます。今日のアジェンダは3つ。まず前回のユーザーインタビュー結果の共有、次にMVPスコープの確定、最後にQ2のロードマップについてです。",
    timestamp: "10:00:05",
    delayMs: 0,
  },
  {
    id: "t2",
    speaker: "鈴木 (UXR)",
    speakerRole: "UXリサーチャー",
    text: "では先にインタビュー結果から。先週8社のエンタープライズ顧客にヒアリングしました。一番多かった課題は、社内ナレッジが属人化していて、退職者が出るとノウハウが完全にロストするということ。8社中6社がこれを最優先課題に挙げています。",
    timestamp: "10:00:35",
    delayMs: 3000,
  },
  {
    id: "t3",
    speaker: "鈴木 (UXR)",
    speakerRole: "UXリサーチャー",
    text: "2番目に多かったのが、SlackやTeamsの会話に重要な意思決定が埋もれてしまう問題。特に100人以上の組織で顕著で、「3ヶ月前にあの件どう決まったっけ？」という検索が日常的に発生しているとのことです。",
    timestamp: "10:01:10",
    delayMs: 7000,
  },
  {
    id: "t4",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "それは技術的には面白い課題ですね。LLMを使ったセマンティック検索と、会話のコンテキストを保持した要約生成の組み合わせで解決できそうです。既にEmbeddingの精度はかなり上がっていて、社内実験でもRAGベースのアプローチで80%以上の適合率を出せています。",
    timestamp: "10:01:45",
    delayMs: 12000,
  },
  {
    id: "t5",
    speaker: "佐藤 (Biz)",
    speakerRole: "事業開発",
    text: "市場的にも追い風です。Notionが先月ナレッジベースAI機能を発表しましたが、あれはあくまでドキュメント内の検索。リアルタイムの会話からナレッジを自動構造化するプレーヤーはまだいません。競合のGleanやGuruも、既存ドキュメントの横断検索が中心です。",
    timestamp: "10:02:20",
    delayMs: 17000,
  },
  {
    id: "t6",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "なるほど、ポジショニング的には「会話→ナレッジの自動変換」がキーになりそうですね。ではMVPのスコープに入りましょう。前回の議論を踏まえて、私の方で3つの案を用意しました。",
    timestamp: "10:02:55",
    delayMs: 22000,
  },
  {
    id: "t7",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "案A: 会議録画の自動要約と構造化のみ。案B: それに加えてSlack連携で会話のナレッジ抽出。案C: フルスコープでリアルタイム構造化＋ナレッジベース自動生成まで。開発工数はそれぞれ2ヶ月、4ヶ月、7ヶ月の見込みです。",
    timestamp: "10:03:25",
    delayMs: 27000,
  },
  {
    id: "t8",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "エンジニアリング観点だと案Bが現実的です。案Aだと差別化が弱い。tl;dvやFirefliesと変わらなくなる。案Cは技術的にはやりたいですが、リアルタイム処理のレイテンシー問題が大きくて、ストリーミングASRの精度とLLM推論速度の両方がボトルネックになります。",
    timestamp: "10:04:00",
    delayMs: 33000,
  },
  {
    id: "t9",
    speaker: "佐藤 (Biz)",
    speakerRole: "事業開発",
    text: "ビジネスサイドとしても案Bに賛成です。エンタープライズ向けだとSlack連携は必須ですし、会議録画だけだと月額1,500円が上限。Slack連携まで入れれば席単価3,000〜5,000円は取れると見ています。ARR1億のラインを考えると、2,000社×月5,000円で届きます。",
    timestamp: "10:04:35",
    delayMs: 38000,
  },
  {
    id: "t10",
    speaker: "鈴木 (UXR)",
    speakerRole: "UXリサーチャー",
    text: "ユーザーの声からも案Bですね。ただ1点気になるのが、Slack連携の際のプライバシー懸念。インタビューでも3社が「DMやプライベートチャンネルのデータがどう扱われるか不明だと導入できない」と明言しています。ここのUX設計は慎重にやる必要があります。",
    timestamp: "10:05:10",
    delayMs: 44000,
  },
  {
    id: "t11",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "重要なポイントですね。プライバシーについてはオプトイン方式にしましょう。チャンネルごとにナレッジ抽出のON/OFFを管理者が設定できるようにして、DMは完全に対象外とする。これでFAQにも明記できます。",
    timestamp: "10:05:45",
    delayMs: 50000,
  },
  {
    id: "t12",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "技術的にはSlack Events APIのスコープを最小限にすればいけます。channels:historyだけ取って、groups:readやim:readは要求しない設計にすれば、OAuth認可画面でもユーザーに安心感を与えられます。SOC2の観点からもデータ保持ポリシーを明確にしておきたい。",
    timestamp: "10:06:15",
    delayMs: 55000,
  },
  {
    id: "t13",
    speaker: "佐藤 (Biz)",
    speakerRole: "事業開発",
    text: "セキュリティは差別化にもなりますね。あとQ2のロードマップについてですが、4月にクローズドベータ開始で、6月末にGA（一般公開）を目標にしたい。ベータは先ほどのインタビュー企業8社のうち、前向きだった5社に声をかけます。",
    timestamp: "10:06:50",
    delayMs: 61000,
  },
  {
    id: "t14",
    speaker: "山田 (Eng)",
    speakerRole: "テックリード",
    text: "4月ベータだと結構タイトですね。バックエンドの設計は2週間で固められますが、Slack連携のOAuth周りとwebhookの実装に3週間。あとLLMパイプラインの構築に3週間。フロントは並行して進められるので、3月末にはベータ版を出せるかもしれません。ただしテストが足りないリスクはあります。",
    timestamp: "10:07:25",
    delayMs: 67000,
  },
  {
    id: "t15",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "テスト不足は許容できないので、4月中旬ベータに1週間後ろ倒しでもいいかもしれません。品質で信頼を失うとエンタープライズは取り返しがつかない。それでは方針をまとめます。",
    timestamp: "10:08:00",
    delayMs: 73000,
  },
  {
    id: "t16",
    speaker: "田中 (PM)",
    speakerRole: "プロダクトマネージャー",
    text: "決定事項。MVPは案B、会議要約＋Slack連携。プライバシーはオプトイン方式、DM対象外。Q2ロードマップは4月中旬ベータ、6月末GA目標。ベータ対象は5社。来週までに山田さんが技術仕様のドラフトを出して、鈴木さんがベータ企業への連絡準備をお願いします。佐藤さんは価格体系の叩きを作ってください。",
    timestamp: "10:08:30",
    delayMs: 78000,
  },
];

export const mindMapUpdates: MindMapUpdate[] = [
  {
    triggeredByTranscriptId: "t1",
    nodes: [
      { id: "root", label: "新規プロダクト企画会議", type: "topic" },
      { id: "agenda1", label: "ユーザーインタビュー結果", type: "topic", parentId: "root" },
      { id: "agenda2", label: "MVPスコープ確定", type: "topic", parentId: "root" },
      { id: "agenda3", label: "Q2ロードマップ", type: "topic", parentId: "root" },
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
      { id: "insight1", label: "ナレッジ属人化問題", type: "insight", parentId: "agenda1", detail: "8社中6社が最優先課題" },
    ],
    edges: [
      { source: "agenda1", target: "insight1" },
    ],
    suggestions: [
      { nodeId: "insight1", text: "退職時のナレッジ移行フローは？", type: "question" },
    ],
  },
  {
    triggeredByTranscriptId: "t3",
    nodes: [
      { id: "insight2", label: "意思決定の埋没問題", type: "insight", parentId: "agenda1", detail: "100人以上の組織で顕著" },
    ],
    edges: [
      { source: "agenda1", target: "insight2" },
    ],
    suggestions: [
      { nodeId: "insight2", text: "検索頻度の定量データは？", type: "question" },
    ],
  },
  {
    triggeredByTranscriptId: "t4",
    nodes: [
      { id: "tech1", label: "LLM + セマンティック検索", type: "insight", parentId: "insight1", detail: "RAGで適合率80%以上" },
    ],
    edges: [
      { source: "insight1", target: "tech1" },
      { source: "insight2", target: "tech1", label: "解決手段" },
    ],
  },
  {
    triggeredByTranscriptId: "t5",
    nodes: [
      { id: "market1", label: "競合分析", type: "topic", parentId: "agenda1" },
      { id: "market2", label: "差別化: 会話→ナレッジ自動変換", type: "insight", parentId: "market1", detail: "既存競合はドキュメント検索中心" },
    ],
    edges: [
      { source: "agenda1", target: "market1" },
      { source: "market1", target: "market2" },
    ],
    suggestions: [
      { nodeId: "market2", text: "Notionの新機能との差別化をより明確に", type: "next-step" },
    ],
  },
  {
    triggeredByTranscriptId: "t7",
    nodes: [
      { id: "mvpA", label: "案A: 会議要約のみ", type: "question", parentId: "agenda2", detail: "開発2ヶ月" },
      { id: "mvpB", label: "案B: 要約+Slack連携", type: "question", parentId: "agenda2", detail: "開発4ヶ月" },
      { id: "mvpC", label: "案C: フルスコープ", type: "question", parentId: "agenda2", detail: "開発7ヶ月" },
    ],
    edges: [
      { source: "agenda2", target: "mvpA" },
      { source: "agenda2", target: "mvpB" },
      { source: "agenda2", target: "mvpC" },
    ],
  },
  {
    triggeredByTranscriptId: "t8",
    nodes: [
      { id: "eval1", label: "案A: 差別化弱い", type: "risk", parentId: "mvpA" },
      { id: "eval2", label: "案C: レイテンシーリスク", type: "risk", parentId: "mvpC" },
    ],
    edges: [
      { source: "mvpA", target: "eval1" },
      { source: "mvpC", target: "eval2" },
    ],
    suggestions: [
      { nodeId: "mvpB", text: "案Bが技術的にも最適？", type: "question" },
    ],
  },
  {
    triggeredByTranscriptId: "t9",
    nodes: [
      { id: "pricing1", label: "価格戦略", type: "topic", parentId: "mvpB", detail: "席単価 3,000〜5,000円" },
      { id: "pricing2", label: "ARR目標: 1億円", type: "insight", parentId: "pricing1", detail: "2,000社 × 月5,000円" },
    ],
    edges: [
      { source: "mvpB", target: "pricing1" },
      { source: "pricing1", target: "pricing2" },
    ],
  },
  {
    triggeredByTranscriptId: "t10",
    nodes: [
      { id: "risk1", label: "プライバシー懸念", type: "risk", parentId: "mvpB", detail: "3社が導入障壁と指摘" },
    ],
    edges: [
      { source: "mvpB", target: "risk1" },
    ],
    suggestions: [
      { nodeId: "risk1", text: "GDPR/個人情報保護法への対応は？", type: "risk" },
    ],
  },
  {
    triggeredByTranscriptId: "t11",
    nodes: [
      { id: "decision1", label: "オプトイン方式採用", type: "decision", parentId: "risk1", detail: "チャンネル単位でON/OFF、DM対象外" },
    ],
    edges: [
      { source: "risk1", target: "decision1" },
    ],
  },
  {
    triggeredByTranscriptId: "t12",
    nodes: [
      { id: "tech2", label: "Slack API最小スコープ設計", type: "action", parentId: "decision1", detail: "channels:historyのみ" },
      { id: "tech3", label: "SOC2対応検討", type: "action", parentId: "decision1" },
    ],
    edges: [
      { source: "decision1", target: "tech2" },
      { source: "decision1", target: "tech3" },
    ],
  },
  {
    triggeredByTranscriptId: "t13",
    nodes: [
      { id: "timeline1", label: "4月: クローズドベータ", type: "action", parentId: "agenda3", detail: "5社対象" },
      { id: "timeline2", label: "6月末: GA (一般公開)", type: "action", parentId: "agenda3" },
    ],
    edges: [
      { source: "agenda3", target: "timeline1" },
      { source: "agenda3", target: "timeline2" },
      { source: "timeline1", target: "timeline2", label: "段階的" },
    ],
    suggestions: [
      { nodeId: "timeline1", text: "ベータのKPIは何を設定する？", type: "question" },
    ],
  },
  {
    triggeredByTranscriptId: "t14",
    nodes: [
      { id: "risk2", label: "テスト不足リスク", type: "risk", parentId: "timeline1", detail: "4月頭は厳しい" },
    ],
    edges: [
      { source: "timeline1", target: "risk2" },
    ],
  },
  {
    triggeredByTranscriptId: "t16",
    nodes: [
      { id: "final1", label: "MVP: 案Bに決定", type: "decision", parentId: "agenda2" },
      { id: "action1", label: "山田: 技術仕様ドラフト", type: "action", parentId: "final1", detail: "来週まで" },
      { id: "action2", label: "鈴木: ベータ企業連絡", type: "action", parentId: "final1", detail: "来週まで" },
      { id: "action3", label: "佐藤: 価格体系叩き", type: "action", parentId: "final1", detail: "来週まで" },
      { id: "final2", label: "ベータ: 4月中旬に変更", type: "decision", parentId: "agenda3" },
    ],
    edges: [
      { source: "agenda2", target: "final1" },
      { source: "final1", target: "action1" },
      { source: "final1", target: "action2" },
      { source: "final1", target: "action3" },
      { source: "agenda3", target: "final2" },
    ],
  },
];
