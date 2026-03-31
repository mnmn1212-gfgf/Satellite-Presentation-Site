import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import {
  ChevronDown,
  Globe,
  Radar,
  Shield,
  Sparkles,
  Waves,
  Orbit,
  Satellite,
  AlertTriangle,
  Play,
  Cpu,
  Activity,
  ShieldCheck,
  Volume2,
  VolumeX,
  Zap,
  RotateCcw,
  Pause,
  Square,
  Maximize2,
  Minimize2,
  PanelsTopLeft,
  ScanSearch,
  Route,
  Crosshair,
} from 'lucide-react';

const scenes = [
  {
    id: 1,
    eyebrow: 'افتتاحية المهمة',
    title: 'عين تحرس المدار',
    description:
      'موقع سينمائي تفاعلي يعرض قمراً صناعياً دفاعياً يراقب الفضاء المحيط به، ويولد مجالاً ذكياً لحمايته من الاصطدامات المعقدة.',
    type: 'hero',
    tone: 'calm',
  },
  {
    id: 2,
    eyebrow: 'الاصطدام الأول',
    title: 'تهديد نيزكي مباشر',
    description:
      'نيزك مندفع يقترب من القمر الصناعي بسرعة حادة، بينما المجال الحامي يرصد شدة الخطر ويطلق موجات تحذير متوهجة.',
    type: 'impact-meteor',
    tone: 'danger',
  },
  {
    id: 3,
    eyebrow: 'المناورة الأولى',
    title: 'انحراف النيزك عن المسار',
    description:
      'القمر الصناعي يعيد تموضعه بدقة، فيما يعيد المجال الطاقي تشكيل نفسه ليولد ممراً آمناً يحرف الجسم بعيداً.',
    type: 'avoid-meteor',
    tone: 'success',
  },
  {
    id: 4,
    eyebrow: 'الاصطدام الثاني',
    title: 'اقتحام المخلفات الفضائية',
    description:
      'شظايا متعددة من الحطام الفضائي تتقاطع مع المدار، مسببة ضغطاً بصرياً وتهديداً معقداً على محيط المهمة.',
    type: 'impact-debris',
    tone: 'danger',
  },
  {
    id: 5,
    eyebrow: 'المناورة الثانية',
    title: 'فتح ممر آمن عبر الحطام',
    description:
      'الخوارزمية الدفاعية تقرأ توزيع المخلفات وتعيد تشكيل الهالة لتفادي الاصطدامات المتتابعة في الزمن الحقيقي.',
    type: 'avoid-debris',
    tone: 'success',
  },
  {
    id: 6,
    eyebrow: 'الاصطدام الثالث',
    title: 'اقتراب قمر صناعي آخر',
    description:
      'جسم مداري كبير يقترب في مسار متقاطع، فتتحول الواجهة إلى حالة إنذار قصوى مع إبراز خطوط التصادم المحتملة.',
    type: 'impact-satellite',
    tone: 'danger',
  },
  {
    id: 7,
    eyebrow: 'المناورة الثالثة',
    title: 'فصل مداري ناجح',
    description:
      'مناورة دقيقة ومجال حماية متكيف يصنعان مسافة آمنة بين الجسمين، فتستمر المهمة بثبات دون تعطيل.',
    type: 'avoid-satellite',
    tone: 'success',
  },
];

const metrics = [
  { label: 'سيناريوهات الخطر', value: '03', icon: AlertTriangle },
  { label: 'مناورات التفادي', value: '03', icon: Shield },
  { label: 'حماية مدارية', value: '360°', icon: Orbit },
  { label: 'رصد لحظي', value: '24/7', icon: Radar },
];

const systems = [
  {
    title: 'درع طيفي متكيف',
    text: 'هالة حماية متغيرة القطر واللون تستجيب فورياً لسرعة الجسم ونوعه وزاوية اقترابه.',
    icon: Shield,
  },
  {
    title: 'رادار مداري ذكي',
    text: 'تحليل فوري لمسارات النيازك والمخلفات والأقمار القريبة مع مؤشرات تحذير محسوبة بصرياً.',
    icon: Radar,
  },
  {
    title: 'خوارزمية مراوغة',
    text: 'تنتج مناورة دقيقة ومساراً بديلاً يمنع الاصطدام ويحافظ على استقرار المهمة والاتصال.',
    icon: Waves,
  },
];

const timeline = [
  'رصد الجسم القادم',
  'تحليل السرعة والاتجاه',
  'تفعيل مجال الحماية',
  'إعادة رسم المسار الآمن',
  'تنفيذ المناورة',
  'استعادة المدار المستقر',
];

const controlCards = [
  { title: 'معالجة فورية', value: '0.4s', icon: Cpu },
  { title: 'استقرار المنظومة', value: '99.2%', icon: ShieldCheck },
  { title: 'تتبع متزامن', value: 'Live', icon: Activity },
];

const avoidanceConfigs = [
  {
    key: 'asteroid',
    title: 'تفادي النيزك',
    eyebrow: 'AVOIDANCE / ASTEROID',
    description:
      'محاكاة مستقلة لنيزك سريع يندفع نحو القمر الصناعي، وعند دخوله نطاق الحماية تبدأ الحلقتان الدفاعيتان في دفعه خارج المجال الآمن.',
    objectLabel: 'نيزك سريع',
    baseSafeDistance: 24,
    finalSafeDistance: 172,
    fuelCost: '0.38 m/s',
    shieldStatus: 'حلقتان نشطتان',
    successRate: '99.7%',
  },
  {
    key: 'debris',
    title: 'تفادي المخلفات',
    eyebrow: 'AVOIDANCE / DEBRIS',
    description:
      'محاكاة مستقلة لشظايا الحطام الفضائي، حيث تقترب القطع من القمر ثم يتم صدّها بعيداً عن مجال الحماية الداخلي والخارجي.',
    objectLabel: 'حطام فضائي',
    baseSafeDistance: 18,
    finalSafeDistance: 138,
    fuelCost: '0.29 m/s',
    shieldStatus: 'حماية متذبذبة',
    successRate: '99.4%',
  },
  {
    key: 'satellite',
    title: 'تفادي قمر صناعي',
    eyebrow: 'AVOIDANCE / SATELLITE',
    description:
      'محاكاة مستقلة لقمر صناعي آخر يقترب في مسار متقاطع، ثم تُجبره منطقة الحماية المزدوجة على الابتعاد وتحقيق فصل مداري آمن.',
    objectLabel: 'قمر قريب',
    baseSafeDistance: 30,
    finalSafeDistance: 196,
    fuelCost: '0.44 m/s',
    shieldStatus: 'فصل مداري',
    successRate: '99.9%',
  },
];


const VIDEO_SLOTS = {
  collision: ['', '', ''],
  avoidance: ['', '', ''],
};

const COPY = {
  ar: {
    dir: 'rtl',
    brandSub: 'Orbital Defense Presentation',
    startTour: 'ابدأ التجربة',
    navHome: 'الرئيسية',
    navCollision: 'محاكاة التصادم',
    navAvoidance: 'محاكاة التفادي',
    navSystems: 'تحليل النظام',
    navScenes: 'المشاهد',
    navTimeline: 'رحلة القرار',
    heroEyebrow: 'ORBITAL COLLISION SIMULATION',
    heroText:
      'في هذا المشهد يحدث اصطدام مباشر من أول مرة. لا تبقى حلقات حماية حول القمر عند لحظة التلامس، ويتحطم القمر والجسم المهاجم معاً بشكل واضح.',
    heroExplore: 'استكشف نظام الاصطدام',
    heroRun: 'ابدأ المحاكاة',
    simRunning: 'المحاكاة جارية',
    collisionTitle: 'محاكاة التصادم',
    collisionStatusReady: 'استعداد',
    collisionStatusTrack: 'تتبع الجسم',
    collisionStatusDanger: 'خطر مرتفع',
    collisionStatusImpact: 'الاصطدام الآن',
    collisionStatusDestroyed: 'تحطم كامل',
    avoidanceEyebrow: 'INDEPENDENT AVOIDANCE SIMULATION',
    avoidanceLead:
      'في هذا الوضع لا يقع أي تصادم نهائياً. يتحرك القمر الصناعي ومعه دوائر الحماية مبكراً قبل أي تماس ليصنع مسافة آمنة تمنع الاحتكاك بالكامل.',
    compare: 'قارن مع التصادم',
    sectionCompareEyebrow: 'MISSION COMPARISON',
    sectionCompareTitle: 'لوحة مقارنة بين الاصطدام والتفادي',
    sectionCompareText:
      'الموقع يوضح الفرق بين سيناريو التحطم المباشر وسيناريو النجاة بالمناورة المبكرة، بدل قسم الصوت والكاميرا العام.',
    systemsEyebrow: 'PROTECTION SYSTEM',
    systemsTitle: 'نظام ذكي لرصد التهديدات واتخاذ القرار',
    systemsText:
      'هذا القسم يشرح منطق المشروع الحقيقي: الرصد الفوري، تحليل المسار، تحديد الخطر، ثم تنفيذ اصطدام مباشر أو تفادي مبكر بحسب الحالة.',
    slidesEyebrow: 'SCENARIO STORY',
    slidesTitle: 'مشاهد المشروع التفاعلية',
    slidesText:
      'شرح مرئي متسلسل لسيناريوهات الاصطدام والتفادي، مع حذف الصور الإضافية والاعتماد على المشهد التفاعلي نفسه.',
    timelineEyebrow: 'DECISION ENGINE',
    timelineTitle: 'رحلة القرار من الخطر إلى النتيجة',
    timelineText:
      'اضغط على كل خطوة لتظهر تفاصيل المرحلة وكيف ينتقل النظام من الرصد إلى القرار ثم إلى الاصطدام أو النجاة.',
    controlEyebrow: 'MISSION LIVE ENGINE',
    controlTitle: 'لوحة حالة المهمة المباشرة',
    controlText:
      'بيانات متغيرة بصرياً تعكس حالة النظام في التصادم أو التفادي بدل القيم الثابتة.',
    finalEyebrow: 'FINAL SUMMARY',
    finalTitle: 'من الاصطدام إلى النجاة... قرار يصنعه الذكاء',
    finalText:
      'المشروع يوضح كيف يرصد النظام الأجسام المدارية ويقرر بين اصطدام مدمر أو مناورة تفادي ناجحة تحافظ على المهمة.',
    finalBtnA: 'ابدأ محاكاة جديدة',
    finalBtnB: 'استكشف رحلة القرار',
    videoCollision: 'فيديوهات محاكاة التصادم',
    videoAvoidance: 'فيديوهات محاكاة التفادي',
    videoHint: 'أضف روابط الفيديوهات داخل VIDEO_SLOTS أعلى الملف.',
    reset: 'إعادة الضبط',
    sceneState: 'حالة المشهد',
    scenario: 'السيناريو',
    probability: 'احتمال التصادم',
    distance: 'أقرب مسافة متوقعة',
    camera: 'زاوية الكاميرا',
    overview: 'رؤية عامة',
    threat: 'تتبع الخطر',
    evadeCam: 'مناورة التفادي',
    safeDistance: 'المسافة الآمنة',
    fieldPower: 'قوة الحقل',
    finalResult: 'النتيجة',
    collisionDirect: 'اصطدام مباشر',
    safeResult: 'تم التفادي',
    videosEmpty: 'ضع رابط الفيديو هنا',
  },
  en: {
    dir: 'ltr',
    brandSub: 'Orbital Defense Presentation',
    startTour: 'Start Experience',
    navHome: 'Home',
    navCollision: 'Collision Simulation',
    navAvoidance: 'Avoidance Simulation',
    navSystems: 'System Analysis',
    navScenes: 'Scenes',
    navTimeline: 'Decision Flow',
    heroEyebrow: 'ORBITAL COLLISION SIMULATION',
    heroText:
      'This scene now shows direct impact from the first approach. No protective rings remain at the moment of contact, and both the satellite and the incoming body shatter.',
    heroExplore: 'Explore Collision System',
    heroRun: 'Run Simulation',
    simRunning: 'Simulation Running',
    collisionTitle: 'Collision Simulation',
    collisionStatusReady: 'Ready',
    collisionStatusTrack: 'Tracking',
    collisionStatusDanger: 'High Danger',
    collisionStatusImpact: 'Impact Now',
    collisionStatusDestroyed: 'Destroyed',
    avoidanceEyebrow: 'INDEPENDENT AVOIDANCE SIMULATION',
    avoidanceLead:
      'In this mode there is no collision at all. The satellite and its protection rings move early before any contact, preserving a safe separation corridor.',
    compare: 'Compare with Collision',
    sectionCompareEyebrow: 'MISSION COMPARISON',
    sectionCompareTitle: 'Comparison panel: collision vs avoidance',
    sectionCompareText:
      'This area now explains the actual difference between destructive impact and successful early avoidance instead of generic sound/camera controls.',
    systemsEyebrow: 'PROTECTION SYSTEM',
    systemsTitle: 'A smart system for threat tracking and decision making',
    systemsText:
      'This section explains the real project logic: live tracking, path analysis, threat evaluation, then either direct collision or early avoidance.',
    slidesEyebrow: 'SCENARIO STORY',
    slidesTitle: 'Interactive project scenes',
    slidesText:
      'A sequential visual explanation of collision and avoidance scenarios, with extra photos removed in favor of the interactive scene itself.',
    timelineEyebrow: 'DECISION ENGINE',
    timelineTitle: 'From threat detection to final outcome',
    timelineText:
      'Click each step to reveal what the system does as it moves from detection to decision and finally to destruction or survival.',
    controlEyebrow: 'MISSION LIVE ENGINE',
    controlTitle: 'Live mission state panel',
    controlText:
      'Visually changing data that reflects the real state of collision or avoidance instead of static placeholders.',
    finalEyebrow: 'FINAL SUMMARY',
    finalTitle: 'From impact to survival... a decision made by intelligence',
    finalText:
      'The project shows how the system tracks orbital bodies and decides between destructive collision and successful avoidance.',
    finalBtnA: 'Start New Simulation',
    finalBtnB: 'Explore Decision Flow',
    videoCollision: 'Collision Simulation Videos',
    videoAvoidance: 'Avoidance Simulation Videos',
    videoHint: 'Add your video URLs inside VIDEO_SLOTS at the top of the file.',
    reset: 'Reset',
    sceneState: 'Scene State',
    scenario: 'Scenario',
    probability: 'Collision Probability',
    distance: 'Closest Distance',
    camera: 'Camera View',
    overview: 'Overview',
    threat: 'Threat View',
    evadeCam: 'Avoidance Maneuver',
    safeDistance: 'Safe Distance',
    fieldPower: 'Field Power',
    finalResult: 'Final Result',
    collisionDirect: 'Direct Collision',
    safeResult: 'Avoided',
    videosEmpty: 'Place video URL here',
  },
};

