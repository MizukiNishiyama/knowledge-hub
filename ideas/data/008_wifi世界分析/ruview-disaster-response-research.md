# RuView WiFiセンシング 災害対応リサーチレポート

generated_at: 2026-03-05
source: https://github.com/ruvnet/RuView

---

## 1. エグゼクティブサマリー

RuView（旧wifi-densepose）は、WiFi CSI（Channel State Information）を利用して、カメラ不要で人体検出・姿勢推定・バイタルサイン検出を行うオープンソースプロジェクト。災害対応モジュール「WiFi-Mat」を含み、壁越し・瓦礫越しの生存者検知をうたう。

**結論: RuViewは災害対応用途においては「研究フレームワーク/プロトタイプ」であり、実戦投入レベルの検証は一切行われていない。プロジェクト自体の信頼性にも重大な疑義がある。**

---

## 2. リポジトリ概要

| 項目 | 詳細 |
|------|------|
| URL | https://github.com/ruvnet/RuView |
| スター数 | 約27,700（2026年3月時点） |
| フォーク数 | 約3,536 |
| 言語 | Rust（v2）、Python（v1） |
| 作成日 | 2025年6月7日 |
| ライセンス | MIT |
| リリース数 | 3（ESP32ファームウェアのみ） |

---

## 3. WiFi-Mat 災害対応モジュールの公称スペック

### 3.1 検出能力（ドキュメント記載値）

| 災害タイプ | 検出範囲 | 最大深度 | 成功率 |
|-----------|---------|---------|--------|
| 地震瓦礫 | 15-30m | 5m | 85-92% |
| ビル倒壊 | 20-40m | 8m | 80-88% |
| 雪崩 | 10-20m | 3m（雪） | 75-85% |
| 鉱山崩落 | 15-25m | 10m | 70-82% |
| 洪水 | 10-15m | 2m | 88-95% |

### 3.2 バイタルサイン検出

- 呼吸検出: 0.1-0.5 Hz（4-60 回/分）
- 心拍検出: 0.8-3.3 Hz（30-200 BPM）マイクロドップラー方式
- 動作分類: 粗大運動、微細運動、震え、周期運動

### 3.3 位置推定

- 2D精度: ±0.5m（3センサー以上）
- 深度推定: ±0.3m（瓦礫越し最大5m）

### 3.4 START トリアージ

- Immediate（即時）: 重篤なバイタルサイン異常
- Delayed（遅延）: 安定しているが負傷
- Minor（軽症）: 軽傷でバイタル安定
- Deceased（死亡）: 生命兆候なし

---

## 4. 信頼性に関する重大な問題

### 4.1 スター数操作の疑惑

- 27,700スターに対し、総コミット数が著しく少ない（元のwifi-densepose時代に約35コミットで8,365スター = コミットあたり約239スター）
- Issue #12（削除済み）で「6ヶ月間コミットなしで1.3kから3k+に一晩でスター増加」と報告
- 複数の外部分析者がスター購入を指摘

### 4.2 コード品質に関する疑義

**deletexiumu/wifi-densepose フォーク**（11スター）がプロジェクトのスキャムアラートを掲げ、以下を主張:

- `ESP32CSIParser.parse()` が `np.random.rand()` を返す
- `_read_raw_data()` がハードウェアからの読み取りではなくハードコード文字列を返す
- `_extract_doppler_features()` が `np.random.rand(10)` を「プレースホルダー」として使用
- 事前学習済みモデルの重み、学習スクリプト、データセット、評価コードが一切存在しない

**独自検証結果（本リサーチ）:**

