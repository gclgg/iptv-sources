import { default_m3u_filter, type TSources } from "./utils"


export const zbds_sources: TSources = [
  {
    name: "whyun-pages/hotel-tvn",
    f_name: "hotel_tvn",
    url: "https://raw.githubusercontent.com/whyun-pages/hotel-tvn/refs/heads/main/lives.m3u",
    filter: default_m3u_filter,
  }
]
