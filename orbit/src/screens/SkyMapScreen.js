// src/screens/SkyMapScreen.js
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import StarField from '../components/StarField';
import { useAuth } from '../hooks/useAuth';

const { width } = Dimensions.get('window');
const IS_WEB = width > 600;

const MONO = Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' });

// ─── Mock data ────────────────────────────────────────────────
const JOURNAL_LOGS = [
  { id: 1, icon: '🌕', title: 'Full Moon',         object: 'Moon',   date: 'Oct 25', rating: 5 },
  { id: 2, icon: '🪐', title: 'Jupiter & Moons',   object: 'Planet', date: 'Oct 22', rating: 4 },
  { id: 3, icon: '🌌', title: 'Andromeda Galaxy',  object: 'Galaxy', date: 'Oct 18', rating: 5 },
];

const UPCOMING_EVENTS = [
  { id: 1, label: 'Geminid Meteor Shower', days: 51, color: '#A5B4FC' },
  { id: 2, label: 'Lunar Eclipse',         days: 29, color: '#DDD6FE' },
  { id: 3, label: 'Jupiter Opposition',    days: 35, color: '#C7D2FE' },
];

const RADAR_EVENTS = [
  { id: 1, icon: '☄️', title: 'Meteor Shower', date: 'Nov 11', reminded: false },
  { id: 2, icon: '🌕', title: 'Full Moon',      date: 'Nov 11', reminded: true  },
  { id: 3, icon: '🪐', title: 'Opposition',     date: 'Nov 15', reminded: false },
  { id: 4, icon: '🌑', title: 'Eclipse',        date: 'Nov 14', reminded: false },
];

const COMMUNITY = [
  { id: 1, user: 'Alex G.',  object: 'Orion Nebula',    likes: 12, comments: 4,  icon: '🌌', stars: 5 },
  { id: 2, user: 'Maria K.', object: 'Waning Crescent', likes: 9,  comments: 9,  icon: '🌙', stars: 4 },
  { id: 3, user: 'David R.', object: 'Leonid Meteor',   likes: 15, comments: 15, icon: '☄️', stars: 5 },
];

const NAV = [
  { key: 'dashboard', label: 'Dashboard',  icon: 'home-outline'     },
  { key: 'journal',   label: 'My Journal', icon: 'book-outline'     },
  { key: 'radar',     label: 'Radar',      icon: 'radio-outline'    },
  { key: 'community', label: 'Community',  icon: 'people-outline'   },
  { key: 'profile',   label: 'Profile',    icon: 'person-outline'   },
  { key: 'settings',  label: 'Settings',   icon: 'settings-outline' },
];

// ─── Cross-platform confirm dialog ───────────────────────────
// Alert.alert is broken on web — use window.confirm instead
const confirmLogout = (onConfirm) => {
  if (Platform.OS === 'web') {
    if (window.confirm('Leave Orbit? Are you sure you want to sign out?')) {
      onConfirm();
    }
  } else {
    Alert.alert(
      'Leave Orbit?',
      'Are you sure you want to sign out?',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: onConfirm },
      ]
    );
  }
};

// ─── Glassmorphism card ───────────────────────────────────────
const GlassCard = ({ children, style }) => (
  <BlurView intensity={18} tint="dark" style={[styles.glassCard, style]}>
    <View style={styles.glassInner}>{children}</View>
  </BlurView>
);

