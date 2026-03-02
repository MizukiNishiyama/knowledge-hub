# Nujabes-Inspired Sampling: Technical Reference

## コンセプト

Nujabes（瀬葉淳）のプロダクション手法を忠実に再現し、ドラム2素材・コーラス2素材から5つのオリジナルコンポジションを制作する。

## 前回からの改善点

前回の出力は「素材にエフェクトをかけてループしただけ」であり、以下が欠落していた。

| 欠落していた要素 | 今回の対応 |
|---|---|
| BPM分析なし → テンポ不一致 | 全素材のBPMを推定し、rubberband で精密にテンポ同期 |
| 適当な秒数での切り出し | RMSエネルギー分析で最もエネルギッシュな区間を特定 |
| 単なるエフェクト適用 | ドラム専用/メロディ専用の多段エフェクトチェーンを設計 |
| 楽曲構造の不在 | イントロ→展開→ブレイク→アウトロの構造を各トラックで設計 |
| ミキシングの欠落 | 各要素のゲインバランス、クロスフェード、マスタリングチェーン |
| ループコピーのみ | 複数素材のレイヤリング、逆再生、スピード変更による変奏 |

## 素材分析結果

### Chorus 1
- Duration: 172秒
- Estimated BPM: ~81
- Peak energy: 74-84秒（RMS 0.1675）
- 特徴: 中盤にかけてエネルギーが上昇し、82秒付近で最大

### Chorus 2
- Duration: 195秒
- Estimated BPM: ~67
- Peak energy: 160-170秒（RMS 0.1273）
- 特徴: 比較的均一なエネルギー、終盤にやや上昇

### Drum 1
- Duration: 245秒
- Estimated BPM: ~100
- Peak energy: 全体的に高エネルギー（周期的パターン）
- 特徴: ~24小節周期でエネルギーが変動、冒頭が最も強い

### Drum 2
- Duration: 177秒
- Estimated BPM: ~92
- Peak energy: 86-94秒（RMS 0.0967）
- 特徴: 88秒が最大ピーク、中盤に集中

## サンプリング手法の詳細

### 1. タイムストレッチ（テンポ同期）
- **ツール**: rubberband（Phase-vocoder + transient detection）
- **目的**: 異なるBPMの素材を同一テンポに正確に同期
- **crisp mode 3**: 音楽素材に最適化されたトランジェント保持
- 例: Drum1（100 BPM）→ 85 BPMへ = time ratio 1.176

### 2. ピッチシフト
- **ツール**: rubberband（独立ピッチ変更）
- **使用例**: メロディを-1〜-3半音下げてNujabes的な深みと哀愁を付与
- テンポを保ったままピッチのみ変更可能

### 3. スピード変更（ヴァイナルスロウダウン）
- Track 5で使用: speed 0.87x = テンポ低下+ピッチ低下を同時に
- レコードの回転数を下げる効果を精密に再現
- rubberband で time ratio と pitch ratio を連動させて実装

### 4. 逆再生
- Track 3で使用: Chorus1のセクションをnumpy配列反転
- 逆再生+ピッチダウン+重リバーブで幻想的なパッドサウンドを生成

### 5. レイヤリング
- Track 3, 4で3素材を同時レイヤー
- 各素材にゲイン差をつけて主従関係を設計
- テクスチャ素材はバンドパス+リバーブで空間を埋める背景に

## エフェクトチェーン設計

### ドラムチェーン（process_drums_nujabes）
```
HP 35Hz (rumble除去)
→ Low shelf +2.5dB @ 120Hz (キック強調)
→ High shelf -3dB @ 12kHz (ハーシュネス除去)
→ Mid boost +1dB @ 2.5kHz (プレゼンス)
→ Compressor: thresh -10dB, ratio 3.5:1, attack 5ms, release 80ms
→ Soft clip @ 0.75 (テープサチュレーション)
```

