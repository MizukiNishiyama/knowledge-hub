# リサーチ結果

generated_at: 2026-03-05
source: memo.md

## 競合サービス

### Origin AI（ADTが$170Mで買収 — 最重要ベンチマーク）
- URL: https://www.originwirelessai.com
- 概要: WiFiセンシング技術のパイオニア。WiFi信号を活用した在室検知・動体検知・セキュリティ製品を提供。2026年2月にADT（米国最大手ホームセキュリティ企業）が$170M（約255億円）で買収
- ターゲット: ISP（通信事業者）、ホームセキュリティ企業、スマートホームデベロッパー
- 価格帯: B2B2C モデル。ISP・セキュリティ企業向けのライセンス提供（消費者向け直販なし）
- 強み: 2013年創業の先行者。WiFiセンシングの基礎特許を多数保有。Verizon・ADTとの大型パートナーシップ実績。TruShield Security（ゾーン検知）・TruPresence（在室検知）の2製品を展開
- 弱み: ADT買収によりクローズド化が進む可能性。バイタルセンシング（呼吸・心拍）までは製品化していない
- 参考になる点: **$170Mでの買収は、WiFiセンシング技術の事業価値を証明した最重要イベント**。ただしOriginは自社ハードウェアではなく、既存ルーターのソフトウェアレイヤーとして提供するモデル

### Cognitive Systems（WiFi Motion）
- URL: https://www.cognitivesystems.com
- 概要: WiFi Motion™ ブランドでISP向けのWiFi動体検知ソフトウェアを提供。Broadcom WiFi 6/6Eチップセットに組み込み可能
- ターゲット: ISP・通信事業者（B2B2Cモデル）
- 価格帯: チップセットベンダー（Broadcom）経由のライセンス。消費者向け直販なし
- 強み: Broadcomとのパートナーシップにより、WiFi 6/6E対応ルーター全般に組み込み可能。CSI（Channel State Information）分析+機械学習で人とペットを区別
- 弱み: 動体検知のみ。姿勢推定・バイタルセンシングは提供していない。Originと比べてパートナー規模が小さい
- 参考になる点: チップセットレベルでの組み込みにより「ルーターに標準搭載」を実現。スタンドアロンデバイスではなく既存インフラへの統合が鍵

### Linksys Aware
- URL: https://www.linksys.com/us/linksys-aware/
- 概要: Linksysのメッシュルーター向けWiFi動体検知サービス。2019年にFirst-to-Market として消費者向けに発売
- ターゲット: Linksysメッシュルーターユーザー（B2C）
- 価格帯: 月額$2.99 / 年額$24.99（90日間無料トライアル付き）
- 強み: 消費者向けWiFiセンシングの先駆者。月額$3の低価格。60日間の動体履歴を保持。感度調整で誤報低減
- 弱み: 動体検知のみ（在室検知・バイタルセンシングなし）。Linksysルーター専用で汎用性がない。「Limited but fascinating」との評価が多く、精度に課題
- 参考になる点: **消費者向けWiFiセンシングの価格ベンチマーク（月額$3）**。低価格で市場教育を行い、プレミアム機能で収益化する戦略

### MAMOLEO ライトプラン（オプテージ / ai6）
- URL: https://www.mamoleo.jp
- 概要: 関西電力系ISPのオプテージが2025年4月に提供開始した、WiFiセンシング技術による家庭向け防犯サービス。ai6社のWiFiセンシングソリューションを採用
- ターゲット: 関西圏の共働き世帯・高齢者世帯（B2C、ISP経由）
- 価格帯: 月額1,100円。セキュリティ員駆けつけは5,500円/30分（オプション）。初期費用なし（WiFiセンサーをコンセントに挿すだけ）
- 強み: **日本初のWiFiセンシング商用サービス**。工事不要・初期費用ゼロの手軽さ。約100㎡以上の広域をカバー。赤外線センサーより広い検知範囲
- 弱み: 関西5府県限定。動体検知・在不在の判定のみで、バイタルセンシングや姿勢推定は非対応。オプテージ（eo光）ユーザー以外への展開が不明
- 参考になる点: **日本市場でのWiFiセンシング商用化の価格・機能ベンチマーク**。月額1,100円で防犯サービスを提供。ISP経由のB2B2Cモデル