const STEP_COPY = {
  ar: [
    { title: 'رصد الجسم القادم', text: 'يتم اكتشاف الجسم وتحديد موضعه بالنسبة للمدار الحالي.' },
    { title: 'تحليل السرعة والاتجاه', text: 'يحسب النظام السرعة والاتجاه واحتمال التقاطع مع القمر الصناعي.' },
    { title: 'تحديد مستوى الخطر', text: 'عند انخفاض المسافة إلى حد حرج، ينتقل النظام إلى حالة تحذير فعّالة.' },
    { title: 'اتخاذ القرار', text: 'يحدد النظام ما إذا كانت النهاية اصطداماً مباشراً أو تفادياً مبكراً.' },
    { title: 'تنفيذ الحركة', text: 'في التصادم يحدث التدمير، وفي التفادي يتحرك القمر مع الحلقات بعيداً.' },
    { title: 'النتيجة النهائية', text: 'إما تحطم الطرفين أو مسار آمن واستمرار المهمة.' },
  ],
  en: [
    { title: 'Detect Incoming Object', text: 'The object is detected and located relative to the current orbit.' },
    { title: 'Analyze Speed and Direction', text: 'The system computes speed, direction, and crossing probability.' },
    { title: 'Evaluate Threat Level', text: 'When separation becomes critical the warning state is activated.' },
    { title: 'Make the Decision', text: 'The system decides whether the path ends in direct impact or early avoidance.' },
    { title: 'Execute the Action', text: 'In collision mode destruction occurs; in avoidance mode the satellite and rings shift away.' },
    { title: 'Final Outcome', text: 'Either both bodies shatter or the mission continues with safe separation.' },
  ],
};

const audioUrls = {
  ambient:
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8f6f6d4b6.mp3?filename=deep-space-ambient-110624.mp3',
  alert:
    'https://cdn.pixabay.com/download/audio/2022/03/10/audio_3d4a66f2d2.mp3?filename=warning-alarm-bloop-2-99742.mp3',
  success:
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4e6f5d19ac.mp3?filename=sci-fi-positive-notification-105743.mp3',
};


export default function App() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [isMuted, setIsMuted] = useState(false);
  const [lang, setLang] = useState('ar');

  const ambientAudioRef = useRef(null);
  const alertAudioRef = useRef(null);
  const successAudioRef = useRef(null);

  useEffect(() => {
    const ambient = new Audio(audioUrls.ambient);
    const alert = new Audio(audioUrls.alert);
    const success = new Audio(audioUrls.success);

    ambient.loop = true;
    ambient.volume = 0.18;
    alert.volume = 0.34;
    success.volume = 0.28;

    ambientAudioRef.current = ambient;
    alertAudioRef.current = alert;
    successAudioRef.current = success;

    ambient.play().catch(() => {});

    return () => {
      ambient.pause();
      alert.pause();
      success.pause();
    };
  }, []);

  useEffect(() => {
    [ambientAudioRef.current, alertAudioRef.current, successAudioRef.current]
      .filter(Boolean)
      .forEach((audio) => {
        audio.muted = isMuted;
      });
  }, [isMuted]);

  const playAlert = () => {
    const a = alertAudioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };

  const playSuccess = () => {
    const a = successAudioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };

  const copy = COPY[lang];

  return (
    <div dir={copy.dir} className="app-shell">
      <style>{globalStyles}</style>

      <motion.div className="progress-bar" style={{ width: progressWidth }} />

      <BackgroundLayers />
      <FloatingHud />
      <TopNav isMuted={isMuted} setIsMuted={setIsMuted} lang={lang} setLang={setLang} />

      <main className="main-content">
        <HeroSection onPlayAlert={playAlert} onPlaySuccess={playSuccess} lang={lang} />
        <AvoidanceSection onPlayAlert={playAlert} onPlaySuccess={playSuccess} lang={lang} />
        <MediaShowcase title={copy.videoCollision} videos={VIDEO_SLOTS.collision} lang={lang} mode="collision" />
        <MediaShowcase title={copy.videoAvoidance} videos={VIDEO_SLOTS.avoidance} lang={lang} mode="avoidance" />
        <ImmersivePanel lang={lang} />
        <MetricsStrip />
        <SystemsSection lang={lang} />
        <ScenesSection lang={lang} />
        <TimelineSection lang={lang} />
        <ControlSection lang={lang} />
        <FinalSection lang={lang} />
      </main>
    </div>
  );
}



function TopNav({ isMuted, setIsMuted, lang, setLang }) {
  const copy = COPY[lang];
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="top-nav-wrap"
    >
      <div className="top-nav">
        <div className="brand-wrap">
          <div className="logo-circle">
            <Satellite size={18} />
          </div>
          <div>
            <div className="brand-title">SAT-GUARD</div>
            <div className="brand-sub">{copy.brandSub}</div>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#hero">{copy.navHome}</a>
          <a href="#hero">{copy.navCollision}</a>
          <a href="#avoidance">{copy.navAvoidance}</a>
          <a href="#systems">{copy.navSystems}</a>
          <a href="#scenes">{copy.navScenes}</a>
          <a href="#timeline">{copy.navTimeline}</a>
        </nav>

        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setIsMuted((v) => !v)}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button className="nav-btn nav-lang" onClick={() => setLang((v) => (v === 'ar' ? 'en' : 'ar'))}>
            <Globe size={16} />
            <span>{lang === 'ar' ? 'AR / EN' : 'EN / AR'}</span>
          </button>
          <a href="#hero" className="btn-primary small">
            {copy.startTour}
          </a>
        </div>
      </div>
    </motion.header>
  );
}



