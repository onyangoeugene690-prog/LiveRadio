from __future__ import annotations

import base64
import hashlib
import hmac
import ipaddress
import json
import os
import re
import secrets
import socket
import ssl
import threading
import time
from functools import lru_cache
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import HTTPRedirectHandler, HTTPSHandler, Request, build_opener, urlopen

from flask import Flask, Response, jsonify, request, send_from_directory, stream_with_context, url_for


ROOT = Path(__file__).resolve().parent
FRONTEND_DIST = ROOT / "dist"

_ssl_context = ssl.create_default_context()
_ssl_context.check_hostname = False
_ssl_context.verify_mode = ssl.CERT_NONE

DIRECTORY_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) EugeneRadio/1.0"
STREAM_USER_AGENT = "VLC/3.0.20 LibVLC/3.0.20"

DIRECTORY_MIRRORS = [
    "https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/KE?hidebroken=true&order=votes&reverse=true&limit=10000",
    "https://at1.api.radio-browser.info/json/stations/bycountrycodeexact/KE?hidebroken=true&order=votes&reverse=true&limit=10000",
    "https://nl1.api.radio-browser.info/json/stations/bycountrycodeexact/KE?hidebroken=true&order=votes&reverse=true&limit=10000",
    "https://all.api.radio-browser.info/json/stations/bycountrycodeexact/KE?hidebroken=true&order=votes&reverse=true&limit=10000",
]

CACHE_SECONDS = 900

FEATURED_STATIONS = [
    {
        "id": "featured-radio-citizen",
        "name": "Radio Citizen",
        "streamUrl": "https://atunwadigital.streamguys1.com/radiocitizen",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/radiocitizen",
            "https://atunwadigital.streamguys1.com/radiocitizen/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/brands/radio-citizen/",
        "logo": "",
        "tags": "news, talk, music, swahili",
        "language": "Swahili",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 500,
        "featured": True,
    },
    {
        "id": "featured-radio-jambo",
        "name": "Radio Jambo",
        "streamUrl": "https://atunwadigital.streamguys1.com/radiojambo",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/radiojambo",
            "https://atunwadigital.streamguys1.com/radiojambo/playlist.m3u8",
        ],
        "website": "https://radiojambo.co.ke/",
        "logo": "",
        "tags": "talk, sports, music, swahili",
        "language": "Swahili",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 480,
        "featured": True,
    },
    {
        "id": "featured-classic-105",
        "name": "Classic 105",
        "streamUrl": "https://atunwadigital.streamguys1.com/classic105",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/classic105",
            "https://atunwadigital.streamguys1.com/classic105/playlist.m3u8",
        ],
        "website": "https://classic105.com/",
        "logo": "",
        "tags": "music, classic, talk, urban",
        "language": "English",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 450,
        "featured": True,
    },
    {
        "id": "featured-kiss-100",
        "name": "Kiss 100",
        "streamUrl": "https://atunwadigital.streamguys1.com/kissfm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/kissfm",
            "https://atunwadigital.streamguys1.com/kissfm/playlist.m3u8",
        ],
        "website": "https://kiss100.co.ke/",
        "logo": "",
        "tags": "music, hits, urban, entertainment",
        "language": "English",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 420,
        "featured": True,
    },
    {
        "id": "featured-nrg-radio",
        "name": "NRG Radio",
        "streamUrl": "https://uksouth.streaming.broadcast.radio/nrg",
        "streamUrls": ["https://uksouth.streaming.broadcast.radio/nrg"],
        "website": "https://nrg.radio/",
        "logo": "",
        "tags": "music, urban, dance, youth",
        "language": "English",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 400,
        "featured": True,
    },
    {
        "id": "featured-capital-fm",
        "name": "98.4 Capital FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/capitalfm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/capitalfm",
            "https://atunwadigital.streamguys1.com/capitalfm/playlist.m3u8",
        ],
        "website": "https://www.capitalfm.co.ke/",
        "logo": "",
        "tags": "news, music, talk, urban",
        "language": "English",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 390,
        "featured": True,
    },
    {
        "id": "featured-ramogi-fm",
        "name": "Ramogi FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/ramogifm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/ramogifm",
            "https://atunwadigital.streamguys1.com/ramogifm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/brands/ramogi-fm/",
        "logo": "",
        "tags": "music, news, talk, vernacular",
        "language": "Dholuo",
        "state": "Kisumu",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 380,
        "featured": True,
    },
]

