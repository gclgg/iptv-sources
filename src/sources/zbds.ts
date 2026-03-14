import { default_m3u_filter, type TSources } from "./utils"


export const zbds_sources: TSources = [
  {
    name: "vbskycn/iptv",
    f_name: "zbds_ipv4",
    url: "https://live.zbds.top/tv/iptv4.m3u",
    filter: default_m3u_filter,
  },
  {
    name: "vbskycn/iptv",
    f_name: "zbds_ipv6",
    url: "https://live.zbds.top/tv/iptv6.m3u",
    filter: default_m3u_filter,
  },
]