function HeroSection({ onPlayAlert, onPlaySuccess, lang }) {
  const copy = COPY[lang];
  const { scrollYProgress } = useScroll();
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -40]);
  const visualY = useTransform(scrollYProgress, [0, 0.2], [0, 30]);

  const [simulationActive, setSimulationActive] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [probability, setProbability] = useState(4);
  const [distanceKm, setDistanceKm] = useState(128);
  const [cameraMode, setCameraMode] = useState('overview');
  const [scenario, setScenario] = useState('debris');

  useEffect(() => {
    if (!simulationActive) {
      setPhase('idle');
      setProbability(4);
      setDistanceKm(128);
      setCameraMode('overview');
      return;
    }

    setPhase('tracking');
    setProbability(12);
    setDistanceKm(96);
    setCameraMode('overview');

    const t0 = setTimeout(() => onPlayAlert?.(), 700);
    const t1 = setTimeout(() => {
      setPhase('danger');
      setProbability(68);
      setDistanceKm(34);
      setCameraMode('threat');
      onPlayAlert?.();
    }, 2200);

    const t2 = setTimeout(() => {
      setPhase('impact');
      setProbability(100);
      setDistanceKm(0);
      setCameraMode('threat');
      onPlayAlert?.();
    }, 4300);

    const t3 = setTimeout(() => {
      setPhase('destroyed');
      setProbability(100);
      setDistanceKm(0);
      setCameraMode('overview');
    }, 6200);

    const t4 = setTimeout(() => {
      setSimulationActive(false);
      setPhase('idle');
      setProbability(4);
      setDistanceKm(128);
      setCameraMode('overview');
    }, 9100);

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [simulationActive, onPlayAlert]);

  const statusLabel =
    phase === 'idle'
      ? copy.collisionStatusReady
      : phase === 'tracking'
        ? copy.collisionStatusTrack
        : phase === 'danger'
          ? copy.collisionStatusDanger
          : phase === 'impact'
            ? copy.collisionStatusImpact
            : copy.collisionStatusDestroyed;

  const scenarioLabel =
    scenario === 'debris'
      ? (lang === 'ar' ? 'حطام فضائي' : 'Space Debris')
      : scenario === 'asteroid'
        ? (lang === 'ar' ? 'نيزك سريع' : 'Fast Asteroid')
        : (lang === 'ar' ? 'قمر صناعي قريب' : 'Nearby Satellite');

  return (
    <section id="hero" className="hero-section hero-section-stacked">
      <div className="container">
        <motion.div
          className="hero-top-content"
          style={{ y: textY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="eyebrow-pill">
            <Sparkles size={14} />
            <span>{copy.heroEyebrow}</span>
          </div>

          <h1 className="hero-title hero-title-centered">
            {lang === 'ar' ? 'القمر الصناعي' : 'The Satellite'}
            <span>{lang === 'ar' ? 'الذي يتفادى الخطر' : 'That Avoids Danger'}</span>
          </h1>

          <p className="hero-text hero-text-centered">{copy.heroText}</p>

          <div className="hero-actions hero-actions-centered">
            <button
              className="btn-primary hero-btn-reset"
              onClick={() => setSimulationActive(true)}
              disabled={simulationActive}
            >
              <Play size={16} />
              <span>{simulationActive ? copy.simRunning : copy.heroRun}</span>
            </button>

            <a href="#systems" className="btn-secondary">
              {copy.heroExplore}
            </a>
          </div>

          <div className="scenario-tabs">
            <button
              className={scenario === 'debris' ? 'active' : ''}
              onClick={() => setScenario('debris')}
              disabled={simulationActive}
            >
              {lang === 'ar' ? 'حطام فضائي' : 'Space Debris'}
            </button>
            <button
              className={scenario === 'asteroid' ? 'active' : ''}
              onClick={() => setScenario('asteroid')}
              disabled={simulationActive}
            >
              {lang === 'ar' ? 'نيزك' : 'Asteroid'}
            </button>
            <button
              className={scenario === 'satellite' ? 'active' : ''}
              onClick={() => setScenario('satellite')}
              disabled={simulationActive}
            >
              {lang === 'ar' ? 'قمر قريب' : 'Nearby Sat'}
            </button>
          </div>

          <div className="hero-science-grid">
            <div className="hero-science-card">
              <div className="hero-science-label">{copy.sceneState}</div>
              <div className="hero-science-value">{statusLabel}</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">{copy.scenario}</div>
              <div className="hero-science-value hero-science-value-sm">{scenarioLabel}</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">{copy.probability}</div>
              <div className="hero-science-value">{probability}%</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">{copy.distance}</div>
              <div className="hero-science-value">{distanceKm} km</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">{copy.camera}</div>
              <div className="hero-science-value hero-science-value-sm">
                {cameraMode === 'overview' ? copy.overview : copy.threat}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual-wrap hero-visual-wrap-full"
          style={{ y: visualY }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <HeroVisual
            simulationActive={simulationActive}
            phase={phase}
            probability={probability}
            distanceKm={distanceKm}
            cameraMode={cameraMode}
            scenario={scenario}
            lang={lang}
          />
        </motion.div>
      </div>

      <motion.a
        href="#systems"
        className="scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span>SCROLL</span>
        <ChevronDown size={18} />
      </motion.a>
    </section>
  );
}



function HeroVisual({ simulationActive, phase, probability, distanceKm, cameraMode, scenario, lang }) {
  const controlsRef = useRef(null);

  return (
    <div className="hero-visual-root hero-visual-root-wide">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="hero-glow-box"
      />

      <div className="hero-visual-frame hero-visual-frame-wide">
        <div className="canvas-fill">
          <HeroThreeScene
            controlsRef={controlsRef}
            simulationActive={simulationActive}
            phase={phase}
            cameraMode={cameraMode}
            scenario={scenario}
          />
        </div>

        <div className="hero-overlay" />

        <button
          type="button"
          className="hero-reset-view"
          onClick={() => controlsRef.current?.reset()}
          aria-label="Reset view"
        >
          <RotateCcw size={18} />
        </button>

        <div className="hero-live-hud">
          <div className={`hero-live-pill ${phase}`}>
            {phase === 'idle'
              ? 'MISSION READY'
              : phase === 'tracking'
                ? 'TRACKING OBJECT'
                : phase === 'danger'
                  ? 'COLLISION WARNING'
                  : phase === 'impact'
                    ? 'DIRECT IMPACT'
                    : 'TOTAL SHATTER'}
          </div>

          <div className="hero-live-panel">
            <div className="hero-live-row">
              <span>Threat Type</span>
              <strong>
                {scenario === 'debris'
                  ? 'Debris'
                  : scenario === 'asteroid'
                    ? 'Asteroid'
                    : 'Satellite'}
              </strong>
            </div>
            <div className="hero-live-row">
              <span>Probability</span>
              <strong>{probability}%</strong>
            </div>
            <div className="hero-live-bar">
              <motion.div
                className="hero-live-bar-fill"
                animate={{ width: `${probability}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>

            <div className="hero-live-row">
              <span>Closest Approach</span>
              <strong>{distanceKm} km</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function MediaShowcase({ title, videos, lang, mode }) {
  const copy = COPY[lang];
  return (
    <section className="section compact media-showcase">
      <div className="container">
        <div className="max-text media-copy">
          <div className="section-eyebrow cyan">{title}</div>
          <p className="section-text">{copy.videoHint}</p>
        </div>
        <div className="media-grid">
          {videos.map((src, index) => (
            <VideoCard key={`${mode}-${index}`} title={`${title} ${index + 1}`} src={src} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({ title, src, lang }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [full, setFull] = useState(false);
  const copy = COPY[lang];

  const togglePlay = () => {
    if (!src || !ref.current) return;
    if (ref.current.paused) {
      ref.current.play().catch(() => {});
      setPlaying(true);
    } else {
      ref.current.pause();
      setPlaying(false);
    }
  };

  const stop = () => {
    if (!src || !ref.current) return;
    ref.current.pause();
    ref.current.currentTime = 0;
    setPlaying(false);
    setProgress(0);
  };

  const toggleFull = async (e) => {
    const card = e.currentTarget.closest('.video-card');
    if (!card) return;
    if (!document.fullscreenElement) {
      await card.requestFullscreen?.();
      setFull(true);
    } else {
      await document.exitFullscreen?.();
      setFull(false);
    }
  };

  return (
    <div className="video-card cinematic-video-card">
      <div className="video-card-head">{title}</div>
      <div className="video-card-screen">
        {src ? (
          <video
            ref={ref}
            src={src}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
            }}
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <div className="video-card-placeholder">{copy.videosEmpty}</div>
        )}
      </div>
      <div className="video-card-controls">
        <button className="video-btn" onClick={togglePlay}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
        <button className="video-btn" onClick={stop}><Square size={16} /></button>
        <button className="video-btn" onClick={toggleFull}>{full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
        <div className="video-progress-track"><div className="video-progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  );
}

function ImmersivePanel({ lang }) {
  const copy = COPY[lang];
  return (
    <section className="section compact">
      <div className="container panel-grid">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card"
        >
          <div className="section-eyebrow cyan">{copy.sectionCompareEyebrow}</div>
          <h3 className="section-title-md">{copy.sectionCompareTitle}</h3>
          <p className="section-text">{copy.sectionCompareText}</p>
          <div className="badge-row">
            <Badge>{lang === 'ar' ? 'اصطدام = تحطم الطرفين' : 'Collision = both shatter'}</Badge>
            <Badge>{lang === 'ar' ? 'تفادي = لا تماس' : 'Avoidance = no contact'}</Badge>
            <Badge>{lang === 'ar' ? 'قرار لحظي' : 'Live decision'}</Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="glass-card"
        >
          <div className="section-eyebrow pink">{lang === 'ar' ? 'مقارنة سريعة' : 'QUICK COMPARISON'}</div>
          <div className="control-list">
            <div className="control-btn danger">
              <span>{lang === 'ar' ? 'في التصادم' : 'In Collision'}</span>
              <span>{lang === 'ar' ? 'لا حماية / تحطم مباشر' : 'No shield / direct impact'}</span>
            </div>
            <div className="control-btn safe">
              <span>{lang === 'ar' ? 'في التفادي' : 'In Avoidance'}</span>
              <span>{lang === 'ar' ? 'تحرك مبكر / فصل آمن' : 'Early move / safe separation'}</span>
            </div>
            <div className="control-btn">
              <span>{lang === 'ar' ? 'حالة النظام' : 'System state'}</span>
              <span>{lang === 'ar' ? 'رصد ← قرار ← نتيجة' : 'Track ← Decide ← Result'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



function AvoidanceSection({ onPlayAlert, onPlaySuccess, lang }) {
  const copy = COPY[lang];
  const [simulationActive, setSimulationActive] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [scenario, setScenario] = useState('asteroid');
  const [safeDistance, setSafeDistance] = useState(24);
  const [fieldPower, setFieldPower] = useState(18);
  const [cameraMode, setCameraMode] = useState('overview');
  const [manualPosition, setManualPosition] = useState({ x: 0, y: 0 });

  const scenarioConfig = useMemo(
    () =>
      avoidanceConfigs.find((item) => item.key === scenario) || avoidanceConfigs[0],
    [scenario]
  );

  useEffect(() => {
    const baseDistance = scenarioConfig.baseSafeDistance;
    const finalDistance = scenarioConfig.finalSafeDistance;

    if (!simulationActive) {
      setPhase('idle');
      setSafeDistance(baseDistance);
      setFieldPower(18);
      setCameraMode('overview');
      return;
    }

    setPhase('tracking');
    setSafeDistance(Math.max(10, baseDistance - 12));
    setFieldPower(34);
    setCameraMode('overview');

    const t0 = setTimeout(() => onPlayAlert?.(), 500);

    const t1 = setTimeout(() => {
      setPhase('warning');
      setSafeDistance(Math.max(14, baseDistance - 6));
      setFieldPower(74);
      setCameraMode('threat');
      onPlayAlert?.();
    }, 1700);

    const t2 = setTimeout(() => {
      setPhase('evade');
      setSafeDistance(Math.round(finalDistance * 0.58));
      setFieldPower(96);
      setCameraMode('evade');
    }, 3500);

    const t3 = setTimeout(() => {
      setPhase('safe');
      setSafeDistance(finalDistance);
      setFieldPower(54);
      setCameraMode('overview');
      onPlaySuccess?.();
    }, 6200);

    const t4 = setTimeout(() => setSimulationActive(false), 8300);

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [simulationActive, scenarioConfig, onPlayAlert, onPlaySuccess]);

  const statusLabel =
    phase === 'idle'
      ? (lang === 'ar' ? 'استعداد' : 'Ready')
      : phase === 'tracking'
        ? (lang === 'ar' ? 'تتبع الجسم' : 'Tracking')
        : phase === 'warning'
          ? (lang === 'ar' ? 'خطر قريب' : 'Warning')
          : phase === 'evade'
            ? (lang === 'ar' ? 'تنفيذ مناورة' : 'Evading')
            : (lang === 'ar' ? 'تم التفادي' : 'Avoided');

  const cameraLabel =
    cameraMode === 'overview'
      ? copy.overview
      : cameraMode === 'threat'
        ? copy.threat
        : copy.evadeCam;

  return (
    <section id="avoidance" className="hero-section hero-section-stacked avoidance-dashboard-section">
      <div className="container">
        <motion.div
          className="hero-top-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="eyebrow-pill">
            <Shield size={14} />
            <span>{copy.avoidanceEyebrow}</span>
          </div>

          <h2 className="hero-title hero-title-centered avoidance-title-main">
            {lang === 'ar' ? 'محاكاة التفادي' : 'Avoidance Simulation'}
            <span>{lang === 'ar' ? 'بنفس تقسيمة الاصطدام' : 'Same collision layout'}</span>
          </h2>

          <p className="hero-text hero-text-centered">{copy.avoidanceLead}</p>

          <div className="hero-actions hero-actions-centered">
            <button
              className="btn-primary hero-btn-reset"
              onClick={() => setSimulationActive(true)}
              disabled={simulationActive}
            >
              <Play size={16} />
              <span>{simulationActive ? copy.simRunning : copy.heroRun}</span>
            </button>

            <a href="#hero" className="btn-secondary">
              {copy.compare}
            </a>
          </div>

          <div className="scenario-tabs">
            {avoidanceConfigs.map((item) => (
              <button
                key={item.key}
                className={scenario === item.key ? 'active' : ''}
                onClick={() => setScenario(item.key)}
                disabled={simulationActive}
              >
                {lang === 'ar'
                  ? item.title
                  : item.key === 'asteroid'
                    ? 'Asteroid Avoidance'
                    : item.key === 'debris'
                      ? 'Debris Avoidance'
                      : 'Satellite Avoidance'}
              </button>
            ))}
          </div>

          <div className="hero-science-grid">
            <div className="hero-science-card">
              <div className="hero-science-label">{copy.sceneState}</div>
              <div className="hero-science-value">{statusLabel}</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">{copy.scenario}</div>
              <div className="hero-science-value hero-science-value-sm">
                {lang === 'ar' ? scenarioConfig.title : (scenario === 'asteroid' ? 'Asteroid Avoidance' : scenario === 'debris' ? 'Debris Avoidance' : 'Satellite Avoidance')}
              </div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">{copy.safeDistance}</div>
              <div className="hero-science-value">{safeDistance} km</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">{copy.fieldPower}</div>
              <div className="hero-science-value">{fieldPower}%</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">{copy.camera}</div>
              <div className="hero-science-value hero-science-value-sm">{cameraLabel}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual-wrap hero-visual-wrap-full"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <AvoidanceDashboardVisual
            simulationActive={simulationActive}
            phase={phase}
            fieldPower={fieldPower}
            safeDistance={safeDistance}
            cameraMode={cameraMode}
            config={scenarioConfig}
            manualPosition={manualPosition}
            setManualPosition={setManualPosition}
            lang={lang}
          />
        </motion.div>
      </div>
    </section>
  );
}



function AvoidanceDashboardVisual({
  simulationActive,
  phase,
  fieldPower,
  safeDistance,
  cameraMode,
  config,
  manualPosition,
  setManualPosition,
  lang,
}) {
  const controlsRef = useRef(null);

  return (
    <div className="hero-visual-root hero-visual-root-wide">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="hero-glow-box"
      />

      <div className="hero-visual-frame hero-visual-frame-wide">
        <div className="canvas-fill">
          <AvoidanceHeroThreeScene
            controlsRef={controlsRef}
            simulationActive={simulationActive}
            phase={phase}
            cameraMode={cameraMode}
            scenario={config.key}
            manualPosition={manualPosition}
            setManualPosition={setManualPosition}
          />
        </div>

        <div className="hero-overlay" />

        <button
          type="button"
          className="hero-reset-view"
          onClick={() => {
            controlsRef.current?.reset();
            setManualPosition({ x: 0, y: 0 });
          }}
          aria-label="Reset view"
        >
          <RotateCcw size={18} />
        </button>

        <div className="hero-live-hud">
          <div className={`hero-live-pill ${phase === 'warning' ? 'danger' : phase === 'evade' || phase === 'safe' ? 'evade' : ''}`}>
            {phase === 'idle'
              ? 'EVASION READY'
              : phase === 'tracking'
                ? 'TRACKING OBJECT'
                : phase === 'warning'
                  ? 'PROXIMITY ALERT'
                  : phase === 'evade'
                    ? 'DEFLECTING PATH'
                    : 'SAFE SEPARATION'}
          </div>

          <div className="hero-live-panel">
            <div className="hero-live-row">
              <span>Threat Type</span>
              <strong>{lang === 'ar' ? config.objectLabel : config.key === 'asteroid' ? 'Asteroid' : config.key === 'debris' ? 'Debris' : 'Satellite'}</strong>
            </div>
            <div className="hero-live-row">
              <span>Shield Power</span>
              <strong>{fieldPower}%</strong>
            </div>
            <div className="hero-live-bar">
              <motion.div
                className="hero-live-bar-fill"
                animate={{ width: `${fieldPower}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>

            <div className="hero-live-row">
              <span>Safe Distance</span>
              <strong>{safeDistance} km</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function AvoidanceHeroThreeScene({
  controlsRef,
  simulationActive,
  phase,
  cameraMode,
  scenario,
  manualPosition,
  setManualPosition,
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <Canvas
      dpr={[1, 2]}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerMove={(e) => {
        if (!dragging) return;
        setManualPosition({
          x: Math.max(-1.8, Math.min(1.8, (e.point.x / 4) * 1.8)),
          y: Math.max(-1.2, Math.min(1.2, (e.point.y / 3) * 1.2)),
        });
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.35, 8]} fov={42} />
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 6, 20]} />

      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 3]} intensity={2.2} color="#7df1ff" />
      <pointLight position={[-2, -1, 2]} intensity={1.1} color="#ff6fd8" />

      <Stars radius={100} depth={40} count={3000} factor={3} fade speed={0.7} />

      <EnhancedCameraRig phase={phase} cameraMode={cameraMode} />
      <AvoidanceCore phase={phase} scenario={scenario} simulationActive={simulationActive} manualPosition={manualPosition} />

      <OrbitControls
        ref={controlsRef}
        enableZoom={!simulationActive}
        enableRotate
        enablePan={false}
        rotateSpeed={0.7}
        zoomSpeed={0.9}
        minDistance={4.8}
        maxDistance={11}
      />
    </Canvas>
  );
}



function AvoidanceCore({ phase, scenario, simulationActive, manualPosition }) {
  const satelliteOffset =
    manualPosition && (manualPosition.x !== 0 || manualPosition.y !== 0)
      ? [manualPosition.x, manualPosition.y, 0]
      : phase === 'evade'
        ? [1.2, 0.85, 0]
        : phase === 'safe'
          ? [0.55, 0.18, 0]
          : phase === 'warning'
            ? [0.42, 0.16, 0]
            : [0, 0, 0];

  return (
    <group>
      <SatelliteWithShield phase={phase} offset={satelliteOffset} />
      <RepelledThreat type={scenario} phase={phase} active={simulationActive} />
      <AvoidancePathArc phase={phase} center={satelliteOffset} />
      <ProtectionWave phase={phase} center={satelliteOffset} />
      <SeparationParticles phase={phase} center={satelliteOffset} />
      <FloatingRock position={[-3.2, 1.2, -1.2]} scale={0.36} speed={1.1} />
      <FloatingRock position={[3.1, -1.4, -1.5]} scale={0.24} speed={1.5} />
      <FloatingRock position={[2.6, 1.7, -1.9]} scale={0.18} speed={1.9} />
    </group>
  );
}


function SatelliteWithShield({ phase, offset = [0, 0, 0] }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += (offset[0] - ref.current.position.x) * 0.05;
    ref.current.position.y += (offset[1] - ref.current.position.y) * 0.05;
    ref.current.position.z += (offset[2] - ref.current.position.z) * 0.05;
  });

  return (
    <group ref={ref}>
      <SmartSatellite phase={phase} locked />
      <ProtectionFieldRings phase={phase} />
    </group>
  );
}

function AvoidanceScenarioCard({ config, index, onPlayAlert, onPlaySuccess }) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('ready');
  const [safeDistance, setSafeDistance] = useState(config.baseSafeDistance);
  const [fieldPower, setFieldPower] = useState(18);
  const [deflection, setDeflection] = useState(0);
  const [status, setStatus] = useState('في وضع الاستعداد');

  useEffect(() => {
    if (!active) {
      setPhase('ready');
      setSafeDistance(config.baseSafeDistance);
      setFieldPower(18);
      setDeflection(0);
      setStatus('في وضع الاستعداد');
      return;
    }

    setPhase('tracking');
    setSafeDistance(Math.max(12, config.baseSafeDistance - 8));
    setFieldPower(36);
    setDeflection(6);
    setStatus('رصد الجسم القادم');

    const t0 = setTimeout(() => {
      onPlayAlert?.();
    }, 600);

    const t1 = setTimeout(() => {
      setPhase('warning');
      setSafeDistance(Math.max(8, config.baseSafeDistance - 14));
      setFieldPower(68);
      setDeflection(18);
      setStatus('دخل الجسم مجال الحماية الخارجي');
      onPlayAlert?.();
    }, 2200);

    const t2 = setTimeout(() => {
      setPhase('repel');
      setSafeDistance(Math.round(config.finalSafeDistance * 0.56));
      setFieldPower(96);
      setDeflection(74);
      setStatus('جاري صد الجسم خارج الحلقتين');
    }, 4300);

    const t3 = setTimeout(() => {
      setPhase('safe');
      setSafeDistance(config.finalSafeDistance);
      setFieldPower(54);
      setDeflection(100);
      setStatus('تم الإبعاد بنجاح عن مجال الحماية');
      onPlaySuccess?.();
    }, 7000);

    const t4 = setTimeout(() => {
      setActive(false);
    }, 9200);

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [active, config, onPlayAlert, onPlaySuccess]);

  const phaseLabel =
    phase === 'ready'
      ? 'جاهز'
      : phase === 'tracking'
        ? 'تتبع'
        : phase === 'warning'
          ? 'تحذير'
          : phase === 'repel'
            ? 'صدّ الجسم'
            : 'آمن';

  return (
    <motion.div
      className="avoidance-scene-card"
      initial={{ opacity: 0, y: 38 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="avoidance-card-header">
        <div>
          <div className="section-eyebrow cyan">{config.eyebrow}</div>
          <h3 className="section-title-md avoidance-title">{config.title}</h3>
          <p className="section-text avoidance-copy">{config.description}</p>
        </div>

        <button
          className="btn-primary hero-btn-reset"
          onClick={() => setActive(true)}
          disabled={active}
          type="button"
        >
          <Play size={16} />
          <span>{active ? 'المحاكاة جارية' : 'ابدأ المحاكاة'}</span>
        </button>
      </div>

      <div className="avoidance-scene-grid">
        <div className="avoidance-scene-visual">
          <div className="avoidance-visual-frame scene-visual-soft">
            <div className="canvas-fill">
              <AvoidanceThreeScene
                type={config.key}
                phase={phase}
                active={active}
              />
            </div>
            <div className="hero-overlay" />
            <div className={`avoidance-pill ${phase}`}>DOUBLE SHIELD FIELD</div>
          </div>
        </div>

        <div className="avoidance-info-side">
          <div className="avoidance-mini-grid">
            <div className="hero-science-card">
              <div className="hero-science-label">العنصر</div>
              <div className="hero-science-value hero-science-value-sm">
                {config.objectLabel}
              </div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">الحالة</div>
              <div className="hero-science-value hero-science-value-sm">{phaseLabel}</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">المسافة الآمنة</div>
              <div className="hero-science-value">{safeDistance} km</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">قوة الحقل</div>
              <div className="hero-science-value">{fieldPower}%</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">الانحراف</div>
              <div className="hero-science-value">{deflection}%</div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">تكلفة المناورة</div>
              <div className="hero-science-value hero-science-value-sm">
                {config.fuelCost}
              </div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">وضع الحماية</div>
              <div className="hero-science-value hero-science-value-sm">
                {config.shieldStatus}
              </div>
            </div>

            <div className="hero-science-card">
              <div className="hero-science-label">نجاح العملية</div>
              <div className="hero-science-value">{config.successRate}</div>
            </div>
          </div>

          <div className="avoidance-status-box">
            <div className="avoidance-status-title">الحالة الحالية</div>
            <div className="avoidance-status-text">{status}</div>

            <div className="status-track large">
              <motion.div
                className="status-fill"
                animate={{ width: `${fieldPower}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AvoidanceThreeScene({ type, phase, active }) {
  return (
    <Canvas dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0.35, 8]} fov={42} />
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 6, 20]} />

      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 3]} intensity={2.2} color="#7df1ff" />
      <pointLight position={[-2, -1, 2]} intensity={1.1} color="#ff6fd8" />

      <Stars radius={100} depth={40} count={3000} factor={3} fade speed={0.7} />

      <EnhancedCameraRig phase={phase} />
      <SmartSatellite phase={phase} />
      <ProtectionFieldRings phase={phase} />
      <ProtectionWave phase={phase} />
      <RepelledThreat type={type} phase={phase} active={active} />
      <AvoidancePathArc phase={phase} />
      <SeparationParticles phase={phase} />

      <OrbitControls
        enableZoom
        enableRotate
        enablePan={false}
        rotateSpeed={0.7}
        zoomSpeed={0.9}
        minDistance={4.8}
        maxDistance={11}
      />
    </Canvas>
  );
}

function EnhancedCameraRig({ phase, cameraMode }) {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const modeTarget =
      cameraMode === 'evade'
        ? { x: 1.5, y: 0.9, z: 5.8 }
        : cameraMode === 'threat'
          ? { x: -1.2, y: 0.6, z: 6.3 }
          : null;

    const phaseTarget =
      phase === 'repel' || phase === 'evade'
        ? { x: 1.5, y: 0.9, z: 5.8 }
        : phase === 'safe'
          ? { x: -0.7, y: 0.45, z: 7.6 }
          : phase === 'warning'
            ? { x: -1.2, y: 0.6, z: 6.3 }
            : { x: 0, y: 0.35, z: 8 };

    const target = modeTarget || phaseTarget;

    camera.position.x += (target.x - camera.position.x) * 0.035;
    camera.position.y += ((target.y + Math.sin(t * 0.35) * 0.04) - camera.position.y) * 0.035;
    camera.position.z += (target.z - camera.position.z) * 0.035;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SmartSatellite({ phase, locked = false }) {
  const ref = useRef();
  const velocity = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;

    let targetX = 0;
    let targetY = 0;

    if (!locked) {
      if (phase === 'repel' || phase === 'evade') {
        targetX = 1.2;
        targetY = 0.85;
      } else if (phase === 'safe') {
        targetX = 0.55;
        targetY = 0.18;
      } else if (phase === 'warning') {
        targetX = 0.18;
        targetY = 0.05;
      }
    }

    const ax = (targetX - pos.current.x) * 0.012;
    const ay = (targetY - pos.current.y) * 0.012;

    velocity.current.x = (velocity.current.x + ax) * 0.95;
    velocity.current.y = (velocity.current.y + ay) * 0.95;

    pos.current.x += velocity.current.x;
    pos.current.y += velocity.current.y;

    ref.current.position.x = pos.current.x;
    ref.current.position.y = pos.current.y;
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x = Math.sin(t * 1.2) * 0.06;
    ref.current.rotation.z += (((phase === 'repel' ? 0.22 : 0) - ref.current.rotation.z) * 0.05);
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.15, 0.82, 0.82]} />
        <meshStandardMaterial color="#cfd8e3" metalness={0.72} roughness={0.26} />
      </mesh>

      <mesh position={[-1.45, 0, 0]}>
        <boxGeometry args={[1.12, 0.05, 0.62]} />
        <meshStandardMaterial color="#2a7cff" emissive="#7fe7ff" emissiveIntensity={0.65} />
      </mesh>

      <mesh position={[1.45, 0, 0]}>
        <boxGeometry args={[1.12, 0.05, 0.62]} />
        <meshStandardMaterial color="#2a7cff" emissive="#7fe7ff" emissiveIntensity={0.65} />
      </mesh>

      <mesh position={[0, 0, 0.46]}>
        <planeGeometry args={[0.44, 0.3]} />
        <meshStandardMaterial color="#091527" emissive="#56e0ff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}
function ProtectionFieldRings({ phase }) {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (outerRef.current) {
      const outerScale =
        phase === 'warning'
          ? 1.08 + Math.sin(t * 4.5) * 0.04
          : phase === 'repel'
            ? 1.18 + Math.sin(t * 7) * 0.06
            : 1;
      outerRef.current.scale.set(outerScale, outerScale, outerScale);
      outerRef.current.rotation.z += 0.004;
    }

    if (innerRef.current) {
      const innerScale =
        phase === 'warning'
          ? 1.04 + Math.sin(t * 5.5) * 0.03
          : phase === 'repel'
            ? 1.11 + Math.sin(t * 8) * 0.05
            : 1;
      innerRef.current.scale.set(innerScale, innerScale, innerScale);
      innerRef.current.rotation.z -= 0.006;
    }
  });

  return (
    <>
      <mesh ref={outerRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.04, 20, 220]} />
        <meshBasicMaterial color="#7df1ff" transparent opacity={0.55} />
      </mesh>

      <mesh ref={innerRef} rotation={[Math.PI / 2, 0.4, 0]}>
        <torusGeometry args={[1.55, 0.05, 20, 220]} />
        <meshBasicMaterial color="#ff7de3" transparent opacity={0.46} />
      </mesh>
    </>
  );
}

function ProtectionWave({ phase, center = [0, 0, 0] }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    ref.current.position.x = center[0];
    ref.current.position.y = center[1];
    ref.current.position.z = center[2];
    ref.current.visible = phase === 'warning' || phase === 'repel' || phase === 'evade';

    if (ref.current.visible) {
      const s = phase === 'repel' || phase === 'evade' ? 1.12 + Math.sin(t * 10) * 0.08 : 1 + Math.sin(t * 6) * 0.04;
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[1.1, 1.25, 64]} />
      <meshBasicMaterial color="#67e8f9" transparent opacity={0.32} />
    </mesh>
  );
}

function RepelledThreat({ type, phase, active }) {
  const ref = useRef();
  const pos = useRef({ x: 0, y: 0, z: 0 });
  const vel = useRef({ x: 0, y: 0, z: 0 });

  const setup = useMemo(() => {
    if (type === 'asteroid') {
      return {
        start: { x: -5.2, y: 1.3, z: -0.4 },
        near: { x: -1.9, y: 0.4, z: -0.18 },
        repel: { x: -4.8, y: 2.8, z: -1.1 },
        safe: { x: -6.6, y: 3.8, z: -1.8 },
      };
    }

    if (type === 'debris') {
      return {
        start: { x: 4.8, y: -1.5, z: -0.35 },
        near: { x: 1.7, y: -0.45, z: -0.1 },
        repel: { x: 5.3, y: -3.1, z: -1.3 },
        safe: { x: 7.1, y: -4.2, z: -1.9 },
      };
    }

    return {
      start: { x: 0.4, y: 5.4, z: -0.7 },
      near: { x: 0.18, y: 1.95, z: -0.2 },
      repel: { x: 2.2, y: 5.8, z: -1.2 },
      safe: { x: 3.4, y: 7.1, z: -1.8 },
    };
  }, [type]);

  useEffect(() => {
    pos.current = { ...setup.start };
    vel.current = { x: 0, y: 0, z: 0 };
  }, [setup, active]);

  useFrame(() => {
    if (!ref.current) return;

    ref.current.visible = active || phase === 'safe';
    if (!active && phase !== 'safe') return;

    let target = setup.start;

    if (phase === 'tracking') target = setup.near;
    if (phase === 'warning') target = setup.near;
    if (phase === 'repel' || phase === 'evade') target = setup.repel;
    if (phase === 'safe') target = setup.safe;

    const factor = phase === 'repel' ? 0.015 : 0.008;

    const ax = (target.x - pos.current.x) * factor;
    const ay = (target.y - pos.current.y) * factor;
    const az = (target.z - pos.current.z) * factor;

    vel.current.x = (vel.current.x + ax) * (phase === 'repel' ? 0.96 : 0.985);
    vel.current.y = (vel.current.y + ay) * (phase === 'repel' ? 0.96 : 0.985);
    vel.current.z = (vel.current.z + az) * (phase === 'repel' ? 0.96 : 0.985);

    pos.current.x += vel.current.x;
    pos.current.y += vel.current.y;
    pos.current.z += vel.current.z;

    ref.current.position.set(pos.current.x, pos.current.y, pos.current.z);
    ref.current.rotation.x += 0.02;
    ref.current.rotation.y += 0.018;
  });

  return (
    <group ref={ref} position={[setup.start.x, setup.start.y, setup.start.z]}>
      {type === 'asteroid' && (
        <>
          <mesh>
            <icosahedronGeometry args={[0.34, 0]} />
            <meshStandardMaterial color="#8b6f5a" roughness={0.9} metalness={0.05} />
          </mesh>
          <mesh position={[-0.5, 0, 0]} rotation={[0, 0, 1.2]}>
            <coneGeometry args={[0.12, 0.9, 12]} />
            <meshBasicMaterial color="#ffb26b" transparent opacity={0.4} />
          </mesh>
        </>
      )}

      {type === 'debris' && (
        <>
          <mesh>
            <boxGeometry args={[0.42, 0.2, 0.2]} />
            <meshStandardMaterial color="#bdefff" roughness={0.82} metalness={0.12} />
          </mesh>
          <mesh position={[0.32, -0.15, 0.05]}>
            <boxGeometry args={[0.18, 0.12, 0.12]} />
            <meshStandardMaterial color="#c8f7ff" roughness={0.8} metalness={0.12} />
          </mesh>
        </>
      )}

      {type === 'satellite' && (
        <>
          <mesh>
            <boxGeometry args={[0.72, 0.48, 0.48]} />
            <meshStandardMaterial color="#d8deea" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.7, 0, 0]}>
            <boxGeometry args={[0.42, 0.04, 0.26]} />
            <meshStandardMaterial color="#ff4f8b" emissive="#ff4f8b" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.7, 0, 0]}>
            <boxGeometry args={[0.42, 0.04, 0.26]} />
            <meshStandardMaterial color="#ff4f8b" emissive="#ff4f8b" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}

function AvoidancePathArc({ phase, center = [0, 0, 0] }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x = center[0];
    ref.current.position.y = center[1];
    ref.current.position.z = center[2];
    ref.current.visible =
      phase === 'tracking' || phase === 'warning' || phase === 'repel' || phase === 'evade' || phase === 'safe';
    ref.current.rotation.z += delta * 0.38;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3.5, 0.03, 16, 220]} />
      <meshBasicMaterial color="#00eaff" transparent opacity={0.5} />
    </mesh>
  );
}

function SeparationParticles({ phase, center = [1.1, 0.7, -0.15] }) {
  const particles = useMemo(() => Array.from({ length: 28 }, (_, i) => i), []);

  if (phase !== 'repel' && phase !== 'evade' && phase !== 'safe') return null;

  return (
    <group position={center}>
      {particles.map((i) => (
        <SeparationParticle key={i} index={i} />
      ))}
    </group>
  );
}

function SeparationParticle({ index }) {
  const ref = useRef();
  const velocity = useMemo(() => {
    const angle = (index / 28) * Math.PI * 2;
    return [
      Math.cos(angle) * (0.4 + Math.random() * 0.8),
      Math.sin(angle) * (0.4 + Math.random() * 0.8),
      (Math.random() - 0.5) * 1.1,
    ];
  }, [index]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += velocity[0] * delta;
    ref.current.position.y += velocity[1] * delta;
    ref.current.position.z += velocity[2] * delta;
    ref.current.scale.multiplyScalar(0.986);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#67e8f9" />
    </mesh>
  );
}

function MetricsStrip() {
  return (
    <section className="section compact">
      <div className="container metrics-grid">
        {metrics.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="metric-card"
            >
              <div className="metric-card-top">
                <div className="metric-card-label">{item.label}</div>
                <Icon size={18} />
              </div>
              <div className="metric-card-value">{item.value}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}


function SystemsSection({ lang }) {
  const copy = COPY[lang];
  const localSystems = [
    {
      title: lang === 'ar' ? 'نظام رصد وتتبع لحظي' : 'Live Tracking System',
      text:
        lang === 'ar'
          ? 'يراقب الأجسام القريبة ويحسب سرعة الاقتراب والاتجاه واحتمالية الخطر بشكل مباشر.'
          : 'Monitors nearby objects and computes approach speed, direction, and danger level in real time.',
      icon: Radar,
    },
    {
      title: lang === 'ar' ? 'تحليل خطر واتخاذ قرار' : 'Risk Analysis and Decision',
      text:
        lang === 'ar'
          ? 'يحدد ما إذا كان المسار ينتهي إلى اصطدام مباشر أو يتطلب تفعيل تفادي مبكر.'
          : 'Determines whether the path ends in direct impact or requires early avoidance.',
      icon: Cpu,
    },
    {
      title: lang === 'ar' ? 'مناورة تفادي ذكية' : 'Smart Avoidance Maneuver',
      text:
        lang === 'ar'
          ? 'يحرك القمر الصناعي وحلقات الحماية إلى موضع جديد ويحافظ على فاصل آمن حتى انتهاء مرور الخطر.'
          : 'Moves the satellite and its protection rings to a new position while preserving safe separation.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="systems" className="section">
      <div className="container">
        <motion.div
          className="max-text"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-eyebrow pink">{copy.systemsEyebrow}</div>
          <h2 className="section-title">{copy.systemsTitle}</h2>
          <p className="section-text">{copy.systemsText}</p>
        </motion.div>

        <div className="cards-grid three">
          {localSystems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="glass-card system-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="icon-box">
                  <Icon size={22} />
                </div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-text">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



function ScenesSection({ lang }) {
  const copy = COPY[lang];
  return (
    <section id="scenes" className="section">
      <div className="container stack">
        <motion.div
          className="max-text"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-eyebrow pink">{copy.slidesEyebrow}</div>
          <h2 className="section-title">{copy.slidesTitle}</h2>
          <p className="section-text">{copy.slidesText}</p>
        </motion.div>
        {scenes.map((scene, index) => (
          <motion.section
            key={scene.id}
            className="scene-card"
            initial={{ opacity: 0, y: 70, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`scene-grid ${index % 2 ? 'reverse' : ''}`}>
              <div className="scene-copy">
                <div className="section-eyebrow pink">{scene.eyebrow}</div>
                <h2 className="scene-title">{scene.title}</h2>
                <p className="scene-text">{scene.description}</p>
                <div className="badge-row">
                  <Badge>
                    {scene.tone === 'danger'
                      ? (lang === 'ar' ? 'وضع تحذير' : 'Warning Mode')
                      : scene.tone === 'success'
                        ? (lang === 'ar' ? 'تفادي ناجح' : 'Successful Avoidance')
                        : (lang === 'ar' ? 'المشهد الرئيسي' : 'Main Scene')}
                  </Badge>
                  <Badge>{lang === 'ar' ? 'مشهد تفاعلي' : 'Interactive Scene'}</Badge>
                  <Badge>{lang === 'ar' ? 'تحكم بالماوس' : 'Mouse Control'}</Badge>
                </div>
                <div className="scene-line" />
              </div>

              <div className="scene-visual-slot">
                <AnimatedOrbitalScene type={scene.type} />
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </section>
  );
}



function TimelineSection({ lang }) {
  const copy = COPY[lang];
  const steps = STEP_COPY[lang];
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="timeline" className="section">
      <div className="container timeline-grid">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-eyebrow cyan">{copy.timelineEyebrow}</div>
          <h3 className="section-title-md">{copy.timelineTitle}</h3>
          <p className="section-text">{copy.timelineText}</p>

          <div className="decision-detail">
            <div className="decision-detail-title">{steps[activeStep].title}</div>
            <p className="decision-detail-text">{steps[activeStep].text}</p>
            <div className="decision-metrics">
              <div className="mini-card">
                <div className="mini-card-label">{lang === 'ar' ? 'الحالة' : 'State'}</div>
                <div className="mini-card-value">{activeStep < 2 ? (lang === 'ar' ? 'رصد' : 'Tracking') : activeStep < 4 ? (lang === 'ar' ? 'تحذير' : 'Warning') : (lang === 'ar' ? 'نتيجة' : 'Outcome')}</div>
              </div>
              <div className="mini-card">
                <div className="mini-card-label">{lang === 'ar' ? 'القرار' : 'Decision'}</div>
                <div className="mini-card-value">{activeStep < 4 ? '—' : activeStep === 4 ? (lang === 'ar' ? 'تنفيذ' : 'Execute') : (lang === 'ar' ? 'نهاية' : 'Final')}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="timeline-list">
          {steps.map((step, i) => (
            <motion.button
              key={step.title}
              className={`timeline-item ${activeStep === i ? 'timeline-item-active' : ''}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setActiveStep(i)}
              type="button"
            >
              <div className="timeline-index">{String(i + 1).padStart(2, '0')}</div>
              <div className="timeline-label">{step.title}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}



function ControlSection({ lang }) {
  const copy = COPY[lang];
  const [mode, setMode] = useState('collision');

  const bars = mode === 'collision'
    ? [
        { label: copy.sceneState, value: 'تحطم', width: '96%' },
        { label: copy.probability, value: '100%', width: '100%' },
        { label: copy.camera, value: copy.threat, width: '64%' },
      ]
    : [
        { label: copy.safeDistance, value: '172 km', width: '88%' },
        { label: copy.fieldPower, value: '96%', width: '96%' },
        { label: copy.finalResult, value: copy.safeResult, width: '78%' },
      ];

  return (
    <section className="section">
      <div className="container panel-grid">
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-eyebrow pink">{copy.controlEyebrow}</div>
          <h3 className="section-title-md">{copy.controlTitle}</h3>
          <p className="section-text">{copy.controlText}</p>

          <div className="scenario-tabs" style={{justifyContent:'flex-start', marginTop: 18}}>
            <button className={mode === 'collision' ? 'active' : ''} onClick={() => setMode('collision')}>
              {lang === 'ar' ? 'التصادم' : 'Collision'}
            </button>
            <button className={mode === 'avoidance' ? 'active' : ''} onClick={() => setMode('avoidance')}>
              {lang === 'ar' ? 'التفادي' : 'Avoidance'}
            </button>
          </div>

          <div className="cards-grid three">
            <motion.div className="mini-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="icon-box small"><PanelsTopLeft size={18} /></div>
              <div className="mini-card-label">{lang === 'ar' ? 'حالة المهمة' : 'Mission Status'}</div>
              <div className="mini-card-value">{mode === 'collision' ? (lang === 'ar' ? 'خطر' : 'Danger') : (lang === 'ar' ? 'آمن' : 'Safe')}</div>
            </motion.div>
            <motion.div className="mini-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="icon-box small"><AlertTriangle size={18} /></div>
              <div className="mini-card-label">{lang === 'ar' ? 'القرار الحالي' : 'Current Decision'}</div>
              <div className="mini-card-value">{mode === 'collision' ? copy.collisionDirect : copy.safeResult}</div>
            </motion.div>
            <motion.div className="mini-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="icon-box small"><Activity size={18} /></div>
              <div className="mini-card-label">{lang === 'ar' ? 'زمن الاستجابة' : 'Response Time'}</div>
              <div className="mini-card-value">{mode === 'collision' ? '0.9s' : '0.4s'}</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="live-card"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="live-glow" />
          <div className="live-inner">
            <div className="section-eyebrow cyan">{copy.controlEyebrow}</div>
            <div className="status-list">
              {bars.map((bar) => (
                <StatusBar key={bar.label} label={bar.label} value={bar.value} width={bar.width} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


function StatusBar({ label, value, width }) {
  return (
    <div>
      <div className="status-top">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="status-track">
        <motion.div
          className="status-fill"
          initial={{ width: 0 }}
          whileInView={{ width }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}


function FinalSection({ lang }) {
  const copy = COPY[lang];
  return (
    <section className="section final">
      <motion.div
        className="final-card"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="final-eyebrow">{copy.finalEyebrow}</div>
        <h2 className="section-title">{copy.finalTitle}</h2>
        <p className="section-text center narrow">
          {copy.finalText}
        </p>

        <div className="ready-pill">{lang === 'ar' ? 'SMART ORBITAL DEFENSE EXPERIENCE' : 'SMART ORBITAL DEFENSE EXPERIENCE'}</div>

        <div className="hero-actions center">
          <a href="#hero" className="btn-primary">
            {copy.finalBtnA}
          </a>
          <a href="#timeline" className="btn-secondary">
            {copy.finalBtnB}
          </a>
        </div>
      </motion.div>
    </section>
  );
}


function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function BackgroundLayers() {
  return (
    <div className="bg-fixed">
      <motion.div
        className="bg-layer one"
        animate={{ y: [-18, 18, -18] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bg-layer two"
        animate={{ y: [18, -16, 18] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bg-blob pink"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bg-blob cyan"
        animate={{ scale: [1.03, 0.94, 1.03] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}


function FloatingHud() {
  return null;
}



function AnimatedOrbitalScene({ type }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const isImpact = type.includes('impact');
  const isAvoid = type.includes('avoid');
  const isHero = type === 'hero';

  return (
    <div ref={ref} className="scene-visual">
      <TransitionFX active={inView} />
      <div className="canvas-fill scene-canvas-layer">
        <SceneThreeCanvas type={type} />
      </div>
      <div className="scene-overlay" />

      <motion.div
        animate={{ y: [-10, 12, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="star-layer"
      >
        <div className="star a" />
        <div className="star b" />
        <div className="star c" />
        <div className="star d" />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.16, 0.5, 0.16], scaleX: [0.94, 1.06, 0.94] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        className="beam-line"
      />

      <div className="scene-center-halo" />

      {isImpact && (
        <>
          <ScreenShakeLayer />
          <ShockwavePulse />
          <div className="pill alert">ALERT MODE</div>
          <div className="pill top-left">DIRECT COLLISION</div>
        </>
      )}

      {isAvoid && (
        <>
          <AvoidanceTrailOverlay />
          <div className="pill safe">SAFE CORRIDOR</div>
          <div className="pill top-left cyan">AI EVADE MODE</div>
        </>
      )}

      {isHero && <div className="pill top-left cyan">MAIN ORBIT VIEW</div>}
    </div>
  );
}


function HeroThreeScene({ controlsRef, simulationActive, phase, cameraMode, scenario }) {
  return (
    <Canvas dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={40} />
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 6, 18]} />

      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 3]} intensity={2.2} color="#7df1ff" />
      <pointLight position={[-3, -2, 2]} intensity={1.4} color="#ff6fd8" />

      <Stars radius={90} depth={30} count={3200} factor={3.2} fade speed={0.8} />

      {simulationActive && <HeroCameraRig phase={phase} cameraMode={cameraMode} />}

      <SatelliteModel3D position={[0, 0, 0]} interactive={!simulationActive} phase={phase} />
      <OrbitRing3D radius={2.2} color="#79dcff" opacity={0.32} speed={0.18} />
      <OrbitRing3D radius={2.85} color="#f08cff" opacity={0.15} speed={-0.12} tilt={0.8} />

      <FloatingRock position={[-3.2, 1.2, -1.2]} scale={0.36} speed={1.1} />
      <FloatingRock position={[3.1, -1.4, -1.5]} scale={0.24} speed={1.5} />
      <FloatingRock position={[2.6, 1.7, -1.9]} scale={0.18} speed={1.9} />

      <ThreatObject3D active={simulationActive} phase={phase} scenario={scenario} />
      <HeroAvoidanceArc active={phase === 'evade' || phase === 'safe'} />
      <HeroImpactPulse active={phase === 'danger'} />

      <OrbitControls
        ref={controlsRef}
        enableZoom={!simulationActive}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.65}
        zoomSpeed={0.85}
        minDistance={4.8}
        maxDistance={10}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.55}
      />
    </Canvas>
  );
}

function SceneThreeCanvas({ type }) {
  return (
    <Canvas dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 6.4]} fov={46} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 2]} intensity={2} color="#8be9ff" />
      <pointLight position={[-2, -1, 1]} intensity={1.3} color="#ff7de3" />
      <fog attach="fog" args={['#08101f', 5, 13]} />
      <Stars radius={50} depth={18} count={1800} factor={2.6} fade speed={0.6} />
      <SceneCore3D type={type} />
    </Canvas>
  );
}

function SceneCore3D({ type }) {
  const isMeteor = type.includes('meteor');
  const isDebris = type.includes('debris');
  const isSatellite = type.includes('satellite');
  const isAvoid = type.includes('avoid');

  return (
    <>
      <CinematicCamera />
      <SatelliteModel3D position={[0, 0, 0]} />
      <OrbitRing3D radius={2.15} color="#7adfff" opacity={0.28} speed={0.25} />
      <OrbitRing3D radius={2.65} color="#f08cff" opacity={0.16} speed={-0.18} tilt={0.9} />

      {isMeteor && (
        <MeteorModel3D
          position={isAvoid ? [-2.2, 1.2, -0.7] : [-2.8, 0.9, -0.4]}
          avoid={isAvoid}
        />
      )}

      {isDebris && (
        <>
          <DebrisField3D center={isAvoid ? [-2, 1, -1] : [-2.2, 0.6, -0.8]} spread={0.95} />
          <DebrisField3D center={isAvoid ? [2.1, -0.8, -1.2] : [2.4, 1.2, -0.7]} spread={0.6} small />
        </>
      )}

      {isSatellite && (
        <HostileSatellite3D
          position={isAvoid ? [2.3, 1.1, -0.8] : [-2.4, 0.2, -0.8]}
          avoid={isAvoid}
        />
      )}

      {isMeteor && !isAvoid && <ExplosionEffect />}
      {isAvoid && <AvoidancePath />}
      <TargetHUD />
    </>
  );
}
function CinematicCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.2) * 0.6;
    camera.position.y = Math.sin(t * 0.3) * 0.4;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function HeroCameraRig({ phase, cameraMode }) {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    let target = { x: 0, y: 0.25, z: 7.2 };

    if (cameraMode === 'threat') {
      target = { x: -1.6, y: 0.5, z: 5.4 };
    } else if (cameraMode === 'evade') {
      target = { x: 1.25, y: 0.85, z: 5.8 };
    }

    camera.position.x += (target.x - camera.position.x) * 0.045;
    camera.position.y += ((target.y + Math.sin(t * 0.4) * 0.08) - camera.position.y) * 0.045;
    camera.position.z += (target.z - camera.position.z) * 0.045;
    camera.lookAt(0, 0, 0);

    if (phase === 'danger') {
      camera.rotation.z = Math.sin(t * 8) * 0.01;
    } else {
      camera.rotation.z *= 0.9;
    }
  });

  return null;
}

function SatelliteModel3D({ position = [0, 0, 0], interactive = true, phase = 'idle' }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;

    if (interactive) {
      ref.current.position.x = position[0];
      ref.current.position.y = position[1];
      ref.current.position.z = position[2];
      return;
    }

    if (phase === 'tracking' || phase === 'danger') {
      ref.current.position.x += (0 - ref.current.position.x) * 0.05;
      ref.current.position.y += (0 - ref.current.position.y) * 0.05;
    }

    if (phase === 'evade') {
      ref.current.position.x += (1.45 - ref.current.position.x) * 0.045;
      ref.current.position.y += (0.85 - ref.current.position.y) * 0.045;
      ref.current.rotation.z += (0.35 - ref.current.rotation.z) * 0.04;
    } else if (phase === 'safe') {
      ref.current.position.x += (0.45 - ref.current.position.x) * 0.03;
      ref.current.position.y += (0.18 - ref.current.position.y) * 0.03;
      ref.current.rotation.z += (0 - ref.current.rotation.z) * 0.04;
    }

    ref.current.rotation.y += 0.01;
    ref.current.rotation.x = Math.sin(t * 1.2) * 0.08;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[1.15, 0.82, 0.82]} />
        <meshStandardMaterial color="#cfd8e3" metalness={0.72} roughness={0.26} />
      </mesh>
      <mesh position={[-1.45, 0, 0]}>
        <boxGeometry args={[1.12, 0.05, 0.62]} />
        <meshStandardMaterial color="#2a7cff" emissive="#7fe7ff" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[1.45, 0, 0]}>
        <boxGeometry args={[1.12, 0.05, 0.62]} />
        <meshStandardMaterial color="#2a7cff" emissive="#7fe7ff" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[0, 0, 0.46]}>
        <planeGeometry args={[0.44, 0.3]} />
        <meshStandardMaterial color="#091527" emissive="#56e0ff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function OrbitRing3D({ radius, color, opacity, speed, tilt = 1.57 }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.018, 14, 120]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function FloatingRock({ position = [0, 0, 0], scale = 0.3, speed = 1.2 }) {
  const ref = useRef();
  const seed = useMemo(() => Math.random() * 10, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + seed;
    if (ref.current) {
      ref.current.rotation.x = t * 0.45;
      ref.current.rotation.y = t * 0.35;
      ref.current.position.y = position[1] + Math.sin(t) * 0.18;
      ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.08;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#7f5b4d" roughness={0.95} metalness={0.08} />
    </mesh>
  );
}

function ThreatObject3D({ active, phase, scenario = 'debris' }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    if (!active) {
      ref.current.visible = false;
      return;
    }

    ref.current.visible = true;

    if (phase === 'tracking') {
      ref.current.position.x = -4 + (t % 4) * 0.7;
      ref.current.position.y = 1.2 - (t % 4) * 0.18;
      ref.current.position.z = -0.6;
    } else if (phase === 'danger') {
      ref.current.position.x += (0.55 - ref.current.position.x) * 0.04;
      ref.current.position.y += (0.08 - ref.current.position.y) * 0.04;
      ref.current.position.z += (-0.25 - ref.current.position.z) * 0.04;
    } else if (phase === 'evade') {
      ref.current.position.x += (-1.8 - ref.current.position.x) * 0.05;
      ref.current.position.y += (1.35 - ref.current.position.y) * 0.05;
      ref.current.position.z += (-0.7 - ref.current.position.z) * 0.05;
    } else if (phase === 'safe') {
      ref.current.position.x += (-3.6 - ref.current.position.x) * 0.03;
      ref.current.position.y += (1.8 - ref.current.position.y) * 0.03;
      ref.current.position.z += (-1.2 - ref.current.position.z) * 0.03;
    }

    ref.current.rotation.x += 0.03;
    ref.current.rotation.y += 0.02;
  });

  return (
    <group ref={ref} position={[-4, 1.2, -0.6]}>
      {scenario === 'debris' && (
        <>
          <mesh>
            <icosahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial color="#8b6f5a" roughness={0.88} metalness={0.08} />
          </mesh>
          <mesh position={[-0.5, 0, 0]} rotation={[0, 0, 1.3]}>
            <coneGeometry args={[0.12, 0.9, 12]} />
            <meshBasicMaterial color="#ffb26b" transparent opacity={0.48} />
          </mesh>
        </>
      )}

      {scenario === 'asteroid' && (
        <>
          <mesh>
            <sphereGeometry args={[0.48, 24, 24]} />
            <meshStandardMaterial color="#5a3b2e" roughness={1} metalness={0.04} />
          </mesh>
          <mesh position={[-0.7, 0, 0]} rotation={[0, 0, 1.2]}>
            <coneGeometry args={[0.16, 1.25, 16]} />
            <meshBasicMaterial color="#ffb26b" transparent opacity={0.42} />
          </mesh>
        </>
      )}

      {scenario === 'satellite' && (
        <>
          <mesh>
            <boxGeometry args={[0.82, 0.56, 0.56]} />
            <meshStandardMaterial color="#d8deea" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.82, 0, 0]}>
            <boxGeometry args={[0.56, 0.04, 0.32]} />
            <meshStandardMaterial color="#ff4f8b" emissive="#ff4f8b" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.82, 0, 0]}>
            <boxGeometry args={[0.56, 0.04, 0.32]} />
            <meshStandardMaterial color="#ff4f8b" emissive="#ff4f8b" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}

function HeroAvoidanceArc({ active }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.visible = active;
      ref.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3.15, 0.025, 16, 240]} />
      <meshBasicMaterial color="#7df1ff" transparent opacity={0.55} />
    </mesh>
  );
}