CURATED_FALLBACK_STATIONS = [
    *FEATURED_STATIONS,
    {
        "id": "curated-radio-maisha",
        "name": "Radio Maisha",
        "streamUrl": "https://atunwadigital.streamguys1.com/radiomaisha",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/radiomaisha",
            "https://atunwadigital.streamguys1.com/radiomaisha/playlist.m3u8",
        ],
        "website": "https://www.standardmedia.co.ke/radiomaisha/",
        "logo": "",
        "tags": "music, news, talk, swahili",
        "language": "Swahili",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 350,
        "featured": False,
    },
    {
        "id": "curated-milele-fm",
        "name": "Milele FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/milelefm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/milelefm",
            "https://atunwadigital.streamguys1.com/milelefm/playlist.m3u8",
        ],
        "website": "https://www.mediamaxnetwork.co.ke/milele-fm/",
        "logo": "",
        "tags": "music, entertainment, talk, swahili",
        "language": "Swahili",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 340,
        "featured": False,
    },
    {
        "id": "curated-kameme-fm",
        "name": "Kameme FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/kamemefm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/kamemefm",
            "https://atunwadigital.streamguys1.com/kamemefm/playlist.m3u8",
        ],
        "website": "https://www.mediamaxnetwork.co.ke/kameme-fm/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Kikuyu",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 330,
        "featured": False,
    },
    {
        "id": "curated-inooro-fm",
        "name": "Inooro FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/inoorofm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/inoorofm",
            "https://atunwadigital.streamguys1.com/inoorofm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/brands/inooro-fm/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Kikuyu",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 320,
        "featured": False,
    },
    {
        "id": "curated-spice-fm",
        "name": "Spice FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/spicefm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/spicefm",
            "https://atunwadigital.streamguys1.com/spicefm/playlist.m3u8",
        ],
        "website": "https://www.standardmedia.co.ke/spicefm/",
        "logo": "",
        "tags": "talk, music, soul, discussion",
        "language": "English",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 310,
        "featured": False,
    },
    {
        "id": "curated-radio-47",
        "name": "Radio 47",
        "streamUrl": "https://streaming.shoutcast.com/radio-47?ver=690109",
        "streamUrls": ["https://streaming.shoutcast.com/radio-47?ver=690109"],
        "website": "https://radio47.co.ke/",
        "logo": "",
        "tags": "news, entertainment, talk, swahili",
        "language": "Swahili",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 305,
        "featured": False,
    },
    {
        "id": "curated-hot-96",
        "name": "Hot 96",
        "streamUrl": "https://atunwadigital.streamguys1.com/hot96",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/hot96",
            "https://atunwadigital.streamguys1.com/hot96/playlist.m3u8",
        ],
        "website": "https://hot96.co.ke/",
        "logo": "",
        "tags": "music, urban, hits",
        "language": "English",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 300,
        "featured": False,
    },
    {
        "id": "curated-homeboyz-radio",
        "name": "Homeboyz Radio",
        "streamUrl": "https://atunwadigital.streamguys1.com/homeboyzradio",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/homeboyzradio",
            "https://atunwadigital.streamguys1.com/homeboyzradio/playlist.m3u8",
        ],
        "website": "https://homeboyzradio.co.ke/",
        "logo": "",
        "tags": "hiphop, urban, music",
        "language": "English",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 290,
        "featured": False,
    },
    {
        "id": "curated-ghetto-radio",
        "name": "Ghetto Radio",
        "streamUrl": "https://stream.zeno.fm/kvudezx1h2zuv",
        "streamUrls": ["https://stream.zeno.fm/kvudezx1h2zuv"],
        "website": "https://ghettoradio.co.ke/",
        "logo": "",
        "tags": "reggae, sheng, urban, community",
        "language": "Sheng",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 280,
        "featured": False,
    },
    {
        "id": "curated-kbc-english",
        "name": "KBC English Service",
        "streamUrl": "https://stream.zeno.fm/ud2u96xst5quv",
        "streamUrls": ["https://stream.zeno.fm/ud2u96xst5quv"],
        "website": "https://www.kbc.co.ke/",
        "logo": "",
        "tags": "news, talk, current affairs",
        "language": "English",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 270,
        "featured": False,
    },
    {
        "id": "curated-nation-fm",
        "name": "Nation FM",
        "streamUrl": "http://stream.radiojar.com/3by7s8eg65quv",
        "streamUrls": ["http://stream.radiojar.com/3by7s8eg65quv"],
        "website": "https://nation.africa/",
        "logo": "",
        "tags": "news, talk, current affairs, english",
        "language": "English",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 265,
        "featured": False,
    },
    {
        "id": "curated-east-fm",
        "name": "East FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/eastfm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/eastfm",
            "https://atunwadigital.streamguys1.com/eastfm/playlist.m3u8",
        ],
        "website": "https://eastfm.com/",
        "logo": "",
        "tags": "music, entertainment, asian",
        "language": "Hindi",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 260,
        "featured": False,
    },
    {
        "id": "curated-bahari-fm",
        "name": "Bahari FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/baharifm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/baharifm",
            "https://atunwadigital.streamguys1.com/baharifm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/",
        "logo": "",
        "tags": "music, news, coastal",
        "language": "Swahili",
        "state": "Mombasa",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 250,
        "featured": False,
    },
    {
        "id": "curated-egesa-fm",
        "name": "Egesa FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/egesafm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/egesafm",
            "https://atunwadigital.streamguys1.com/egesafm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Ekegusii",
        "state": "Kisii",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 240,
        "featured": False,
    },
    {
        "id": "curated-mulembe-fm",
        "name": "Mulembe FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/mulembefm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/mulembefm",
            "https://atunwadigital.streamguys1.com/mulembefm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Luhya",
        "state": "Kakamega",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 230,
        "featured": False,
    },
    {
        "id": "curated-musyi-fm",
        "name": "Musyi FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/musyifm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/musyifm",
            "https://atunwadigital.streamguys1.com/musyifm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Kamba",
        "state": "Machakos",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 220,
        "featured": False,
    },
    {
        "id": "curated-chamgei-fm",
        "name": "Chamgei FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/chamgeifm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/chamgeifm",
            "https://atunwadigital.streamguys1.com/chamgeifm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Kalenjin",
        "state": "Eldoret",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 210,
        "featured": False,
    },
    {
        "id": "curated-wimwaro-fm",
        "name": "Wimwaro FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/wimwarofm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/wimwarofm",
            "https://atunwadigital.streamguys1.com/wimwarofm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Embu",
        "state": "Embu",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 200,
        "featured": False,
    },
    {
        "id": "curated-vuuka-fm",
        "name": "Vuuka FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/vuukafm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/vuukafm",
            "https://atunwadigital.streamguys1.com/vuukafm/playlist.m3u8",
        ],
        "website": "https://www.royalmedia.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Maragoli",
        "state": "Vihiga",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 190,
        "featured": False,
    },
    {
        "id": "curated-mayian-fm",
        "name": "Mayian FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/mayianfm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/mayianfm",
            "https://atunwadigital.streamguys1.com/mayianfm/playlist.m3u8",
        ],
        "website": "https://www.mediamaxnetwork.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Maa",
        "state": "Kajiado",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 180,
        "featured": False,
    },
    {
        "id": "curated-meru-fm",
        "name": "Meru FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/merufm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/merufm",
            "https://atunwadigital.streamguys1.com/merufm/playlist.m3u8",
        ],
        "website": "https://www.mediamaxnetwork.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Meru",
        "state": "Meru",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 170,
        "featured": False,
    },
    {
        "id": "curated-emo-fm",
        "name": "Emoo FM",
        "streamUrl": "https://atunwadigital.streamguys1.com/emoofm",
        "streamUrls": [
            "https://atunwadigital.streamguys1.com/emoofm",
            "https://atunwadigital.streamguys1.com/emoofm/playlist.m3u8",
        ],
        "website": "https://www.mediamaxnetwork.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular",
        "language": "Kalenjin",
        "state": "Eldoret",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 160,
        "featured": False,
    },
    {
        "id": "curated-radio-maria",
        "name": "Radio Maria Kenya",
        "streamUrl": "http://dreamsiteradiocp5.com:8069/stream",
        "streamUrls": ["http://dreamsiteradiocp5.com:8069/stream"],
        "website": "https://www.radiomaria.co.ke/",
        "logo": "",
        "tags": "gospel, christian, worship, catholic",
        "language": "Swahili",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 155,
        "featured": False,
    },
    {
        "id": "curated-jesus-is-lord",
        "name": "Jesus Is Lord Radio",
        "streamUrl": "https://s3.radio.co/s97f38db97/listen",
        "streamUrls": ["https://s3.radio.co/s97f38db97/listen"],
        "website": "https://www.jesusislordradio.info/",
        "logo": "",
        "tags": "gospel, christian, worship",
        "language": "English",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 150,
        "featured": False,
    },
    {
        "id": "curated-radio-waumini",
        "name": "Radio Waumini 88.3FM",
        "streamUrl": "https://stream.zeno.fm/gvk894g072quv",
        "streamUrls": ["https://stream.zeno.fm/gvk894g072quv"],
        "website": "https://radiowaumini.org/",
        "logo": "",
        "tags": "gospel, christian, catholic, news",
        "language": "Swahili",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 145,
        "featured": False,
    },
    {
        "id": "curated-radio-kaya",
        "name": "Radio Kaya",
        "streamUrl": "http://usa9-vn.mixstream.net:8084/;",
        "streamUrls": ["http://usa9-vn.mixstream.net:8084/;"],
        "website": "https://radiokaya.co.ke/",
        "logo": "",
        "tags": "coastal, music, news, mijikenda",
        "language": "Swahili",
        "state": "Kwale",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 140,
        "featured": False,
    },
    {
        "id": "curated-taach-fm",
        "name": "Taach FM",
        "streamUrl": "https://pegasus.nucast.co.uk:8064/stream",
        "streamUrls": ["https://pegasus.nucast.co.uk:8064/stream"],
        "website": "https://taachfm.co.ke/",
        "logo": "",
        "tags": "music, news, vernacular, kalenjin",
        "language": "Kalenjin",
        "state": "Kericho",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 135,
        "featured": False,
    },
    {
        "id": "curated-campus-radio",
        "name": "Campus Radio Kenya",
        "streamUrl": "https://stream.zenolive.com/mayn36v1v8quv.aac",
        "streamUrls": ["https://stream.zenolive.com/mayn36v1v8quv.aac"],
        "website": "https://campusradio.co.ke/",
        "logo": "",
        "tags": "youth, campus, music, urban",
        "language": "English",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 130,
        "featured": False,
    },
    {
        "id": "curated-flamingo-radio",
        "name": "Flamingo Radio Nakuru",
        "streamUrl": "https://stream.zeno.fm/215bpympks8uv",
        "streamUrls": ["https://stream.zeno.fm/215bpympks8uv"],
        "website": "https://flamingoradio.co.ke/",
        "logo": "",
        "tags": "community, music, news, rift valley",
        "language": "Swahili",
        "state": "Nakuru",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 125,
        "featured": False,
    },
    {
        "id": "curated-radio-quran",
        "name": "Radio Quran Kenya",
        "streamUrl": "https://n0a.radiojar.com/0tpy1h0kxtzuv",
        "streamUrls": ["https://n0a.radiojar.com/0tpy1h0kxtzuv"],
        "website": "https://radioquran.co.ke/",
        "logo": "",
        "tags": "islamic, quran, religious, recitation",
        "language": "Arabic",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 120,
        "featured": False,
    },
    {
        "id": "curated-cri-nairobi",
        "name": "CRI Nairobi 91.9 FM",
        "streamUrl": "https://sk.cri.cn/kenya.m3u8",
        "streamUrls": ["https://sk.cri.cn/kenya.m3u8"],
        "website": "https://sk.cri.cn/",
        "logo": "",
        "tags": "news, current affairs, global, culture",
        "language": "English",
        "state": "Nairobi",
        "codec": "AAC",
        "bitrate": 128,
        "votes": 115,
        "featured": False,
    },
    {
        "id": "curated-at254-radio",
        "name": "AT254 Radio",
        "streamUrl": "https://s127.radiolize.com/radio/8100/radio.mp3",
        "streamUrls": ["https://s127.radiolize.com/radio/8100/radio.mp3"],
        "website": "https://at254.co.ke/",
        "logo": "",
        "tags": "urban, mixes, hits, youth",
        "language": "Sheng",
        "state": "Nairobi",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 110,
        "featured": False,
    },
    {
        "id": "curated-juja-fm",
        "name": "Juja FM",
        "streamUrl": "http://node-10.zeno.fm/5w8y7wcf9x8uv",
        "streamUrls": ["http://node-10.zeno.fm/5w8y7wcf9x8uv"],
        "website": "https://jujafm.co.ke/",
        "logo": "",
        "tags": "campus, youth, music, local",
        "language": "English",
        "state": "Kiambu",
        "codec": "MP3",
        "bitrate": 128,
        "votes": 105,
        "featured": False,
    },
]

