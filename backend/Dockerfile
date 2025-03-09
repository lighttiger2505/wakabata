# ビルドステージ
FROM golang:1.24-bullseye AS builder

WORKDIR /app

# 依存関係のコピーとダウンロード
COPY go.mod go.sum ./
RUN go mod download

# ソースコードのコピーとビルド
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/server ./cmd/server/main.go

# 実行ステージ
FROM debian:bullseye-slim

WORKDIR /app

# 必要なCA証明書をコピー
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# ビルドしたバイナリをコピー
COPY --from=builder /app/bin/server .

# 実行時の環境変数を設定
ENV GIN_MODE=release

EXPOSE 8080

CMD ["./server"]