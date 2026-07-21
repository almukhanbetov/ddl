FROM golang:1.25-alpine AS builder
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/ddl-api ./cmd/api

FROM alpine:3.20
RUN apk add --no-cache ca-certificates && \
    addgroup -S ddl && adduser -S ddl -G ddl
WORKDIR /app
COPY --from=builder /out/ddl-api ./ddl-api
RUN mkdir -p /app/uploads/reviews /app/uploads/admin && chown -R ddl:ddl /app
USER ddl

EXPOSE 8082
ENTRYPOINT ["./ddl-api"]
