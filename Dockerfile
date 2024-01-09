FROM  node:18.14.0-slim as builder
WORKDIR /root/react
COPY . .

RUN npm install -g pnpm

RUN pnpm install
RUN pnpm run build

FROM nginx:latest
WORKDIR /opt/www/html/workflow/


COPY --from=builder /root/react/build /opt/www/html/workflow/
COPY --from=builder /root/react/deploy/web.conf  /etc/nginx/conf.d
# COPY build  /opt/www/html/workflow/
# COPY deploy/web.conf  /etc/nginx/conf.d
EXPOSE 82
## 设置工作目录

## 启动nginx
CMD ["nginx","-g","daemon off;"]
