# GCP e2-micro + Codex セットアップ手順（実施ログ反映版）

この手順書は、ローカルの `knowledge-hub` から Terraform で GCP の `e2-micro` を作成し、
VM上の `/home/vmadmin/project/knowledge-hub` で `codex` を使えるようにするまでの実施手順をまとめたものです。

## 1. Terraform 構成の準備

```bash
cd /Users/nishiyamasuisei/business/outarc/knowledge-hub/terraform/gcp/e2-micro-free-tier
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` の例:

```tfvars
project_id      = "<YOUR_PROJECT_ID>"
region          = "us-central1"
zone            = "us-central1-a"
vm_name         = "tf-e2-micro"
ssh_source_cidr = "0.0.0.0/0"
login_user      = "vmadmin"
```

## 2. GCP 認証

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project <YOUR_PROJECT_ID>
```

Compute Engine API 有効化:

```bash
gcloud services enable compute.googleapis.com
```

## 3. Terraform 実行（VM作成）

```bash
cd /Users/nishiyamasuisei/business/outarc/knowledge-hub/terraform/gcp/e2-micro-free-tier
terraform init -input=false
terraform plan -input=false -out=tfplan
terraform apply -input=false -auto-approve tfplan
```

出力確認:

```bash
terraform output
terraform output -raw password_ssh_password
```

## 4. VM への SSH 接続

パスワード認証を強制して接続:

```bash
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no vmadmin@<INSTANCE_EXTERNAL_IP>
```

もし `Permission denied (publickey)` が出る場合は、管理側から `gcloud compute ssh` で入り、
`/etc/ssh/sshd_config` の `PasswordAuthentication yes` などを確認して `sshd` を再起動する。

## 5. リポジトリ配置

VM上で:

```bash
mkdir -p /home/vmadmin/project
cd /home/vmadmin
git clone https://github.com/MizukiNishiyama/knowledge-hub.git
mv /home/vmadmin/knowledge-hub /home/vmadmin/project/
```

必要に応じて所有権修正:

```bash
sudo chown -R vmadmin:vmadmin /home/vmadmin/project/knowledge-hub
```

## 6. VM上で Codex CLI セットアップ

VM上で:

```bash
sudo apt-get update -y
sudo apt-get install -y nodejs npm
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
```

`PATH` 設定:

```bash
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.profile
source ~/.bashrc
hash -r
```

Codex インストール:

```bash
npm install -g @openai/codex
codex --version
```

## 7. Codex ログイン

### 方法A: Device Auth（推奨）

VM上で:

```bash
codex login --device-auth
```

表示される URL とコードをローカルPCのブラウザで開き、`outarc.dev@gmail.com` で認証する。

### 方法B: `codex login`（ローカル転送あり）

`codex login` は VM の `localhost:1455` を使うため、そのままだとブラウザから戻れない。
ローカルPCで先にトンネルを作る:

```bash
gcloud compute ssh tf-e2-micro --zone=us-central1-a --project=<YOUR_PROJECT_ID> -- -N -L 1455:localhost:1455
```

別ターミナルで VM に入り:

```bash
codex login
```

表示された OAuth URL をローカルブラウザで開いて `outarc.dev@gmail.com` で認証。

ログイン確認:

```bash
codex login status
```

## 8. セキュリティ注意

- パスワードSSHは、鍵認証 + IP制限より弱い。
- Terraform state や startup-script にパスワードが残るため、運用前に以下を推奨:
  - パスワード即時ローテーション
  - 可能なら SSH 鍵認証へ移行
  - `ssh_source_cidr` を `/32` に制限

## 9. 破棄

不要時はローカルから:

```bash
cd /Users/nishiyamasuisei/business/outarc/knowledge-hub/terraform/gcp/e2-micro-free-tier
terraform destroy
```