FEATURED_ALIASES = {
    "radio jambo": "Radio Jambo",
    "radio citizen": "Radio Citizen",
    "ramogi": "Ramogi FM",
    "classic 105": "Classic 105",
    "kiss": "Kiss 100",
    "nrg": "NRG Radio",
    "capital": "98.4 Capital FM",
}

STREAM_URL_OVERRIDES = {
    "radio jambo": [
        "https://atunwadigital.streamguys1.com/radiojambo/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/radiojambo",
        "https://radiojambo-atunwadigital.streamguys1.com/radiojambo",
    ],
    "radio citizen": [
        "https://atunwadigital.streamguys1.com/radiocitizen/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/radiocitizen",
        "https://radiocitizen-atunwadigital.streamguys1.com/radiocitizen",
    ],
    "ramogi": [
        "https://atunwadigital.streamguys1.com/ramogifm/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/ramogifm",
        "https://ramogifm-atunwadigital.streamguys1.com/ramogifm",
    ],
    "classic": [
        "https://atunwadigital.streamguys1.com/classic105/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/classic105",
        "https://classic105-atunwadigital.streamguys1.com/classic105",
    ],
    "kiss": [
        "https://atunwadigital.streamguys1.com/kissfm/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/kissfm",
    ],
    "nrg": [
        "https://uksouth.streaming.broadcast.radio/nrg",
    ],
    "capital": [
        "https://atunwadigital.streamguys1.com/capitalfm/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/capitalfm",
        "https://capitalfm-atunwadigital.streamguys1.com/capitalfm",
    ],
    "kameme": [
        "https://atunwadigital.streamguys1.com/kamemefm/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/kamemefm",
        "https://kamemefm-atunwadigital.streamguys1.com/kamemefm",
    ],
    "milele": [
        "https://atunwadigital.streamguys1.com/milelefm/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/milelefm",
        "https://milelefm-atunwadigital.streamguys1.com/milelefm",
    ],
    "radio maisha": [
        "https://atunwadigital.streamguys1.com/radiomaisha/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/radiomaisha",
        "https://radiomaisha-atunwadigital.streamguys1.com/radiomaisha",
    ],
    "spice": [
        "https://atunwadigital.streamguys1.com/spicefm/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/spicefm",
        "https://spicefm-atunwadigital.streamguys1.com/spicefm",
    ],
    "hot 96": [
        "https://atunwadigital.streamguys1.com/hot96/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/hot96",
        "https://hot96-atunwadigital.streamguys1.com/hot96",
    ],
    "inooro": [
        "https://atunwadigital.streamguys1.com/inoorofm/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/inoorofm",
        "https://inoorofm-atunwadigital.streamguys1.com/inoorofm",
    ],
    "homeboyz": [
        "https://atunwadigital.streamguys1.com/homeboyzradio/playlist.m3u8",
        "https://atunwadigital.streamguys1.com/homeboyzradio",
        "https://homeboyzradio-atunwadigital.streamguys1.com/homeboyzradio",
    ],
    "east fm": [
        "https://atunwadigital.streamguys1.com/eastfm",
        "https://eastfm-atunwadigital.streamguys1.com/eastfm",
        "https://atunwadigital.streamguys1.com/eastfm/playlist.m3u8",
    ],
    "bahari": [
        "https://atunwadigital.streamguys1.com/baharifm",
        "https://baharifm-atunwadigital.streamguys1.com/baharifm",
        "https://atunwadigital.streamguys1.com/baharifm/playlist.m3u8",
    ],
    "egesa": [
        "https://atunwadigital.streamguys1.com/egesafm",
        "https://egesafm-atunwadigital.streamguys1.com/egesafm",
        "https://atunwadigital.streamguys1.com/egesafm/playlist.m3u8",
    ],
    "mulembe": [
        "https://atunwadigital.streamguys1.com/mulembefm",
        "https://mulembefm-atunwadigital.streamguys1.com/mulembefm",
        "https://atunwadigital.streamguys1.com/mulembefm/playlist.m3u8",
    ],
    "musyi": [
        "https://atunwadigital.streamguys1.com/musyifm",
        "https://musyifm-atunwadigital.streamguys1.com/musyifm",
        "https://atunwadigital.streamguys1.com/musyifm/playlist.m3u8",
    ],
    "chamgei": [
        "https://atunwadigital.streamguys1.com/chamgeifm",
        "https://chamgeifm-atunwadigital.streamguys1.com/chamgeifm",
        "https://atunwadigital.streamguys1.com/chamgeifm/playlist.m3u8",
    ],
    "wimwaro": [
        "https://atunwadigital.streamguys1.com/wimwarofm",
        "https://wimwarofm-atunwadigital.streamguys1.com/wimwarofm",
        "https://atunwadigital.streamguys1.com/wimwarofm/playlist.m3u8",
    ],
    "vuuka": [
        "https://atunwadigital.streamguys1.com/vuukafm",
        "https://vuukafm-atunwadigital.streamguys1.com/vuukafm",
        "https://atunwadigital.streamguys1.com/vuukafm/playlist.m3u8",
    ],
    "mayian": [
        "https://atunwadigital.streamguys1.com/mayianfm",
        "https://mayianfm-atunwadigital.streamguys1.com/mayianfm",
        "https://atunwadigital.streamguys1.com/mayianfm/playlist.m3u8",
    ],
    "meru": [
        "https://atunwadigital.streamguys1.com/merufm",
        "https://merufm-atunwadigital.streamguys1.com/merufm",
        "https://atunwadigital.streamguys1.com/merufm/playlist.m3u8",
    ],
    "emoo": [
        "https://atunwadigital.streamguys1.com/emoofm",
        "https://emoofm-atunwadigital.streamguys1.com/emoofm",
        "https://atunwadigital.streamguys1.com/emoofm/playlist.m3u8",
    ],
    "radio 47": ["https://streaming.shoutcast.com/radio-47?ver=690109"],
    "nation fm": ["http://stream.radiojar.com/3by7s8eg65quv"],
    "radio maria": ["http://dreamsiteradiocp5.com:8069/stream"],
    "waumini": ["https://stream.zeno.fm/gvk894g072quv"],
    "kaya": ["http://usa9-vn.mixstream.net:8084/;"],
    "taach": ["https://pegasus.nucast.co.uk:8064/stream"],
    "ghetto": ["https://stream.zeno.fm/kvudezx1h2zuv"],
    "kbc": ["https://stream.zeno.fm/ud2u96xst5quv"],
}