### Algorized
- URL: https://www.algorized.com
- 概要: UWB（Ultra-Wideband）無線センサー向けのEdge AI人体検知ソフトウェアプラットフォーム。CES 2026でHuman-Machine Interactionエンジンを発表
- ターゲット: IoTデバイスメーカー・ロボティクス企業（B2B）
- 価格帯: 非公開（ライセンスモデル）
- 強み: WiFiではなくUWBを使用し、より高精度な人体検知を実現。Edge AIで処理するためプライバシー保護に強み。ファウンデーションモデルとして汎用性が高い
- 弱み: UWB対応デバイスが必要で、WiFiのように既存インフラを活用できない。市場認知度が低い
- 参考になる点: WiFi vs UWB の技術選択における比較対象。UWBは精度で優位だが、WiFiは「既に家にあるインフラ」という圧倒的な普及率で優位

### Xfinity WiFi Motion（Comcast）
- URL: 非公開（Xfinityサービスの一機能）
- 概要: Comcastが2025年からXfinityホームインターネット顧客向けに提供開始したWiFi動体検知機能
- ターゲット: Xfinityホームインターネットユーザー（米国、B2C）
- 価格帯: Xfinity月額プランの付帯機能（追加料金の詳細は不明）
- 強み: 米国最大手ISPの一つが標準搭載。巨大なユーザーベースで一気にWiFiセンシングを普及させる力がある
- 弱み: 動体検知に限定。ISP契約に紐づくため他社ユーザーは利用不可
- 参考になる点: **大手ISPがWiFiセンシングを「標準機能」として提供し始めた**。これは技術の成熟を示す一方、独立プロダクトの存在意義を脅かす

## 市場規模・トレンド

### グローバル市場

| 指標 | 数値 | ソース |
|---|---|---|
| 屋内位置測位市場（2025） | 約169億ドル | Research and Markets |
| 同 2032年予測 | 約725億ドル（CAGR 23.1%） | Research and Markets |
| ワイヤレスセンサー市場（2025） | 約148億ドル | Mordor Intelligence |
| 同 2030年予測 | 約482億ドル（CAGR 26.6%） | Mordor Intelligence |
| ワイヤレスIoTセンサー市場（2026） | 約124億ドル | Business Research Insights |
| 同 2035年予測 | 約723億ドル（CAGR 21.7%） | Business Research Insights |

### 日本市場

| 指標 | 数値 | ソース |
|---|---|---|
| 高齢者見守り・緊急通報サービス市場（2025予測） | 227億円 | シード・プランニング |
| 高齢者/介護関連製品・サービス市場（2025予測） | 9,254億円 | 富士経済 |
| スマートホーム市場（日本、2025推定） | 約5,000億円 | 各種推計 |

### TAM / SAM / SOM 推定

| レイヤー | 定義 | 推定規模 |
|---|---|---|
| TAM | グローバルのWiFiセンシング関連市場（屋内位置測位+ワイヤレスセンサーの重複除外） | 約150-200億ドル（2025年） |
| SAM | WiFiセンシングを活用した見守り・セキュリティ・ヘルスケア市場（日本+米国） | 約500-1,000億円 |
| SOM | 初期ターゲット（日本の高齢者見守り×WiFiセンシング） | 約10-30億円 |

### 主要トレンド

