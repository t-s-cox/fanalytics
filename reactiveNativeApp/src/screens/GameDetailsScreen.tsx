// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Linking,
} from 'react-native';
// Try to import WebView; on unsupported platforms we'll fallback automatically
let WebViewComponent: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  WebViewComponent = require('react-native-webview').WebView; // may throw on unsupported platforms
} catch (e) {
  WebViewComponent = null;
}
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

interface GameDetailsProps {
  navigation: any;
  route: any;
}

interface GameDataRaw {
  times?: number[];
  avgs?: number[];
  worst15?: [string, number, number][]; // [comment, sentiment, time]
  best5?: [string, number, number][]; // [comment, sentiment, time]
  // Allow any extra keys without breaking
  [k: string]: any;
}

interface GameData {
  times: number[];
  avgs: number[];
  worst15: [string, number, number][];
  best5: [string, number, number][];
}

// Static mapping so Metro bundler can include the JSON assets
const gameJsonMap: Record<string, any> = {
  'cincinativskansas.json': require('../../assets/exports/cincinativskansas.json'),
  'dukevsyracuse.json': require('../../assets/exports/dukevsyracuse.json'),
  'fsuvsvirginia.json': require('../../assets/exports/fsuvsvirginia.json'),
  'gtvwoke.json': require('../../assets/exports/gtvwoke.json'),
  'louisvillevspittsburgh.json': require('../../assets/exports/louisvillevspittsburgh.json'),
  'lsuvolemiss.json': require('../../assets/exports/lsuvolemiss.json'),
  'notredamevsarkansas.json': require('../../assets/exports/notredamevsarkansas.json'),
  'syracusevsclemson.json': require('../../assets/exports/syracusevsclemson.json'),
  'uclavsnorthwestern.json': require('../../assets/exports/uclavsnorthwestern.json'),
  'uscvillinois.json': require('../../assets/exports/uscvillinois.json'),
  'utahvsvandy.json': require('../../assets/exports/utahvsvandy.json'),
};

// Base (light) and DARK variant mappings for game analysis
const gameGraphMapLight: Record<string, any> = {
  'cincinativskansas.json': require('../../assets/graphs/game_analysis_cincinnati_kansas.png'),
  'dukevsyracuse.json': require('../../assets/graphs/game_analysis_duke_syracuse.png'),
  'louisvillevspittsburgh.json': require('../../assets/graphs/game_analysis_louisville_pittsburgh.png'),
  'lsuvolemiss.json': require('../../assets/graphs/game_analysis_lsu_ole_miss.png'),
  'notredamevsarkansas.json': require('../../assets/graphs/game_analysis_notre_dame_arkansas.png'),
  'uclavsnorthwestern.json': require('../../assets/graphs/game_analysis_ucla_northwestern.png'),
  'uscvillinois.json': require('../../assets/graphs/game_analysis_usc_illinois.png'),
  'utahvsvandy.json': require('../../assets/graphs/game_analysis_utah_state_vanderbilt.png'),
};
const gameGraphMapDark: Record<string, any> = {
  'cincinativskansas.json': require('../../assets/graphs/DARK_game_analysis_cincinnati_kansas.png'),
  'dukevsyracuse.json': require('../../assets/graphs/DARK_game_analysis_duke_syracuse.png'),
  'louisvillevspittsburgh.json': require('../../assets/graphs/DARK_game_analysis_louisville_pittsburgh.png'),
  'lsuvolemiss.json': require('../../assets/graphs/DARK_game_analysis_lsu_ole_miss.png'),
  'notredamevsarkansas.json': require('../../assets/graphs/DARK_game_analysis_notre_dame_arkansas.png'),
  'uclavsnorthwestern.json': require('../../assets/graphs/DARK_game_analysis_ucla_northwestern.png'),
  'uscvillinois.json': require('../../assets/graphs/DARK_game_analysis_usc_illinois.png'),
  'utahvsvandy.json': require('../../assets/graphs/DARK_game_analysis_utah_state_vanderbilt.png'),
};