INVALID_STREAM_PATTERNS = [
    "musicradio.com",
    "181.fm",
    "shoutcast.com",
    "infomaniak.ch",
    "emmachev.com",
    "capitalfm-atunwadigital",
    "radiojambo-atunwadigital",
    "radiocitizen-atunwadigital",
    "ramogifm-atunwadigital",
    "classic105-atunwadigital",
]

app = Flask(__name__, static_folder=None)
_cache_lock = threading.Lock()
_stations_cache: tuple[float, list[dict[str, object]]] | None = None
_proxy_secret = os.environ.get("EUGENE_STREAM_PROXY_SECRET", "EugeneRadioSecretKey2025StaticSignature").encode()


def is_http_url(value: object) -> bool:
    if not isinstance(value, str):
        return False
    try:
        return urlparse(value).scheme.lower() in {"http", "https"}
    except ValueError:
        return False


@lru_cache(maxsize=1024)
def _resolve_host_is_global(hostname: str, port: int) -> bool:
    try:
        addresses = socket.getaddrinfo(hostname, port)
        return bool(addresses) and all(
            ipaddress.ip_address(address[4][0]).is_global for address in addresses
        )
    except (OSError, ValueError):
        return False


def is_public_http_url(value: str) -> bool:
    if not isinstance(value, str):
        return False
    try:
        parsed = urlparse(value)
        if (
            parsed.scheme.lower() not in {"http", "https"}
            or not parsed.hostname
            or parsed.username
            or parsed.password
        ):
            return False
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
        return _resolve_host_is_global(parsed.hostname, port)
    except (OSError, ValueError):
        return False