1. **大手ISP/セキュリティ企業によるWiFiセンシングの「コモディティ化」**: ADTがOriginを$170Mで買収、ComcastがXfinityに搭載、オプテージがMAMOLEOを開始。WiFiセンシングの基本機能（動体検知・在不在判定）は既存インフラに組み込まれつつある
2. **IEEE 802.11bf 規格の策定**: WiFiセンシングの標準規格が2025年に策定される見込み。これにより全てのWiFiデバイスがセンシングデータを容易に取得可能になり、市場拡大の加速が予想される
3. **「カメラレス」がプライバシー訴求の鍵**: MAMOLEO・Linksys Aware・Origin AI のいずれも「カメラなし・映像なし」をプライバシー保護の最大の訴求点としている
4. **バイタルセンシングはまだ実験段階**: 呼吸・心拍のWiFiセンシングは学術研究では10年以上の実績があるが、商用製品として精度保証しているプレイヤーは現時点で存在しない
5. **災害対応はニッチだが強力なユースケース**: RuViewのWiFi-Mat（瓦礫越し生存者検知）のような災害対応用途は、政府・自治体向けの高単価・高信頼性が求められる特殊市場

## 技術的な実現手段

### WiFiセンシングの基盤技術
- **Channel State Information（CSI）**: WiFi信号のサブキャリアごとの振幅・位相データ。人体の動き・呼吸・心拍がCSIパターンに影響を与えることを利用
- **ESP32-S3**: Espressif Systems製のWiFi+BLE対応SoC。CSI取得が可能なファームウェアが利用可能。1チップ約$3-8
- **RuView（MIT License）**: 17点姿勢推定・バイタルセンシング・壁越し検知のOSS。Rust実装で54,000fps処理。AIモデル55KB。**ただし実環境での精度に課題報告あり**

### ハードウェア構成
- **最小構成**: ESP32-S3ノード × 4台（$48）で360度カバレッジ、12測定リンク、20Hz更新
- **エッジ処理**: Raspberry Pi 4/5 または Jetson Nano で推論処理。クラウド不要の完全ローカル処理が可能
- **量産**: ESP32-S3ベースのカスタム基板設計 → 中国EMS（Shenzhen等）で量産。BOM $15-25/ノード

### ソフトウェアスタック
- **ファームウェア**: ESP-IDF（Espressif IoT Development Framework）でCSI取得+BLE送信
- **推論エンジン**: RuViewのRust実装 or TensorFlow Lite for Microcontrollers
- **クラウド**: AWS IoT Core / GCP IoT Core でデバイス管理・データ集約
- **アプリケーション**: React Native / Flutter でモバイルアプリ。リアルタイムダッシュボード

### 認証・規制
- **電波法（技適）**: ESP32は技適認証取得済みモジュールが流通。ただしカスタム基板設計の場合は再認証が必要な場合あり
- **薬機法**: バイタルセンシング（呼吸・心拍）を医療用途で提供する場合、医療機器認証が必要。ウェルネス用途（「目安値」表示）なら不要の可能性
- **IEEE 802.11bf**: 2025年策定予定のWiFiセンシング標準規格。将来的にこの規格に準拠することで相互運用性が向上

## 参考リンク
- [RuView GitHub](https://github.com/ruvnet/RuView) - WiFi DensePoseのOSS実装
- [ADT Acquires Origin AI ($170M)](https://www.globenewswire.com/news-release/2026/02/24/3243557/0/en/ADT-Acquires-Origin-AI-to-Power-AI-Sensing-and-Ambient-Intelligence-for-the-Home.html) - WiFiセンシング企業の大型買収事例
- [Cognitive Systems WiFi Motion](https://www.cognitivesystems.com/wifi-motion/) - ISP向けWiFiセンシングソフトウェア
- [MAMOLEO ライトプラン](https://optage.co.jp/press/2025/press_11.html) - 日本初のWiFiセンシング商用サービス
- [MIT Technology Review: How Wi-Fi sensing became usable tech](https://www.technologyreview.com/2024/02/27/1088154/wifi-sensing-tracking-movements/) - WiFiセンシング技術の成熟過程
- [Linksys Aware](https://www.linksys.com/us/linksys-aware/) - 消費者向けWiFi動体検知の先駆者
- [IEEE 802.11bf WiFi Sensing Standard](https://www.kaspersky.com/blog/wifi-sensing-motion-detection-howto/53851/) - WiFiセンシング標準規格の解説
- [RuView Issue #37: Accuracy discussion](https://github.com/ruvnet/RuView/issues/37) - RuViewの実環境精度に関する議論