const SectionLabel = ({ children }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

// ─── Animated Log button with haptic ─────────────────────────
const LogButton = () => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(0.95, { duration: 80 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
  };

  return (
    <Animated.View style={[styles.logBtnWrap, animStyle]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={1}>
        <LinearGradient
          colors={['#1E3A8A', '#3B0F8C']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.logBtnGradient}
        >
          <Ionicons name="add" size={16} color="#FFF" />
          <Text style={styles.logBtnText}>LOG OBSERVATION</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Tabs ─────────────────────────────────────────────────────
const DashboardTab = ({ userProfile }) => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
    <View style={IS_WEB ? styles.rowWrap : null}>
      <GlassCard style={IS_WEB ? styles.cardHalf : null}>
        <SectionLabel>TONIGHT'S SKY</SectionLabel>
        <LinearGradient
          colors={['rgba(30,58,138,0.25)', 'rgba(59,15,140,0.2)']}
          style={styles.skyBanner}
        >
          <View style={styles.skyRow}>
            <View style={styles.skyItem}>
              <Ionicons name="telescope-outline" size={14} color="rgba(200,200,255,0.5)" />
              <Text style={styles.skyVal}><Text style={styles.monoData}>CLASS 3</Text> Bortle</Text>
            </View>
            <View style={styles.skyItem}>
              <Ionicons name="moon-outline" size={14} color="rgba(200,200,255,0.5)" />
              <Text style={styles.skyVal}><Text style={styles.monoData}>85%</Text> Moon</Text>
            </View>
          </View>
          <View style={styles.skyRow}>
            <View style={styles.skyItem}>
              <Ionicons name="cloud-outline" size={14} color="rgba(200,200,255,0.5)" />
              <Text style={styles.skyVal}>Clear</Text>
            </View>
            <View style={styles.skyItem}>
              <Ionicons name="thermometer-outline" size={14} color="rgba(200,200,255,0.5)" />
              <Text style={styles.skyVal}><Text style={styles.monoData}>11°C</Text></Text>
            </View>
          </View>
        </LinearGradient>

        <SectionLabel style={{ marginTop: 16 }}>YOUR STATS</SectionLabel>
        <View style={styles.statsGrid}>
          {[
            { val: userProfile?.observationsCount ?? 74, label: 'Observations' },
            { val: userProfile?.starsLogged       ?? 12, label: 'Stars' },
            { val: userProfile?.meteorShowers      ?? 3,  label: 'Showers' },
          ].map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.favRow}>
          <Text style={styles.favLabel}>FAV OBJECT</Text>
          <Text style={styles.favVal}>{userProfile?.favoriteObject || 'Saturn'}</Text>
        </View>
      </GlassCard>

      <GlassCard style={IS_WEB ? styles.cardHalf : { marginTop: 14 }}>
        <SectionLabel>UPCOMING EVENTS</SectionLabel>
        {UPCOMING_EVENTS.map((ev) => (
          <View key={ev.id} style={styles.eventRow}>
            <View style={[styles.eventDot, { backgroundColor: ev.color }]} />
            <Text style={styles.eventLabel}>{ev.label}</Text>
            <View style={styles.eventDaysWrap}>
              <Text style={[styles.eventDaysNum, { fontFamily: MONO }]}>{String(ev.days).padStart(2, '0')}</Text>
              <Text style={styles.eventDaysUnit}>DAYS</Text>
            </View>
          </View>
        ))}
      </GlassCard>
    </View>
  </ScrollView>
);

const JournalTab = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
    <GlassCard>
      <SectionLabel>RECENT LOGS</SectionLabel>
      {JOURNAL_LOGS.map((log) => (
        <View key={log.id} style={styles.logRow}>
          <View style={styles.logIconWrap}>
            <Text style={styles.logIcon}>{log.icon}</Text>
          </View>
          <View style={styles.logInfo}>
            <Text style={styles.logTitle}>{log.title}</Text>
            <Text style={[styles.logMeta, { fontFamily: MONO, fontSize: 10 }]}>
              {log.object} · {log.date}
            </Text>
            <View style={styles.starsRow}>
              {Array.from({ length: log.rating }).map((_, i) => (
                <Ionicons key={i} name="star" size={10} color="#A5B4FC" />
              ))}
            </View>
          </View>
          <Text style={[styles.logDate, { fontFamily: MONO }]}>{log.date}</Text>
        </View>
      ))}
      <LogButton />
    </GlassCard>
  </ScrollView>
);

const RadarTab = () => {
  const [reminded, setReminded] = useState(
    RADAR_EVENTS.reduce((acc, ev) => ({ ...acc, [ev.id]: ev.reminded }), {})
  );
  const handleRemind = (id) => {
    Haptics.selectionAsync();
    setReminded((r) => ({ ...r, [id]: !r[id] }));
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
      <GlassCard>
        <SectionLabel>RADAR · EVENTS</SectionLabel>
        {RADAR_EVENTS.map((ev) => (
          <View key={ev.id} style={styles.radarRow}>
            <View style={styles.radarIconWrap}>
              <Text style={styles.radarIcon}>{ev.icon}</Text>
            </View>
            <View style={styles.radarInfo}>
              <Text style={styles.radarTitle}>{ev.title}</Text>
              <Text style={[styles.radarDate, { fontFamily: MONO, fontSize: 10 }]}>{ev.date} · VIS</Text>
            </View>
            <TouchableOpacity
              style={[styles.remindBtn, reminded[ev.id] && styles.remindBtnActive]}
              onPress={() => handleRemind(ev.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={reminded[ev.id] ? 'notifications' : 'notifications-outline'}
                size={13}
                color={reminded[ev.id] ? '#FFFFFF' : 'rgba(200,200,255,0.6)'}
              />
              <Text style={[styles.remindText, reminded[ev.id] && { color: '#FFF' }]}>
                {reminded[ev.id] ? 'Reminded' : 'Remind Me'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </GlassCard>
    </ScrollView>
  );
};

const CommunityTab = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
    <GlassCard>
      <SectionLabel>COMMUNITY FEED</SectionLabel>
      {COMMUNITY.map((post) => (
        <View key={post.id} style={styles.postRow}>
          <View style={styles.postAvatar}>
            <Text style={styles.postAvatarText}>{post.user[0]}</Text>
          </View>
          <View style={styles.postInfo}>
            <Text style={styles.postUser}>{post.user}</Text>
            <View style={styles.postObjectRow}>
              <Text style={styles.postIcon}>{post.icon}</Text>
              <Text style={styles.postObject}>{post.object}</Text>
            </View>
            <View style={styles.postActions}>
              <Ionicons name="heart-outline" size={13} color="rgba(200,200,255,0.5)" />
              <Text style={[styles.postStat, { fontFamily: MONO }]}>{post.likes}</Text>
              <Ionicons name="chatbubble-outline" size={13} color="rgba(200,200,255,0.5)" style={{ marginLeft: 10 }} />
              <Text style={[styles.postStat, { fontFamily: MONO }]}>{post.comments}</Text>
            </View>
          </View>
          <View style={styles.starsRow}>
            {Array.from({ length: post.stars }).map((_, i) => (
              <Ionicons key={i} name="star" size={10} color="#A5B4FC" />
            ))}
          </View>
        </View>
      ))}
    </GlassCard>
  </ScrollView>
);

// ─── Main screen ──────────────────────────────────────────────
const SkyMapScreen = () => {
  const { user, userProfile, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');

  const username = user?.displayName || userProfile?.username || 'Observer';
  const initials = username.slice(0, 2).toUpperCase();

  const handleLogout = () => confirmLogout(logout);

  const handleNavPress = (key) => {
    Haptics.selectionAsync();
    setActiveNav(key);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard': return <DashboardTab userProfile={userProfile} />;
      case 'journal':   return <JournalTab />;
      case 'radar':     return <RadarTab />;
      case 'community': return <CommunityTab />;
      default:
        return (
          <View style={styles.comingSoon}>
            <Ionicons name="construct-outline" size={40} color="rgba(200,200,255,0.3)" />
            <Text style={styles.comingSoonText}>Coming soon</Text>
          </View>
        );
    }
  };

  const activeNavItem = NAV.find((n) => n.key === activeNav);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#000000', '#05091A', '#080D2A']}
        style={StyleSheet.absoluteFill}
      />
      <StarField />

      <View style={styles.layout}>
        {/* ── Sidebar ── */}
        <BlurView intensity={30} tint="dark" style={styles.sidebar}>
          <View style={styles.sidebarBorder}>
            <View style={styles.logoRow}>
              <Text style={styles.logoEmoji}>🔭</Text>
              {IS_WEB && <Text style={styles.logoText}>ORBIT</Text>}
            </View>

            <View style={styles.navList}>
              {NAV.map((item) => {
                const active = activeNav === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.navItem, active && styles.navItemActive]}
                    onPress={() => handleNavPress(item.key)}
                    activeOpacity={0.75}
                  >
                    <Ionicons
                      name={item.icon}
                      size={17}
                      color={active ? '#FFFFFF' : 'rgba(200,200,220,0.35)'}
                    />
                    {IS_WEB && (
                      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                        {item.label}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Avatar — tap to sign out */}
            <View style={styles.sidebarBottom}>
              <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout} activeOpacity={0.8}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                {IS_WEB && (
                  <View style={styles.avatarInfo}>
                    <Text style={styles.avatarName}>{username}</Text>
                    <Text style={[styles.avatarSub, { fontFamily: MONO }]}>OBSERVER</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        {/* ── Main content ── */}
        <View style={styles.main}>
          <BlurView intensity={20} tint="dark" style={styles.topBar}>
            <Text style={styles.pageTitle}>{activeNavItem.label.toUpperCase()}</Text>
            {/* Dedicated sign out button — calls logout directly, no Alert */}
            <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout} activeOpacity={0.75}>
              <Ionicons name="log-out-outline" size={16} color="rgba(248,113,113,0.6)" />
              {IS_WEB && <Text style={styles.signOutText}>Sign Out</Text>}
            </TouchableOpacity>
          </BlurView>

          {renderContent()}
        </View>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────
const SIDEBAR_W = IS_WEB ? 200 : 56;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  layout: { flex: 1, flexDirection: 'row' },

  sidebar: {
    width: SIDEBAR_W,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  sidebarBorder: {
    flex: 1,
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: IS_WEB ? 14 : 8,
    justifyContent: 'space-between',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, paddingLeft: IS_WEB ? 4 : 0 },
  logoEmoji: { fontSize: 20 },
  logoText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF', letterSpacing: 5, marginLeft: 10 },

  navList: { flex: 1, gap: 2 },
  navItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: IS_WEB ? 10 : 8,
    borderRadius: 10, gap: 10,
  },
  navItemActive: { backgroundColor: 'rgba(30,58,138,0.4)' },
  navLabel: { fontSize: 13, color: 'rgba(200,200,220,0.35)', fontWeight: '600' },
  navLabelActive: { color: '#FFFFFF' },

  sidebarBottom: { paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  avatarBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: IS_WEB ? 4 : 0 },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(30,58,138,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 11, fontWeight: '800', color: 'rgba(220,220,255,0.9)' },
  avatarInfo: { flex: 1 },
  avatarName: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  avatarSub: { fontSize: 9, color: 'rgba(200,200,220,0.35)', marginTop: 1, letterSpacing: 1 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  pageTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: 3 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 5 },
  signOutText: { fontSize: 12, color: 'rgba(248,113,113,0.6)', fontWeight: '600' },

  main: { flex: 1 },
  tabContent: { padding: 18, paddingBottom: 40 },

  glassCard: {
    borderRadius: 16, overflow: 'hidden', marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  glassInner: { padding: 18 },
  cardHalf: IS_WEB ? { flex: 1, marginHorizontal: 6 } : {},
  rowWrap: { flexDirection: 'row', marginHorizontal: -6 },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: 'rgba(200,200,255,0.4)',
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12,
  },

  skyBanner: { borderRadius: 10, padding: 14, gap: 10, marginBottom: 4 },
  skyRow: { flexDirection: 'row', gap: 24 },
  skyItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  skyVal: { fontSize: 12, color: 'rgba(220,220,255,0.8)', fontWeight: '500' },
  monoData: { fontFamily: MONO, color: '#FFFFFF', fontWeight: '700' },

  statsGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statBox: {
    flex: 1, backgroundColor: 'rgba(30,58,138,0.18)',
    borderRadius: 10, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  statVal: { fontFamily: MONO, fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  statLbl: { fontSize: 9, color: 'rgba(200,200,220,0.4)', marginTop: 3, textAlign: 'center' },

  favRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  favLabel: { fontSize: 10, color: 'rgba(200,200,255,0.4)', letterSpacing: 1.5, fontWeight: '700' },
  favVal: { fontFamily: MONO, fontSize: 14, color: '#A5B4FC', fontWeight: '700' },

  eventRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  eventDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 12 },
  eventLabel: { flex: 1, fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
  eventDaysWrap: { alignItems: 'center', minWidth: 36 },
  eventDaysNum: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
  eventDaysUnit: { fontFamily: MONO, fontSize: 8, color: 'rgba(200,200,220,0.35)', letterSpacing: 1.5 },

  logRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  logIconWrap: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: 'rgba(30,58,138,0.25)',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  logIcon: { fontSize: 18 },
  logInfo: { flex: 1 },
  logTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  logMeta: { color: 'rgba(200,200,220,0.45)', marginBottom: 4 },
  starsRow: { flexDirection: 'row', gap: 2 },
  logDate: { fontSize: 10, color: 'rgba(200,200,220,0.3)' },

  logBtnWrap: { borderRadius: 12, overflow: 'hidden', marginTop: 16 },
  logBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  logBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },

  radarRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  radarIconWrap: {
    width: 36, height: 36, borderRadius: 9,
    backgroundColor: 'rgba(30,58,138,0.25)',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  radarIcon: { fontSize: 16 },
  radarInfo: { flex: 1 },
  radarTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  radarDate: { color: 'rgba(200,200,220,0.4)', marginTop: 2 },
  remindBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  remindBtnActive: { backgroundColor: 'rgba(30,58,138,0.5)', borderColor: 'rgba(165,180,252,0.3)' },
  remindText: { fontSize: 11, color: 'rgba(200,200,255,0.6)', fontWeight: '600' },

  postRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: 14, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)', gap: 12,
  },
  postAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(59,15,140,0.45)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    justifyContent: 'center', alignItems: 'center',
  },
  postAvatarText: { fontSize: 12, fontWeight: '800', color: 'rgba(220,220,255,0.9)' },
  postInfo: { flex: 1 },
  postUser: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  postObjectRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  postIcon: { fontSize: 13 },
  postObject: { fontSize: 12, color: 'rgba(200,200,220,0.55)' },
  postActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postStat: { fontSize: 11, color: 'rgba(200,200,220,0.4)' },

  comingSoon: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100, gap: 12 },
  comingSoonText: { fontFamily: MONO, fontSize: 13, color: 'rgba(200,200,220,0.25)', letterSpacing: 2 },
});

export default SkyMapScreen;