class PublicStreamRedirectHandler(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not is_public_http_url(newurl):
            raise ValueError("The stream redirected to an unsafe address.")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def featured_name(name: str) -> str | None:
    normalized_name = name.casefold()
    for alias, canonical_name in FEATURED_ALIASES.items():
        if alias in normalized_name:
            return canonical_name
    return None


def fetch_directory_data() -> list[dict[str, object]]:
    for mirror_url in DIRECTORY_MIRRORS:
        try:
            req = Request(mirror_url, headers={"User-Agent": DIRECTORY_USER_AGENT})
            with urlopen(req, timeout=8, context=_ssl_context) as response:
                data = json.loads(response.read())
                if isinstance(data, list) and len(data) > 0:
                    return data
        except (HTTPError, URLError, TimeoutError, ValueError, OSError):
            continue
    return []


def load_static_stations() -> list[dict[str, object]]:
    try:
        with (ROOT / "stations.json").open(encoding="utf-8") as station_file:
            data = json.load(station_file)
    except (OSError, json.JSONDecodeError) as error:
        app.logger.error("Unable to read static station directory: %s", error)
        return CURATED_FALLBACK_STATIONS.copy()

    if not isinstance(data, dict) or not isinstance(data.get("stations"), list):
        app.logger.error("Static station directory has an invalid format.")
        return CURATED_FALLBACK_STATIONS.copy()

    return [
        station
        for station in data["stations"]
        if isinstance(station, dict) and str(station.get("name", "")).strip()
    ]


def load_stations() -> list[dict[str, object]]:
    directory_data = fetch_directory_data()
    if not directory_data:
        app.logger.warning("Directory mirrors failed or returned empty. Using the static station directory.")
        return load_static_stations()

    stations = []
    seen_ids = set()
    seen_names = set()

    for station in directory_data:
        if not isinstance(station, dict):
            continue
        name = str(station.get("name", "")).strip()
        normalized_name = name.casefold()

        override_urls = None
        for alias, urls in STREAM_URL_OVERRIDES.items():
            if alias in normalized_name:
                override_urls = urls
                break

        raw_urls = [
            *(override_urls or []),
            station.get("url_resolved"),
            station.get("url"),
        ]
        stream_urls = list(
            dict.fromkeys(
                str(value).strip()
                for value in raw_urls
                if is_http_url(value) and not any(p in str(value).lower() for p in INVALID_STREAM_PATTERNS)
            )
        )
        station_id = str(station.get("stationuuid", "")).strip()
        if not name or not stream_urls:
            continue
        if station_id and station_id in seen_ids:
            continue
        if normalized_name in seen_names:
            continue

        if station_id:
            seen_ids.add(station_id)
        seen_names.add(normalized_name)

        website = station.get("homepage") or ""
        logo = station.get("favicon") or ""
        stations.append(
            {
                "id": station_id or f"station-{len(stations)}",
                "name": name,
                "streamUrl": stream_urls[0],
                "streamUrls": stream_urls,
                "website": website if is_http_url(website) else "",
                "logo": logo if is_http_url(logo) else "",
                "tags": str(station.get("tags") or ""),
                "language": str(station.get("language") or ""),
                "state": str(station.get("state") or ""),
                "codec": str(station.get("codec") or ""),
                "bitrate": station.get("bitrate") or 0,
                "votes": station.get("votes") or 0,
                "featured": False,
            }
        )

    for featured_station in FEATURED_STATIONS:
        existing_index = next(
            (
                index
                for index, station in enumerate(stations)
                if featured_name(station["name"]) == featured_station["name"]
            ),
            None,
        )
        if existing_index is None:
            stations.append(featured_station.copy())
        else:
            existing_station = stations[existing_index]
            clean_existing_urls = [
                u for u in existing_station.get("streamUrls", [])
                if is_http_url(u) and not any(p in str(u).lower() for p in INVALID_STREAM_PATTERNS)
            ]
            stream_urls = list(
                dict.fromkeys(
                    [
                        *featured_station["streamUrls"],
                        *clean_existing_urls,
                    ]
                )
            )
            stations[existing_index] = {
                **existing_station,
                **featured_station,
                "id": featured_station["id"],
                "streamUrl": stream_urls[0],
                "streamUrls": stream_urls,
                "votes": max(existing_station.get("votes", 0), featured_station.get("votes", 0)),
            }

    seen_names = {
        (featured_name(str(station.get("name", ""))) or str(station.get("name", "")).strip()).casefold()
        for station in stations
    }
    static_stations = load_static_stations()
    existing_static_names = {str(station.get("name", "")).strip().casefold() for station in static_stations}
    merged_stations = []
    for static_station in static_stations:
        static_name = str(static_station.get("name", "")).strip()
        normalized_name = (featured_name(static_name) or static_name).casefold()
        if not normalized_name:
            continue
        existing_station = next(
            (
                station
                for station in stations
                if (featured_name(str(station.get("name", ""))) or str(station.get("name", "")).strip()).casefold()
                == normalized_name
            ),
            None,
        )
        if existing_station:
            merged_stations.append(
                {
                    **existing_station,
                    "logo": static_station.get("logo", ""),
                }
            )
        elif normalized_name not in seen_names:
            merged_stations.append(static_station.copy())
        else:
            continue
        seen_names.add(normalized_name)
        if len(merged_stations) >= 100:
            break

    stations = merged_stations

    priority = {station["name"]: index for index, station in enumerate(FEATURED_STATIONS)}
    stations.sort(key=lambda station: priority.get(station["name"], len(priority) + 100))
    return stations[:100]


def _async_refresh_cache():
    global _stations_cache
    try:
        stations = load_stations()
        with _cache_lock:
            _stations_cache = (time.monotonic(), stations)
    except Exception as error:
        app.logger.warning("Background station refresh failed: %s", error)


def get_cached_stations() -> list[dict[str, object]]:
    global _stations_cache

    with _cache_lock:
        if _stations_cache and time.monotonic() - _stations_cache[0] < CACHE_SECONDS:
            return _stations_cache[1]

        cached = _stations_cache[1] if _stations_cache else load_static_stations()
        _stations_cache = (time.monotonic(), cached)

    threading.Thread(target=_async_refresh_cache, daemon=True).start()
    return cached


def ordered_stream_urls(station: dict[str, object]) -> list[str]:
    raw_stream_urls = station.get("streamUrls")
    if not isinstance(raw_stream_urls, list) or not raw_stream_urls:
        stream_url = station.get("streamUrl")
        raw_stream_urls = [stream_url] if isinstance(stream_url, str) and stream_url else []

    # Put direct audio streams first for instant native HTML5 audio playback in browsers,
    # followed by HLS playlists as secondary.
    return sorted(
        (str(stream_url) for stream_url in raw_stream_urls),
        key=lambda stream_url: urlparse(stream_url).path.lower().endswith(".m3u8"),
    )


def station_response(station: dict[str, object]) -> dict[str, object]:
    station_id = str(station["id"])
    raw_stream_urls = ordered_stream_urls(station)
    raw_logo = station.get("logo")
    logo = (
        raw_logo
        if is_http_url(raw_logo)
        or isinstance(raw_logo, str) and re.fullmatch(r"/logos/[a-z0-9-]+\.png", raw_logo)
        else ""
    )

    proxied_streams = [
        url_for("station_stream", station_id=station_id, stream_index=index)
        for index in range(len(raw_stream_urls))
    ]

    combined_streams = []
    combined_types = []

    for index, raw_url in enumerate(raw_stream_urls):
        combined_streams.append(proxied_streams[index])
        combined_types.append("hls" if urlparse(str(raw_url)).path.lower().endswith(".m3u8") else "audio")

    return {
        **station,
        "logo": logo,
        "streamUrl": combined_streams[0] if combined_streams else "",
        "streamUrls": combined_streams,
        "streamTypes": combined_types,
    }


@app.get("/api/stations")
def get_stations():
    try:
        stations = get_cached_stations()
    except Exception as error:
        app.logger.exception("Unable to retrieve Kenyan radio stations")
        return jsonify(
            {
                "error": "The radio directory is temporarily unavailable. Please try again.",
                "details": str(error),
            }
        ), 502
    return jsonify(
        {"stations": [station_response(station) for station in stations], "source": "Radio Browser"}
    )


def make_resource_token(resource_url: str) -> str:
    encoded_url = base64.urlsafe_b64encode(resource_url.encode()).decode().rstrip("=")
    signature = hmac.new(_proxy_secret, encoded_url.encode(), hashlib.sha256).hexdigest()
    return f"{encoded_url}.{signature}"


def read_resource_token(token: str) -> str | None:
    try:
        encoded_url, signature = token.rsplit(".", 1)
        expected_signature = hmac.new(_proxy_secret, encoded_url.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected_signature):
            return None
        padding = "=" * (-len(encoded_url) % 4)
        resource_url = base64.urlsafe_b64decode(encoded_url + padding).decode()
        return resource_url if is_http_url(resource_url) else None
    except (ValueError, UnicodeDecodeError):
        return None


def playlist_resource_url(resource_url: str) -> str:
    token = make_resource_token(resource_url)
    return url_for("stream_resource", token=token)


def is_hls_response(response, source_url: str) -> bool:
    content_type = response.headers.get_content_type().lower()
    return (
        "mpegurl" in content_type
        or "vnd.apple" in content_type
        or urlparse(source_url).path.lower().endswith(".m3u8")
    )


def rewrite_hls_playlist(playlist: bytes, base_url: str) -> bytes:
    parsed_base = urlparse(base_url)
    if not parsed_base.path.endswith("/") and "." not in parsed_base.path.rsplit("/", 1)[-1]:
        base_url = base_url + "/"

    text = playlist.decode("utf-8-sig")
    rewritten_lines = []
    for line in text.splitlines():
        stripped_line = line.strip()
        if stripped_line and not stripped_line.startswith("#"):
            line = playlist_resource_url(urljoin(base_url, stripped_line))
        elif "URI=" in line:
            line = re.sub(
                r'URI="([^"]+)"',
                lambda match: f'URI="{playlist_resource_url(urljoin(base_url, match.group(1)))}"',
                line,
            )
        rewritten_lines.append(line)
    return ("\n".join(rewritten_lines) + "\n").encode()


def relay_upstream(upstream, source_url: str, station_id: str, codec: str = ""):
    upstream_content_type = upstream.headers.get("Content-Type", "").lower()
    if any(
        invalid_type in upstream_content_type
        for invalid_type in ("text/html", "application/json")
    ):
        upstream.close()
        app.logger.warning(
            "Rejected non-audio stream response for station %s (%s)",
            station_id,
            upstream_content_type,
        )
        return jsonify({"error": "The broadcaster returned a non-audio response."}), 502

    if is_hls_response(upstream, source_url):
        try:
            playlist = upstream.read(1_000_001)
        finally:
            upstream.close()
        if len(playlist) > 1_000_000:
            return jsonify({"error": "The station playlist is unexpectedly large."}), 502
        response = Response(
            rewrite_hls_playlist(playlist, upstream.geturl()),
            status=upstream.status,
            content_type="application/vnd.apple.mpegurl",
        )
        response.headers["Cache-Control"] = "no-store"
        return response

    def relay():
        try:
            while chunk := upstream.read(8192):
                yield chunk
        except (OSError, URLError):
            app.logger.warning("Stream connection ended for station %s", station_id)
        finally:
            upstream.close()

    content_type = upstream.headers.get("Content-Type") or {
        "MP3": "audio/mpeg",
        "AAC": "audio/aac",
        "AAC+": "audio/aac",
    }.get(codec.upper(), "audio/mpeg")

    response = Response(
        stream_with_context(relay()),
        status=upstream.status,
        content_type=content_type,
        direct_passthrough=True,
    )
    for header_name in ("Content-Length", "Content-Range", "Accept-Ranges"):
        if header_name in upstream.headers:
            response.headers[header_name] = upstream.headers[header_name]
    response.headers["Cache-Control"] = "no-store"
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response


def open_stream_url(stream_url: str, incoming_headers=None, max_playlist_depth=3):
    if not is_public_http_url(stream_url):
        raise ValueError("The stream address is not a public HTTP(S) URL.")
    headers = {
        "User-Agent": STREAM_USER_AGENT,
        "Accept": "*/*",
        "Icy-MetaData": "1",
    }
    incoming_headers = incoming_headers or {}
    for header_name in ("Range", "If-Range", "Accept", "Accept-Encoding"):
        if header_name in incoming_headers:
            headers[header_name] = incoming_headers[header_name]

    current_url = stream_url
    for _ in range(max_playlist_depth):
        stream_request = Request(current_url, headers=headers)
        opener = build_opener(PublicStreamRedirectHandler(), HTTPSHandler(context=_ssl_context))
        upstream = opener.open(stream_request, timeout=15)

        ct = upstream.headers.get("Content-Type", "").lower()
        path = urlparse(current_url).path.lower()

        # Unwrap PLS / non-HLS M3U playlists to target stream URL
        if (
            ("x-scpls" in ct or "pls" in ct or path.endswith(".pls") or (path.endswith(".m3u") and not path.endswith(".m3u8")))
            and not is_hls_response(upstream, current_url)
        ):
            try:
                playlist_data = upstream.read(65536).decode("utf-8", errors="ignore")
            finally:
                upstream.close()

            pls_match = re.search(r'File\d*=(https?://[^\s]+)', playlist_data, re.I)
            if pls_match:
                target_url = pls_match.group(1).strip()
                if is_public_http_url(target_url):
                    current_url = target_url
                    continue

            m3u_match = re.search(r'^(https?://[^\s]+)', playlist_data, re.M | re.I)
            if m3u_match:
                target_url = m3u_match.group(1).strip()
                if is_public_http_url(target_url):
                    current_url = target_url
                    continue

        return upstream

    raise ValueError("Too many playlist redirects.")


@app.get("/api/stream/<station_id>/<int:stream_index>")
def station_stream(station_id: str, stream_index: int):
    try:
        stations = get_cached_stations()
    except Exception as error:
        app.logger.exception("Unable to find station stream")
        return jsonify({"error": "The station directory is temporarily unavailable."}), 502

    station = next((item for item in stations if item["id"] == station_id), None)
    if not station:
        return jsonify({"error": "Station not found."}), 404
    stream_urls = ordered_stream_urls(station)
    if not isinstance(stream_urls, list) or stream_index < 0 or stream_index >= len(stream_urls):
        return jsonify({"error": "Stream not found."}), 404

    stream_url = stream_urls[stream_index]
    if not is_public_http_url(stream_url):
        app.logger.warning("Blocked unsafe stream URL for station %s", station_id)
        return jsonify({"error": "This station has an invalid stream address."}), 502

    try:
        upstream = open_stream_url(stream_url, request.headers)
    except (HTTPError, URLError, TimeoutError, ValueError, OSError) as error:
        app.logger.warning("Stream request failed for station %s (%s): %s", station_id, stream_url, error)
        return jsonify({"error": "The broadcaster stream is currently unavailable."}), 502

    return relay_upstream(upstream, stream_url, station_id, str(station.get("codec") or ""))


@app.get("/api/stream-resource/<token>")
def stream_resource(token: str):
    resource_url = read_resource_token(token)
    if not resource_url:
        return jsonify({"error": "Invalid stream resource."}), 404
    if not is_public_http_url(resource_url):
        return jsonify({"error": "This stream resource is not available."}), 502
    try:
        upstream = open_stream_url(resource_url, request.headers)
    except (HTTPError, URLError, TimeoutError, ValueError, OSError) as error:
        app.logger.warning("HLS stream resource request failed: %s", error)
        return jsonify({"error": "The station stream resource is unavailable."}), 502
    return relay_upstream(upstream, resource_url, "HLS resource")


@app.get("/")
def index():
    if (FRONTEND_DIST / "index.html").is_file():
        return send_from_directory(FRONTEND_DIST, "index.html")
    if (ROOT / "index.html").is_file():
        return send_from_directory(ROOT, "index.html")
    return jsonify(
        {
            "message": "Eugene Radio API is running. Start the React app with `npm run dev`.",
            "stations": "/api/stations",
        }
    )


@app.get("/<path:asset_path>")
def frontend_assets(asset_path: str):
    requested_file = FRONTEND_DIST / asset_path
    if requested_file.is_file():
        return send_from_directory(FRONTEND_DIST, asset_path)
    root_file = ROOT / asset_path
    if root_file.is_file():
        return send_from_directory(ROOT, asset_path)
    if (FRONTEND_DIST / "index.html").is_file():
        return send_from_directory(FRONTEND_DIST, "index.html")
    if (ROOT / "index.html").is_file():
        return send_from_directory(ROOT, "index.html")
    return jsonify({"error": "Not found"}), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