function HeroImpactPulse({ active }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    ref.current.visible = active;
    if (active) {
      const s = 1 + Math.sin(t * 6) * 0.12;
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[1.75, 1.92, 64]} />
      <meshBasicMaterial color="#ff6b88" transparent opacity={0.45} />
    </mesh>
  );
}

function MeteorModel3D({ position = [-2.5, 1, -0.5], avoid = false }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = t * 0.8;
      ref.current.rotation.y = t * 0.5;
      ref.current.position.x = position[0] + Math.cos(t * 0.7) * (avoid ? 0.22 : 0.08);
      ref.current.position.y = position[1] + Math.sin(t) * 0.14;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#885841" roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh position={[-0.65, 0, 0]} rotation={[0, 0, 1.3]}>
        <coneGeometry args={[0.16, 1.2, 12]} />
        <meshBasicMaterial color="#ffb26b" transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

function DebrisField3D({ center = [0, 0, 0], spread = 0.8, small = false }) {
  const pieces = useMemo(() => {
    const count = small ? 4 : 7;
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      offset: [
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * 0.8,
      ],
      scale: small ? 0.08 + Math.random() * 0.08 : 0.1 + Math.random() * 0.12,
    }));
  }, [spread, small]);

  return (
    <group position={center}>
      {pieces.map((piece) => (
        <DebrisPiece3D key={piece.key} offset={piece.offset} scale={piece.scale} />
      ))}
    </group>
  );
}

