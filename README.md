# iptv-sources

自动更新的 IPTV 直播源，支持 M3U、TXT 和 TVBox 格式，并提供基于静态文件的 EPG（电子节目预告）服务。

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
2. 在 Cloudflare Pages 中关联你的 GitHub 仓库
3. GitHub Actions 会每 2 小时自动抓取最新数据并更新
4. Cloudflare Pages 自动部署更新后的静态文件

整个过程完全免费、零运维。

## 环境变量

```shell
# 自定义回退地址，默认为空
# ROLLBACK_URLS=https://xxxx.xxx.com

# 关闭源代理，默认 false
# CLOSE_SOURCE_PROXY=true

# 自定义 GitHub Raw 代理地址
# CUSTOM_GITHUB_RAW_SOURCE_PROXY_URL=https://ghp.ci/

# 启用 IPTV 可用性检测，默认 false
# ENABLE_IPTV_CHECKER=true

# IPTV 检测服务地址
# IPTV_CHECKER_URL=http://[::1]:8081
```

## LICENSE

GPL-3.0 &copy; yunnysunny

本项目基于 GPL-3.0 协议开源。