// Sentiment images (light vs dark)
const sentimentGraphMapLight: Record<string, any> = {
  'cincinativskansas.json': require('../../assets/graphs/sentiment_analysis_cincinnati_kansas.png'),
  'dukevsyracuse.json': require('../../assets/graphs/sentiment_analysis_duke_syracuse.png'),
  'louisvillevspittsburgh.json': require('../../assets/graphs/sentiment_analysis_louisville_pittsburgh.png'),
  'lsuvolemiss.json': require('../../assets/graphs/sentiment_analysis_lsu_ole_miss.png'),
  'notredamevsarkansas.json': require('../../assets/graphs/sentiment_analysis_notre_dame_arkansas.png'),
  'uclavsnorthwestern.json': require('../../assets/graphs/sentiment_analysis_ucla_northwestern.png'),
  'uscvillinois.json': require('../../assets/graphs/sentiment_analysis_usc_illinois.png'),
  'utahvsvandy.json': require('../../assets/graphs/sentiment_analysis_utah_state_vanderbilt.png'),
};
const sentimentGraphMapDark: Record<string, any> = {
  'cincinativskansas.json': require('../../assets/graphs/DARK_sentiment_analysis_cincinnati_kansas.png'),
  'dukevsyracuse.json': require('../../assets/graphs/DARK_sentiment_analysis_duke_syracuse.png'),
  'louisvillevspittsburgh.json': require('../../assets/graphs/DARK_sentiment_analysis_louisville_pittsburgh.png'),
  'lsuvolemiss.json': require('../../assets/graphs/DARK_sentiment_analysis_lsu_ole_miss.png'),
  'notredamevsarkansas.json': require('../../assets/graphs/DARK_sentiment_analysis_notre_dame_arkansas.png'),
  'uclavsnorthwestern.json': require('../../assets/graphs/DARK_sentiment_analysis_ucla_northwestern.png'),
  'uscvillinois.json': require('../../assets/graphs/DARK_sentiment_analysis_usc_illinois.png'),
  'utahvsvandy.json': require('../../assets/graphs/DARK_sentiment_analysis_utah_state_vanderbilt.png'),
};

// Legacy alias used by resolveGraphSource & debug text (light keys sufficient since key sets match)
const gameGraphMap = gameGraphMapLight;