| ファイル | 評価 |
|---------|------|
| v1/src/core/csi_processor.py | 正当な信号処理コード。np.random.randなし。scipy使用 |
| v1/src/sensing/feature_extractor.py | 正当な特徴抽出。CUSUM、FFT使用。ランダムデータなし |
| v1/src/hardware/csi_extractor.py | **問題あり**: `_read_raw_data()` にハードコード文字列、`_establish_hardware_connection()` がTrueを返すだけのプレースホルダー、Atheros CSIパーサーは未実装 |
| rust-port breathing.rs | 正当な信号処理: IIRバンドパスフィルタ、ゼロクロッシング検出。ただしテストは合成正弦波のみ |
| rust-port ml/mod.rs | アーキテクチャ定義のみ。モデル重みなし。ONNX外部ファイル参照だが同梱されていない |

### 4.3 Issue削除・抑圧

- 元リポジトリのIssue #3, #5-9, #11-16が「not planned」としてクローズ
- 技術監査Issue #29が完全削除
- Hacker Newsの開発者コンセンサス: 「機能しない」「vibecoding」

### 4.4 開発者の反論（Issue #37）

- 「WiFi CSIベースの人体センシングは10年以上の査読付き研究がある」
- ESP32-S3ファームウェアで実際にCSIデータをキャプチャ可能
- 229テスト通過、693フレームを21.6fpsでキャプチャ
- しかし**引用した学術論文が無関係なもの**だと指摘される（IEEE論文がビデオエンコーディング、ACM論文がLoRaセンシング）

---

## 5. 実際のコード実装の現状

### 5.1 動作するもの

- **ESP32 CSIファームウェア**: 実際にCSIデータを20Hzでストリーミング可能（v0.1.0-v0.3.0リリース済み）
- **基本的な信号処理**: 位相アンラッピング、Welford統計、サブキャリアフィルタリング
- **IIRバンドパスフィルタ**: 呼吸（0.1-0.5 Hz）、心拍（0.8-2.0 Hz）帯域
- **存在検知**: CSI振幅変動に基づく基本的な存在検知
- **ユニットテスト**: 1,031のRustテストが通過（ただし合成データに対するテスト）

### 5.2 動作しない/未実装のもの

- **実データでの検証**: Witness Log ADR-028が明示的に認めている - 「合成参照信号（seed=42）のみ」
- **実世界CSIデータセット**: 同梱されていない
- **学習済みMLモデル**: ONNX参照パスはあるが、モデルファイル自体が存在しない
- **姿勢推定の実動作**: 17キーポイント推定を主張するが、実証されていない
- **壁越し検出の実測データ**: 一切の実測結果が公開されていない
- **災害シナリオでのテスト**: ゼロ

### 5.3 Dockerでのデモについて

デフォルトのDockerデプロイメントは**シミュレーションモード**で動作。UIは動作するが、実センサーデータではなくシミュレートされたデータを表示。ユーザーが `/health` エンドポイントで確認しないとシミュレーションモードと気づかない。

---

## 6. WiFi-Mat 災害対応スペックの検証

### 6.1 公称値 vs 学術的に実証されている値

| パラメータ | RuView公称値 | 学術研究の実績 | 乖離 |
|-----------|------------|--------------|------|
| 壁越し存在検知距離 | 15-40m | 2-4m（単一アンテナ）、18.5m（指向性アンテナ+ESP32、学術実験） | **大幅に楽観的** |
| コンクリート越し深度 | 5-10m | 30cm（CMU DensePose）、42cm（専用レーダー SJ6000+で18m） | **WiFiでは未実証** |
| 呼吸検出精度 | 85-95% | 96%（LOS条件下）、NLOSでは大幅低下 | **NLOSでは過大** |
| 心拍検出 | 40-120 BPM | 実験的に可能だが精度限定的、2-4m範囲 | **壁越しでは未実証** |
| 複数人検出 | 3-5人/AP | 研究段階で課題山積（FFTベースの分離の限界） | **楽観的** |

### 6.2 学術研究が示す実際の限界

**Carnegie Mellon DensePose from WiFi (2023)**:
- 3台のルーターからのCSIで24人体領域のUV座標を推定
- 胴体の検出は可能だが、**四肢の検出には困難**
- 学習データは限定的で、レイアウト汎化が課題
- 距離・壁材質に関する定量スペックは公表されていない

