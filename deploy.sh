#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹

git init
git add -A
git commit -m 'deploy'
# 提交到 master 分支
# git push origin master

# 将 dist 文件提交到 gh-pages 分支
# git subtree push --prefix dist origin gh-pages

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:SHIJIECHN/front-end-note.git master:gh-pages

cd -