const GameDetailsScreen: React.FC<GameDetailsProps> = ({ navigation, route }: GameDetailsProps) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const drawerNavigation = useNavigation();
  const { gameId, gameName, jsonFile } = route.params || {};
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllWorst, setShowAllWorst] = useState(false);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const [useSmoothed, setUseSmoothed] = useState(true);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  // shared horizontal cursor ratio (0..1) for synchronized vertical red line
  const [cursorRatio, setCursorRatio] = useState<number | null>(null);
  const [hoverCount, setHoverCount] = useState(0); // track overlapping hover across both graphs
  const [cursorLocked, setCursorLocked] = useState(false);
  const [lastClickTs, setLastClickTs] = useState<number>(0);

  useEffect(() => {
    loadGameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonFile]);

  const normalizeData = (raw: GameDataRaw): GameData => {
    const times = Array.isArray(raw.times) ? raw.times.filter(t => typeof t === 'number') : [];
    const avgsRaw = Array.isArray(raw.avgs) ? raw.avgs.filter(a => typeof a === 'number') : [];
    // Ensure lengths match
    const length = Math.min(times.length, avgsRaw.length);
    const timesSlice = times.slice(0, length);
    const avgsSlice = avgsRaw.slice(0, length);
    // Clamp avgs to [0,1]
    const avgs = avgsSlice.map(v => v < 0 ? 0 : v > 1 ? 1 : v);
    const worst15 = Array.isArray(raw.worst15) ? raw.worst15.slice(0, 15) : [];
    const best5 = Array.isArray(raw.best5) ? raw.best5.slice(0, 5) : [];
    return { times: timesSlice, avgs, worst15, best5 };
  };

  const loadGameData = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      if (!jsonFile || !gameJsonMap[jsonFile]) {
        throw new Error('JSON file mapping not found');
      }
      const raw: GameDataRaw = gameJsonMap[jsonFile];
      const normalized = normalizeData(raw);
      setGameData(normalized);
    } catch (e: any) {
      console.error('Error loading game data:', e);
      setError(e?.message || 'Failed to load data');
      setGameData(null);
    } finally {
      setLoading(false);
    }
  }, [jsonFile]);

  const formatMinute = (m: number) => {
    if (!isFinite(m) || isNaN(m) || m < 0) return '0:00';
    const whole = Math.floor(Math.abs(m));
    const fractional = Math.abs(m) - whole;
    const secs = Math.round(fractional * 60);
    return `${whole}:${String(secs).padStart(2, '0')}`;
  };

  // Aggregate duplicate times by averaging their values to reduce jitter
  const aggregatedSeries = useMemo(() => {
    if (!gameData) return null;
    const map = new Map<number, { sum: number; count: number }>();
    gameData.times.forEach((t: number, i: number) => {
      const v = gameData.avgs[i];
      const slot = map.get(t) || { sum: 0, count: 0 };
      slot.sum += v; slot.count += 1; map.set(t, slot);
    });
    const times = Array.from(map.keys()).sort((a,b)=>a-b);
    const avgs = times.map(t => map.get(t)!.sum / map.get(t)!.count);
    return { times, avgs };
  }, [gameData]);

  // Smoothing with peak preservation
  const smoothedSeries = useMemo(() => {
    if (!aggregatedSeries) return null;
    const { times, avgs } = aggregatedSeries;
    if (avgs.length < 5) return aggregatedSeries; // nothing to do
    // 1. Median filter (window 3)
    const medianFiltered = avgs.map((v: number, i: number) => {
      if (i===0 || i===avgs.length-1) return v;
      const window = [avgs[i-1], v, avgs[i+1]].sort((a,b)=>a-b);
      return window[1];
    });
    // 2. Triangular moving average (window 5 weights 1,2,3,2,1)
    const weights = [1,2,3,2,1];
    const wSum = weights.reduce((a,b)=>a+b,0);
    const tri = medianFiltered.map((v: number, i: number)=>{
      if (i<2 || i>medianFiltered.length-3) return v;
      let acc = 0; for(let k=-2;k<=2;k++){ acc += medianFiltered[i+k]*weights[k+2]; }
      return acc / wSum;
    });
    // 3. Peak preservation: identify local maxima/minima in original aggregated avgs with prominence
    const preserved = [...tri];
    for (let i=1;i<avgs.length-1;i++) {
      const prev = avgs[i-1], cur = avgs[i], next = avgs[i+1];
      const isPeak = cur>prev && cur>next;
      const isValley = cur<prev && cur<next;
      if (isPeak || isValley) {
        const prominence = Math.abs(cur - (prev+next)/2);
        if (prominence > 0.04) { // threshold tweakable
          preserved[i] = cur; // restore original extreme
        }
      }
    }
    return { times, avgs: preserved };
  }, [aggregatedSeries]);

  const activeSeries = useMemo(() => {
    if (!aggregatedSeries) return null;
    if (!useSmoothed || !smoothedSeries) return aggregatedSeries;
    return smoothedSeries;
  }, [aggregatedSeries, smoothedSeries, useSmoothed]);



  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => drawerNavigation.dispatch(DrawerActions.openDrawer())}
      >
        <Image 
          source={require('../../assets/hamburger2.png')}
          style={styles.hamburgerIcon}
        />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {gameName || 'Game Analysis'}
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Live Analytics Dashboard
        </Text>
      </View>
      <TouchableOpacity
        style={styles.themeButton}
        onPress={toggleTheme}
      >
        <Image 
          source={isDark ? require('../../assets/lightMode.png') : require('../../assets/darkMode.png')}
          style={[styles.themeIcon, { tintColor: theme.text }]}
        />
      </TouchableOpacity>
    </View>
  );

  const renderVideoStream = () => {
    // Web platform: use a raw iframe (react-native-web allows unknown tags)
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.videoContainer, { backgroundColor: theme.card }]}>        
          <View style={styles.videoInnerWrapper}>
            {/* @ts-ignore: iframe is valid on web */}
            <iframe
              src="https://www.youtube.com/embed/r9BPacWxJ2M?playsinline=1"
              style={{ border: 0, width: '120%', height: '100%', marginLeft: '-10%' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Game Video"
            />
          </View>
        </View>
      );
    }
    // Native platforms: use WebView if available
    if (WebViewComponent) {
      return (
        <View style={[styles.videoContainer, { backgroundColor: theme.card }]}>          
          <View style={styles.videoInnerWrapper}>
            <WebViewComponent
              source={{ uri: 'https://www.youtube.com/embed/r9BPacWxJ2M?playsinline=1' }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
            />
          </View>
        </View>
      );
    }
    // Fallback: clickable thumbnail opening external YouTube
    return (
      <View style={[styles.videoContainer, { backgroundColor: theme.card }]}>        
        <View style={[styles.videoInnerWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
          <TouchableOpacity
            style={[styles.videoFallback, styles.videoOverscan]}
            onPress={() => Linking.openURL('https://www.youtube.com/watch?v=r9BPacWxJ2M')}
          >
            <Image
              source={{ uri: 'https://img.youtube.com/vi/r9BPacWxJ2M/hqdefault.jpg' }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <View style={styles.playOverlay}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </TouchableOpacity>
          <Text style={[styles.videoSubtext, { color: theme.textSecondary, marginTop: 8 }]}>Open video on YouTube</Text>
        </View>
      </View>
    );
  };

  const resolveGraphSource = (): any | null => {
    if (jsonFile && gameGraphMap[jsonFile]) return gameGraphMap[jsonFile];
    // Attempt heuristic: convert jsonFile like lsuvolemiss.json -> game_analysis_lsu_ole_miss.png
    if (jsonFile) {
      const base = jsonFile.replace('.json','');
      const guess = `game_analysis_${base.replace(/vs|_/g,'_')}.png`;
      // We can't dynamically require unknown at runtime in bundle; keep for debug text.
      return null;
    }
    return null;
  };

  // Map physical x inside container so that only middle 60% (0.2 -> 0.8) is the active scaling region.
  // 0.2 corresponds to logical 0, 0.8 corresponds to logical 1. Outside this band we clamp.
  const updateCursorFromX = (x: number, width: number) => {
    if (cursorLocked) return; // do not move if locked
    if (!width || width <= 0) return;
    const raw = x / width; // 0..1 physical
    const bandStart = 0.2;
    const bandEnd = 0.8;
    let clamped = raw;
    if (raw < bandStart) clamped = bandStart;
    else if (raw > bandEnd) clamped = bandEnd;
    const bandRatio = (clamped - bandStart) / (bandEnd - bandStart); // 0..1 logical inside band
    setCursorRatio(clamped); // store physical position for line placement
    if (gameData && gameData.times.length) {
      const minT = Math.min(...gameData.times);
      const maxT = Math.max(...gameData.times);
      const mapped = minT + (maxT - minT) * bandRatio;
      setSelectedTime(mapped);
    }
  };

  const onGraphTouch = (evt: any) => {
    if (cursorLocked) return;
    try {
      const { locationX, nativeEvent } = evt.nativeEvent || {};
      const width = nativeEvent?.layout?.width || nativeEvent?.target?.width || 1;
      updateCursorFromX(locationX, width);
    } catch (_) {}
  };

  // Web hover support
  const onGraphHover = (evt: any) => {
    if (Platform.OS !== 'web') return;
    if (cursorLocked) return;
    try {
      const bounds = (evt.currentTarget as HTMLElement).getBoundingClientRect();
      const x = evt.clientX - bounds.left;
      const width = bounds.width;
      updateCursorFromX(x, width);
    } catch (_) {}
  };
  const onGraphHoverEnter = () => {
    if (Platform.OS !== 'web') return;
    setHoverCount(c => c + 1);
  };
  const onGraphHoverLeave = () => {
    if (Platform.OS !== 'web') return;
    setHoverCount(c => {
      const next = Math.max(0, c - 1);
      if (next === 0) {
        setCursorRatio(null);
        setSelectedTime(null);
      }
      return next;
    });
  };

  const clearCursor = () => {
    setCursorRatio(null);
    setSelectedTime(null);
    setCursorLocked(false);
  };

  const onGraphPress = () => {
    const now = Date.now();
    const DOUBLE_CLICK_MS = 300;
    if (now - lastClickTs <= DOUBLE_CLICK_MS) {
      // double click detected: toggle lock state if cursor present
      if (cursorRatio !== null) {
        setCursorLocked(l => !l);
      }
      setLastClickTs(0); // reset
      return;
    }
    setLastClickTs(now);
    // single click fallback: lock if not already locked and cursor exists
    if (cursorRatio !== null && !cursorLocked) {
      setCursorLocked(true);
    }
  };

  const renderInteractiveGraph = () => {
  const map = isDark ? gameGraphMapDark : gameGraphMapLight;
  const primary = jsonFile && map[jsonFile] ? map[jsonFile] : resolveGraphSource();
    return (
      <View style={[styles.rightGraphsContainer, { backgroundColor: theme.card }]}
        onTouchStart={onGraphTouch}
        onTouchMove={onGraphTouch}
        onTouchEnd={() => { /* keep line for touch; cleared manually */ }}
        // @ts-ignore web hover events
        onMouseMove={onGraphHover}
        // @ts-ignore
  onMouseEnter={(e: any) => { onGraphHoverEnter(); onGraphHover(e); }}
        // @ts-ignore
        onMouseLeave={onGraphHoverLeave}
        // @ts-ignore - click to lock
        onClick={onGraphPress}
      >        
        <Text style={[styles.graphTitle, { color: theme.text }]}>Game Analysis</Text>
        <Text style={[styles.graphSubtitle, { color: theme.textSecondary }]}>Overall Overview</Text>
        <View style={styles.syncWrapper}>
          {primary ? (
            <Image source={primary} style={styles.staticGraphImage} resizeMode="contain" />
          ) : (
            <View style={styles.noGraphContainer}>
              <Text style={[styles.noGraphText, { color: theme.textSecondary }]}>No primary graph image for: {jsonFile}</Text>
              <Text style={[styles.noGraphHint, { color: theme.textSecondary }]}>Expected one of: {Object.keys(gameGraphMap).join(', ')}</Text>
            </View>
          )}
          {cursorRatio !== null && (
            <View style={[styles.syncLine, cursorLocked ? styles.syncLineLocked : null, { left: `${cursorRatio * 100}%` }]} pointerEvents="none" />
          )}
        </View>
        {cursorRatio !== null && selectedTime !== null && (
          <Text style={[styles.selectedTimeText, { color: theme.textSecondary }]}>Cursor: {formatMinute(selectedTime)} {cursorLocked ? '(Locked)' : ''}</Text>
        )}
        {cursorRatio !== null && (
          <TouchableOpacity onPress={clearCursor} style={[styles.clearCursorBtn, { backgroundColor: theme.primary + '22' }]}> 
            <Text style={[styles.clearCursorText, { color: theme.primary }]}>Clear Line</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSentimentBlock = () => {
  const sMap = isDark ? sentimentGraphMapDark : sentimentGraphMapLight;
  const sentimentImg = jsonFile ? sMap[jsonFile] : null;
    return (
  <View style={[styles.sentimentContainer, { backgroundColor: theme.card }]}
        onTouchStart={onGraphTouch}
        onTouchMove={onGraphTouch}
        // @ts-ignore
        onMouseMove={onGraphHover}
        // @ts-ignore
  onMouseEnter={(e: any) => { onGraphHoverEnter(); onGraphHover(e); }}
        // @ts-ignore
        onMouseLeave={onGraphHoverLeave}
      >        
        <Text style={[styles.sentimentTitle, { color: theme.text }]}>Sentiment Breakdown</Text>
        <View style={styles.syncWrapper}>
          {sentimentImg ? (
            <Image source={sentimentImg} style={styles.sentimentImage} resizeMode="contain" />
          ) : (
            <Text style={[styles.noGraphHint, { color: theme.textSecondary }]}>No sentiment image available.</Text>
          )}
          {cursorRatio !== null && (
            <View style={[styles.syncLine, cursorLocked ? styles.syncLineLocked : null, { left: `${cursorRatio * 100}%` }]} pointerEvents="none" />
          )}
        </View>
      </View>
    );
  };

  const renderComments = () => {
    // Filter comments based on selected time (within ±2 minutes)
    const filterCommentsByTime = (comments: [string, number, number][]) => {
      if (selectedTime === null || isNaN(selectedTime)) return comments;
      return comments.filter(([, , time]) => {
        if (isNaN(time) || !isFinite(time)) return false;
        return Math.abs(time - selectedTime) <= 2;
      });
    };

    const filteredBest = filterCommentsByTime(gameData?.best5 || []);
    const filteredWorst = filterCommentsByTime(gameData?.worst15 || []);

    return (
      <View style={styles.commentsSection}>
        {selectedTime !== null && !isNaN(selectedTime) && (
          <View style={[styles.timeFilterNotice, { backgroundColor: theme.card }]}>
            <Text style={[styles.timeFilterText, { color: theme.primary }]}>
              📍 Showing comments from {formatMinute(selectedTime)} ± 2min
            </Text>
            <TouchableOpacity onPress={() => setSelectedTime(null)}>
              <Text style={[styles.clearFilterText, { color: theme.textSecondary }]}>Show All</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={[styles.commentsContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.commentsTitle, { color: theme.success }]}>🎉 Best Fan Reactions (Top 5)</Text>
          {(selectedTime !== null ? filteredBest : gameData?.best5 || []).map((comment, index) => (
            <View key={`best-${index}`} style={[
              styles.commentCard, 
              { 
                backgroundColor: theme.surface,
                borderColor: selectedTime !== null && Math.abs(comment[2] - selectedTime) <= 2 ? theme.primary : 'transparent',
                borderWidth: selectedTime !== null && Math.abs(comment[2] - selectedTime) <= 2 ? 2 : 0
              }
            ]}>
              <View style={styles.commentHeader}>
                <View style={[styles.sentimentBadge, { backgroundColor: theme.success }]}>
                  <Text style={styles.sentimentBadgeText}>{Math.round(comment[1] * 100)}%</Text>
                </View>
                <Text style={[styles.commentTime, { color: theme.textSecondary }]}>{formatMinute(comment[2])}</Text>
              </View>
              <Text style={[styles.commentText, { color: theme.text }]}>&quot;{comment[0]}&quot;</Text>
            </View>
          ))}
        </View>
        <View style={[styles.commentsContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.commentsTitle, { color: theme.error }]}>😤 Worst Fan Reactions (Bottom 15)</Text>
          {(selectedTime !== null ? filteredWorst : gameData?.worst15 || []).slice(0, showAllWorst ? 15 : 8).map((comment, index) => (
            <View key={`worst-${index}`} style={[
              styles.commentCard, 
              { 
                backgroundColor: theme.surface,
                borderColor: selectedTime !== null && Math.abs(comment[2] - selectedTime) <= 2 ? theme.primary : 'transparent',
                borderWidth: selectedTime !== null && Math.abs(comment[2] - selectedTime) <= 2 ? 2 : 0
              }
            ]}>
              <View style={styles.commentHeader}>
                <View style={[styles.sentimentBadge, { backgroundColor: theme.error }]}>
                  <Text style={styles.sentimentBadgeText}>{Math.round(comment[1] * 100)}%</Text>
                </View>
                <Text style={[styles.commentTime, { color: theme.textSecondary }]}>{formatMinute(comment[2])}</Text>
              </View>
              <Text style={[styles.commentText, { color: theme.text }]}>&quot;{comment[0]}&quot;</Text>
            </View>
          ))}
          {gameData && gameData.worst15.length > 8 && !showAllWorst && (
            <TouchableOpacity onPress={() => setShowAllWorst(true)} style={[styles.showMoreButton, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.showMoreText, { color: theme.primary }]}>Show all {gameData.worst15.length} negative comments</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Two-column main layout: left (video + comments), right (two graphs) */}
        <View style={styles.contentColumns}>
          <View style={styles.leftColumn}>
            {renderVideoStream()}
            {gameData && renderComments()}
          </View>
          <View style={styles.rightColumn}>
            {renderInteractiveGraph()}
            {renderSentimentBlock()}
          </View>
        </View>
        
        {/* Additional content area */}
        <View style={styles.bottomSection}>
          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              Game Information
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              JSON File: {jsonFile}
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Game ID: {gameId}
            </Text>
            {gameData && (
              <>
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  Data Points: {gameData.times.length}
                </Text>
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  Time Range: {Math.min(...gameData.times)} - {Math.max(...gameData.times)} minutes
                </Text>
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  Sentiment Range: {Math.min(...gameData.avgs).toFixed(3)} - {Math.max(...gameData.avgs).toFixed(3)}
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButton: {
    padding: Platform.OS === 'web' ? 12 : 10,
    borderRadius: 8,
    width: Platform.OS === 'web' ? 44 : 40,
    height: Platform.OS === 'web' ? 44 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    width: Platform.OS === 'web' ? 28 : 24,
    height: Platform.OS === 'web' ? 28 : 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeButton: {
    padding: Platform.OS === 'web' ? 12 : 10,
    borderRadius: 8,
    width: Platform.OS === 'web' ? 44 : 40,
    height: Platform.OS === 'web' ? 44 : 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    width: Platform.OS === 'web' ? 24 : 18,
    height: Platform.OS === 'web' ? 24 : 18,
  },
  scrollContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    minHeight: 400,
  },
  topSplit: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    alignItems: 'flex-start',
  },
  contentColumns: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
  },
  rightColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 24,
  },
  videoContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 380,
    position: 'relative',
  },
  videoInnerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoOverscan: {
    width: '120%',
    marginLeft: '-10%',
  },
  webview: {
    flex: 1,
  },
  videoFallback: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  playIcon: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '600',
  },
  videoPlaceholder: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  videoText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 16,
  },
  graphOuter: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  noGraphHint: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 4,
  },
  graphSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    fontSize: 14,
  },
  chartArea: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 350,
    maxHeight: 450,
  },
  graphContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  staticGraphImage: {
    width: '100%',
    height: 535, 
    marginTop: 12,
  },
  rightGraphsContainer: {
    flex: 0.9, // narrower than before
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 500,
    justifyContent: 'flex-start',
  },
  sentimentContainer: {
    borderRadius: 12,
    padding: 16,
    marginTop: 24, // push sentiment block further down below video
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 260,
    justifyContent: 'flex-start',
  },
  sentimentTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  sentimentImage: {
    width: '100%',
    height: 380,
  },
  syncWrapper: {
    width: '100%',
    position: 'relative',
  },
  syncLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'red',
    opacity: 0.85,
  },
  syncLineLocked: {
    backgroundColor: 'orange',
    opacity: 1,
  },
  clearCursorBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearCursorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  graphTouchArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  graphImage: {
    width: '100%',
    height: '100%',
    maxWidth: '90%',
  },
  timeIndicator: {
    position: 'absolute',
    top: 0,
    width: 2,
    backgroundColor: '#FF0000',
    opacity: 0.8,
    zIndex: 10,
  },
  selectedTimeText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  timeFilterNotice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  timeFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearFilterText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  noGraphContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGraphText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  chartGrid: {
    flex: 1,
    flexDirection: 'row',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chartPlotArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: 4,
  },
  lineLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineSegment: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
  },
  linePoint: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartDataText: {
    fontSize: 12,
    textAlign: 'center',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 8,
  },
  axisLabel: {
    fontSize: 12,
  },
  graphControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  graphButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  graphButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSection: {
    padding: 16,
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  commentsSection: {
    padding: 16,
    gap: 16,
  },
  commentsContainer: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  commentCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sentimentBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  showMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GameDetailsScreen;