**ESP32 CSI Through-Wall HAR (2023, Springer)**:
- 2.4GHz指向性ビクワッドアンテナ + ESP32で18.5m・5部屋越しのテスト
- CNN HAR モデルで85%以上の精度（LOS: 392サンプル、NLOS: 384サンプル）
- **標準ESP32（内蔵アンテナ）では性能が大幅に低下**

**IEEE 802.11bf (2025年承認)**:
- WiFiセンシングの標準化を進めるが、**災害対応用途は射程外**
- チャネルアクセスの断続性が精度を制限
- 動的環境での位置推定誤差が増大

**既存のバイタルサイン検出研究**:
- 呼吸検出: LOS条件で高精度（誤差0.13 brpm）だが、**コンクリート壁越しではCSI測定の信頼性が不十分**
- 心拍検出: 単一アンテナで2-4mの短距離のみ
- **瓦礫越し（ランダムな残骸・金属・水）での検証は皆無**

---

## 7. フォークの状況

| フォーク | 説明 | 災害関連機能 |
|---------|------|------------|
| deletexiumu/wifi-densepose (11★) | **スキャムアラート**: 技術監査で非機能的と判定 | なし（監査リポジトリ） |
| Scottcjn/wifi-densepose (14★) | wifi-densepose のフォーク | 独自の災害関連実装なし |
| yangsuzhou/wifi-densepose (12★) | wifi-densepose のフォーク | 独自の災害関連実装なし |
| LuisKoo/ruvnet_wifi-densepose (9★) | wifi-densepose のフォーク | 独自の災害関連実装なし |

**災害対応機能を独自に実装・テストしたフォークは発見されなかった。**

---

## 8. 比較: 実用されている壁越し検出技術

災害救助において**実際に使用されている**壁越し生存者検出技術:

| 技術 | 実績 | 検出距離 | 壁厚 |
|------|------|---------|------|
| UWB レーダー（SJ-3000/SJ-6000+） | 2006年アジア太平洋地震訓練、2008年四川大地震 | 静止人: 18m、移動人: 27m | 42cm |
| UWB レーダー（Xaver 400, Camero） | 2023年トルコ地震、2017年メキシコ地震 | 数メートル | 複数壁 |
| マイクロ波ドップラーレーダー | 多数の実地展開 | 7フィート（瓦礫3フィート含む） | 瓦礫越し |
| WiFi CSI（研究段階） | 実災害での使用実績なし | 2-18.5m（実験室） | 標準壁のみ |

---

## 9. 総合評価

### 9.1 RuViewプロジェクトの信頼性

| 評価項目 | スコア | 根拠 |
|---------|--------|------|
| コードの実在性 | 3/10 | 信号処理の一部は実装されているが、ML推論・姿勢推定のコア機能が欠落 |
| スター数の信頼性 | 1/10 | 複数の独立分析でスター購入が指摘 |
| ドキュメントの正確性 | 2/10 | 検証不可能なスペックが多数。引用論文の不正確さ |
| 災害対応機能の成熟度 | 1/10 | 実データでのテストゼロ。MLモデル未同梱。シミュレーションのみ |
| ESP32 CSIファームウェア | 6/10 | 基本的なCSIキャプチャは動作。ただし、そこから災害対応までの道のりは遠い |

### 9.2 WiFi CSI技術自体の災害対応ポテンシャル

**基礎科学は実在する**:
- WiFi CSIによる人体検出は10年以上の査読付き研究がある
- 壁越し存在検知はLOS/NLOSの両条件で学術的に実証済み
- 呼吸検知もLOS条件下では高精度

