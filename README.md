# iptv-sources

自动更新的 IPTV 直播源，支持 M3U、TXT 和 TVBox 格式，并提供基于静态文件的 EPG（电子节目预告）服务。

- **本项目仓库**：[yunnysunny/iptv-sources](https://github.com/yunnysunny/iptv-sources)

基于 [HerbertHe/iptv-sources](https://github.com/HerbertHe/iptv-sources) 开发。

## 特性

- 每 2 小时自动从上游抓取并更新直播源
- 支持 M3U、TXT、TVBox JSON 多种格式输出
- **零成本 EPG 方案**：将节目预告拆分为静态 JSON 文件，部署到 Cloudflare Pages，无需自建后端服务即可在 TVBox 中查看直播预告

## 直播源

| 来源 | 说明 |
|------|------|
| [epg.pw](https://epg.pw/test_channel_page.html) | 全球频道 |
| [youhun](https://github.com/HerbertHe/youhun) | 国内频道 |
| [zbds](https://github.com/youhunwl/TVAPP) | 国内频道 |
| [hotel_tvn](https://github.com/HerbertHe/hotel_tvn) | 酒店源 |

## EPG 数据源

| 来源 | 说明 |
|------|------|
| [epg.51zmt.top:8000](http://epg.51zmt.top:8000/) | 央视、卫视及地方频道 |
| [epg.pw](https://epg.pw/) | 抓取中国地区频道列表并合并为一份 XMLTV；同时生成 TVBox 用按日/频道 JSON（`epg/epg_pw/…`） |

## EPG 使用说明

本项目提供两种 EPG 格式：**标准 XMLTV 格式**（适用于大多数 IPTV 播放器）和 **TVBox 专用 JSON 格式**（零成本静态方案）。

### 标准 EPG（XMLTV XML）

项目会将上游 EPG 数据原样保存为 XML 文件，适用于支持 XMLTV 格式的播放器（如 Kodi、DIYP、Perfect Player 等）。

可用的 EPG XML 链接：

| 名称 | 链接 |
|------|------|
| 51zmt.top | `https://your-domain.pages.dev/epg/51zmt.xml` |
| 51zmt.top cc | `https://your-domain.pages.dev/epg/51zmt_cc.xml` |
| 51zmt.top 地方台 | `https://your-domain.pages.dev/epg/51zmt_df.xml` |

在 M3U 文件头部通过 `x-tvg-url` 指定即可：

```
#EXTM3U x-tvg-url="https://your-domain.pages.dev/epg/51zmt.xml"
```

或在播放器的 EPG 设置中直接填入上述 XML 链接。

### TVBox EPG（静态 JSON）

本项目会将 XMLTV 格式的 EPG 数据解析后，按日期和频道拆分为独立的 JSON 文件，以 `epg/{provider}/{date}/{channel}.json` 的路径结构部署到 Cloudflare Pages。其中 `provider` 与 XML 文件名一致，例如 `51zmt`、`epg_pw` 等。

利用 TVBox 的 EPG 链接动态参数替换特性（`{date}` 替换为当天日期，`{name}` 替换为频道名），你只需配置一个 URL 模板，TVBox 就能自动请求到对应的静态 JSON 文件，无需任何后端服务。

在直播源 JSON 中添加 `epg` 字段（任选其一数据源，需与 M3U 里频道名称尽量一致）：

**51zmt 系列：**

```json
{
  "lives": [
    {
      "group": "Channels",
      "channels": [
        {
          "name": "CCTV1",
          "urls": ["http://your-iptv-source-url"]
        }
      ]
    }
  ],
  "epg": "https://your-domain.pages.dev/epg/51zmt/{date}/{name}.json"
}
```

**epg.pw 聚合（中国地区）：**

```json
{
  "epg": "https://your-domain.pages.dev/epg/epg_pw/{date}/{name}.json"
}
```

> 将 `your-domain.pages.dev` 替换为你的 Cloudflare Pages 域名。

更多背景和细节请参阅 [EPG 方案详解](docs/EPG.md)。

## 自行部署

1. Fork 本项目到你的 GitHub 仓库
2. 按下方 [Cloudflare Pages 部署](#cloudflare-pages-部署) 关联仓库并完成首次构建
3. **定时更新**：由 GitHub Actions 的 `schedule` 工作流每 2 小时抓取并生成静态资源；若配置了 Cloudflare 直连上传凭据则直接发布 `m3u/`，否则通过空 commit 触发 Pages 在云端构建。推送代码时仍可按你在 Pages 里配置的构建命令由云端重新构建

整个过程可完全免费、零运维（具体以 Cloudflare 与 GitHub 当前套餐为准）。

## Cloudflare Pages 部署

静态站点根目录为构建生成的 **`m3u/`**（M3U、TXT、`sources/`、TVBox JSON、`epg/` 等均在此目录下）。

### 通过 Git 连接仓库（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
2. 授权并选择本仓库与要部署的分支（一般为 `main`）。
3. 构建设置如下：

   | 项 | 值 |
   | --- | --- |
   | Framework preset | `None` |
   | Build command | ` pnpm build:static` |
   | Build output directory | `m3u` |

   - 若需要生成镜像站检测表格（写入 `m3u/README.md`），可在上述 **Build command** 末尾追加 ` && pnpm build:matrix`（构建时间会显著增加）。

### 定时更新（GitHub Actions `schedule`）

仓库中的 [`.github/workflows/schedule.yml`](.github/workflows/schedule.yml) 按 cron **每 2 小时**执行：安装依赖、`pnpm build`、`pnpm m3u`、`pnpm matrix`，然后根据是否配置 Cloudflare 直连上传凭据，选择两种后续行为之一：

| 条件 | 行为 |
| --- | --- |
| 已设置 Secret **`CLOUDFLARE_API_TOKEN`**（非空） | 在 Runner 上通过 `npx wrangler pages deploy` 将本地生成的 **`m3u/`** 目录发布到指定 Pages 项目（**Direct Upload**） |
| 未设置该 Secret | 向当前分支推送一个**空 commit**，利用 Cloudflare Pages「连接 Git」时的推送触发，在 Cloudflare 侧按你在控制台配置的构建命令重新构建站点 |

直连上传时，请在 GitHub 仓库中配置：

| 类型 | 名称 | 说明 |
| --- | --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌，需包含 Pages 写入权限 |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | 账户 ID（Dashboard 右侧或 Workers 概览可见） |
| Variable 或 Secret | `PROJECT_NAME` | 目标 **Pages 项目名称**（与 Cloudflare 控制台中的项目名一致）；优先读取 Repository variable `PROJECT_NAME`，未设置时再读同名 Secret |

Pages 项目需支持 **Direct Upload**（或通过 Wrangler 首次创建/关联）。若走「空 commit」分支，请确保默认分支未开启会阻止 `github-actions[bot]` 推送的保护规则，否则 push 会失败。

### 部署后检查

- 浏览器访问 `https://<你的-pages-域名>/` 应能看到站点或列表页（取决于 `public/` 内容）。
- TVBox / M3U 中的 EPG 地址请把文档里的 `your-domain.pages.dev` 换成你的 **Pages 域名或自定义域名**。


## LICENSE

GPL-3.0 &copy; yunnysunny

本项目基于 GPL-3.0 协议开源。
