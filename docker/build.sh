npm run build
cp -r ../dist ./
docker build -t registry.cn-hangzhou.aliyuncs.com/panbiao/videoweb:v1.0.0 ./
docker push registry.cn-hangzhou.aliyuncs.com/panbiao/videoweb:v1.0.0