function DebrisPiece3D({ offset, scale }) {
  const ref = useRef();
  const seed = useMemo(() => Math.random() * 10, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + seed;
    if (ref.current) {
      ref.current.rotation.x = t * 0.8;
      ref.current.rotation.y = t * 0.5;
      ref.current.position.y = offset[1] + Math.sin(t) * 0.05;
    }
  });

  return (
    <mesh ref={ref} position={offset} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#bdefff" roughness={0.82} metalness={0.12} />
    </mesh>
  );
}

function HostileSatellite3D({ position = [-2.2, 0.2, -0.8], avoid = false }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = -t * 0.26;
      ref.current.position.x = position[0] + Math.cos(t * 0.55) * (avoid ? 0.2 : 0.07);
      ref.current.position.y = position[1] + Math.sin(t * 0.9) * 0.12;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[0.92, 0.62, 0.62]} />
        <meshStandardMaterial color="#d7deec" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[-1.05, 0, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.42]} />
        <meshStandardMaterial color="#8e68ff" emissive="#d28cff" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[1.05, 0, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.42]} />
        <meshStandardMaterial color="#8e68ff" emissive="#d28cff" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.38]}>
        <sphereGeometry args={[0.12, 18, 18]} />
        <meshStandardMaterial color="#ff8ef5" emissive="#ff8ef5" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

