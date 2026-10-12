import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;

// Clean SVG Icon Components
const SvgIcon = ({
  size = 20,
  strokeWidth = 2,
  children,
  ...props
}) => /*#__PURE__*/_jsx("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...props,
  children: children
});
const AudioLines = p => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("path", {
    d: "M2 10v3"
  }), /*#__PURE__*/_jsx("path", {
    d: "M6 6v11"
  }), /*#__PURE__*/_jsx("path", {
    d: "M10 3v18"
  }), /*#__PURE__*/_jsx("path", {
    d: "M14 8v7"
  }), /*#__PURE__*/_jsx("path", {
    d: "M18 5v13"
  }), /*#__PURE__*/_jsx("path", {
    d: "M22 10v3"
  })]
});
const Play = ({
  fill = "currentColor",
  ...p
}) => /*#__PURE__*/_jsx(SvgIcon, {
  ...p,
  children: /*#__PURE__*/_jsx("polygon", {
    points: "6 3 20 12 6 21 6 3",
    fill: fill
  })
});
const Pause = ({
  fill = "currentColor",
  ...p
}) => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("rect", {
    x: "6",
    y: "4",
    width: "4",
    height: "16",
    fill: fill
  }), /*#__PURE__*/_jsx("rect", {
    x: "14",
    y: "4",
    width: "4",
    height: "16",
    fill: fill
  })]
});
const Heart = ({
  fill = "none",
  ...p
}) => /*#__PURE__*/_jsx(SvgIcon, {
  ...p,
  children: /*#__PURE__*/_jsx("path", {
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
    fill: fill
  })
});
const Signal = p => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("path", {
    d: "M2 20h.01"
  }), /*#__PURE__*/_jsx("path", {
    d: "M7 20v-4"
  }), /*#__PURE__*/_jsx("path", {
    d: "M12 20v-8"
  }), /*#__PURE__*/_jsx("path", {
    d: "M17 20V8"
  }), /*#__PURE__*/_jsx("path", {
    d: "M22 20V4"
  })]
});
const ArrowUpRight = p => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("path", {
    d: "M7 17L17 7"
  }), /*#__PURE__*/_jsx("path", {
    d: "M7 7h10v10"
  })]
});
const Search = p => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/_jsx("path", {
    d: "m21 21-4.3-4.3"
  })]
});
const ChevronDown = p => /*#__PURE__*/_jsx(SvgIcon, {
  ...p,
  children: /*#__PURE__*/_jsx("path", {
    d: "m6 9 6 6 6-6"
  })
});
const Check = p => /*#__PURE__*/_jsx(SvgIcon, {
  ...p,
  children: /*#__PURE__*/_jsx("path", {
    d: "M20 6 9 17l-5-5"
  })
});
const X = p => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/_jsx("path", {
    d: "m6 6 12 12"
  })]
});
const LoaderCircle = p => /*#__PURE__*/_jsx(SvgIcon, {
  ...p,
  children: /*#__PURE__*/_jsx("path", {
    d: "M21 12a9 9 0 1 1-6.219-8.56"
  })
});
const Radio = p => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("path", {
    d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9"
  }), /*#__PURE__*/_jsx("path", {
    d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"
  }), /*#__PURE__*/_jsx("circle", {
    cx: "12",
    cy: "12",
    r: "2"
  }), /*#__PURE__*/_jsx("path", {
    d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"
  }), /*#__PURE__*/_jsx("path", {
    d: "M19.1 4.9C23 8.8 23 15.1 19.1 19"
  })]
});
const Headphones = p => /*#__PURE__*/_jsx(SvgIcon, {
  ...p,
  children: /*#__PURE__*/_jsx("path", {
    d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
  })
});
const Volume2 = p => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("polygon", {
    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
  }), /*#__PURE__*/_jsx("path", {
    d: "M15.54 8.46a5 5 0 0 1 0 7.07"
  }), /*#__PURE__*/_jsx("path", {
    d: "M19.07 4.93a10 10 0 0 1 0 14.14"
  })]
});
const VolumeX = p => /*#__PURE__*/_jsxs(SvgIcon, {
  ...p,
  children: [/*#__PURE__*/_jsx("polygon", {
    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
  }), /*#__PURE__*/_jsx("line", {
    x1: "22",
    x2: "16",
    y1: "9",
    y2: "15"
  }), /*#__PURE__*/_jsx("line", {
    x1: "16",
    x2: "22",
    y1: "9",
    y2: "15"
  })]
});
const categories = ["All stations", "Music", "News", "Talk", "Gospel"];
const FAVORITES_KEY = "eugene-radio-favorite-stations";
const LEGACY_FAVORITES_KEY = "hewa-favorite-stations";
const STREAM_CONNECT_TIMEOUT_MS = 30000;
const STREAM_STALL_TIMEOUT_MS = 20000;
function loadFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY) || localStorage.getItem(LEGACY_FAVORITES_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}
function matchesCategory(station, category) {
  if (category === "All stations") return true;
  const tags = `${station.tags} ${station.name}`.toLowerCase();
  const matches = {
    Music: /music|hits|pop|urban|dance|classic|entertainment|rnb|afro/,
    News: /news|current affairs|politic|information/,
    Talk: /talk|spoken|discussion|community|sport/,
    Gospel: /gospel|christian|worship|religion/
  };
  return matches[category].test(tags);
}
function StationArtwork({
  station,
  compact = false
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = station.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  if (station.logo && !imageFailed) {
    return /*#__PURE__*/_jsx("img", {
      className: `station-art${compact ? " station-art--compact" : ""}`,
      src: station.logo,
      alt: "",
      loading: "lazy",
      referrerPolicy: "no-referrer",
      onError: () => setImageFailed(true)
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: `station-art station-art--fallback${compact ? " station-art--compact" : ""}`,
    children: [/*#__PURE__*/_jsx("span", {
      children: initials || "KE"
    }), /*#__PURE__*/_jsx(AudioLines, {
      "aria-hidden": "true"
    })]
  });
}
function StationCard({
  station,
  isPlaying,
  isFavorite,
  onPlay,
  onFavorite
}) {
  const tags = station.tags.split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 2);
  return /*#__PURE__*/_jsxs("article", {
    className: `station-card${isPlaying ? " station-card--active" : ""}`,
    children: [/*#__PURE__*/_jsx("button", {
      className: `favorite-button${isFavorite ? " favorite-button--saved" : ""}`,
      type: "button",
      "aria-label": isFavorite ? `Remove ${station.name} from favorites` : `Add ${station.name} to favorites`,
      onClick: () => onFavorite(station.id),
      children: /*#__PURE__*/_jsx(Heart, {
        size: 17,
        fill: isFavorite ? "currentColor" : "none"
      })
    }), /*#__PURE__*/_jsxs("button", {
      className: "station-card__main",
      type: "button",
      onClick: () => onPlay(station),
      children: [/*#__PURE__*/_jsxs("div", {
        className: "station-card__art-wrap",
        children: [/*#__PURE__*/_jsx(StationArtwork, {
          station: station
        }), /*#__PURE__*/_jsx("span", {
          className: "station-card__play",
          children: isPlaying ? /*#__PURE__*/_jsx(Pause, {
            size: 17,
            fill: "currentColor"
          }) : /*#__PURE__*/_jsx(Play, {
            size: 17,
            fill: "currentColor"
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "station-card__copy",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "station-card__eyebrow",
          children: [/*#__PURE__*/_jsx("span", {
            className: "station-card__country",
            children: "KE"
          }), station.featured && /*#__PURE__*/_jsx("span", {
            className: "station-card__featured",
            children: "TOP PICK"
          }), station.state && /*#__PURE__*/_jsx("span", {
            className: "station-card__state",
            children: station.state
          })]
        }), /*#__PURE__*/_jsx("h3", {
          title: station.name,
          children: station.name
        }), /*#__PURE__*/_jsx("p", {
          children: tags.length ? tags.join(" · ") : station.language || "Kenyan radio"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "station-card__footer",
      children: [/*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx(Signal, {
          size: 13
        }), " ", station.codec || "LIVE", station.bitrate ? ` · ${station.bitrate} kbps` : ""]
      }), station.website && /*#__PURE__*/_jsx("a", {
        href: station.website,
        target: "_blank",
        rel: "noreferrer",
        "aria-label": `Visit ${station.name} website`,
        children: /*#__PURE__*/_jsx(ArrowUpRight, {
          size: 15
        })
      })]
    })]
  });
}
function App() {
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState("Radio Browser");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All stations");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [activeStation, setActiveStation] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerError, setPlayerError] = useState("");
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const hasPlayedStreamRef = useRef(false);
  const searchRef = useRef(null);
  const currentStationRef = useRef(null);
  const streamIndexRef = useRef(0);
  const failedStreamIndexRef = useRef(-1);
  const streamTimeoutRef = useRef(null);
  const hlsRef = useRef(null);
  const hlsLoadingRef = useRef(false);
  const streamTypeRef = useRef("audio");
  const streamRequestRef = useRef(0);
  const stopCurrentStream = () => {
    streamRequestRef.current += 1;
    hlsLoadingRef.current = false;
    window.clearTimeout(streamTimeoutRef.current);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };
  const fetchStations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/stations");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.stations) && data.stations.length > 0) {
          setStations(data.stations);
          setSource(data.source || "Radio Browser");
          return;
        }
      }
    } catch {
      // Backend unavailable (e.g. GitHub Pages), fallback to static stations.json
    }
    try {
      const staticRes = await fetch("stations.json");
      if (staticRes.ok) {
        const staticData = await staticRes.json();
        if (Array.isArray(staticData.stations) && staticData.stations.length > 0) {
          setStations(staticData.stations);
          setSource(staticData.source || "Kenyan Airwaves Directory");
          return;
        }
      }
      throw new Error("Could not load station list.");
    } catch (loadError) {
      setError(loadError.message || "Could not load stations. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStations();
  }, []);
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);
  useEffect(() => {
    const focusSearch = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  useEffect(() => () => stopCurrentStream(), []);
  const filteredStations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return stations.filter(station => {
      const matchesSearch = !normalizedQuery || `${station.name} ${station.state} ${station.tags} ${station.language}`.toLowerCase().includes(normalizedQuery);
      return matchesSearch && matchesCategory(station, category) && (!showFavorites || favorites.has(station.id));
    });
  }, [stations, query, category, showFavorites, favorites]);
  const toggleFavorite = stationId => {
    setFavorites(current => {
      const next = new Set(current);
      if (next.has(stationId)) next.delete(stationId);else next.add(stationId);
      return next;
    });
  };
  const handleStreamError = error => {
    if (error && error.name === "AbortError") {
      return;
    }
    if (error && error.name === "NotAllowedError") {
      setPlaying(false);
      setPlayerError("Tap Play to start listening.");
      return;
    }
    const audio = audioRef.current;
    const station = currentStationRef.current;
    const failedIndex = streamIndexRef.current;
    if (!audio || !station || failedStreamIndexRef.current === failedIndex) return;
    failedStreamIndexRef.current = failedIndex;
    stopCurrentStream();
    const streamUrls = station.streamUrls?.length ? station.streamUrls : [station.streamUrl];
    const nextIndex = failedIndex + 1;
    if (nextIndex >= streamUrls.length) {
      setPlaying(false);
      setPlayerError("Stream unavailable. Try another station or visit its website.");
      return;
    }
    streamIndexRef.current = nextIndex;
    setPlayerError("Trying alternate stream...");
    startStream(station, nextIndex);
  };
  const startStream = async (station, index) => {
    const audio = audioRef.current;
    if (!audio) return;
    const streamUrls = station.streamUrls?.length ? station.streamUrls : [station.streamUrl];
    const streamUrl = streamUrls[index];
    const streamType = station.streamTypes?.[index] || "audio";
    currentStationRef.current = station;
    streamIndexRef.current = index;
    setPlayerError("Connecting to station...");
    stopCurrentStream();
    const requestId = streamRequestRef.current;
    const isCurrentRequest = () => requestId === streamRequestRef.current && currentStationRef.current?.id === station.id && streamIndexRef.current === index;
    hasPlayedStreamRef.current = false;
    streamTimeoutRef.current = window.setTimeout(() => handleStreamError(), STREAM_CONNECT_TIMEOUT_MS);
    streamTypeRef.current = streamType;
    try {
      if (streamType === "hls" && !audio.canPlayType("application/vnd.apple.mpegurl")) {
        hlsLoadingRef.current = true;
        if (window.Hls && window.Hls.isSupported()) {
          if (!isCurrentRequest()) return;
          hlsLoadingRef.current = false;
          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsRef.current = hls;
          hls.on(window.Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) handleStreamError();
          });
          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            audio.play().catch(error => handleStreamError(error));
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(audio);
        } else {
          if (!isCurrentRequest()) return;
          hlsLoadingRef.current = false;
          setPlayerError("This browser cannot play this station’s HLS stream.");
          handleStreamError();
        }
        return;
      }
      if (audio.src !== streamUrl) {
        audio.src = streamUrl;
      }
      audio.load();
      await audio.play();
    } catch (error) {
      if (!isCurrentRequest() || error.name === "AbortError") return;
      handleStreamError(error);
    }
  };
  const handleStreamStalled = () => {
    if (!hasPlayedStreamRef.current) return;
    setPlayerError("Buffering live stream...");
    window.clearTimeout(streamTimeoutRef.current);
    streamTimeoutRef.current = window.setTimeout(handleStreamError, STREAM_STALL_TIMEOUT_MS);
  };
  const playStation = async station => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeStation?.id === station.id && !audio.paused) {
      stopCurrentStream();
      audio.pause();
      return;
    }
    if (activeStation?.id !== station.id) {
      stopCurrentStream();
      audio.pause();
      setActiveStation(station);
      failedStreamIndexRef.current = -1;
      startStream(station, 0);
      return;
    }
    failedStreamIndexRef.current = -1;
    startStream(station, 0);
  };
  const togglePlayback = async () => {
    if (!activeStation) return;
    if (audioRef.current?.paused) await playStation(activeStation);else audioRef.current?.pause();
  };
  const changeVolume = event => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    setMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
      audioRef.current.muted = false;
    }
  };
  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (audioRef.current) audioRef.current.muted = nextMuted;
  };
  return /*#__PURE__*/_jsxs("main", {
    className: "app-shell",
    children: [/*#__PURE__*/_jsxs("header", {
      className: "topbar",
      children: [/*#__PURE__*/_jsxs("a", {
        className: "brand",
        href: "#",
        "aria-label": "Eugene home",
        children: [/*#__PURE__*/_jsx("span", {
          className: "brand__mark",
          children: /*#__PURE__*/_jsx(AudioLines, {
            size: 19,
            strokeWidth: 2.4
          })
        }), /*#__PURE__*/_jsxs("span", {
          children: ["Eugene", /*#__PURE__*/_jsx("span", {
            className: "brand__dot",
            children: "."
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "topbar__center",
        children: [/*#__PURE__*/_jsx("span", {
          className: "kenya-mark"
        }), " SOUND OF KENYA"]
      }), /*#__PURE__*/_jsxs("button", {
        className: `favorites-toggle${showFavorites ? " favorites-toggle--active" : ""}`,
        type: "button",
        onClick: () => setShowFavorites(value => !value),
        children: [/*#__PURE__*/_jsx(Heart, {
          size: 16,
          fill: showFavorites ? "currentColor" : "none"
        }), /*#__PURE__*/_jsx("span", {
          children: "Saved"
        }), favorites.size > 0 && /*#__PURE__*/_jsx("span", {
          className: "favorites-count",
          children: favorites.size
        })]
      })]
    }), /*#__PURE__*/_jsxs("section", {
      className: "hero",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "hero__content",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "hero__kicker",
          children: [/*#__PURE__*/_jsx("span", {
            className: "live-dot"
          }), " YOUR FREQUENCY, YOUR HOME"]
        }), /*#__PURE__*/_jsxs("h1", {
          children: ["Kenya, ", /*#__PURE__*/_jsx("span", {
            children: "on air."
          })]
        }), /*#__PURE__*/_jsx("p", {
          className: "hero__intro",
          children: "From the coast to the highlands. Find your station, turn it up, and take a little Kenya with you."
        }), /*#__PURE__*/_jsxs("div", {
          className: "hero__meta",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "hero__stat",
            children: [/*#__PURE__*/_jsx("strong", {
              children: stations.length || "—"
            }), /*#__PURE__*/_jsx("span", {
              children: "stations to discover"
            })]
          }), /*#__PURE__*/_jsx("span", {
            className: "hero__divider"
          }), /*#__PURE__*/_jsxs("div", {
            className: "hero__stat",
            children: [/*#__PURE__*/_jsx("strong", {
              children: "47"
            }), /*#__PURE__*/_jsx("span", {
              children: "counties. one home."
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "hero__art",
        "aria-hidden": "true",
        children: [/*#__PURE__*/_jsx("div", {
          className: "hero__orbit hero__orbit--outer"
        }), /*#__PURE__*/_jsx("div", {
          className: "hero__orbit hero__orbit--inner"
        }), /*#__PURE__*/_jsx("div", {
          className: "hero__sun",
          children: /*#__PURE__*/_jsx(AudioLines, {
            size: 50,
            strokeWidth: 1.35
          })
        }), /*#__PURE__*/_jsx("span", {
          className: "hero__label hero__label--top",
          children: "NAIROBI · KENYA"
        }), /*#__PURE__*/_jsxs("span", {
          className: "hero__label hero__label--bottom",
          children: ["LIVE FROM KENYA ", /*#__PURE__*/_jsx("span", {
            children: "✳"
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("section", {
      className: "directory",
      "aria-labelledby": "directory-title",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "directory__heading",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "section-eyebrow",
            children: "TUNE IN"
          }), /*#__PURE__*/_jsxs("h2", {
            id: "directory-title",
            children: [showFavorites ? "Your saved stations" : "Find your frequency", /*#__PURE__*/_jsx("span", {
              className: "heading-period",
              children: "."
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "directory__count",
          children: [/*#__PURE__*/_jsx("span", {
            className: "count-dot"
          }), " ", filteredStations.length, " ", filteredStations.length === 1 ? "station" : "stations"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "toolbar",
        children: [/*#__PURE__*/_jsxs("label", {
          className: "search-box",
          children: [/*#__PURE__*/_jsx(Search, {
            size: 18,
            "aria-hidden": "true"
          }), /*#__PURE__*/_jsx("input", {
            ref: searchRef,
            type: "search",
            value: query,
            onChange: event => setQuery(event.target.value),
            placeholder: "Search stations, genres, counties...",
            "aria-label": "Search radio stations"
          }), query && /*#__PURE__*/_jsx("button", {
            type: "button",
            onClick: () => setQuery(""),
            "aria-label": "Clear search",
            children: /*#__PURE__*/_jsx(X, {
              size: 16
            })
          }), /*#__PURE__*/_jsx("span", {
            className: "search-shortcut",
            children: "⌘ / Ctrl K"
          })]
        }), /*#__PURE__*/_jsxs("button", {
          className: "filter-select",
          type: "button",
          onClick: () => setCategory(current => categories[(categories.indexOf(current) + 1) % categories.length]),
          children: [/*#__PURE__*/_jsx("span", {
            children: category
          }), /*#__PURE__*/_jsx(ChevronDown, {
            size: 16
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "category-tabs",
        role: "group",
        "aria-label": "Filter by category",
        children: [categories.map(item => /*#__PURE__*/_jsxs("button", {
          type: "button",
          className: `category-tab${category === item ? " category-tab--active" : ""}`,
          onClick: () => setCategory(item),
          children: [item, category === item && /*#__PURE__*/_jsx("span", {
            className: "category-tab__check",
            children: /*#__PURE__*/_jsx(Check, {
              size: 11
            })
          })]
        }, item)), /*#__PURE__*/_jsxs("span", {
          className: "directory__source",
          children: ["Directory by ", /*#__PURE__*/_jsx("strong", {
            children: source
          })]
        })]
      }), loading ? /*#__PURE__*/_jsxs("div", {
        className: "state-panel",
        children: [/*#__PURE__*/_jsx(LoaderCircle, {
          className: "spin",
          size: 25
        }), /*#__PURE__*/_jsx("span", {
          children: "Finding your stations..."
        })]
      }) : error ? /*#__PURE__*/_jsxs("div", {
        className: "state-panel state-panel--error",
        children: [/*#__PURE__*/_jsx(Radio, {
          size: 25
        }), /*#__PURE__*/_jsx("strong", {
          children: "We lost the signal."
        }), /*#__PURE__*/_jsx("span", {
          children: error
        }), /*#__PURE__*/_jsxs("button", {
          type: "button",
          className: "retry-button",
          onClick: fetchStations,
          children: ["Try again ", /*#__PURE__*/_jsx(ArrowUpRight, {
            size: 14
          })]
        })]
      }) : filteredStations.length ? /*#__PURE__*/_jsx("div", {
        className: "station-grid",
        children: filteredStations.map(station => /*#__PURE__*/_jsx(StationCard, {
          station: station,
          isPlaying: playing && activeStation?.id === station.id,
          isFavorite: favorites.has(station.id),
          onPlay: playStation,
          onFavorite: toggleFavorite
        }, station.id))
      }) : /*#__PURE__*/_jsxs("div", {
        className: "state-panel state-panel--empty",
        children: [/*#__PURE__*/_jsx(Headphones, {
          size: 25
        }), /*#__PURE__*/_jsx("strong", {
          children: showFavorites && !favorites.size ? "Your favorites live here." : "No stations found."
        }), /*#__PURE__*/_jsx("span", {
          children: showFavorites && !favorites.size ? "Tap the heart on any station to save it for later." : "Try another search or choose a different category."
        }), (query || category !== "All stations" || showFavorites) && /*#__PURE__*/_jsxs("button", {
          type: "button",
          className: "retry-button",
          onClick: () => {
            setQuery("");
            setCategory("All stations");
            setShowFavorites(false);
          },
          children: ["Clear filters ", /*#__PURE__*/_jsx(X, {
            size: 14
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("footer", {
      className: "footer",
      children: [/*#__PURE__*/_jsxs("a", {
        className: "brand brand--footer",
        href: "#",
        children: [/*#__PURE__*/_jsx("span", {
          className: "brand__mark",
          children: /*#__PURE__*/_jsx(AudioLines, {
            size: 16
          })
        }), /*#__PURE__*/_jsxs("span", {
          children: ["Eugene", /*#__PURE__*/_jsx("span", {
            className: "brand__dot",
            children: "."
          })]
        })]
      }), /*#__PURE__*/_jsxs("p", {
        children: ["Made for the love of the airwaves. ", /*#__PURE__*/_jsx("span", {
          children: "✳"
        }), " Kenya"]
      }), /*#__PURE__*/_jsxs("p", {
        className: "footer__note",
        children: ["Station data from ", source, ". Stream availability varies by broadcaster."]
      })]
    }), /*#__PURE__*/_jsxs("p", {
      className: "copyright",
      children: ["© ", new Date().getFullYear(), " Eugene Onyango. All rights reserved."]
    }), /*#__PURE__*/_jsxs("div", {
      className: `player${activeStation ? " player--active" : ""}`,
      "aria-label": "Radio player",
      children: [/*#__PURE__*/_jsx("audio", {
        ref: audioRef,
        onCanPlay: () => {
          if (playerError === "Connecting to station...") setPlayerError("");
        },
        onPlaying: () => {
          hasPlayedStreamRef.current = true;
          window.clearTimeout(streamTimeoutRef.current);
          setPlaying(true);
          setPlayerError("");
        },
        onPause: () => setPlaying(false),
        onWaiting: handleStreamStalled,
        onStalled: handleStreamStalled,
        onEnded: handleStreamError,
        onError: () => {
          if (streamTypeRef.current === "hls" && (hlsLoadingRef.current || hlsRef.current?.media === audioRef.current)) return;
          handleStreamError();
        }
      }), /*#__PURE__*/_jsxs("div", {
        className: "player__station",
        children: [activeStation ? /*#__PURE__*/_jsx(StationArtwork, {
          station: activeStation,
          compact: true
        }) : /*#__PURE__*/_jsx("div", {
          className: "player__placeholder",
          children: /*#__PURE__*/_jsx(Radio, {
            size: 19
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "player__details",
          children: [/*#__PURE__*/_jsx("strong", {
            children: activeStation?.name || "Pick a station"
          }), /*#__PURE__*/_jsx("span", {
            children: playerError || (activeStation ? playing ? "LIVE · KENYA" : "Ready to play" : "Your next favorite is out there")
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "player__controls",
        children: [/*#__PURE__*/_jsx("button", {
          className: "player__play",
          type: "button",
          disabled: !activeStation,
          onClick: togglePlayback,
          "aria-label": playing ? "Pause radio" : "Play radio",
          children: playing ? /*#__PURE__*/_jsx(Pause, {
            size: 19,
            fill: "currentColor"
          }) : /*#__PURE__*/_jsx(Play, {
            size: 19,
            fill: "currentColor"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "player__live",
          children: playing && /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx("span", {
              className: "live-dot"
            }), " ON AIR"]
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "player__volume",
        children: [/*#__PURE__*/_jsx("button", {
          type: "button",
          "aria-label": muted ? "Unmute" : "Mute",
          onClick: toggleMute,
          children: muted || volume === 0 ? /*#__PURE__*/_jsx(VolumeX, {
            size: 18
          }) : /*#__PURE__*/_jsx(Volume2, {
            size: 18
          })
        }), /*#__PURE__*/_jsx("input", {
          type: "range",
          min: "0",
          max: "1",
          step: "0.01",
          value: volume,
          onChange: changeVolume,
          "aria-label": "Volume",
          style: {
            "--volume": `${volume * 100}%`
          }
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "player__branding",
        children: [/*#__PURE__*/_jsx("span", {
          className: "kenya-mark"
        }), " ", /*#__PURE__*/_jsx("span", {
          children: "MADE IN KENYA"
        })]
      })]
    })]
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/_jsx(App, {}));