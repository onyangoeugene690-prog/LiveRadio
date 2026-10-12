const { useState, useEffect, useRef, useMemo } = React;

// Clean SVG Icon Components
const SvgIcon = ({ size = 20, strokeWidth = 2, children, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

const AudioLines = (p) => (
  <SvgIcon {...p}>
    <path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" />
  </SvgIcon>
);

const Play = ({ fill = "currentColor", ...p }) => (
  <SvgIcon {...p}>
    <polygon points="6 3 20 12 6 21 6 3" fill={fill} />
  </SvgIcon>
);

const Pause = ({ fill = "currentColor", ...p }) => (
  <SvgIcon {...p}>
    <rect x="6" y="4" width="4" height="16" fill={fill} /><rect x="14" y="4" width="4" height="16" fill={fill} />
  </SvgIcon>
);

const Heart = ({ fill = "none", ...p }) => (
  <SvgIcon {...p}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill={fill} />
  </SvgIcon>
);

const Signal = (p) => (
  <SvgIcon {...p}>
    <path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" /><path d="M22 20V4" />
  </SvgIcon>
);

const ArrowUpRight = (p) => (
  <SvgIcon {...p}>
    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
  </SvgIcon>
);

const Search = (p) => (
  <SvgIcon {...p}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </SvgIcon>
);

const ChevronDown = (p) => (
  <SvgIcon {...p}>
    <path d="m6 9 6 6 6-6" />
  </SvgIcon>
);

const Check = (p) => (
  <SvgIcon {...p}>
    <path d="M20 6 9 17l-5-5" />
  </SvgIcon>
);

const X = (p) => (
  <SvgIcon {...p}>
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </SvgIcon>
);

const LoaderCircle = (p) => (
  <SvgIcon {...p}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </SvgIcon>
);

const Radio = (p) => (
  <SvgIcon {...p}>
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
  </SvgIcon>
);

const Headphones = (p) => (
  <SvgIcon {...p}>
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
  </SvgIcon>
);

const Volume2 = (p) => (
  <SvgIcon {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </SvgIcon>
);

const VolumeX = (p) => (
  <SvgIcon {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" />
  </SvgIcon>
);

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
    Gospel: /gospel|christian|worship|religion/,
  };
  return matches[category].test(tags);
}

function StationArtwork({ station, compact = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = station.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (station.logo && !imageFailed) {
    return (
      <img
        className={`station-art${compact ? " station-art--compact" : ""}`}
        src={station.logo}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className={`station-art station-art--fallback${compact ? " station-art--compact" : ""}`}>
      <span>{initials || "KE"}</span>
      <AudioLines aria-hidden="true" />
    </div>
  );
}

function StationCard({ station, isPlaying, isFavorite, onPlay, onFavorite }) {
  const tags = station.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 2);

  return (
    <article className={`station-card${isPlaying ? " station-card--active" : ""}`}>
      <button
        className={`favorite-button${isFavorite ? " favorite-button--saved" : ""}`}
        type="button"
        aria-label={isFavorite ? `Remove ${station.name} from favorites` : `Add ${station.name} to favorites`}
        onClick={() => onFavorite(station.id)}
      >
        <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      <button className="station-card__main" type="button" onClick={() => onPlay(station)}>
        <div className="station-card__art-wrap">
          <StationArtwork station={station} />
          <span className="station-card__play">
            {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
          </span>
        </div>
        <div className="station-card__copy">
          <div className="station-card__eyebrow">
            <span className="station-card__country">KE</span>
            {station.featured && <span className="station-card__featured">TOP PICK</span>}
            {station.state && <span className="station-card__state">{station.state}</span>}
          </div>
          <h3 title={station.name}>{station.name}</h3>
          <p>{tags.length ? tags.join(" · ") : station.language || "Kenyan radio"}</p>
        </div>
      </button>
      <div className="station-card__footer">
        <span><Signal size={13} /> {station.codec || "LIVE"}{station.bitrate ? ` · ${station.bitrate} kbps` : ""}</span>
        {station.website && (
          <a href={station.website} target="_blank" rel="noreferrer" aria-label={`Visit ${station.name} website`}>
            <ArrowUpRight size={15} />
          </a>
        )}
      </div>
    </article>
  );
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
    const focusSearch = (event) => {
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
    return stations.filter((station) => {
      const matchesSearch =
        !normalizedQuery ||
        `${station.name} ${station.state} ${station.tags} ${station.language}`.toLowerCase().includes(normalizedQuery);
      return (
        matchesSearch &&
        matchesCategory(station, category) &&
        (!showFavorites || favorites.has(station.id))
      );
    });
  }, [stations, query, category, showFavorites, favorites]);

  const toggleFavorite = (stationId) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(stationId)) next.delete(stationId);
      else next.add(stationId);
      return next;
    });
  };

  const handleStreamError = (error) => {
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
    const isCurrentRequest = () =>
      requestId === streamRequestRef.current &&
      currentStationRef.current?.id === station.id &&
      streamIndexRef.current === index;

    hasPlayedStreamRef.current = false;
    streamTimeoutRef.current = window.setTimeout(() => handleStreamError(), STREAM_CONNECT_TIMEOUT_MS);
    streamTypeRef.current = streamType;

    try {
      if (streamType === "hls" && !audio.canPlayType("application/vnd.apple.mpegurl")) {
        hlsLoadingRef.current = true;
        if (window.Hls && window.Hls.isSupported()) {
          if (!isCurrentRequest()) return;
          hlsLoadingRef.current = false;
          const hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsRef.current = hls;
          hls.on(window.Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) handleStreamError();
          });
          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            audio.play().catch((error) => handleStreamError(error));
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

  const playStation = async (station) => {
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
    if (audioRef.current?.paused) await playStation(activeStation);
    else audioRef.current?.pause();
  };

  const changeVolume = (event) => {
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

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Eugene home">
          <span className="brand__mark"><AudioLines size={19} strokeWidth={2.4} /></span>
          <span>Eugene<span className="brand__dot">.</span></span>
        </a>
        <div className="topbar__center"><span className="kenya-mark" /> SOUND OF KENYA</div>
        <button
          className={`favorites-toggle${showFavorites ? " favorites-toggle--active" : ""}`}
          type="button"
          onClick={() => setShowFavorites((value) => !value)}
        >
          <Heart size={16} fill={showFavorites ? "currentColor" : "none"} />
          <span>Saved</span>
          {favorites.size > 0 && <span className="favorites-count">{favorites.size}</span>}
        </button>
      </header>

      <section className="hero">
        <div className="hero__content">
          <div className="hero__kicker"><span className="live-dot" /> YOUR FREQUENCY, YOUR HOME</div>
          <h1>Kenya, <span>on air.</span></h1>
          <p className="hero__intro">From the coast to the highlands. Find your station, turn it up, and take a little Kenya with you.</p>
          <div className="hero__meta">
            <div className="hero__stat"><strong>{stations.length || "—"}</strong><span>stations to discover</span></div>
            <span className="hero__divider" />
            <div className="hero__stat"><strong>47</strong><span>counties. one home.</span></div>
          </div>
        </div>
        <div className="hero__art" aria-hidden="true">
          <div className="hero__orbit hero__orbit--outer" />
          <div className="hero__orbit hero__orbit--inner" />
          <div className="hero__sun"><AudioLines size={50} strokeWidth={1.35} /></div>
          <span className="hero__label hero__label--top">NAIROBI · KENYA</span>
          <span className="hero__label hero__label--bottom">LIVE FROM KENYA <span>✳</span></span>
        </div>
      </section>

      <section className="directory" aria-labelledby="directory-title">
        <div className="directory__heading">
          <div>
            <p className="section-eyebrow">TUNE IN</p>
            <h2 id="directory-title">{showFavorites ? "Your saved stations" : "Find your frequency"}<span className="heading-period">.</span></h2>
          </div>
          <div className="directory__count"><span className="count-dot" /> {filteredStations.length} {filteredStations.length === 1 ? "station" : "stations"}</div>
        </div>

        <div className="toolbar">
          <label className="search-box">
            <Search size={18} aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stations, genres, counties..."
              aria-label="Search radio stations"
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
            <span className="search-shortcut">⌘ / Ctrl K</span>
          </label>
          <button className="filter-select" type="button" onClick={() => setCategory((current) => categories[(categories.indexOf(current) + 1) % categories.length])}>
            <span>{category}</span><ChevronDown size={16} />
          </button>
        </div>

        <div className="category-tabs" role="group" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={`category-tab${category === item ? " category-tab--active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
              {category === item && <span className="category-tab__check"><Check size={11} /></span>}
            </button>
          ))}
          <span className="directory__source">Directory by <strong>{source}</strong></span>
        </div>

        {loading ? (
          <div className="state-panel"><LoaderCircle className="spin" size={25} /><span>Finding your stations...</span></div>
        ) : error ? (
          <div className="state-panel state-panel--error">
            <Radio size={25} /><strong>We lost the signal.</strong><span>{error}</span>
            <button type="button" className="retry-button" onClick={fetchStations}>Try again <ArrowUpRight size={14} /></button>
          </div>
        ) : filteredStations.length ? (
          <div className="station-grid">
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                isPlaying={playing && activeStation?.id === station.id}
                isFavorite={favorites.has(station.id)}
                onPlay={playStation}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="state-panel state-panel--empty">
            <Headphones size={25} />
            <strong>{showFavorites && !favorites.size ? "Your favorites live here." : "No stations found."}</strong>
            <span>{showFavorites && !favorites.size ? "Tap the heart on any station to save it for later." : "Try another search or choose a different category."}</span>
            {(query || category !== "All stations" || showFavorites) && (
              <button type="button" className="retry-button" onClick={() => { setQuery(""); setCategory("All stations"); setShowFavorites(false); }}>
                Clear filters <X size={14} />
              </button>
            )}
          </div>
        )}
      </section>

      <footer className="footer">
        <a className="brand brand--footer" href="#"><span className="brand__mark"><AudioLines size={16} /></span><span>Eugene<span className="brand__dot">.</span></span></a>
        <p>Made for the love of the airwaves. <span>✳</span> Kenya</p>
        <p className="footer__note">Station data from {source}. Stream availability varies by broadcaster.</p>
      </footer>
      <p className="copyright">© {new Date().getFullYear()} Eugene Onyango. All rights reserved.</p>

      <div className={`player${activeStation ? " player--active" : ""}`} aria-label="Radio player">
        <audio
          ref={audioRef}
          onCanPlay={() => {
            if (playerError === "Connecting to station...") setPlayerError("");
          }}
          onPlaying={() => {
            hasPlayedStreamRef.current = true;
            window.clearTimeout(streamTimeoutRef.current);
            setPlaying(true);
            setPlayerError("");
          }}
          onPause={() => setPlaying(false)}
          onWaiting={handleStreamStalled}
          onStalled={handleStreamStalled}
          onEnded={handleStreamError}
          onError={() => {
            if (streamTypeRef.current === "hls" && (hlsLoadingRef.current || hlsRef.current?.media === audioRef.current)) return;
            handleStreamError();
          }}
        />
        <div className="player__station">
          {activeStation ? <StationArtwork station={activeStation} compact /> : <div className="player__placeholder"><Radio size={19} /></div>}
          <div className="player__details">
            <strong>{activeStation?.name || "Pick a station"}</strong>
            <span>{playerError || (activeStation ? playing ? "LIVE · KENYA" : "Ready to play" : "Your next favorite is out there")}</span>
          </div>
        </div>
        <div className="player__controls">
          <button className="player__play" type="button" disabled={!activeStation} onClick={togglePlayback} aria-label={playing ? "Pause radio" : "Play radio"}>
            {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
          </button>
          <div className="player__live">{playing && <><span className="live-dot" /> ON AIR</>}</div>
        </div>
        <div className="player__volume">
          <button type="button" aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
            {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={changeVolume} aria-label="Volume" style={{ "--volume": `${volume * 100}%` }} />
        </div>
        <div className="player__branding"><span className="kenya-mark" /> <span>MADE IN KENYA</span></div>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