function ExplosionEffect() {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => i), []);
  return (
    <group>
      {particles.map((i) => (
        <ExplosionParticle key={i} />
      ))}
    </group>
  );
}

function ExplosionParticle() {
  const ref = useRef();
  const velocity = useMemo(
    () => [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
    []
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += velocity[0] * delta;
      ref.current.position.y += velocity[1] * delta;
      ref.current.position.z += velocity[2] * delta;
      ref.current.scale.multiplyScalar(0.98);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#ff8a3c" />
    </mesh>
  );
}

function AvoidancePath() {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) ref.current.rotation.z += 0.01;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.8, 0.02, 16, 200]} />
      <meshBasicMaterial color="#7df1ff" transparent opacity={0.5} />
    </mesh>
  );
}

function TargetHUD() {
  return (
    <mesh position={[0, 0, 0]}>
      <ringGeometry args={[1.6, 1.7, 64]} />
      <meshBasicMaterial color="#00eaff" transparent opacity={0.4} />
    </mesh>
  );
}

function TransitionFX({ active }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? [0, 0.6, 0] : 0 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="transition-fx"
    />
  );
}

function ShockwavePulse() {
  return (
    <>
      <motion.div
        animate={{ scale: [0.7, 1.4], opacity: [0.45, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
        className="shockwave a"
      />
      <motion.div
        animate={{ scale: [0.86, 1.7], opacity: [0.28, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut', delay: 0.22 }}
        className="shockwave b"
      />
    </>
  );
}

function ScreenShakeLayer() {
  return (
    <motion.div
      animate={{ x: [0, -6, 5, -4, 3, 0], y: [0, 3, -2, 2, -1, 0] }}
      transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 1.2 }}
      className="shake-layer"
    />
  );
}

function AvoidanceTrailOverlay() {
  return (
    <>
      <motion.div
        animate={{ opacity: [0.18, 0.5, 0.18], scale: [0.96, 1.03, 0.96] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="avoid-ring"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="avoid-svg"
      >
        <svg className="full-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M8,72 C24,34 50,20 72,46 S92,74 88,20"
            fill="none"
            stroke="rgba(125,241,255,.7)"
            strokeWidth="0.45"
            strokeDasharray="2 2"
          />
        </svg>
      </motion.div>
    </>
  );
}

function PhotoAsset({ src, alt, styleClass = '', floatType = 'default' }) {
  const animation =
    floatType === 'satellite'
      ? { y: [10, -12, 10], rotate: [-1, 1.5, -1] }
      : floatType === 'meteor'
        ? { y: [-8, 10, -8], x: [0, 8, 0], rotate: [-2, 2, -2] }
        : floatType === 'debris'
          ? { y: [-10, 12, -10], rotate: [-3, 4, -3] }
          : { y: [10, -10, 10], rotate: [2, -2, 2] };

  return (
    <motion.div
      animate={animation}
      transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
      className={styleClass}
    >
      <div className="photo-asset-frame">
        <img src={src} alt={alt} className="photo-asset-image" />
        <div className="photo-asset-overlay" />
      </div>
    </motion.div>
  );
}

function PlanetGlow({ styleClass = '' }) {
  return (
    <motion.div
      animate={{ y: [8, -10, 8], scale: [1, 1.06, 1] }}
      transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
      className={styleClass}
    >
      <div className="planet-glow" />
    </motion.div>
  );
}

function StarShard({ styleClass = '', reverse = false }) {
  return (
    <motion.div
      animate={{ y: reverse ? [10, -12, 10] : [-10, 14, -10], x: [0, reverse ? -6 : 6, 0] }}
      transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
      className={styleClass}
    >
      <div className="star-shard" />
    </motion.div>
  );
}

function ImpactObject({ type }) {
  const isMeteor = type.includes('meteor');
  const isDebris = type.includes('debris');
  const isSatellite = type.includes('satellite');

  return (
    <>
      {isMeteor && (
        <PhotoAsset
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80"
          alt="meteor threat"
          floatType="meteor"
          styleClass="asset meteor-impact"
        />
      )}

      {isDebris && (
        <>
          <PhotoAsset
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
            alt="space debris"
            floatType="debris"
            styleClass="asset debris-a"
          />
          <PhotoAsset
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
            alt="space debris"
            floatType="debris"
            styleClass="asset debris-b"
          />
        </>
      )}

      {isSatellite && (
        <PhotoAsset
          src="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80"
          alt="hostile satellite"
          floatType="hostile"
          styleClass="asset hostile-a"
        />
      )}
    </>
  );
}

function AvoidObject({ type }) {
  const isMeteor = type.includes('meteor');
  const isDebris = type.includes('debris');
  const isSatellite = type.includes('satellite');

  return (
    <>
      {isMeteor && (
        <PhotoAsset
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80"
          alt="meteor"
          floatType="meteor"
          styleClass="asset meteor-avoid"
        />
      )}

      {isDebris && (
        <>
          <PhotoAsset
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
            alt="space debris"
            floatType="debris"
            styleClass="asset debris-c"
          />
          <PhotoAsset
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
            alt="space debris"
            floatType="debris"
            styleClass="asset debris-d"
          />
        </>
      )}

      {isSatellite && (
        <PhotoAsset
          src="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80"
          alt="hostile satellite"
          floatType="hostile"
          styleClass="asset hostile-b"
        />
      )}

      <svg className="full-svg avoid-path" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M14,60 C28,22 54,22 70,54 S90,72 88,28"
          fill="none"
          stroke="rgba(120,230,255,.85)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          initial={{ pathLength: 0.15, opacity: 0.35 }}
          whileInView={{ pathLength: 1, opacity: 0.95 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
        />
      </svg>
    </>
  );
}

const globalStyles = `
  * { box-sizing: border-box; }
  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    background: #050816;
    color: white;
    font-family: Inter, system-ui, Arial, sans-serif;
  }
  body { overflow-x: hidden; }
  a { color: inherit; text-decoration: none; }
  button { font: inherit; cursor: pointer; }
  img { display: block; }

  .app-shell {
    min-height: 100vh;
    background: #050816;
    color: white;
    overflow-x: hidden;
    position: relative;
  }

  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    z-index: 200;
    background: linear-gradient(90deg, #ec4899, #67e8f9, #ec4899);
  }

  .bg-fixed {
    pointer-events: none;
    position: fixed;
    inset: 0;
    overflow: hidden;
  }

  .bg-layer {
    position: absolute;
    inset: 0;
  }

  .bg-layer.one {
    opacity: .9;
    background:
      radial-gradient(circle at 18% 18%, rgba(255,88,180,.18), transparent 24%),
      radial-gradient(circle at 78% 16%, rgba(100,120,255,.18), transparent 24%),
      radial-gradient(circle at 60% 76%, rgba(30,185,255,.16), transparent 28%),
      linear-gradient(180deg, #090b1d 0%, #070816 48%, #050611 100%);
  }

  .bg-layer.two {
    opacity: .45;
    background-image:
      radial-gradient(white 1px, transparent 1px),
      radial-gradient(rgba(255,255,255,.65) 1px, transparent 1px);
    background-size: 120px 120px, 180px 180px;
    background-position: 0 0, 40px 60px;
  }

  .bg-blob {
    position: absolute;
    border-radius: 999px;
    filter: blur(120px);
  }

  .bg-blob.pink {
    width: 34rem;
    height: 34rem;
    left: -10%;
    top: 10%;
    background: rgba(217, 70, 239, .10);
  }

  .bg-blob.cyan {
    width: 28rem;
    height: 28rem;
    right: -10%;
    bottom: -10%;
    background: rgba(34, 211, 238, .10);
  }

  .floating-hud {
    position: fixed;
    inset-block: 0;
    right: 14px;
    z-index: 60;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .floating-hud-card {
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(10,16,34,.6);
    backdrop-filter: blur(24px);
    padding: 14px 10px;
    display: grid;
    gap: 10px;
  }

  .floating-hud-item {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    color: rgba(255,255,255,.7);
    font-size: 11px;
  }

  .top-nav-wrap {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    padding: 18px 16px;
  }

  .top-nav {
    max-width: 1480px;
    margin: 0 auto;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(11,16,36,.55);
    backdrop-filter: blur(24px);
    box-shadow: 0 10px 40px rgba(0,0,0,.35);
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .brand-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-circle {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(240,171,252,.2);
    background: rgba(232,121,249,.12);
    color: #f7d8ff;
  }

  .brand-title {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: .28em;
  }

  .brand-sub {
    font-size: 10px;
    color: rgba(255,255,255,.45);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 26px;
    color: rgba(255,255,255,.72);
    font-size: 14px;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-btn {
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    color: rgba(255,255,255,.86);
    border-radius: 999px;
    padding: 10px 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary,
  .btn-secondary {
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    transition: .25s ease;
    border: none;
  }

  .btn-primary {
    background: linear-gradient(90deg, #ec4899, #d946ef);
    color: white;
    padding: 14px 28px;
    box-shadow: 0 12px 28px rgba(112,26,117,.38);
  }

  .btn-primary.small {
    padding: 10px 16px;
    font-size: 14px;
  }

  .btn-primary:disabled,
  .scenario-tabs button:disabled {
    opacity: .65;
    cursor: not-allowed;
  }

  .btn-secondary {
    border: 1px solid rgba(255,255,255,.14);
    background: rgba(255,255,255,.05);
    color: rgba(255,255,255,.9);
    padding: 14px 28px;
  }

  .hero-btn-reset {
    appearance: none;
  }

  .main-content {
    position: relative;
    z-index: 10;
  }

  .container {
    width: min(1480px, calc(100% - 28px));
    margin-inline: auto;
  }

  .hero-section {
    min-height: 100vh;
    padding: 140px 0 50px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .hero-section-stacked {
    align-items: flex-start;
  }

  .hero-top-content {
    text-align: center;
    max-width: 1080px;
    margin: 0 auto 28px;
  }

  .eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    border: 1px solid rgba(232,121,249,.22);
    background: rgba(232,121,249,.10);
    color: #f5d0fe;
    padding: 10px 16px;
    margin-bottom: 22px;
    font-size: 11px;
    letter-spacing: .28em;
  }

  .hero-title {
    margin: 0;
    font-size: clamp(3rem, 8vw, 6.4rem);
    line-height: .95;
    font-weight: 900;
  }

  .hero-title span {
    display: block;
    background: linear-gradient(90deg, #f0abfc, #fff, #67e8f9);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hero-title-centered span,
  .hero-text-centered {
    display: block;
    margin-inline: auto;
  }

  .hero-text,
  .section-text,
  .card-text,
  .scene-text {
    color: rgba(255,255,255,.74);
    line-height: 1.9;
  }

  .hero-text {
    margin-top: 24px;
    font-size: clamp(17px, 2vw, 21px);
    max-width: 860px;
  }

  .hero-actions {
    margin-top: 34px;
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .hero-actions.center,
  .hero-actions-centered {
    justify-content: center;
  }

  .scenario-tabs {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .scenario-tabs button {
    padding: 10px 16px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: white;
    transition: 0.3s;
  }

  .scenario-tabs button:hover,
  .scenario-tabs button.active {
    background: rgba(255,255,255,0.2);
    border-color: rgba(103,232,249,.4);
    box-shadow: 0 0 0 1px rgba(103,232,249,.18) inset;
  }

  .hero-science-grid {
    margin-top: 34px;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 14px;
  }

  .hero-science-card {
    border-radius: 22px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    backdrop-filter: blur(18px);
    padding: 18px;
    text-align: center;
  }

  .hero-science-label {
    color: rgba(255,255,255,.58);
    font-size: 12px;
    letter-spacing: .14em;
    margin-bottom: 10px;
  }

  .hero-science-value {
    font-size: 28px;
    font-weight: 900;
  }

  .hero-science-value-sm {
    font-size: 22px;
  }

  .hero-visual-wrap {
    min-height: 620px;
    position: relative;
  }

  .hero-visual-wrap-full {
    width: 100%;
    min-height: 720px;
  }

  .hero-visual-root {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 620px;
  }

  .hero-visual-root-wide,
  .hero-visual-frame-wide {
    min-height: 720px;
  }

  .hero-glow-box {
    position: absolute;
    inset: 0;
    border-radius: 42px;
    border: 1px solid rgba(255,255,255,.1);
    background:
      radial-gradient(circle at 50% 35%, rgba(80,180,255,.16), transparent 20%),
      radial-gradient(circle at 22% 22%, rgba(255,80,180,.12), transparent 18%),
      linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
    box-shadow: 0 30px 80px rgba(0,0,0,.45);
    backdrop-filter: blur(10px);
  }

  .hero-visual-frame {
    position: absolute;
    inset: 20px;
    overflow: hidden;
    border-radius: 34px;
    border: 1px solid rgba(255,255,255,.1);
    background: linear-gradient(180deg, rgba(6,9,21,.3), rgba(6,9,21,.65));
  }

  .canvas-fill {
    position: absolute;
    inset: 0;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    background: linear-gradient(180deg, rgba(6,9,21,.16), rgba(6,9,21,.42));
    pointer-events: none;
  }

  .hero-reset-view {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 35;
    width: 46px;
    height: 46px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.14);
    background: rgba(8,12,24,.55);
    color: white;
    display: grid;
    place-items: center;
    backdrop-filter: blur(18px);
    box-shadow: 0 12px 30px rgba(0,0,0,.3);
  }

  .hero-live-hud {
    position: absolute;
    inset-inline: 24px;
    top: 24px;
    z-index: 30;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
    pointer-events: none;
  }

  .hero-live-pill {
    border-radius: 999px;
    padding: 11px 18px;
    font-size: 11px;
    letter-spacing: .24em;
    border: 1px solid rgba(255,255,255,.14);
    background: rgba(8,12,24,.45);
    backdrop-filter: blur(18px);
  }

  .hero-live-pill.danger {
    color: #ffe4e6;
    background: rgba(244,63,94,.15);
    border-color: rgba(253,164,175,.2);
  }

  .hero-live-pill.evade,
  .hero-live-pill.safe {
    color: #ecfeff;
    background: rgba(34,211,238,.12);
    border-color: rgba(165,243,252,.18);
  }

  .hero-live-panel {
    width: min(320px, 100%);
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(8,12,24,.42);
    backdrop-filter: blur(18px);
    padding: 16px;
  }

  .hero-live-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(255,255,255,.88);
    margin-bottom: 8px;
    font-size: 14px;
  }

  .hero-live-bar {
    height: 8px;
    border-radius: 999px;
    background: rgba(255,255,255,.08);
    overflow: hidden;
    margin-bottom: 14px;
  }

  .hero-live-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #fb7185, #f59e0b, #67e8f9);
  }

  .scroll-hint {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: .3em;
    color: rgba(255,255,255,.5);
  }

  .section {
    padding: 70px 0;
  }

  .section.compact {
    padding: 20px 0 26px;
  }

  .avoidance-zone {
    padding-top: 10px;
  }

  .avoidance-grid {
    display: grid;
    gap: 24px;
  }

  .avoidance-scene-card {
    border-radius: 38px;
    border: 1px solid rgba(255,255,255,.1);
    background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.025));
    backdrop-filter: blur(22px);
    padding: 28px;
    box-shadow: 0 24px 60px rgba(0,0,0,.34);
  }

  .avoidance-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 22px;
  }

  .avoidance-title {
    margin-bottom: 10px;
  }

  .avoidance-copy {
    max-width: 820px;
    margin: 0;
  }

  .avoidance-scene-grid {
    display: grid;
    grid-template-columns: 1.35fr .95fr;
    gap: 18px;
    align-items: stretch;
  }

  .avoidance-scene-visual {
    min-height: 420px;
  }

  .scene-visual-soft,
  .avoidance-visual-frame {
    position: relative;
    overflow: hidden;
    min-height: 420px;
    border-radius: 30px;
    border: 1px solid rgba(255,255,255,.1);
    background: linear-gradient(180deg, rgba(6,9,21,.3), rgba(6,9,21,.65));
  }

  .avoidance-pill {
    position: absolute;
    right: 22px;
    top: 22px;
    z-index: 25;
    border-radius: 999px;
    padding: 10px 16px;
    font-size: 11px;
    letter-spacing: .22em;
    border: 1px solid rgba(165,243,252,.18);
    background: rgba(34,211,238,.1);
    color: #ecfeff;
    backdrop-filter: blur(18px);
  }

  .avoidance-pill.warning {
    background: rgba(251,113,133,.14);
    border-color: rgba(253,164,175,.2);
    color: #ffe4e6;
  }

  .avoidance-pill.repel,
  .avoidance-pill.safe {
    background: rgba(34,211,238,.14);
  }

  .avoidance-info-side {
    display: grid;
    gap: 16px;
  }

  .avoidance-mini-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .avoidance-status-box {
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    padding: 20px;
  }

  .avoidance-status-title {
    font-size: 13px;
    letter-spacing: .18em;
    color: rgba(165,243,252,.82);
    margin-bottom: 10px;
  }

  .avoidance-status-text {
    font-size: 17px;
    color: rgba(255,255,255,.88);
    line-height: 1.8;
    margin-bottom: 18px;
  }

  .status-track.large {
    height: 10px;
  }

  .panel-grid,
  .timeline-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .glass-card,
  .metric-card,
  .scene-card,
  .final-card {
    border: 1px solid rgba(255,255,255,.1);
    background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
    backdrop-filter: blur(20px);
    box-shadow: 0 20px 60px rgba(0,0,0,.35);
  }

  .glass-card {
    border-radius: 34px;
    padding: 28px;
  }

  .section-eyebrow {
    margin-bottom: 10px;
    font-size: 12px;
    letter-spacing: .3em;
  }

  .section-eyebrow.pink { color: rgba(245,208,254,.82); }
  .section-eyebrow.cyan { color: rgba(165,243,252,.82); }

  .section-title {
    margin: 0;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 900;
    line-height: 1.05;
  }

  .section-title-md {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 900;
    line-height: 1.1;
  }

  .badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }

  .badge {
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    padding: 10px 14px;
    font-size: 13px;
    color: rgba(255,255,255,.82);
  }

  .control-list {
    display: grid;
    gap: 12px;
  }

  .control-btn {
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    color: rgba(255,255,255,.9);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .control-btn.danger {
    border-color: rgba(253,164,175,.16);
    background: rgba(251,113,133,.10);
    color: #ffe4e6;
  }

  .control-btn.safe {
    border-color: rgba(165,243,252,.16);
    background: rgba(34,211,238,.10);
    color: #ecfeff;
  }

  .metrics-grid,
  .cards-grid.three {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .cards-grid.three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .metric-card {
    border-radius: 28px;
    padding: 24px;
  }

  .metric-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    color: rgba(255,255,255,.65);
  }

  .metric-card-label {
    font-size: 14px;
    letter-spacing: .18em;
  }

  .metric-card-value {
    font-size: 42px;
    font-weight: 900;
  }

  .max-text {
    max-width: 850px;
    margin-bottom: 40px;
  }

  .system-card {
    padding: 28px;
  }

  .icon-box {
    width: 56px;
    height: 56px;
    display: grid;
    place-items: center;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(232,121,249,.10);
    color: #f6d7ff;
    margin-bottom: 18px;
  }

  .icon-box.small {
    width: 44px;
    height: 44px;
    border-radius: 14px;
  }

  .card-title {
    margin: 0 0 10px;
    font-size: 28px;
    font-weight: 800;
  }

  .card-text {
    margin: 0;
    font-size: 18px;
  }

  .stack {
    display: grid;
    gap: 24px;
  }

  .scene-card {
    border-radius: 40px;
    padding: 28px;
  }

  .scene-grid {
    min-height: 76vh;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    align-items: center;
  }

  .scene-grid.reverse > :first-child {
    order: 2;
  }

  .scene-copy {
    max-width: 560px;
  }

  .scene-title {
    margin: 0;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 900;
    line-height: 1.08;
  }

  .scene-text {
    font-size: clamp(18px, 2vw, 21px);
    margin-top: 18px;
  }

  .scene-line {
    margin-top: 28px;
    width: 160px;
    height: 1px;
    background: linear-gradient(90deg, rgba(232,121,249,.8), rgba(255,255,255,.5), transparent);
  }

  .scene-visual-slot {
    position: relative;
    min-height: 560px;
  }

  .scene-visual {
    position: relative;
    width: 100%;
    height: 560px;
    overflow: hidden;
    border-radius: 34px;
    border: 1px solid rgba(255,255,255,.1);
    background:
      radial-gradient(circle at 50% 15%, rgba(128,102,255,.18), transparent 22%),
      radial-gradient(circle at 50% 80%, rgba(0,190,255,.14), transparent 32%),
      linear-gradient(180deg,#080b18,#0b1228);
    box-shadow: inset 0 0 40px rgba(0,0,0,.3);
  }

  .scene-canvas-layer {
    z-index: 0;
    opacity: .9;
  }

  .scene-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(180deg, rgba(8,11,24,.12), rgba(8,11,24,.22));
  }

  .star-layer {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .star {
    position: absolute;
    border-radius: 999px;
    background: rgba(255,255,255,.7);
  }

  .star.a { left: 12%; top: 16%; width: 8px; height: 8px; }
  .star.b { left: 22%; top: 62%; width: 6px; height: 6px; opacity: .8; }
  .star.c { right: 18%; top: 18%; width: 8px; height: 8px; opacity: .9; }
  .star.d { right: 12%; bottom: 22%; width: 6px; height: 6px; opacity: .7; }

  .beam-line {
    position: absolute;
    inset-inline: 12%;
    top: 50%;
    z-index: 4;
    height: 2px;
    transform: translateY(-50%);
    background: linear-gradient(90deg, rgba(251,146,60,.8), rgba(244,114,182,.7), rgba(103,232,249,.55));
  }

  .scene-center-halo {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 13rem;
    height: 13rem;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    border: 1px solid rgba(186,230,253,.3);
    background: rgba(103,232,249,.08);
    z-index: 3;
  }

  .asset {
    position: absolute;
    z-index: 10;
  }

  .hero-meteor { left: 12%; top: 18%; width: 180px; height: 92px; }
  .hero-shard { right: 14%; bottom: 20%; width: 128px; height: 24px; transform: rotate(18deg); position: absolute; z-index: 10; }
  .hero-planet { right: 12%; top: 16%; width: 96px; height: 96px; position: absolute; z-index: 10; }

  .meteor-impact { left: 6%; top: 24%; width: 220px; height: 90px; transform: rotate(8deg); }
  .meteor-avoid { left: 14%; top: 18%; width: 180px; height: 80px; transform: rotate(20deg); opacity: .85; }

  .debris-a { left: 10%; top: 24%; width: 150px; height: 150px; }
  .debris-b { right: 14%; top: 16%; width: 110px; height: 110px; }
  .debris-c { left: 12%; top: 30%; width: 120px; height: 120px; opacity: .8; }
  .debris-d { right: 12%; top: 20%; width: 90px; height: 90px; opacity: .7; }

  .hostile-a { left: 10%; top: 30%; width: 130px; height: 130px; }
  .hostile-b { right: 10%; top: 18%; width: 120px; height: 120px; opacity: .8; }

  .photo-asset-frame {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,.15);
    background: rgba(255,255,255,.05);
    box-shadow: 0 25px 40px rgba(0,0,0,.35);
    position: relative;
  }

  .photo-asset-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .photo-asset-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(6,8,18,.05), rgba(6,8,18,.28));
  }

  .planet-glow {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    background:
      radial-gradient(circle at 35% 35%, rgba(255,255,255,.95), rgba(166,230,255,.75) 30%, rgba(98,150,255,.18) 65%, transparent 72%);
    box-shadow: 0 0 45px rgba(180,220,255,.35);
  }

  .star-shard {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.7), rgba(255,255,255,0));
    filter: blur(1px);
  }

  .pill {
    position: absolute;
    z-index: 10;
    border-radius: 999px;
    padding: 10px 16px;
    font-size: 11px;
    letter-spacing: .2em;
    backdrop-filter: blur(20px);
  }

  .pill.alert {
    right: 24px;
    bottom: 24px;
    border: 1px solid rgba(253,164,175,.2);
    background: rgba(244,63,94,.15);
    color: #ffe4e6;
  }

  .pill.safe {
    left: 24px;
    bottom: 24px;
    border: 1px solid rgba(165,243,252,.2);
    background: rgba(34,211,238,.1);
    color: #ecfeff;
  }

  .pill.top-left {
    left: 24px;
    top: 24px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(0,0,0,.2);
    color: rgba(255,255,255,.75);
    font-size: 10px;
    letter-spacing: .28em;
  }

  .pill.top-left.cyan {
    border-color: rgba(165,243,252,.14);
    background: rgba(34,211,238,.1);
    color: #ecfeff;
  }

  .transition-fx {
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 50;
    background: linear-gradient(135deg, rgba(255,255,255,.2), rgba(186,230,253,.08), transparent);
  }

  .shockwave {
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 999px;
    transform: translate(-50%, -50%);
    z-index: 18;
  }

  .shockwave.a {
    width: 14rem;
    height: 14rem;
    border: 1px solid rgba(254,215,170,.4);
  }

  .shockwave.b {
    width: 18rem;
    height: 18rem;
    border: 1px solid rgba(251,113,133,.25);
  }

  .shake-layer {
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 16;
  }

  .avoid-ring {
    pointer-events: none;
    position: absolute;
    inset: 40px;
    z-index: 16;
    border-radius: 999px;
    border: 1px solid rgba(165,243,252,.15);
  }

  .avoid-svg {
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 16;
  }

  .full-svg {
    width: 100%;
    height: 100%;
  }

  .avoid-path {
    position: absolute;
    inset: 0;
    z-index: 10;
  }

  .timeline-list,
  .status-list {
    display: grid;
    gap: 16px;
  }

  .timeline-item {
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,.1);
    background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.025));
    backdrop-filter: blur(20px);
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .timeline-index {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #d946ef, #67e8f9);
    color: #04111f;
    font-weight: 900;
  }

  .timeline-label {
    font-size: 18px;
    color: rgba(255,255,255,.86);
  }

  .mini-card {
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.05);
    padding: 20px;
  }

  .mini-card-label {
    color: rgba(255,255,255,.62);
    font-size: 14px;
  }

  .mini-card-value {
    margin-top: 8px;
    font-size: 32px;
    font-weight: 900;
  }

  .live-card {
    position: relative;
    overflow: hidden;
    border-radius: 36px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(10,16,34,.7);
    backdrop-filter: blur(24px);
    padding: 30px;
  }

  .live-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 20%, rgba(80,180,255,.12), transparent 24%),
      radial-gradient(circle at 70% 70%, rgba(236,72,153,.1), transparent 26%);
  }

  .live-inner {
    position: relative;
    z-index: 1;
  }

  .status-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: rgba(255,255,255,.72);
  }

  .status-track {
    height: 8px;
    border-radius: 999px;
    background: rgba(255,255,255,.1);
    overflow: hidden;
  }

  .status-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #d946ef, #67e8f9);
  }

  .section.final {
    padding-top: 20px;
    padding-bottom: 80px;
  }

  .final-card {
    border-radius: 40px;
    padding: 42px 28px;
    text-align: center;
    background:
      linear-gradient(135deg, rgba(236,72,153,.12), rgba(255,255,255,.04), rgba(34,211,238,.12));
  }

  .final-eyebrow {
    margin-bottom: 12px;
    font-size: 12px;
    letter-spacing: .35em;
    color: rgba(255,255,255,.6);
  }

  .section-text.center {
    text-align: center;
  }

  .section-text.narrow {
    max-width: 760px;
    margin-inline: auto;
  }

  .ready-pill {
    margin-top: 22px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    border: 1px solid rgba(110,231,183,.15);
    background: rgba(74,222,128,.10);
    color: #d1fae5;
    padding: 10px 16px;
    font-size: 11px;
    letter-spacing: .28em;
  }


  .avoidance-dashboard-section {
    padding-top: 18px;
  }

  .avoidance-title-main {
    font-size: clamp(2.8rem, 7vw, 5.2rem);
  }

  @media (max-width: 1200px) {
    .floating-hud { display: none; }
    .hero-science-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 980px) {
    .nav-links,
    .nav-lang {
      display: none !important;
    }

    .panel-grid,
    .timeline-grid,
    .scene-grid,
    .cards-grid.three,
    .metrics-grid,
    .hero-science-grid,
    .avoidance-scene-grid,
    .avoidance-mini-grid {
      grid-template-columns: 1fr;
    }

    .scene-grid.reverse > :first-child {
      order: 0;
    }

    .hero-visual-wrap,
    .hero-visual-root {
      min-height: 460px;
    }

    .hero-visual-wrap-full,
    .hero-visual-root-wide,
    .hero-visual-frame-wide {
      min-height: 520px;
    }

    .scene-visual-slot,
    .scene-visual,
    .avoidance-scene-visual,
    .avoidance-visual-frame {
      min-height: 420px;
      height: 420px;
    }

    .hero-live-hud {
      flex-direction: column;
      align-items: stretch;
    }

    .avoidance-card-header {
      display: grid;
    }
  }

  @media (max-width: 640px) {
    .top-nav {
      padding: 10px 12px;
    }

    .hero-section {
      padding-top: 130px;
    }

    .hero-actions,
    .badge-row,
    .scenario-tabs {
      gap: 10px;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
      justify-content: center;
    }

    .scene-card,
    .glass-card,
    .final-card,
    .metric-card,
    .avoidance-scene-card {
      padding: 20px;
    }
  }

  .media-showcase .max-text { margin-bottom: 20px; }
  .media-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }
  .cinematic-video-card {
    border-radius: 28px;
    padding: 16px;
    border: 1px solid rgba(255,255,255,.1);
    background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
    backdrop-filter: blur(20px);
    box-shadow: 0 20px 60px rgba(0,0,0,.35);
  }
  .video-card-head {
    font-size: 12px;
    letter-spacing: .2em;
    color: rgba(255,255,255,.62);
    margin-bottom: 12px;
  }
  .video-card-screen {
    min-height: 240px;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.04);
  }
  .video-card-screen video {
    display: block;
    width: 100%;
    height: 240px;
    object-fit: cover;
  }
  .video-card-placeholder {
    min-height: 240px;
    display: grid;
    place-items: center;
    color: rgba(255,255,255,.5);
  }
  .video-card-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
  }
  .video-btn {
    width: 42px;
    height: 42px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.06);
    color: white;
    display: grid;
    place-items: center;
  }
  .video-progress-track {
    flex: 1;
    height: 10px;
    border-radius: 999px;
    overflow: hidden;
    background: rgba(255,255,255,.08);
  }
  .video-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #d946ef, #67e8f9);
  }
  .timeline-item {
    appearance: none;
    text-align: right;
  }
  .timeline-item-active {
    box-shadow: 0 0 0 1px rgba(103,232,249,.22) inset;
    background: rgba(103,232,249,.12);
  }
  @media (max-width: 980px) {
    .media-grid {
      grid-template-columns: 1fr;
    }
  }

`;