### メロディチェーン（process_melody_nujabes）
```
HP 60Hz (不要低域除去)
→ Low shelf +1.5dB @ 200Hz (ウォーム感)
→ LP 14kHz (ヴィンテージ感)
→ High shelf -4dB @ 10kHz (さらにロールオフ)
→ Compressor: thresh -14dB, ratio 2.5:1, attack 15ms, release 150ms
→ Plate reverb: decay 0.5, wet 15-35%, predelay 25ms
```

### マスタリングチェーン（master_chain）
```
DC offset除去
→ HP 30Hz
→ Low shelf +1dB @ 100Hz
→ High shelf -2dB @ 13kHz
→ Bus compressor: thresh -8dB, ratio 2:1, attack 20ms, release 200ms
→ Vinyl noise layer (crackle + random pops)
→ Soft limiter @ 0.85
→ Normalize to -0.7dBFS
```

## 制作物

### Track 01: Sunset Boulevard
- **BPM**: 85
- **素材**: Drum1 (0-16s) + Chorus1 (74-90s, -1半音)
- **構造**: 4bar intro（メロディ+LP 3kHz）→ 12bar main → 4bar outro（フェードアウト）
- **コンセプト**: Nujabesの王道——ウォームなブームバップにソウルフルなメロディを乗せた、日差しの中のドライブ
- **Duration**: 25.7秒

### Track 02: Rainy Afternoon
- **BPM**: 83
- **素材**: Drum2 (86-102s) + Chorus2 (44-60s, -2半音)
- **構造**: 2bar intro → 8bar verse → 4bar break（ドラムのみ+リバーブ）→ 4bar full → 2bar outro
- **コンセプト**: 内省的でムーディな一曲。ブレイクセクションでドラムだけが残り、再びメロディが戻る構成で感情の波を表現
- **Duration**: 46.4秒

### Track 03: Midnight in Shibuya
- **BPM**: 78
- **素材**: Drum1 (34-50s) + Chorus1 reversed (98-114s, -3半音) + Chorus2 (24-40s, -2半音)
- **構造**: 4bar ambient intro → 8bar full（3素材レイヤー）→ 4bar reverb outro
- **コンセプト**: Nujabesのアンビエント側面を探求。逆再生コーラスをパッドとして使い、3素材を重ねた深い空間を構築。渋谷の深夜の静けさと喧騒の共存
- **Duration**: 37.1秒

### Track 04: Golden Hour
- **BPM**: 88
- **素材**: Drum2 (40-56s) + Chorus2 (70-86s) + Chorus1 (52-68s, +3半音, テクスチャ)
- **構造**: 2bar texture → 2bar melody入り → 8bar full → 4bar filter sweep outro
- **コンセプト**: Modal Soul期のNujabesを意識した、やや速めのアップリフティングなトラック。Chorus1を+3半音上げてバンドパス+リバーブで背景テクスチャ化した3層構成
- **Duration**: 33.1秒

### Track 05: Departure
- **BPM**: 80
- **素材**: Drum1 (96-116s) + Chorus2 (156-176s, speed 0.87x)
- **構造**: 4bar melody solo → 8bar full groove → 4bar drums fade + melody swell
- **コンセプト**: Luv(sic)シリーズへのオマージュ。メロディにヴァイナルスロウダウン（speed 0.87x）を適用し、レコードの回転を落としたような哀愁と深みを生成。最後にドラムが沈みメロディが浮かび上がる構成で「旅立ち」を表現
- **Duration**: 46.0秒

## 技術スタック

- **タイムストレッチ/ピッチシフト**: rubberband (Phase-vocoder, crisp mode 3)
- **DSP/ミキシング**: Python + NumPy + SciPy (Butterworth filters, signal processing)
- **I/O**: soundfile (libsndfile wrapper)
- **マスタリング**: Custom Python chain (EQ → Compression → Vinyl noise → Soft limiting)
- **出力**: WAV 44.1kHz / 16bit / Stereo