**しかし災害対応には大きなギャップがある**:
1. **瓦礫は壁ではない**: 研究は石膏ボード・コンクリート壁を対象。ランダムな残骸、金属片、水が混在する瓦礫環境は未検証
2. **距離制限**: 現行のWiFi CSIは2-4m（標準アンテナ）。RuViewが主張する15-40mは学術的裏付けなし
3. **マルチパス干渉**: 崩壊構造物内の信号反射は制御不可能
4. **実用化されたのはUWBレーダー**: 実際の地震救助にはSJ-6000+やXaver 400といった専用レーダーが使用されている
5. **WiFiセンシングの現行用途**: 在室検知・動体検知・HAR（人間行動認識）が中心。バイタルセンシングは研究段階

---

## 10. 事業への示唆

### 10.1 RuViewを災害対応製品の基盤にすべきか

**結論: No**

- 実データでの検証がゼロのプロジェクトを安全クリティカルな用途に使用することは不適切
- スター数操作の疑惑があるプロジェクトとの提携はレピュテーションリスク
- WiFi-Matのスペックは学術研究の裏付けがない楽観的な数値

### 10.2 WiFi CSI技術自体を災害対応に活用する可能性

**中長期的には可能性あり。ただし以下の条件が必要:**

1. 独自のハードウェア・ソフトウェア開発（RuViewに依存しない）
2. 実際の瓦礫環境での大規模実証実験
3. UWBレーダー等の既存技術との**補完的な**利用（WiFi単独ではなく）
4. IEEE 802.11bf標準の成熟を待つ
5. 学術パートナーとの共同研究

### 10.3 RuViewから参考にできる要素

- WiFi-Mat のコンセプト設計（STARTトリアージとの統合アイデア）
- ESP32 CSIファームウェアの基本設計（CSIキャプチャ自体は動作する）
- Rustによる高速信号処理パイプラインのアーキテクチャ

---

## 11. 参照ソース

### RuView関連
- [RuView GitHub リポジトリ](https://github.com/ruvnet/RuView)
- [WiFi-Mat ユーザーガイド](https://github.com/ruvnet/RuView/blob/main/docs/wifi-mat-user-guide.md)
- [Issue #37: "No, this is not fake"](https://github.com/ruvnet/RuView/issues/37)
- [Issue #79: "Is this a real and usable project?"](https://github.com/ruvnet/RuView/issues/79)
- [Issue #72: ADR-028 Independent Audit](https://github.com/ruvnet/wifi-densepose/issues/72)
- [deletexiumu/wifi-densepose スキャムアラートフォーク](https://github.com/deletexiumu/wifi-densepose)
- [ByteIota: Real or AI-Generated Hype?](https://byteiota.com/wifi-densepose-hits-github-2-real-or-ai-generated-hype/)
- [Hacker News Discussion](https://news.ycombinator.com/item?id=46388904)

### 学術研究
- [DensePose From WiFi (CMU, 2023)](https://arxiv.org/abs/2301.00250)
- [WiFi CSI-Based Long-Range Through-Wall HAR with ESP32 (Springer, 2023)](https://link.springer.com/chapter/10.1007/978-3-031-44137-0_4)
- [IEEE 802.11bf WiFi Sensing Standard](https://standards.ieee.org/ieee/802.11bf/11574/)
- [AI-enhanced CSI-based Vital Sign Monitoring Survey (PeerJ, 2025)](https://peerj.com/articles/cs-3375/)
- [Commodity WiFi Sensing Advancements (PMC, 2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11597943/)
- [EHUNAM WiFi CSI Dataset (Nature, 2025)](https://www.nature.com/articles/s41597-025-06238-4)
- [Victim Detection and Localization in Emergencies (PMC, 2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9658015/)

### 災害救助用レーダー技術
- [Microwave Radar Sensing for Search and Rescue (PMC, 2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6650952/)
- [UWB Impulse Radar Through-Wall Vital Signs (Scientific Reports, 2018)](https://www.nature.com/articles/s41598-018-31669-y)
- [Camero: UWB Radar in Life-Saving Missions](https://camero-tech.com/enhancing-search-and-rescue-operations-with-ultra-wideband-radar/)
- [Espressif ESP-CSI 公式リポジトリ](https://github.com/espressif/esp-csi)
