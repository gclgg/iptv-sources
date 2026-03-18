# iptv-sources

自动更新的 IPTV 直播源 & 零成本 EPG 直播预告服务

GitHub: [HerbertHe/iptv-sources](https://github.com/HerbertHe/iptv-sources)

直播源来自：

- <https://epg.pw/test_channel_page.html>
- [youhun](https://github.com/HerbertHe/youhun)
- [zbds](https://github.com/youhunwl/TVAPP)
- [hotel_tvn](https://github.com/HerbertHe/hotel_tvn)

EPG 数据源来自：

- [epg.51zmt.top:8000](http://epg.51zmt.top:8000/)

## Matrix

You can also use the services provided by Mirror Sites Matrix! See <https://m3u.ibert.me> for more.

<!-- matrix_here -->
## Channel

| channel | url | list | count | isRollback |
| ------- | --- | ---- | ----- | ---------- |
<!-- channels_here -->

## EPG

| epg | url | isRollback |
| --- | --- | ---------- |
<!-- epgs_here -->

## TVBox EPG 使用

本站将 EPG 数据按日期和频道拆分为静态 JSON 文件，可直接在 TVBox 中使用。

EPG 链接格式：

```
{site_url}/epg/51zmt/{date}/{name}.json
```

在 TVBox 直播源 JSON 中添加 `epg` 字段即可查看节目预告。

## LICENSE

GPL-3.0 &copy; yunnysunny

本项目基于 GPL-3.0 协议开源。
