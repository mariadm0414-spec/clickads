"use client";

import { useState, useEffect } from "react";
import { Home, Play, Sparkles, UploadCloud, Download, Loader2, Key, Layers, ArrowLeft, Users, PlayCircle, LogOut, Plus, Folder, Trash2, ChevronRight, ChevronDown, MessageSquare, ThumbsUp, Send, Library, Save, CheckCircle2, Minus, Bookmark, Palette, Type, Search, Edit3, Heart, Share2, Award, User, HelpCircle, Layout, Globe, TrendingUp, DollarSign, UserCheck, ShieldCheck, Video, X, Settings, Smile, Stethoscope, BookOpen, Newspaper, Calendar, Image, Camera, Box, ShieldAlert, Zap, Brain } from "lucide-react";
import JSZip from "jszip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { imageDB } from "@/app/lib/db";

const LIBRARY_OF_CLOSURES = [
    { cat: "Cierre Directo", text: "¿Te parece bien si te envío el enlace de pago ahora mismo para que aproveches la promoción?" },
    { cat: "Urgencia", text: "Solo me quedan 3 unidades con este descuento especial. ¿Aseguramos la tuya antes de que se agoten?" },
    { cat: "Escasez", text: "Esta oferta expira en menos de 2 horas. Después volverá a su precio original." },
    { cat: "Bono", text: "Si haces el pedido ahora, te incluiré un bono exclusivo de [BONO] totalmente gratis." }
];

const RESEARCH_MODULES = [
    { title: "Identidad y Esencia del Producto", desc: "Clasificación general, posicionamiento comercial y radiografía principal del artículo." },
    { title: "La Gran Promesa Transformadora", desc: "El cambio épico o resultado definitivo que el producto garantiza ofrecer." },
    { title: "Arsenal de Beneficios Específicos", desc: "Desglose exhaustivo de las mejoras físicas, emocionales, estéticas y prácticas." },
    { title: "Anatomía y Características Clave", desc: "Ingredientes, especificaciones técnicas, materiales y detalles constitutivos." },
    { title: "Naturaleza de la Solución", desc: "El enfoque estratégico: prevención, corrección, alivio, mantenimiento u optimización." },
    { title: "El Arma Secreta (Mecánica Funcional)", desc: "Cómo opera internamente y por qué es más eficaz que la competencia convencional." },
    { title: "Catálogo de Frustraciones a Resolver", desc: "Todas las molestias, problemas cotidianos y dolores de cabeza que elimina." },
    { title: "Aspiraciones y Deseos Profundos", desc: "Lo que realmente persigue el cliente: estatus social, bienestar, validación o lujo." },
    { title: "Picos de Dolor Emocional", desc: "La urgencia implacable o insatisfacción que obliga al consumidor a tomar acción inmediata." },
    { title: "Miedos y Preocupaciones Paralizantes", desc: "Temores sociales o inquietudes ocultas que los detienen al momento de elegir." },
    { title: "El Escenario Ideal (Santo Grial)", desc: "La victoria final y el triunfo impecable que el cliente espera con ansias." },
    { title: "Metamorfosis Exacta", desc: "El paso del estado actual hacia el resultado deseado en todos sus niveles posibles." },
    { title: "Contraste Dramático: Antes vs. Después", desc: "El contraste abismal entre su torturosa incomodidad y la nueva brillante realidad." },
    { title: "Núcleo del Valor Percibido", desc: "Dónde perciben la verdadera ganancia: ahorros de tiempo/dinero, eficiencia o prestigio." },
    { title: "Integración Sin Fricciones", desc: "El mejor paso a paso para consumirlo o aplicarlo en la rutina actual de forma automática." },
    { title: "Peligros y Fricciones de Uso", desc: "Posibles complicaciones o errores comunes que el marketing debe prever y limpiar." },
    { title: "Restricciones y Límites Importantes", desc: "Advertencias médicas, incompatibilidades de cuidado o perfiles donde no encaja." },
    { title: "Casillero Mental del Prospecto", desc: "Cómo se juzga inicialmente este producto comparado con su competencia." },
    { title: "Algoritmo Lógico de Compra", desc: "Los filtros racionales, comparativas de características, tiempos y garantías." },
    { title: "Eventos Gatillo de Alta Urgencia", desc: "Esa situación crucial en la vida que los hace sacar la tarjeta de crédito de inmediato." },
    { title: "Bloqueadores Mentales (Objeciones)", desc: "Excusas típicas para posponer y cómo despedazarlas al instante de forma creíble." },
    { title: "El Demonio Final (Barrera de Cierre)", desc: "El gran obstáculo o indecisión final en el check-out y cómo saltar esa pared." },
    { title: "Exigencia de Educación Comercial", desc: "La densidad y claridad que requerirá su Landing Page o material publicitario en vídeo." },
    { title: "Blindaje de Autoridad Absoluta", desc: "Respaldos clave, componentes patentados, demostraciones o asociaciones prestigiosas." },
    { title: "Blueprint de Testimonios Perfectos", desc: "El modelo ideal de reviews hiper-convincentes que necesitamos fabricar y mostrar." },
    { title: "Rapidez de Gratificación", desc: "El tiempo exacto de espera para sentir resultados y cómo retener toda su atención." },
    { title: "Ángulos Estratégicos Novedosos", desc: "Océanos azules absolutos y usos inusuales que la competencia ha ignorado." },
    { title: "El Botón Reptiliano Comercial", desc: "El pilar psicológico más primitivo que justifica esta compra impulsiva sin lugar a dudas." },
    { title: "Pitch de Ventas Ultra-Letal", desc: "La esencia destilada y venenosa en apenas tres frases para disparar alta atención." },
    { title: "Micro-Nichos Desesperados", desc: "Despiece quirúrgico de los nichos periféricos dispuestos a pagar ya mismo." }
];


const MASTER_KEY = "AIzaSyAaByLIiFQIcrBkzuObksCf3Fsx9Ss5PZw";

interface Project {
    id: string;
    name: string;
    productName?: string;
    targetAudience?: string;
    productPreview: string;
    userPrompt: string;
    results: { image: string, title?: string, copy?: string, angle: string, isLanding?: boolean }[];
    updatedAt: number;
    primaryColor?: string;
    secondaryColor?: string;
    font?: string;
    logoPreview?: string;
    referencePreview?: string;
    personPreview?: string;
    type: 'ecommerce' | 'digital';
    idealSolution?: string;
    priceX1?: string;
    priceX2?: string;
    priceX3?: string;
    priceX4?: string; // New
    adPrice?: string;
    adCta?: string;
    bonuses?: string;
    guarantees?: string;
    // States for Landing Page persistency
    landingCategory?: string;
    lPrice1?: string;
    lPrice2?: string;
    lPrice3?: string;
    lPrice4?: string;
    lBefore?: string;
    lAfter?: string;
    lBenefits?: string;
    lCompBrand?: string;
    lCompOthers?: string;
    lTest1?: string;
    lTest2?: string;
    lTest3?: string;
    lAuthExpert?: string;
    lAuthTitle?: string;
    lAuthQuote?: string;
    lUsage?: string;
    lLogistics?: string;
    lFaqs?: { q: string, a: string }[];
}

interface SavedAd {
    id: string;
    image: string;
    angle: string;
    projectName: string;
    savedAt: number;
    copy?: string;
}

interface Comment {
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    timestamp: number;
    isPinned?: boolean;
}

interface Post {
    id: string;
    author: string;
    authorAvatar: string;
    category: 'all' | 'presentacion' | 'soporte' | 'logros';
    content: string;
    timestamp: number;
    likes: number;
    likedByMe?: boolean;
    comments: Comment[];
    image?: string;
}

interface VideoContent {
    id: string;
    title: string;
    youtubeUrl: string;
    likes: number;
    likedByMe?: boolean;
    comments: Comment[];
}

interface Module {
    id: string;
    title: string;
    cover: string;
    videos: VideoContent[];
}

const CANVA_PRESETS = [
    "#000000", "#FFFFFF", "#666666", "#999999", "#CCCCCC", "#EEEEEE",
    "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#9900FF", "#FF00FF",
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50"
];

const GOOGLE_FONTS = [
    "Inter", "Poppins", "Montserrat", "Roboto", "Outfit", "Sora", "Lexend", "Archivo", "Syne", "Urbanist",
    "Jost", "Manrope", "Plus Jakarta Sans", "Space Grotesk", "DM Sans"
];

const INITIAL_POSTS: Post[] = [];

const getIconColor = (color?: string) => {
    if (!color) return "#8B5CF6";
    try {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma < 40 ? "#FFFFFF" : color;
    } catch {
        return color;
    }
};

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [activeTab, setActiveTab] = useState<string>("home");
    const [streakDays, setStreakDays] = useState(0);
    const [weekActivity, setWeekActivity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [apiKey, setApiKey] = useState("");
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [selectedRatio, setSelectedRatio] = useState<'4:5' | '9:16' | 'both'>('both');

    // Novedad: Output Size & Language para Creativos
    const [selectedOutputSize, setSelectedOutputSize] = useState("1024x1024");
    const [isFinAIOn, setIsFinAIOn] = useState(false);
    const [finAIResult, setFinAIResult] = useState("");
    const [selectedOutputLanguage, setSelectedOutputLanguage] = useState("Español");

    // Estados para Refinamiento de Piezas
    const [refiningIndex, setRefiningIndex] = useState<number | null>(null);
    const [refiningText, setRefiningText] = useState("");
    const [isRefining, setIsRefining] = useState(false);
    const [showLandingRefine, setShowLandingRefine] = useState(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const OUTPUT_SIZES = [
        { label: "Móvil Landing (447x800)", value: "447x800" },
        { label: "Original Vertical 4:5", value: "1080x1350" },
        { label: "Facebook/LinkedIn (1200x628)", value: "1.91:1" },
        { label: "Instagram Cuadrado (1080x1080)", value: "1:1" },
        { label: "Instagram Stories (1080x1920)", value: "9:16" },
        { label: "YouTube/HD (1920x1080)", value: "16:9" },
        { label: "Banner Medium (300x250)", value: "1.2:1" },
        { label: "Leaderboard (728x90)", value: "8:1" },
        { label: "Skyscraper (160x600)", value: "1:4" }
    ];
    const OUTPUT_LANGS = [
        "Español", "Inglés", "Portugués", "Francés", "Alemán",
        "Italiano", "Neerlandés", "Ruso", "Chino", "Japonés",
        "Coreano", "Árabe", "Hindi", "Turco", "Polaco"
    ];

    // Auth Protection RESTORED - Selective access check
    useEffect(() => {
        const savedUser = localStorage.getItem("clickads_user");
        if (!savedUser) {
            router.push("/login");
        } else {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Auth parse error:", e);
                localStorage.removeItem("clickads_user");
                router.push("/login");
            }
        }

        // Admin Mode state recovery
        const adminStatus = localStorage.getItem(getUKey("clickads_admin_mode")) === 'true';
        setIsAdmin(adminStatus);
    }, [router]);

    // Admin State (In a real app, this comes from auth/roles)
    const [isAdmin, setIsAdmin] = useState(false);
    const [secretKey, setSecretKey] = useState("");

    // Community States
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [activeCategory, setActiveCategory] = useState<'all' | 'presentacion' | 'soporte' | 'logros'>('all');
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostImage, setNewPostImage] = useState<string | null>(null);
    const [postingTo, setPostingTo] = useState<'presentacion' | 'soporte' | 'logros'>('presentacion');

    const [modules, setModules] = useState<Module[]>([
        {
            id: "1",
            title: "Módulo 1: Fundamentos",
            cover: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop",
            videos: [
                {
                    id: "v1",
                    title: "Introducción a ClickAds",
                    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    likes: 15,
                    comments: []
                },
                {
                    id: "v2",
                    title: "Estrategia de Ventas",
                    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    likes: 12,
                    comments: []
                }
            ]
        }
    ]);

    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [selectedAngle, setSelectedAngle] = useState("HERO");
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

    const [showModuleModal, setShowModuleModal] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [newModuleCover, setNewModuleCover] = useState("");

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [newVideoTitle, setNewVideoTitle] = useState("");
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [showApiModal, setShowApiModal] = useState(false);
    const [tempApiKey, setTempApiKey] = useState("");

    const [generatingCopyIndex, setGeneratingCopyIndex] = useState<number | null>(null);

    // Clinics States
    const [clinicBefore, setClinicBefore] = useState<string | null>(null);
    const [clinicAfter, setClinicAfter] = useState<string | null>(null);
    const [clinicTreatment, setClinicTreatment] = useState("");
    const [clinicResults, setClinicResults] = useState<{ image: string, angle: string }[]>([]);
    const [isClinicLoading, setIsClinicLoading] = useState(false);
    const [selectedClinicAngle, setSelectedClinicAngle] = useState("ALL");

    // Digital Products States
    const [digitalPerson, setDigitalPerson] = useState<string | null>(null);
    const [digitalProduct, setDigitalProduct] = useState<string | null>(null);
    const [digitalLogo, setDigitalLogo] = useState<string | null>(null);
    const [digitalPrompt, setDigitalPrompt] = useState("");
    const [digitalResults, setDigitalResults] = useState<{ image: string, angle: string }[]>([]);
    const [isDigitalLoading, setIsDigitalLoading] = useState(false);
    const [selectedDigitalAngle, setSelectedDigitalAngle] = useState("ALL");

    // Logo Generator States
    const [logoBusinessName, setLogoBusinessName] = useState("");
    const [logoSector, setLogoSector] = useState("");
    const [logoPrimaryColor, setLogoPrimaryColor] = useState("#8B5CF6");
    const [logoSecondaryColor, setLogoSecondaryColor] = useState("#FFFFFF");
    const [logoStep, setLogoStep] = useState(0); // 0: Form, 1: Result & Iteration
    const [likedLogos, setLikedLogos] = useState<string[]>([]);
    const [finalLogo, setFinalLogo] = useState<string | null>(null);
    const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
    const [logoLikedFeedback, setLogoLikedFeedback] = useState("");
    const [logoDislikedFeedback, setLogoDislikedFeedback] = useState("");





    // Landing Page States
    const [landingCategory, setLandingCategory] = useState('Hero');
    const [landingResults, setLandingResults] = useState<{ image: string, angle: string } | null>(null);
    const [isLandingLoading, setIsLandingLoading] = useState(false);
    const [lPrice1, setLPrice1] = useState("");
    const [lPrice2, setLPrice2] = useState("");
    const [lPrice3, setLPrice3] = useState("");
    const [lPrice4, setLPrice4] = useState("");
    const [lBefore, setLBefore] = useState("");
    const [lAfter, setLAfter] = useState("");
    const [lBenefits, setLBenefits] = useState("");
    const [lCompBrand, setLCompBrand] = useState("");
    const [lCompOthers, setLCompOthers] = useState("");
    const [lTest1, setLTest1] = useState("");
    const [lTest2, setLTest2] = useState("");
    const [lTest3, setLTest3] = useState("");
    const [lAuthExpert, setLAuthExpert] = useState("");
    const [lAuthTitle, setLAuthTitle] = useState("");
    const [lAuthQuote, setLAuthQuote] = useState("");
    const [lUsage, setLUsage] = useState("");
    const [lLogistics, setLLogistics] = useState("");
    const [lFaqs, setLFaqs] = useState(Array(10).fill({ q: "", a: "" }));

    // ===== ANÁLISIS FINANCIERO STATES =====
    const [finFleteIda, setFinFleteIda] = useState("15000");
    const [finFleteDevolucion, setFinFleteDevolucion] = useState("0");
    const [finRecaudo, setFinRecaudo] = useState("3");
    const [finGastosFijos, setFinGastosFijos] = useState("5000000");
    const [finOrdenesMensuales, setFinOrdenesMensuales] = useState("1000");
    const [finPrecioCOD, setFinPrecioCOD] = useState("79900");
    const [finCostoProducto, setFinCostoProducto] = useState("15000");
    const [finCancelaciones, setFinCancelaciones] = useState("15");
    const [finDevoluciones, setFinDevoluciones] = useState("30");
    const [finGarantias, setFinGarantias] = useState("1");
    const [finChargebacks, setFinChargebacks] = useState("0.5");
    const [finCPAObjetivo, setFinCPAObjetivo] = useState("23");
    const [finUtilidad, setFinUtilidad] = useState("25");
    const [finMoneda, setFinMoneda] = useState("COP");
    const [finCalculado, setFinCalculado] = useState(false);
    const [finSnapshot, setFinSnapshot] = useState<any>(null);
    const FIN_MONEDAS = [
        { code: 'COP', label: '🇨🇴 COP – Peso Colombiano', symbol: '$' },
        { code: 'USD', label: '🇺🇸 USD – Dólar Americano', symbol: '$' },
        { code: 'EUR', label: '🇪🇺 EUR – Euro', symbol: '€' },
        { code: 'MXN', label: '🇲🇽 MXN – Peso Mexicano', symbol: '$' },
        { code: 'PEN', label: '🇵🇪 PEN – Sol Peruano', symbol: 'S/' },
        { code: 'ARS', label: '🇦🇷 ARS – Peso Argentino', symbol: '$' },
        { code: 'BRL', label: '🇧🇷 BRL – Real Brasileño', symbol: 'R$' },
        { code: 'CLP', label: '🇨🇱 CLP – Peso Chileno', symbol: '$' },
        { code: 'GTQ', label: '🇬🇹 GTQ – Quetzal Guatemalteco', symbol: 'Q' },
        { code: 'HNL', label: '🇭🇳 HNL – Lempira Hondureño', symbol: 'L' },
    ];

    // Photo Studio States
    const [studioInputImage, setStudioInputImage] = useState<string | null>(null);
    const [isStudioLoading, setIsStudioLoading] = useState(false);
    const [studioResults, setStudioResults] = useState<{ image: string, angle: string }[]>([]);

    // Research States
    const [researchName, setResearchName] = useState("");
    const [researchDescription, setResearchDescription] = useState("");
    const [isResearchLoading, setIsResearchLoading] = useState(false);
    const [researchResults, setResearchResults] = useState<string[] | null>(null);
    const [expandedResearch, setExpandedResearch] = useState<number | null>(0);
    const [researchHistory, setResearchHistory] = useState<{ id: string; name: string; description: string; date: string; results: string[] }[]>([]);
    const [isEvaluatingWa, setIsEvaluatingWa] = useState(false);
    const [waSimEvaluation, setWaSimEvaluation] = useState<string | null>(null);
    const [waSimMessages, setWaSimMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);



    useEffect(() => {
        if (activeTab === 'landing') {
            setSelectedOutputSize("447x800");
        }
    }, [activeTab]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Track streak and weekly activity
    useEffect(() => {
        if (!user) return;
        const streakKey = getUKey('clickads_streak');
        const weekKey = getUKey('clickads_week_activity');
        const savedStreak = localStorage.getItem(streakKey);
        const savedWeek = localStorage.getItem(weekKey);
        if (savedStreak) setStreakDays(parseInt(savedStreak, 10));
        if (savedWeek) { try { setWeekActivity(JSON.parse(savedWeek)); } catch (e) { } }
    }, [user]);

    // Library State
    const [library, setLibrary] = useState<SavedAd[]>([]);
    const [libProjectFilter, setLibProjectFilter] = useState("all");

    // Helper for unique storage
    const getUKey = (base: string) => user ? `${base}_${user.email}` : base;

    useEffect(() => {
        if (!user) return;

        // Cargar API Key (Primero por usuario, luego Global como fallback)
        const savedKey = localStorage.getItem(getUKey("clickads_api_key")) || localStorage.getItem("clickads_api_key_global");
        if (savedKey) {
            setApiKey(savedKey);
            setTempApiKey(savedKey);
        }

        const adminStatus = localStorage.getItem(getUKey("clickads_admin_mode")) === 'true';
        setIsAdmin(adminStatus);

        // Cargar Proyectos (IndexedDB con fallback a LocalStorage)
        const loadProjects = async () => {
            const userId = (user as any).email || "global";
            const idbProjects = await imageDB.getProjects(userId);

            if (idbProjects && idbProjects.length > 0) {
                setProjects(idbProjects);
            } else {
                // Fallback a localStorage para migración inicial
                const savedProjects = localStorage.getItem(getUKey("clickads_projects"));
                const legacyProjects = localStorage.getItem("clickads_projects");

                let found: Project[] = [];
                if (savedProjects) {
                    try { found = JSON.parse(savedProjects); } catch (e) { console.error(e); }
                } else if (legacyProjects && user?.email) {
                    try { found = JSON.parse(legacyProjects); } catch (e) { console.error(e); }
                }

                if (found.length > 0) {
                    setProjects(found);
                    // Migrar a IndexedDB inmediatamente
                    await imageDB.saveProjects(userId, found);
                    // Opcional: limpiar localStorage gradualmente o dejarlo hasta estar seguros
                } else {
                    setProjects([]);
                }
            }
        };
        loadProjects();

        // Cargar Biblioteca (IndexedDB)
        const loadLib = async () => {
            const userId = (user as any).email || "global";
            const idbLib = await imageDB.getLibrary(userId);
            if (idbLib && idbLib.length > 0) {
                setLibrary(idbLib);
            } else {
                const savedLib = localStorage.getItem(getUKey("clickads_library"));
                if (savedLib) {
                    try {
                        const parsed = JSON.parse(savedLib);
                        setLibrary(parsed);
                        await imageDB.saveLibrary(userId, parsed);
                    } catch (e) { console.error(e); }
                } else {
                    setLibrary([]);
                }
            }
        };
        loadLib();

        const savedPhoto = localStorage.getItem(getUKey("clickads_user_photo")) || (user as any)?.photo;
        if (savedPhoto) setUserPhoto(savedPhoto);
        else setUserPhoto(null);

        const savedResearch = localStorage.getItem(getUKey("clickads_research_history"));
        if (savedResearch) {
            try { setResearchHistory(JSON.parse(savedResearch)); } catch (e) { }
        }

        const savedPosts = localStorage.getItem("clickads_community_posts");
        if (savedPosts) {
            try { setPosts(JSON.parse(savedPosts)); } catch (e) { console.error(e); }
        }
    }, [user]);

    // Synchronize local states with active project to ensure isolation
    useEffect(() => {
        if (!activeProject) {
            // Reset states if no project is active
            setLandingCategory('Hero');
            setLPrice1(""); setLPrice2(""); setLPrice3(""); setLPrice4("");
            setLBefore(""); setLAfter(""); setLBenefits("");
            setLCompBrand(""); setLCompOthers("");
            setLTest1(""); setLTest2(""); setLTest3("");
            setLAuthExpert(""); setLAuthTitle(""); setLAuthQuote("");
            setLUsage(""); setLLogistics("");
            setLFaqs(Array(10).fill({ q: "", a: "" }));
            setLandingResults(null);
            return;
        }

        setLandingCategory(activeProject.landingCategory || 'Hero');
        setLPrice1(activeProject.lPrice1 || "");
        setLPrice2(activeProject.lPrice2 || "");
        setLPrice3(activeProject.lPrice3 || "");
        setLPrice4(activeProject.lPrice4 || "");
        setLBefore(activeProject.lBefore || "");
        setLAfter(activeProject.lAfter || "");
        setLBenefits(activeProject.lBenefits || "");
        setLCompBrand(activeProject.lCompBrand || "");
        setLCompOthers(activeProject.lCompOthers || "");
        setLTest1(activeProject.lTest1 || "");
        setLTest2(activeProject.lTest2 || "");
        setLTest3(activeProject.lTest3 || "");
        setLAuthExpert(activeProject.lAuthExpert || "");
        setLAuthTitle(activeProject.lAuthTitle || "");
        setLAuthQuote(activeProject.lAuthQuote || "");
        setLUsage(activeProject.lUsage || "");
        setLLogistics(activeProject.lLogistics || "");
        setLFaqs(activeProject.lFaqs || Array(10).fill({ q: "", a: "" }));

    }, [activeProjectId]);

    // Persistencia de Proyectos con IndexedDB (Capacidad Ilimitada)
    useEffect(() => {
        if (user && projects.length > 0) {
            const userId = (user as any).email || "global";
            imageDB.saveProjects(userId, projects);
        }
    }, [projects, user]);

    // Persistencia de Biblioteca (Capacidad Ilimitada)
    useEffect(() => {
        if (user && library.length > 0) {
            const userId = (user as any).email || "global";
            imageDB.saveLibrary(userId, library);
        }
    }, [library, user]);

    // Sync with Supabase on mount/user change
    useEffect(() => {
        if (!user?.email) return;

        const syncProfile = async () => {
            return;
        };

        syncProfile();
    }, [user?.email]);


    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const res = event.target?.result as string;
            setUserPhoto(res);
            localStorage.setItem(getUKey("clickads_user_photo"), res);

            // Persistir en Supabase
            if (user?.email) {
                await supabase
                    .from('authorized_users')
                    .update({ avatar_url: res })
                    .eq('email', user.email);
            }

            setToast({ msg: "Foto de perfil actualizada", type: 'success' });
        };
        reader.readAsDataURL(file);
    };

    const getAvatarUrl = () => {
        if (userPhoto) return userPhoto;
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`;
    };

    const toggleAdmin = () => {
        if (secretKey === "CLICKADS2025") { // Llave secreta para activar modo admin
            const newAdminStatus = !isAdmin;
            setIsAdmin(newAdminStatus);
            localStorage.setItem(getUKey("clickads_admin_mode"), newAdminStatus.toString());
            setToast({ msg: newAdminStatus ? "Modo Administrador Activo" : "Modo Usuario Activo", type: 'success' });
            setSecretKey("");
        } else {
            setToast({ msg: "Clave incorrecta", type: 'error' });
        }
    };

    const deletePost = (id: string) => {
        if (!isAdmin) return;
        const newPosts = posts.filter(p => p.id !== id);
        setPosts(newPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(newPosts));
        setToast({ msg: "Publicación eliminada", type: 'success' });
    };

    const deleteModule = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!isAdmin) return;
        setModules(prev => prev.filter(m => m.id !== id));
        setToast({ msg: "Módulo eliminado", type: 'success' });
    };

    const deleteVideo = (moduleId: string, videoId: string) => {
        if (!isAdmin) return;
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, videos: m.videos.filter(v => v.id !== videoId) } : m));
        setToast({ msg: "Video eliminado", type: 'success' });
    };

    const handleModuleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setNewModuleCover(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const addModule = () => {
        if (!newModuleTitle.trim()) return;
        const newModule: Module = {
            id: Math.random().toString(),
            title: newModuleTitle,
            cover: newModuleCover || "https://images.unsplash.com/photo-1557833006-c9f403002771?w=800",
            videos: []
        };
        setModules([...modules, newModule]);
        setShowModuleModal(false);
        setNewModuleTitle("");
        setNewModuleCover("");
        setToast({ msg: "Módulo creado", type: 'success' });
    };

    const addVideoToModule = (moduleId: string) => {
        if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;

        // Convert youtube link to embed link if needed
        let embedUrl = newVideoUrl;
        if (newVideoUrl.includes("watch?v=")) {
            embedUrl = newVideoUrl.replace("watch?v=", "embed/");
        } else if (newVideoUrl.includes("youtu.be/")) {
            embedUrl = newVideoUrl.replace("youtu.be/", "youtube.com/embed/");
        }

        const newVid: VideoContent = {
            id: Math.random().toString(),
            title: newVideoTitle,
            youtubeUrl: embedUrl,
            likes: 0,
            comments: []
        };

        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, videos: [...m.videos, newVid] } : m));
        setShowVideoModal(false);
        setNewVideoTitle("");
        setNewVideoUrl("");
        setToast({ msg: "Video añadido", type: 'success' });
    };

    const toggleVideoLike = (moduleId: string, videoId: string) => {
        setModules(prev => prev.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    videos: m.videos.map(v => {
                        if (v.id === videoId) {
                            const liked = !v.likedByMe;
                            return { ...v, likedByMe: liked, likes: liked ? v.likes + 1 : v.likes - 1 };
                        }
                        return v;
                    })
                };
            }
            return m;
        }));
    };

    const addVideoComment = (moduleId: string, videoId: string, content: string) => {
        if (!content.trim()) return;
        const newComment: Comment = {
            id: Math.random().toString(),
            author: user?.name || "Usuario",
            authorAvatar: getAvatarUrl(),
            content: content,
            timestamp: Date.now()
        };
        setModules(prev => prev.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    videos: m.videos.map(v => v.id === videoId ? { ...v, comments: [...v.comments, newComment] } : v)
                };
            }
            return m;
        }));
    };

    // Placeholder data for Admin Dashboard
    const adminStats = {
        activeClients: 142,
        mrr: 2840,
        mrrGrowth: "+12%",
        newClientsToday: 5
    };

    const [projectNameInput, setProjectNameInput] = useState("");
    const [productNameInput, setProductNameInput] = useState("");
    const [targetAudienceInput, setTargetAudienceInput] = useState("");
    const [selectedPrimary, setSelectedPrimary] = useState("#8B5CF6");
    const [selectedSecondary, setSelectedSecondary] = useState("#FFFFFF");
    const [selectedFont, setSelectedFont] = useState("Inter");
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [newProjectPreview, setNewProjectPreview] = useState<string | null>(null);
    const [newProjectLogo, setNewProjectLogo] = useState<string | null>(null);
    const [newProjectPerson, setNewProjectPerson] = useState<string | null>(null);
    const [newProjectType, setNewProjectType] = useState<'ecommerce' | 'digital'>('ecommerce');
    const [idealSolutionInput, setIdealSolutionInput] = useState("");
    const [bonusesInput, setBonusesInput] = useState("");
    const [guaranteesInput, setGuaranteesInput] = useState("");

    const createProject = () => {
        if (!projectNameInput.trim()) return;
        const newProject: Project = {
            id: Math.random().toString(36).substr(2, 9),
            name: projectNameInput,
            productName: productNameInput,
            targetAudience: targetAudienceInput,
            productPreview: newProjectPreview || "",
            userPrompt: "",
            results: [],
            updatedAt: Date.now(),
            primaryColor: selectedPrimary,
            secondaryColor: selectedSecondary,
            font: selectedFont,
            logoPreview: newProjectLogo || "",
            personPreview: newProjectPerson || "",
            type: newProjectType,
            idealSolution: idealSolutionInput,
            bonuses: bonusesInput,
            guarantees: guaranteesInput
        };
        const newProjects = [newProject, ...projects];
        setProjects(newProjects);
        setActiveProjectId(newProject.id);
        setProjectNameInput("");
        setProductNameInput("");
        setTargetAudienceInput("");
        setNewProjectPreview(null);
        setNewProjectLogo(null);
        setNewProjectPerson(null);
        setIdealSolutionInput("");
        setBonusesInput("");
        setGuaranteesInput("");
        setShowProjectModal(false);
    };

    const deleteProject = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("¿Eliminar proyecto?")) return;
        const newProjects = projects.filter(p => p.id !== id);
        setProjects(newProjects);
        if (activeProjectId === id) setActiveProjectId(null);
    };

    const updateActiveProject = (updates: Partial<Project>) => {
        if (!activeProjectId) return;
        const newProjects = projects.map(p => {
            if (p.id === activeProjectId) {
                const merged = { ...p, ...updates, updatedAt: Date.now() };
                return merged;
            }
            return p;
        });
        setProjects(newProjects);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateActiveProject({ productPreview: reader.result as string });
        reader.readAsDataURL(file);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateActiveProject({ logoPreview: reader.result as string });
        reader.readAsDataURL(file);
    };

    const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateActiveProject({ referencePreview: reader.result as string });
        reader.readAsDataURL(file);
    };

    const handleGenerate = async (angleId?: string, count: number = 1) => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }
        if (!activeProject?.productPreview) {
            setToast({ msg: "Sube una foto de producto primero", type: 'error' });
            return;
        }
        setIsLoading(true);
        updateActiveProject({ results: [] });

        const outputLang = selectedOutputLanguage || "ESPAÑOL";
        const logoInstruction = activeProject.logoPreview ? " YOU MUST INTEGRATE THE LOGO: Use the provided second image as the brand logo. Position it professionally." : "";
        const referenceInstruction = activeProject.referencePreview ? " STRICT STYLE/LAYOUT REFERENCE: The last image provided is the absolute layout and stylistic reference. Adapt the aesthetic, tone, and composition of the generated image to closely match this reference while integrating our product smoothly." : "";

        const brandingContext = ` PRODUCT: "${activeProject.productName || 'unknown'}". TARGET AUDIENCE: "${activeProject.targetAudience || 'general'}". ${logoInstruction} ${referenceInstruction} VISUAL THEME: Use the colors ${activeProject.primaryColor || "luxury"} and ${activeProject.secondaryColor || "neutral"} for backgrounds and accents. 
        CRITICAL RULES for TEXT AND TYPOGRAPHY: 
        1. BAN ON META-TEXT: DO NOT RENDER "${activeProject.primaryColor}" OR "${activeProject.secondaryColor}" AS TEXT.
        2. NO TECHNICAL LABELS: NEVER write "CABECERA", "SUBTITULAR", "TITULAR", etc.
        3. REGLA DE IDIOMA Y PRECISIÓN (MÁXIMA PRIORIDAD): TODO EL TEXTO DEBE ESTAR 100% EN ESPAÑOL. Usa el nombre exacto del producto. NUNCA uses sinónimos incorrectos (ej: no uses "GORRO" si el producto es un "SOMBRERO"). Usa ortografía perfecta. No escribas "INSCRÁLA AT ACIÓN" ni palabras inventadas.
        4. FONT STYLE: USE VERY BOLD, CLEAN SANS-SERIF fonts.`;

        const allAdTypes = [
            { id: "TESTIMONIAL", name: "TESTIMONIAL", style: "Cinematic professional product photography with dramatic commercial lighting.", goal: `Añadir 2-3 burbujas de testimonios elegantes con FOTOGRAFÍAS REALES DE PERSONAS. Texto corto en ${outputLang}.` },
            { id: "SALES_CTA", name: "SALES_CTA", style: "Urban premium lifestyle editorial photography.", goal: `Incluir un titular impactante en ${outputLang} relacionado con el producto. Añadir un botón flotante moderno.` },
            { id: "BENEFITS", name: "BENEFITS", style: "Clean luxury minimalist showroom.", goal: `Resaltar 3 beneficios clave del producto "${activeProject.productName || 'de la imagen'}" para el público "${activeProject.targetAudience || 'general'}" usando iconos minimalistas en ${outputLang}.` },
            { id: "INFOGRAPHIC", name: "INFOGRAPHIC", style: "Flat-lay professional editorial layout.", goal: `Crear una infografía premium. Señalar 3-4 características REALES. Texto breve en ${outputLang}.` },
            { id: "BEFORE_AFTER", name: "BEFORE_AFTER", style: "Cinematic ultra-high conversion split-screen comparison.", goal: `Diseño 'ANTES/DESPUÉS' impactante. Lado izquierdo "ANTES" (problema) y Lado derecho "DESPUÉS" (éxito). Producto en el centro.` },
            { id: "HERO", name: "HERO", style: "Premium high-energy lifestyle advertising photography.", goal: `Diseño 'HERO': Titular GIGANTE en ${outputLang}, 3 beneficios con checks, badges de "ENVÍO SEGURO", y persona feliz.` },
            { id: "LIFESTYLE_ELITE", name: "LIFESTYLE_ELITE", style: "Premium cinematic gym or lifestyle setting.", goal: `Diseño 'LIFESTYLE PREMIUN': Titular GIGANTE y ENÉRGICO. Producto en primer plano. Lista de 6 beneficios cortos.` },
            { id: "WHAT_IS_IT_FOR", name: "WHAT_IS_IT_FOR", style: "Clean minimalist studio photography.", goal: `Diseño 'PARA QUÉ SIRVE': Escribir "¿PARA QUÉ SIRVE?" en letras grandes. Lista vertical del 1 al 5. Producto a la derecha.` },
            { id: "PROBLEM_QUESTION", name: "PROBLEM_QUESTION", style: "High-energy cinematic background.", goal: `Diseño 'PREGUNTA PROBLEMA': Una PREGUNTA GIGANTE e IMPACTANTE sobre un dolor del usuario. Lista de 4 beneficios.` },
            { id: "END_OF_PROBLEM", name: "END_OF_PROBLEM", style: "High-voltage cinematic background.", goal: `Diseño 'EL FIN DE TU PROBLEMA': Escribir "EL FIN DE [PROBLEMA]" en letras blancas ultra-gruesas. 4 iconos de beneficios.` },
            { id: "OVERCOME_LIMITS", name: "OVERCOME_LIMITS", style: "High-exposure energetic clean studio layout.", goal: `Diseño 'SUPERA TUS LÍMITES': Escribir "SUPERA TUS LÍMITES" en letras GIGANTES. Banner con frase de beneficio.` },
            { id: "TRANSFORMATION", name: "TRANSFORMATION", style: "Elite graphic comparison layout.", goal: `Diseño 'TRANSFORMACIÓN': Escribir "TRANSFORMA TU VIDA". Comparativa con "ANTES" y "DESPUÉS" muy contrastados.` },
            { id: "BEST_FRIEND", name: "BEST_FRIEND", style: "Infographic-style photographic layout.", goal: `Diseño 'TU MEJOR AMIGO': Mostrar 3 pasos de uso con fotos pequeñas. 4 beneficios cortos resaltados.` },
            { id: "WHY_IS_IT_SPECIAL", name: "WHY_IS_IT_SPECIAL", style: "Elite product showcase with minimalist architecture.", goal: `¿POR QUÉ ES TAN ESPECIAL? en letras GIGANTES. Producto en un pedestal. Lista de 4 beneficios a la derecha.` },
            { id: "PROBLEM_VS_SOLUTION", name: "PROBLEM_VS_SOLUTION", style: "Clean vertical split layout.", goal: `Diseño 'PROBLEMA VS SOLUCIÓN': División vertical. Lado IZQ con problemas, lado DER con solución y persona feliz.` },
            { id: "COMPARISON", name: "COMPARISON", style: "Side-by-side luxurious product face-off.", goal: `Comparativa premium: 'OTROS' vs 'NOSOTROS'.` }
        ];

        const targetAngle = allAdTypes.find(a => a.id === (angleId || "HERO")) || allAdTypes[5];
        const variations: any[] = [];
        const base64Data = activeProject.productPreview?.split(",")[1] || "";
        const mimeType = activeProject.productPreview.includes("image/png") ? "image/png" : "image/jpeg";

        try {
            // Direct Google API Call
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

            const tasks = Array.from({ length: count }).map(async (_, i) => {
                const customContext = activeProject.userPrompt ? ` INSTRUCCIONES ADICIONALES DEL USUARIO: ${activeProject.userPrompt}.` : "";
                const priceOverlay = activeProject.adPrice ? ` RENDER PRICE TEXT PROMINENTLY: "${activeProject.adPrice}".` : "";
                const ctaOverlay = activeProject.adCta ? ` RENDER CTA BUTTON OR TEXT PROMINENTLY: "${activeProject.adCta}".` : "";
                const finalPrompt = `Create a high quality commercial ad image. Professional photography style: ${targetAngle.style}. AD CREATIVE OBJECTIVE: ${targetAngle.goal}. ${brandingContext} ${customContext} ${priceOverlay} ${ctaOverlay} DIMENSIONS: ${selectedOutputSize || '1:1'}. Variation ${i + 1}`;

                const reqParts: any[] = [{ inlineData: { mimeType, data: base64Data } }];
                if (activeProject.logoPreview) {
                    reqParts.push({ inlineData: { mimeType: "image/png", data: activeProject.logoPreview.split(",")[1] || "" } });
                }
                if (activeProject.referencePreview) {
                    const refMime = activeProject.referencePreview.includes("image/png") ? "image/png" : "image/jpeg";
                    reqParts.push({ inlineData: { mimeType: refMime, data: activeProject.referencePreview.split(",")[1] || "" } });
                }
                reqParts.push({ text: finalPrompt });

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: reqParts
                        }]
                    })
                });

                if (res.status === 429) throw new Error("Google Rate Limit (429). Espera unos minutos.");

                const data = await res.json();
                if (data.error) throw new Error(data.error.message || "Error Gemini");

                const part = data.candidates?.[0]?.content?.parts?.[0];
                if (part?.inlineData) {
                    const newVar = { image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, title: targetAngle.name, copy: "", angle: targetAngle.name };

                    // Generate Copy directly after image
                    try {
                        const copyUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
                        const copyRes = await fetch(copyUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{
                                    parts: [
                                        { inlineData: { mimeType: part.inlineData.mimeType, data: part.inlineData.data } },
                                        {
                                            text: `Genera UN Ad Copy (texto para anuncio) de alto impacto persuasivo en ESPAÑOL para este anuncio que acabas de ver. 
Datos de la Pauta/Anuncio:
- Producto: ${activeProject.productName || 'No especificado'}
- Marca: ${activeProject.name || 'No especificada'}
- Ángulo de Venta: ${targetAngle.name} (${targetAngle.goal})
${activeProject.userPrompt ? `- Instrucciones adicionales: ${activeProject.userPrompt}` : ''}

Escribe un copy que conecte perfectamente con la imagen del anuncio y el ángulo de venta. Usa una estructura persuasiva y ganchos atractivos. Responde SOLO el texto del copy.` }
                                    ]
                                }]
                            })
                        });
                        const copyData = await copyRes.json();
                        newVar.copy = copyData.candidates?.[0]?.content?.parts?.[0]?.text || "";
                    } catch (e) { console.error("Copy error", e); }

                    return newVar;
                }
                return null;
            });

            const results = await Promise.all(tasks);
            const validResults = results.filter(r => r !== null) as any[];
            updateActiveProject({ results: validResults });
        } catch (error: any) {
            setToast({ msg: error.message || "Error en la generación.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCopy = async (index: number) => {
        if (!apiKey || !activeProject) return;
        setGeneratingCopyIndex(index);
        try {
            const image = activeProject.results[index].image;
            const base64Data = image?.split(",")[1] || "";
            const mimeType = image.includes("image/png") ? "image/png" : "image/jpeg";

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { inlineData: { mimeType, data: base64Data } },
                            { text: `Analiza este anuncio y genera UN Ad Copy persuasivo en ESPAÑOL. Marca: ${activeProject.name}. Producto: ${activeProject.productName}. Responde solo el texto del anuncio.` }
                        ]
                    }]
                })
            });

            const data = await res.json();
            const copy = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            const newResults = [...(activeProject?.results || [])];
            newResults[index].copy = copy;
            updateActiveProject({ results: newResults });
            setToast({ msg: "Copy generado con éxito", type: 'success' });
        } catch (error: any) {
            setToast({ msg: "Error al generar copy.", type: 'error' });
        } finally {
            setGeneratingCopyIndex(null);
        }
    };

    const saveToLibrary = (image: string, angle: string, copy?: string) => {
        if (library.some(item => item.image === image)) { setToast({ msg: "Ya está en tu biblioteca", type: 'success' }); return; }
        const newAd: SavedAd = { id: Math.random().toString(36).substr(2, 9), image, angle: angle || "Mix", projectName: activeProject?.name || "Global", savedAt: Date.now(), copy };
        const newLib = [newAd, ...library];
        setLibrary(newLib);
        setToast({ msg: "¡Guardado con éxito!", type: 'success' });
    };

    const removeFromLibrary = (id: string) => {
        const newLib = library.filter(a => a.id !== id);
        setLibrary(newLib);
        localStorage.setItem(getUKey("clickads_library"), JSON.stringify(newLib));
    };

    const handlePost = () => {
        if (!newPostContent.trim()) return;
        const newPost: Post = {
            id: Math.random().toString(36).substr(2, 9),
            author: user?.name || "Admin ClickAds",
            authorAvatar: getAvatarUrl(),
            category: postingTo,
            content: newPostContent,
            timestamp: Date.now(),
            likes: 0,
            comments: [],
            image: newPostImage || undefined
        };
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(updatedPosts));
        setNewPostContent("");
        setNewPostImage(null);
        setToast({ msg: "Publicación compartida", type: 'success' });
    };

    const handleGenerateLogo = async (isIteration: boolean = false) => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        setIsGeneratingLogo(true);
        if (!isIteration) setFinalLogo(null);

        try {
            const mediaParts = [];
            const likedSelection = likedLogos.slice(0, 6);
            if (finalLogo) likedSelection.push(finalLogo);

            for (const logoUrl of likedSelection) {
                if (logoUrl.startsWith('data:')) {
                    const base64 = logoUrl?.split(',')[1] || "";
                    const header = logoUrl?.split(',')[0] || "";
                    const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";
                    mediaParts.push({ inlineData: { mimeType, data: base64 } });
                }
            }

            const feedbackContext = (logoLikedFeedback || logoDislikedFeedback) ? `
                USER FEEDBACK FOR THIS ITERATION:
                The user likes: "${logoLikedFeedback || 'no specific likes provided'}"
                The user wants to CHANGE or remove: "${logoDislikedFeedback || 'no specific dislikes provided'}"
                Please incorporate this feedback strictly in the new generation.
            ` : "";

            const prompt = `
                TASK: Generate a high-end, professional brand logo.
                BUSINESS NAME: "${logoBusinessName}"
                SECTOR: "${logoSector}"
                PRIMARY COLOR: "${logoPrimaryColor}"
                SECONDARY COLOR: "${logoSecondaryColor}"
                ${feedbackContext}
                
                STYLE GUIDELINES:
                1. MODERN & MINIMALIST: Use clean lines and balanced proportions.
                2. VECTOR STYLE: The final result should look like a professional vector logo on a clean background.
                3. COLOR HARMONY: Primarily use ${logoPrimaryColor} and ${logoSecondaryColor}. No neon unless specified.
                4. LEGIBILITY: The name "${logoBusinessName}" must be clearly legible if text is included.
                5. SYMBOLISM: Incorporate a subtle icon or symbol relevant to the ${logoSector} sector.
                6. BACKGROUND: Use a solid, clean neutral background (e.g., white or light grey) to make the logo pop.
                7. REFERENCE: Synthesize the aesthetic of the provided example images while making it unique and superior.
                8. DIMENSIONS: 1080x1080 pixels (Square).
                
                NO TECHNICAL LABELS: Do not include words like "Logo", "Design", "Concept", color names as text.
            `;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            ...mediaParts,
                            { text: prompt }
                        ]
                    }],
                    generationConfig: { responseModalities: ["IMAGE"] }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const logo = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setFinalLogo(logo);
                setLogoStep(1);
                if (isIteration) {
                    setLogoLikedFeedback("");
                    setLogoDislikedFeedback("");
                    setToast({ msg: "Logo refinado con éxito", type: 'success' });
                }
            } else {
                throw new Error("No se pudo generar el logo. Intenta de nuevo.");
            }
        } catch (error: any) {
            setToast({ msg: error.message, type: 'error' });
        } finally {
            setIsGeneratingLogo(false);
        }
    };


    const handleGenerateLanding = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Ve a Configuración y guarda tu API Key de Gemini", type: 'error' });
            return;
        }
        if (!activeProject) {
            setToast({ msg: "Selecciona o crea un proyecto primero", type: 'error' });
            return;
        }
        setIsLandingLoading(true);
        setLandingResults(null);
        try {
            const mediaParts: any[] = [];
            const images = [activeProject.productPreview, activeProject.logoPreview].filter(Boolean) as string[];
            images.forEach((img: string) => {
                const data = img?.split(",")[1] || "";
                const mimeType = img.includes("image/png") ? "image/png" : "image/jpeg";
                mediaParts.push({ inlineData: { data, mimeType } });
            });

            const colorStyle = `Color Primario: ${activeProject.primaryColor || '#8B5CF6'}, Secundario: ${activeProject.secondaryColor || '#FFFFFF'}, Fuente: ${activeProject.font || 'Inter'}.`;
            const language = selectedOutputLanguage || "ESPAÑOL";

            let specificPrompt = "";
            if (landingCategory === "Antes/Después") {
                specificPrompt = `Sección Antes/Después. Antes: "${lBefore}". Después: "${lAfter}".`;
            } else if (landingCategory === "Hero") {
                specificPrompt = `Hero Section de alto impacto. Producto héroe, titular persuasivo.`;
            } else if (landingCategory === "Oferta") {
                specificPrompt = `Sección de Oferta. Precios: x1: ${lPrice1}, x2: ${lPrice2}, x3: ${lPrice3}, x4: ${lPrice4}.`;
            } else if (landingCategory === "Beneficios") {
                specificPrompt = `Sección de Beneficios. Detalles: ${lBenefits}.`;
            } else if (landingCategory === "Preguntas Frecuentes") {
                specificPrompt = `Sección de FAQ. Preguntas: ${lFaqs.map(f => f.q).join(", ")}.`;
            } else {
                specificPrompt = `Sección de ${landingCategory} para el producto ${activeProject.productName}.`;
            }

            const customContext = activeProject.userPrompt ? ` INSTRUCCIONES ADICIONALES: ${activeProject.userPrompt}.` : "";
            const prompt = `Crea un gráfico para una landing page. DIMENSIONES: ${selectedOutputSize || '(447x800)'}. CATEGORÍA: ${landingCategory}. IDIOMA: ${language}. ${specificPrompt} ${customContext} ${colorStyle} ORTOGRAFÍA PERFECTA EN ${language}. CALIDAD 8K.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [...mediaParts, { text: prompt }] }],
                    generationConfig: { responseModalities: ["IMAGE"] }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const newImg = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setLandingResults({ image: newImg, angle: landingCategory || "Landing" });
                updateActiveProject({ results: [...(activeProject.results || []), { image: newImg, title: landingCategory, angle: landingCategory || "Landing", isLanding: true }] });
            } else {
                throw new Error("No se pudo generar la sección.");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsLandingLoading(false);
        }
    };

    const handleRefine = async (index: number, isLanding = false) => {
        if (!refiningText.trim()) return;
        setIsRefining(true);

        let prevImage = "";
        if (isLanding) {
            if (!landingResults) return;
            prevImage = landingResults.image;
        } else {
            const target = activeProject!.results[index];
            if (!target) return;
            prevImage = target.image;
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const base64Data = prevImage?.split(",")[1] || "";

            const prompt = `ADJUSTMENT REQUESTED BY USER: "${refiningText}". 
            Context: This image is part of a marketing campaign for "${activeProject?.productName}".
            TASK: Re-generate the image making the specific changes requested. KEEP the exact same composition, layout and aesthetic, but apply the fix: "${refiningText}". 
            Primary Color: ${activeProject?.primaryColor}, Secondary: ${activeProject?.secondaryColor}.
            Output Language: ${selectedOutputLanguage || 'Español'}.
            IMPORTANT: Do not invent a new concept, just refine the current one.`;

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
                            { text: prompt }
                        ]
                    }],
                    generationConfig: { responseModalities: ["IMAGE"] }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const newImg = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                let newCopy = "";

                // Generate new copy based on adjusted image
                try {
                    const copyUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                    const copyRes = await fetch(copyUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    { inlineData: { mimeType: part.inlineData.mimeType, data: part.inlineData.data } },
                                    {
                                        text: `Genera UN Ad Copy (texto para anuncio) de alto impacto persuasivo en ESPAÑOL para este anuncio que acabas de ver. 
Datos de la Pauta/Anuncio:
- Producto: ${activeProject?.productName || 'No especificado'}
- Marca: ${activeProject?.name || 'No especificada'}
- Ajustes hechos al anuncio: ${refiningText}

Escribe un copy que conecte perfectamente con la nueva imagen del anuncio. Usa una estructura persuasiva y ganchos atractivos. Responde SOLO el texto del copy.` }
                                ]
                            }]
                        })
                    });
                    const copyData = await copyRes.json();
                    newCopy = copyData.candidates?.[0]?.content?.parts?.[0]?.text || "";
                } catch (e) {
                    console.error("Copy refine error", e);
                }

                if (isLanding) {
                    setLandingResults({ image: newImg, angle: landingCategory || "Landing" });
                    setShowLandingRefine(false);
                } else {
                    const newResults = [...activeProject!.results];
                    newResults[index] = {
                        ...newResults[index],
                        image: newImg,
                        copy: newCopy || newResults[index].copy // fall back to old copy if generation fails
                    };
                    updateActiveProject({ results: newResults });
                    setRefiningIndex(null);
                }
                setRefiningText("");
                setToast({ msg: "✅ Ajuste completado con éxito", type: 'success' });
            } else {
                throw new Error("No se pudo generar el ajuste.");
            }
        } catch (e: any) {
            setToast({ msg: "Error al ajustar: " + e.message, type: 'error' });
        } finally {
            setIsRefining(false);
        }
    };

    const downloadSingleImage = async (image: string, name: string) => {
        try {
            let blob: Blob | null = null;
            if (image.startsWith('data:')) {
                const img = new window.Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = image;
                });
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95));
                }
            }
            if (!blob) {
                const byteString = atob(image?.split(',')[1] || "");
                const mimeString = image?.split(',')[0]?.split(':')[1]?.split(';')[0] || "";
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                blob = new Blob([ab], { type: mimeString });
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setToast({ msg: "¡JPEG descargado!", type: 'success' });
        } catch (error) {
            console.error("Error downloading image:", error);
            const link = document.createElement("a");
            link.href = image;
            link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
            link.click();
        }
    };

    const downloadAsZip = async (images: { image: string, name: string }[], zipName: string) => {
        try {
            const zip = new JSZip();
            setToast({ msg: "Preparando carpeta ZIP...", type: 'success' });
            for (let i = 0; i < images.length; i++) {
                const { image, name } = images[i];
                if (image.startsWith('data:')) {
                    let base64Data = image?.split(',')[1] || "";
                    if (!image.startsWith('data:image/jpeg')) {
                        try {
                            const img = new window.Image();
                            await new Promise((resolve, reject) => {
                                img.onload = resolve;
                                img.onerror = reject;
                                img.src = image;
                            });
                            const canvas = document.createElement("canvas");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext("2d");
                            if (ctx) {
                                ctx.fillStyle = "#FFFFFF";
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(img, 0, 0);
                                base64Data = canvas.toDataURL("image/jpeg", 0.95)?.split(',')[1] || "";
                            }
                        } catch (e) { }
                    }
                    zip.file(`${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${i + 1}.jpg`, base64Data, { base64: true });
                } else {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    zip.file(`${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${i + 1}.jpg`, blob);
                }
            }
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = `${zipName.replace(/[^a-z0-9]/gi, '_')}.zip`;
            link.click();
            setToast({ msg: "¡ZIP descargado!", type: 'success' });
        } catch (error) {
            setToast({ msg: "Error al crear el ZIP", type: 'error' });
        }
    };

    const handleGenerateClinic = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!clinicBefore || !clinicAfter) {
            setToast({ msg: "Sube ambas fotos (Antes y Después)", type: 'error' });
            return;
        }
        setIsClinicLoading(true);
        setClinicResults([]);
        try {
            const mediaParts = [
                { inlineData: { data: clinicBefore?.split(",")[1] || "", mimeType: "image/jpeg" } },
                { inlineData: { data: clinicAfter?.split(",")[1] || "", mimeType: "image/jpeg" } }
            ];
            const prompt = `Diseño de Antes y Después impactante. Texto en ESPAÑOL. Ángulo: ${selectedClinicAngle}. Contexto: ${clinicTreatment}. Calidad fotorealista profesional.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [...mediaParts, { text: prompt }] }],
                    generationConfig: { responseModalities: ["IMAGE"] }
                })
            });
            const data = await res.json();
            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const img = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setClinicResults([{ image: img, angle: selectedClinicAngle || "Generado" }]);
            } else {
                throw new Error("No se pudo generar");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsClinicLoading(false);
        }
    };

    const handleGenerateStudio = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!studioInputImage) {
            setToast({ msg: "Sube una foto tomada con tu teléfono", type: 'error' });
            return;
        }
        setIsStudioLoading(true);
        setStudioResults([]);

        const angles = [
            "Ángulo frontal directo (Front View)",
            "Ángulo ligeramente inclinado desde arriba (Top-Down / 45°)",
            "Ángulo de perfil o tres cuartos (Side/3/4 View)",
            "Ángulo en detalle de primer plano (Close-Up)"
        ];

        try {
            const mediaParts = [{ inlineData: { data: studioInputImage.split(",")[1] || "", mimeType: "image/jpeg" } }];
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

            const promises = angles.map(async (angle) => {
                const prompt = `Extrae el producto de la imagen proporcionada. Transformalo en una fotografía de estudio ultra realista en calidad Full HD (Alta resolución). Fondo debe ser TOTALMENTE BLANCO 100% PURO (#FFFFFF). El producto debe verse limpio, profesional y bien iluminado. Ángulo: ${angle}.`;

                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [...mediaParts, { text: prompt }] }],
                        generationConfig: { responseModalities: ["IMAGE"] }
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error.message || "Error Gemini");
                const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
                if (part && part.inlineData) {
                    return { image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, angle };
                }
                return null;
            });

            const resultsRaw = await Promise.all(promises);
            const validResults = resultsRaw.filter(Boolean) as { image: string, angle: string }[];
            setStudioResults(validResults);

            if (validResults.length === 0) {
                throw new Error("No se pudo generar");
            } else {
                setToast({ msg: "¡Imágenes de Photo Studio generadas!", type: 'success' });
            }
        } catch (e: any) {
            setToast({ msg: e.message || "Error al procesar", type: 'error' });
        } finally {
            setIsStudioLoading(false);
        }
    };


    const handleWaSimEvaluate = async () => {
        setIsEvaluatingWa(true);
        setWaSimEvaluation(null);
        try {
            const chatStr = waSimMessages.map(m => `${m.role === 'user' ? 'Vendedor' : 'Cliente'}: ${m.content}`).join("\n");
            const res = await fetch("/api/vertex-ai/whatsapp-closer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode: "evaluate", userMessage: chatStr, apiKey: apiKey })
            });
            const data = await res.json();
            if (data.success) {
                setWaSimEvaluation(data.evaluation);
                setToast({ msg: "Evaluación generada", type: 'success' });
            }
        } catch (e) {
            setToast({ msg: "Error al evaluar", type: 'error' });
        } finally {
            setIsEvaluatingWa(false);
        }
    };


    const handleGenerateDigital = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!digitalProduct) {
            setToast({ msg: "Sube una foto del producto", type: 'error' });
            return;
        }
        setIsDigitalLoading(true);
        setDigitalResults([]);
        try {
            const mediaParts = [{ inlineData: { data: digitalProduct?.split(",")[1] || "", mimeType: "image/jpeg" } }];
            if (digitalPerson || digitalLogo) {
                const imgData = digitalPerson || digitalLogo;
                if (imgData) {
                    mediaParts.push({ inlineData: { data: imgData?.split(",")[1] || "", mimeType: "image/jpeg" } });
                }
            }
            const prompt = `Diseño de anuncio digital premium. Producto: ${activeProject?.productName}. Ángulo: ${selectedDigitalAngle}. Texto: ${digitalPrompt}.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [...mediaParts, { text: prompt }] }],
                    generationConfig: { responseModalities: ["IMAGE"] }
                })
            });
            const data = await res.json();
            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const img = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setDigitalResults([{ image: img, angle: selectedDigitalAngle || "Generado" }]);
            } else {
                throw new Error("No se pudo generar");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsDigitalLoading(false);
        }
    };

    const handleGenerateResearch = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!researchName || !researchDescription) {
            setToast({ msg: "Completa el nombre y la información del producto", type: 'error' });
            return;
        }
        setIsResearchLoading(true);
        setResearchResults(null);
        try {
            const res = await fetch("/api/vertex-ai/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: researchName,
                    description: researchDescription,
                    apiKey
                })
            });
            const data = await res.json();
            if (data.results) {
                setResearchResults(data.results);
                const newHist = {
                    id: Date.now().toString(),
                    name: researchName,
                    description: researchDescription,
                    date: new Date().toLocaleDateString(),
                    results: data.results
                };
                const updatedHist = [newHist, ...researchHistory];
                setResearchHistory(updatedHist);
                localStorage.setItem(getUKey("clickads_research_history"), JSON.stringify(updatedHist));
                setToast({ msg: "Investigación completada y guardada", type: 'success' });
            } else {
                throw new Error(data.error || "No se pudo generar. Revisa tu API Key.");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsResearchLoading(false);
        }
    };

    const ColorPicker = ({ label, color, onChange }: { label: string, color: string, onChange: (c: string) => void }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase" }}>{label}</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative", width: 44, height: 44, borderRadius: 12, border: "2px solid rgba(255,255,255,0.1)", background: color, cursor: "pointer", overflow: "hidden" }}>
                    <input type="color" value={color} onChange={(e) => onChange(e.target.value)} style={{ position: "absolute", top: -10, left: -10, width: 64, height: 64, cursor: "pointer" }} />
                </div>
                <input className="input-field" style={{ padding: "10px 16px", width: 120, fontSize: 13, textTransform: "uppercase" }} value={color} onChange={(e) => onChange(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, marginTop: 4 }}>
                {CANVA_PRESETS.map(c => (
                    <div key={c} onClick={() => onChange(c)} style={{ width: "100%", aspectRatio: "1/1", borderRadius: 4, background: c, cursor: "pointer", border: color === c ? "2px solid #fff" : "1px solid rgba(255,255,255,0.1)" }} />
                ))}
            </div>
        </div>
    );

    const activeProject = projects.find(p => p.id === activeProjectId) || null;

    const toggleLike = (postId: string) => {
        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                const liked = !p.likedByMe;
                return { ...p, likedByMe: liked, likes: liked ? p.likes + 1 : p.likes - 1 };
            }
            return p;
        });
        setPosts(updatedPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(updatedPosts));
    };

    const [commentingTo, setCommentingTo] = useState<string | null>(null);
    const [tempComment, setTempComment] = useState("");

    const addComment = (postId: string) => {
        if (!tempComment.trim()) return;
        const newComment: Comment = {
            id: Math.random().toString(),
            author: user?.name || "Usuario",
            authorAvatar: getAvatarUrl(),
            content: tempComment,
            timestamp: Date.now()
        };
        const updatedPosts = posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p);
        setPosts(updatedPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(updatedPosts));
        setTempComment("");
        setCommentingTo(null);
        setToast({ msg: "Comentario añadido", type: 'success' });
    };

    const togglePinComment = (postId: string, commentId: string) => {
        if (!isAdmin) return;
        const updatedPosts = posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    comments: p.comments.map(c => c.id === commentId ? { ...c, isPinned: !c.isPinned } : c)
                };
            }
            return p;
        });
        setPosts(updatedPosts);
        localStorage.setItem("clickads_community_posts", JSON.stringify(updatedPosts));
        setToast({ msg: "Estado de anclaje actualizado", type: 'success' });
    };

    return (
        <div style={{ background: "#030303", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif", display: "flex" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                ${GOOGLE_FONTS.map(f => `@import url('https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@400;700;900&display=swap');`).join('\n')}
                .glass-card { background: rgba(10, 10, 15, 0.8); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 32px; backdrop-filter: blur(12px); }
                .btn-primary { background: #8B5CF6; color: #fff; border: none; padding: 16px 32px; border-radius: 16px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 10px; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4); }
                .input-field { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; color: #fff; padding: 16px; width: 100%; outline: none; transition: 0.2s; }
                .input-field option { background: #111; color: #fff; }

                .nav-item { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 12px; cursor: pointer; transition: 0.2s; color: #6B7280; font-weight: 600; font-size: 14px; border: 1px solid transparent; }
                .nav-item:hover { color: #D1D5DB; background: rgba(255,255,255,0.03); }
                .nav-item.active { background: rgba(139,92,246,0.08); border-color: rgba(139,92,246,0.15); color: #8B5CF6; }
                .project-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; cursor: pointer; transition: 0.2s; }
                .project-card:hover { border-color: #8B5CF6; background: rgba(255,255,255,0.04); }
                .community-cat { padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 14px; color: #9CA3AF; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .community-cat.active { background: #8B5CF6; color: #fff; }
                .post-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 24px; margin-bottom: 20px; transition: 0.2s; position: relative; }
                .stat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
                .home-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 28px 24px; display:flex; flex-direction:column; gap:8px; transition:0.2s; }
                .home-stat:hover { border-color: rgba(139,92,246,0.25); background: rgba(139,92,246,0.04); }
                .home-tool-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 24px; cursor:pointer; transition:0.2s; display:flex; flex-direction:column; gap:12px; }
                .home-tool-card:hover { border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.04); transform: translateY(-2px); }
                .home-proj-row { display:flex; align-items:center; gap:16px; padding:14px 20px; border-radius:14px; transition:0.2s; cursor:pointer; }
                .home-proj-row:hover { background: rgba(255,255,255,0.04); }
                @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                .anim-in { animation: fadeInUp 0.4s ease forwards; }
                .bar-col { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; }

                /* SLA Specific Styles */
                .hero-card { background: #0A0A0A; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 40px; position: relative; overflow: hidden; }
                .lesson-item { display: flex; align-items: center; gap: 16px; padding: 12px 16px; border-radius: 12px; cursor: pointer; transition: 0.2s; }
                .lesson-item:hover { background: rgba(255,255,255,0.03); transform: translateX(4px); }
                .btn-purple { background: #8B5CF6; color: #fff; border: none; padding: 14px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; width: 100%; font-size: 14px; }
                .btn-purple:hover { background: #7C3AED; transform: scale(1.02); }
                .progress-bar { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; position: relative; }
                .progress-fill { height: 100%; background: #8B5CF6; border: 1px solid rgba(255,255,255,0.05); }

                .image-zoom-container:hover .hover-zoom { transform: scale(1.05); }
                .image-zoom-container:hover .zoom-overlay { opacity: 1 !important; }

                @media print {
                    @page { margin: 15mm; size: auto; }
                    body, html, main { background: #fff !important; color: #000 !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; height: auto !important; }
                    aside, .no-print, button, nav, .btn-primary { display: none !important; }
                    .print-module { break-inside: avoid; margin-bottom: 24px !important; border: 1px solid #ddd !important; background: #fff !important; border-radius: 8px !important; display: block !important; }
                    .print-module-header { display: flex !important; align-items: center !important; gap: 16px !important; background: #f9fafb !important; padding: 12px 16px !important; border-bottom: 1px solid #eee !important; justify-content: flex-start !important; }
                    .print-module-num { background: #e5e7eb !important; color: #000 !important; border: 1px solid #ccc !important; border-radius: 8px !important; padding: 6px 12px !important; font-weight: bold !important; font-family: monospace !important; }
                    .print-module-title { color: #000 !important; font-size: 16px !important; font-weight: 800 !important; margin-bottom: 4px !important; }
                    .print-module-desc { display: none !important; }
                    .print-module-body-open, .print-module-body-closed { display: block !important; padding: 16px !important; background: #fff !important; border: none !important; }
                    .print-text { color: #000 !important; font-size: 13px !important; line-height: 1.6 !important; white-space: pre-wrap !important; }
                    .glass-card { box-shadow: none !important; border: none !important; background: transparent !important; }
                    * { color: #000 !important; }
                }
            `}</style>

            {/* Sidebar */}
            <aside style={{ width: 280, borderRight: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", background: "#050505" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, padding: "0 12px" }}>
                    <img src="/logo.png" alt="ClickAds" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }} />
                    <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-1px" }}>ClickAds</span>
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                    <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><Home size={18} /> Inicio</div>
                    <div className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}><Sparkles size={18} /> Genera Creativos</div>
                    <div className={`nav-item ${activeTab === 'landing' ? 'active' : ''}`} onClick={() => setActiveTab('landing')}><Layout size={18} /> Generar Landing Page</div>
                    <div className={`nav-item ${activeTab === 'logo_generator' ? 'active' : ''}`} onClick={() => setActiveTab('logo_generator')}><Sparkles size={18} /> Generar Logo</div>
                    <div className={`nav-item ${activeTab === 'photo_studio' ? 'active' : ''}`} onClick={() => setActiveTab('photo_studio')}><Camera size={18} /> Photo Studio</div>
                    <div className={`nav-item ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}><Search size={18} /> Investigación de Producto <span style={{ fontSize: 9, background: "#8B5CF6", color: "#fff", padding: "2px 6px", borderRadius: 4, marginLeft: 8, fontWeight: 900 }}>NUEVO</span></div>
                    <div className={`nav-item ${activeTab === 'financial' ? 'active' : ''}`} onClick={() => setActiveTab('financial')} style={{ background: activeTab === 'financial' ? 'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(5,150,105,0.15))' : '', color: activeTab === 'financial' ? '#10b981' : '', border: activeTab === 'financial' ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent' }}><TrendingUp size={18} /> Análisis Financiero</div>

                    <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}><Bookmark size={18} /> Mi Biblioteca</div>

                    <div className={`nav-item ${activeTab === 'tutorials' ? 'active' : ''}`} onClick={() => setActiveTab('tutorials')}>
                        <PlayCircle size={18} /> Tutoriales para usar esta app
                    </div>
                    <div className={`nav-item ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}><Users size={18} /> Comunidad</div>
                    <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={18} /> Configuración</div>
                </nav>

                {user && (
                    <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <img src={getAvatarUrl()} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                            <div style={{ fontSize: 10, color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                        </div>
                    </div>
                )}


                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                    <button onClick={() => { setTempApiKey(apiKey); setShowApiModal(true); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF", padding: "12px 24px", borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}><Key size={14} /> Configuración API</button>
                    <button
                        onClick={() => { localStorage.removeItem("clickads_user"); router.push("/login"); }}
                        style={{ color: "#4B5563", background: "none", border: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, padding: "0 24px", cursor: "pointer", textAlign: "left" }}
                    >
                        <LogOut size={14} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: 300, flex: 1, padding: "40px 60px", overflowX: 'hidden' }}>

                {/* ===== HOME TAB ===== */}
                {activeTab === 'home' && (
                    <div style={{ maxWidth: 1100 }} className="anim-in">
                        <div className="glass-card" style={{ padding: "24px 32px", marginBottom: 40, borderLeft: "4px solid #25D366", background: "rgba(37, 211, 102, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, color: "#25D366", display: "flex", alignItems: "center", gap: 8 }}>
                                    <MessageSquare size={24} /> Soporte directo incluido
                                </h2>
                                <p style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                                    Si algo no te funciona o no entiendes cómo usar la app, tienes acceso a soporte directo conmigo. Escríbeme antes de pedir una devolución. Mi objetivo es que te funcione y puedas obtener resultados reales.
                                </p>
                            </div>
                            <a href="https://wa.link/nz8huv" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}>
                                <button className="btn-primary" style={{ background: "#25D366", color: "#000", whiteSpace: "nowrap" }}>
                                    Escribir a WhatsApp
                                </button>
                            </a>
                        </div>

                        <div className="glass-card" style={{ padding: "24px 32px", marginBottom: 40, borderLeft: "4px solid #8B5CF6", background: "rgba(139, 92, 246, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, color: "#8B5CF6", display: "flex", alignItems: "center", gap: 8 }}>
                                    <Users size={24} /> ¡ATENCIÓN MUY IMPORTANTE!
                                </h2>
                                <p style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                                    Es increíble e indispensable que ingreses a la comunidad de ClickAds. Hay un grupo de emprendedores gigantes compartiendo valor y resultados. ¡No te quedes por fuera!
                                </p>
                            </div>
                            <a href="https://chat.whatsapp.com/F6OP4KUv1Us2fTd0cbnBUE" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0 }}>
                                <button className="btn-primary" style={{ background: "#8B5CF6", color: "#fff", whiteSpace: "nowrap" }}>
                                    Acceder al Grupo
                                </button>
                            </a>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                            <div>
                                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Bienvenido, {user?.name || "Usuario"}!</h1>
                                <p style={{ color: "#9CA3AF" }}>Este es tu resumen de actividad en ClickAds.</p>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div className="home-stat">
                                    <div style={{ fontSize: 10, fontWeight: 900, color: "#8B5CF6", textTransform: "uppercase" }}>Imágenes Generadas</div>
                                    <div style={{ fontSize: 28, fontWeight: 900 }}>{projects.reduce((acc, p) => acc + (p.results?.length || 0), 0)}</div>
                                </div>
                                <div className="home-stat">
                                    <div style={{ fontSize: 10, fontWeight: 900, color: "#10B981", textTransform: "uppercase" }}>Clases Subidas</div>
                                    <div style={{ fontSize: 28, fontWeight: 900 }}>{modules.reduce((acc, m) => acc + (m.videos?.length || 0), 0)}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
                            <div className="glass-card" style={{ padding: 32 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                                    <PlayCircle size={24} color="#8B5CF6" /> Clases Disponibles
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {modules.flatMap(m => m.videos).slice(0, 2).map((video, idx) => (
                                        <div key={video.id} className="home-proj-row" onClick={() => { setActiveTab('tutorials'); setActiveVideoId(video.id); }}>
                                            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6" }}>
                                                <Play size={20} fill="#8B5CF6" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800, fontSize: 15 }}>{video.title}</div>
                                                <div style={{ fontSize: 12, color: "#6B7280" }}>Módulo de aprendizaje</div>
                                            </div>
                                            <ChevronRight size={18} color="#4B5563" />
                                        </div>
                                    ))}
                                    {modules.flatMap(m => m.videos).length === 1 && (
                                        <div className="home-proj-row" style={{ opacity: 0.5 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>
                                                <PlayCircle size={20} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800, fontSize: 15 }}>Próxima Clase...</div>
                                                <div style={{ fontSize: 12, color: "#6B7280" }}>Contenido en preparación</div>
                                            </div>
                                            <ChevronRight size={18} color="#4B5563" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setActiveTab('tutorials')}
                                    className="btn-primary"
                                    style={{ width: "100%", marginTop: 24, padding: "12px", fontSize: 13, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#9CA3AF" }}
                                >
                                    Ver todos los tutoriales
                                </button>
                            </div>

                            <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
                                <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>Tu Perfil</h2>
                                <div style={{ marginBottom: 24, position: "relative", display: "inline-block" }}>
                                    <div style={{ width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.02)", border: "2px solid rgba(139, 92, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", margin: "0 auto" }}>
                                        {userPhoto ? (
                                            <img src={userPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <User size={48} color="rgba(255,255,255,0.1)" />
                                        )}
                                    </div>
                                    <label style={{ position: "absolute", bottom: 5, right: 5, background: "#8B5CF6", color: "#fff", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #030303", cursor: "pointer" }}>
                                        <Plus size={18} />
                                        <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                                    </label>
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>{user?.name}</h3>
                                <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 24 }}>{user?.email}</p>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className="btn-primary"
                                    style={{ width: "100%", padding: "12px", fontSize: 13, background: "#8B5CF6" }}
                                >
                                    Editar Perfil
                                </button>
                            </div>
                        </div>

                        <div style={{ marginTop: 32 }} className="glass-card">
                            <div style={{ padding: 32, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 12 }}>
                                    <Sparkles size={24} color="#8B5CF6" /> Accesos Rápidos
                                </h2>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, padding: 32 }}>
                                <div className="home-tool-card" onClick={() => setActiveTab('generator')}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6" }}>
                                        <Image size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800 }}>Generador</div>
                                        <div style={{ fontSize: 11, color: "#6B7280" }}>Crea creativos virales</div>
                                    </div>
                                </div>
                                <div className="home-tool-card" onClick={() => setActiveTab('landing')}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                                        <Layout size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800 }}>Landings</div>
                                        <div style={{ fontSize: 11, color: "#6B7280" }}>Diséña secciones web</div>
                                    </div>
                                </div>
                                <div className="home-tool-card" onClick={() => setActiveTab('logo_generator')}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6" }}>
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800 }}>Logotipos</div>
                                        <div style={{ fontSize: 11, color: "#6B7280" }}>Identidad de marca</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {activeTab === 'generator' && (
                    <div style={{ maxWidth: 1100 }}>
                        {!activeProjectId ? (
                            <>
                                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Mis Proyectos</h1>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                                    <div onClick={() => setShowProjectModal(true)} className="project-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, border: "2px dashed rgba(139,92,246,0.3)" }}>
                                        <Plus size={24} /> <span style={{ fontWeight: 800 }}>Nuevo Proyecto</span>
                                    </div>
                                    {projects.filter(p => !p.type || p.type === 'ecommerce').map(project => (
                                        <div key={project.id} onClick={() => setActiveProjectId(project.id)} className="project-card">
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                                                <div style={{ display: "flex", gap: 4 }}>
                                                    <div style={{ width: 32, height: 32, background: project.primaryColor || "#8B5CF6", borderRadius: 8 }} />
                                                    <div style={{ width: 16, height: 32, background: project.secondaryColor || "#FFFFFF", borderRadius: 4 }} />
                                                </div>
                                                <button onClick={(e) => deleteProject(project.id, e)} style={{ background: "none", border: "none", color: "#4B5563", cursor: "pointer" }}><Trash2 size={16} /></button>
                                            </div>
                                            <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: project.font }}>{project.name}</h3>
                                            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{(project.results || []).filter(r => !r.isLanding).length} creativos</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                                        <button onClick={() => setActiveProjectId(null)} style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><ArrowLeft size={16} /> Volver</button>
                                        <button onClick={() => updateActiveProject({ results: [], productPreview: "" })} style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444", padding: "6px 16px", borderRadius: 100, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Empezar de nuevo</button>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.5 }}>PROYECTO ACTIVO</div>
                                        <div style={{ fontWeight: 900, fontSize: 24, fontFamily: activeProject?.font, color: activeProject?.primaryColor }}>{activeProject?.name}</div>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 40 }}>
                                    <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>PRODUCTO</label>
                                                <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 24, height: 260, position: "relative", marginBottom: 24, overflow: "hidden" }}>
                                                    {!activeProject?.productPreview && (
                                                        <input type="file" onChange={handleFileChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                                    )}
                                                    {activeProject?.productPreview ? (
                                                        <>
                                                            <img src={activeProject?.productPreview} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }} />
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); updateActiveProject({ productPreview: "" }); }}
                                                                style={{ position: "absolute", top: 12, right: 12, zIndex: 20, background: "rgba(0, 0, 0, 0.6)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", backdropFilter: "blur(4px)" }}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    ) : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.3 }}><UploadCloud /> <span>Sube tu producto</span></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 4 }}>IMAGEN DE REFERENCIA</label>
                                                <span style={{ display: "block", fontSize: 10, color: "#9CA3AF", marginBottom: 12 }}>(Este paso es opcional y es solo si quieres que tu imagen se parezca a otra imagen que tienes de referencia dentro del ángulo y producto)</span>
                                                <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 16, height: 160, position: "relative", marginBottom: 24, overflow: "hidden" }}>
                                                    {!activeProject?.referencePreview && (
                                                        <input type="file" onChange={handleReferenceChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                                    )}
                                                    {activeProject?.referencePreview ? (
                                                        <>
                                                            <img src={activeProject?.referencePreview} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); updateActiveProject({ referencePreview: "" }); }}
                                                                style={{ position: "absolute", top: 8, right: 8, zIndex: 20, background: "rgba(0, 0, 0, 0.6)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", backdropFilter: "blur(4px)" }}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </>
                                                    ) : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4, opacity: 0.3 }}><Image size={16} /> <span style={{ fontSize: 10 }}>Sube tu Referencia</span></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                                                    <div>
                                                        <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#9CA3AF", marginBottom: 4 }}>Precio (Opcional)</label>
                                                        <input className="input-field" placeholder="Ej: $49.99" value={activeProject?.adPrice || ""} onChange={(e) => updateActiveProject({ adPrice: e.target.value })} style={{ padding: "8px 12px", fontSize: 11 }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#9CA3AF", marginBottom: 4 }}>CTA (Opcional)</label>
                                                        <input className="input-field" placeholder="Ej: Comprar ahora" value={activeProject?.adCta || ""} onChange={(e) => updateActiveProject({ adCta: e.target.value })} style={{ padding: "8px 12px", fontSize: 11 }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 16, height: 100, position: "relative", marginBottom: 0, overflow: "hidden" }}>
                                                    {!activeProject?.logoPreview && (
                                                        <input type="file" onChange={handleLogoChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                                    )}
                                                    {activeProject?.logoPreview ? (
                                                        <>
                                                            <img src={activeProject?.logoPreview} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); updateActiveProject({ logoPreview: "" }); }}
                                                                style={{ position: "absolute", top: 8, right: 8, zIndex: 20, background: "rgba(0, 0, 0, 0.6)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", backdropFilter: "blur(4px)" }}
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </>
                                                    ) : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4, opacity: 0.3 }}><Plus size={16} /> <span style={{ fontSize: 10 }}>Sube tu Logo</span></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>INSTRUCCIONES ADICIONALES</label>
                                                <textarea className="input-field" placeholder="Ej: Resalta la frescura, estilo elegante..." style={{ height: 120 }} value={activeProject?.userPrompt} onChange={(e) => updateActiveProject({ userPrompt: e.target.value })} />
                                            </div>

                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                                <div>
                                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>TAMAÑO DE SALIDA</label>
                                                    <div style={{ position: "relative" }}>
                                                        <select className="input-field" value={selectedOutputSize} onChange={(e) => setSelectedOutputSize(e.target.value)} style={{ paddingLeft: 36 }}>
                                                            {OUTPUT_SIZES.map(sz => <option key={sz.value} value={sz.value}>{sz.label}</option>)}
                                                        </select>
                                                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF" }}>
                                                            <Layout size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>IDIOMA DE SALIDA</label>
                                                    <div style={{ position: "relative" }}>
                                                        <select className="input-field" value={selectedOutputLanguage} onChange={(e) => setSelectedOutputLanguage(e.target.value)} style={{ paddingLeft: 36 }}>
                                                            {OUTPUT_LANGS.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                                                        </select>
                                                        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF" }}>
                                                            <Globe size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>ÁNGULO DE VENTA</label>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                                                    {[
                                                        { id: "HERO", name: "Hero (Impactante)" },
                                                        { id: "TESTIMONIAL", name: "Testimonios" },
                                                        { id: "INFOGRAPHIC", name: "Infografía" },
                                                        { id: "BENEFITS", name: "Beneficios" },
                                                        { id: "BEFORE_AFTER", name: "Antes vs Después" },
                                                        { id: "LIFESTYLE_ELITE", name: "Lifestyle Premium" },
                                                        { id: "WHAT_IS_IT_FOR", name: "¿Para qué sirve?" },
                                                        { id: "PROBLEM_QUESTION", name: "Pregunta Problema" },
                                                        { id: "END_OF_PROBLEM", name: "El Fin de tu Problema" },
                                                        { id: "OVERCOME_LIMITS", name: "Supera tu Problema" },
                                                        { id: "TRANSFORMATION", name: "Transformación" },
                                                        { id: "BEST_FRIEND", name: "Tu Mejor Amigo" },
                                                        { id: "WHY_IS_IT_SPECIAL", name: "¿Por qué es tan especial?" },
                                                        { id: "PROBLEM_VS_SOLUTION", name: "Problema vs Solución" },
                                                        { id: "COMPARISON", name: "Comparativo" }
                                                    ].map(ang => (
                                                        <button
                                                            key={ang.id}
                                                            onClick={() => setSelectedAngle(ang.id)}
                                                            style={{
                                                                padding: "10px 4px",
                                                                borderRadius: 12,
                                                                fontSize: 10,
                                                                fontWeight: 800,
                                                                cursor: "pointer",
                                                                border: selectedAngle === ang.id ? `2px solid ${getIconColor(activeProject?.primaryColor)}` : "1px solid rgba(255,255,255,0.1)",
                                                                background: selectedAngle === ang.id ? `${getIconColor(activeProject?.primaryColor)}20` : "transparent",
                                                                color: selectedAngle === ang.id ? getIconColor(activeProject?.primaryColor) : "#9CA3AF"
                                                            }}
                                                        >
                                                            {ang.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: activeProject?.primaryColor }} onClick={() => handleGenerate(selectedAngle)} disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles /> Generar Creativos</>}</button>
                                        </div>
                                    </div>
                                    <div>
                                        {(activeProject?.results || []).length > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Resultados</h3>
                                                {((activeProject?.results || []).filter(r => !r.isLanding).length) > 1 && (
                                                    <button
                                                        onClick={() => downloadAsZip((activeProject?.results || []).filter(r => !r.isLanding).map((r, idx) => ({ image: r.image, name: `${activeProject?.name || 'proj'}_${idx}` })), "clickads_generador")}
                                                        className="btn-primary"
                                                        style={{ padding: "8px 16px", fontSize: 11, background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProject?.primaryColor || "#8B5CF6"}`, color: activeProject?.primaryColor || "#8B5CF6" }}
                                                    >
                                                        <Layers size={14} /> Descargar Todos (.ZIP)
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                            {(activeProject?.results || []).map((res, i) => {
                                                if (res.isLanding) return null;
                                                return (
                                                    <div key={i} className="glass-card" style={{ padding: 12, position: "relative" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                                            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                                                <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 10, background: activeProject?.primaryColor || "#8B5CF6" }} onClick={() => handleGenerate(res.title, 1)}>Más</button>
                                                                <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 10, background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }} onClick={() => { setRefiningIndex(i); setRefiningText(""); }}>Ajustar</button>
                                                                <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 10, background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }} onClick={() => handleGenerateCopy(i)} disabled={generatingCopyIndex === i}>
                                                                    {generatingCopyIndex === i ? <Loader2 size={12} className="animate-spin" /> : "Copy"}
                                                                </button>
                                                            </div>
                                                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                                <button onClick={() => downloadSingleImage(res.image, activeProject?.name || "image")} style={{ background: "none", border: "none", color: getIconColor(activeProject?.primaryColor), cursor: "pointer" }}><Download size={16} /></button>
                                                                <button onClick={() => saveToLibrary(res.image, res.title || "Mix", res.copy)} style={{ background: "none", border: "none", color: getIconColor(activeProject?.primaryColor), cursor: "pointer" }}>
                                                                    <Bookmark size={16} fill={library.some(a => a.image === res.image) ? getIconColor(activeProject?.primaryColor) : "none"} />
                                                                </button>
                                                                <button onClick={() => setZoomedImage(res.image)} style={{ background: "none", border: "none", color: getIconColor(activeProject?.primaryColor), cursor: "pointer" }}>
                                                                    <Search size={16} />
                                                                </button>
                                                            </div>

                                                        </div>
                                                        <div
                                                            style={{ position: "relative", cursor: "zoom-in", overflow: "hidden", borderRadius: 16 }}
                                                            onClick={() => setZoomedImage(res.image)}
                                                            className="image-zoom-container"
                                                        >
                                                            <img src={res.image} style={{ width: "100%", transition: "transform 0.3s ease" }} className="hover-zoom" />
                                                            <div className="zoom-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s ease" }}>
                                                                <Search size={32} color="#fff" />
                                                            </div>
                                                        </div>


                                                        {refiningIndex === i && (
                                                            <div className="anim-in" style={{ marginTop: 12, padding: 12, background: "rgba(139,92,246,0.1)", borderRadius: 12, border: "1px solid rgba(139,92,246,0.2)" }}>
                                                                <label style={{ display: "block", fontSize: 9, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 8 }}>¿QUÉ QUIERES CAMBIAR?</label>
                                                                <textarea
                                                                    className="input-field"
                                                                    placeholder="Ej: Pon a una mujer usándolo, cambia el fondo a azul..."
                                                                    value={refiningText}
                                                                    onChange={(e) => setRefiningText(e.target.value)}
                                                                    style={{ height: 60, fontSize: 11, marginBottom: 10 }}
                                                                />
                                                                <div style={{ display: "flex", gap: 8 }}>
                                                                    <button
                                                                        disabled={isRefining}
                                                                        className="btn-primary"
                                                                        style={{ flex: 1, padding: "8px", fontSize: 10 }}
                                                                        onClick={() => handleRefine(i)}
                                                                    >
                                                                        {isRefining ? <Loader2 className="animate-spin" size={14} /> : "APLICAR CAMBIOS"}
                                                                    </button>
                                                                    <button className="btn-primary" style={{ padding: "8px 12px", fontSize: 10, background: "transparent", color: "#9CA3AF" }} onClick={() => setRefiningIndex(null)}>X</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {res.copy && (
                                                            <div style={{ marginTop: 12, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                                                                <div style={{ fontSize: 10, fontWeight: 900, color: activeProject?.primaryColor || "#8B5CF6", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                    AD COPY SUGERIDO
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(res.copy || "");
                                                                            setToast({ msg: "Copy copiado al portapapeles", type: 'success' });
                                                                        }}
                                                                        style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 9, fontWeight: 700 }}
                                                                    >
                                                                        COPIAR
                                                                    </button>
                                                                </div>
                                                                <div style={{ fontSize: 11, color: "#D1D5DB", whiteSpace: "pre-wrap", lineHeight: "1.5", maxHeight: 150, overflowY: "auto" }}>
                                                                    {res.copy}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'photo_studio' && (
                    <div style={{ maxWidth: 1100 }}>
                        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Photo Studio</h1>
                        <p style={{ color: "#9CA3AF", fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
                            Sube una foto de tu producto tomada con el teléfono. La Inteligencia Artificial eliminará el fondo, ajustará la iluminación y generará fotos en diferentes ángulos con fondo blanco puro, listas para usar en tus e-commerce.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                            <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#8B5CF6", marginBottom: 12 }}>FOTO DEL PRODUCTO (TELÉFONO)</label>
                                        <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 24, height: 260, position: "relative", marginBottom: 24, overflow: "hidden" }}>
                                            <input type="file" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setStudioInputImage(reader.result as string);
                                                    reader.readAsDataURL(file);
                                                }
                                            }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                            {studioInputImage ? <img src={studioInputImage} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.3 }}><UploadCloud /> <span>Sube tu foto aquí</span></div>}
                                        </div>
                                    </div>

                                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "#8B5CF6" }} onClick={handleGenerateStudio} disabled={isStudioLoading}>
                                        {isStudioLoading ? <Loader2 className="animate-spin" /> : <><Sparkles /> Generar en Alta Calidad</>}
                                    </button>
                                </div>
                            </div>

                            <div>
                                {(studioResults || []).length > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 800 }}>Resultados Full HD</h3>
                                        {studioResults.length > 1 && (
                                            <button
                                                onClick={() => downloadAsZip(studioResults.map((r, idx) => ({ image: r.image, name: `PhotoStudio_${idx}` })), "PhotoStudio_Results")}
                                                className="btn-primary"
                                                style={{ padding: "8px 16px", fontSize: 11, background: "rgba(255,255,255,0.05)", border: `1px solid #8B5CF6`, color: "#8B5CF6" }}
                                            >
                                                <Layers size={14} /> Descargar Todos (.ZIP)
                                            </button>
                                        )}
                                    </div>
                                )}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    {(studioResults || []).map((res, i) => (
                                        <div key={i} className="glass-card" style={{ padding: 12, position: "relative" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                                <div style={{ fontSize: 10, fontWeight: 800, color: "#8B5CF6" }}>{res.angle}</div>
                                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                    <button onClick={() => downloadSingleImage(res.image, `PhotoStudio_${i}.jpg`)} style={{ background: "none", border: "none", color: "#8B5CF6", cursor: "pointer" }}><Download size={16} /></button>
                                                    <button onClick={() => saveToLibrary(res.image, res.angle || "Photo Studio")} style={{ background: "none", border: "none", color: "#8B5CF6", cursor: "pointer" }}>
                                                        <Bookmark size={16} fill={library.some(a => a.image === res.image) ? "#8B5CF6" : "none"} />
                                                    </button>
                                                    <button onClick={() => setZoomedImage(res.image)} style={{ background: "none", border: "none", color: "#8B5CF6", cursor: "pointer" }}>
                                                        <Search size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div
                                                style={{ position: "relative", cursor: "zoom-in", overflow: "hidden", borderRadius: 16 }}
                                                onClick={() => setZoomedImage(res.image)}
                                                className="image-zoom-container"
                                            >
                                                <img src={res.image} style={{ width: "100%", transition: "transform 0.3s ease" }} className="hover-zoom" />
                                                <div className="zoom-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s ease" }}>
                                                    <Search size={32} color="#fff" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {
                    activeTab === 'community' && (
                        <div style={{ height: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <a
                                href="https://chat.whatsapp.com/F6OP4KUv1Us2fTd0cbnBUE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{
                                    padding: "48px 80px",
                                    fontSize: "32px",
                                    borderRadius: "32px",
                                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                                    boxShadow: "0 20px 50px rgba(37, 211, 102, 0.4)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "24px",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <Users size={64} />
                                <span style={{ fontWeight: 900, letterSpacing: "1px" }}>ACCEDER A COMUNIDAD</span>
                            </a>
                        </div>
                    )
                }




                {
                    activeTab === 'tutorials' && (
                        <div style={{ padding: "0 20px", maxWidth: "1200px", margin: "0 auto" }}>
                            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 20 }}>Tutoriales de ClickAds</h1>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Tutorial para instalar la Api Key</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/a67e625210d74984aade36da888237ac"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Tutorial para usar esta app</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/8c02cb996ae34fe4b5e445f44c096250"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 60, display: "flex", justifyContent: "center" }}>
                                <a href="https://wa.link/1jfhfr" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "16px 36px", fontSize: 18, borderRadius: 100, display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)" }}>
                                    <MessageSquare size={20} />
                                    Comunícate con nosotros
                                </a>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'settings' && (
                        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Configuración de Perfil</h1>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 60 }}>
                                <div className="glass-card" style={{ padding: 40, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ marginBottom: 32, position: "relative" }}>
                                        <div style={{ width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "2px solid rgba(139, 92, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                            {userPhoto ? (
                                                <img src={userPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: 0.3 }}>
                                                    <User size={64} />
                                                    <span style={{ fontSize: 12, fontWeight: 700 }}>SIN FOTO</span>
                                                </div>
                                            )}
                                        </div>
                                        <label style={{ position: "absolute", bottom: 10, right: 10, background: "#8B5CF6", color: "#fff", width: 54, height: 54, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #030303", cursor: "pointer", transition: "0.2s" }} className="hover-scale">
                                            <Plus />
                                            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                                        </label>
                                    </div>
                                    <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>{user?.name}</h3>
                                    <p style={{ color: "#4B5563", fontSize: 14 }}>{user?.email}</p>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                    <div className="glass-card" style={{ padding: 32 }}>
                                        <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Sube tu cara</h4>
                                        <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                                            Utiliza una foto clara de tu rostro. Esta foto se usará como tu identidad en la comunidad ClickAds y en tu perfil personal.
                                        </p>
                                        <label className="btn-primary" style={{ display: "inline-flex", justifyContent: "center", cursor: "pointer" }}>
                                            <UploadCloud size={20} /> Seleccionar Foto
                                            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                                        </label>
                                    </div>

                                    <div className="glass-card" style={{ padding: 32 }}>
                                        <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Datos de Acceso</h4>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                            <div>
                                                <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", textTransform: "uppercase" }}>Nombre Registrado</label>
                                                <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: 600 }}>{user?.name}</div>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", textTransform: "uppercase" }}>Email de Cuenta</label>
                                                <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: 600 }}>{user?.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card" style={{ padding: 32 }}>
                                        <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Google AI API Key</h4>
                                        <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                                            Conecta tu propia llave de Google AI Studio (Gemini) para tener generaciones ilimitadas y gratuitas.
                                        </p>
                                        <div style={{ display: "flex", gap: 12 }}>
                                            <input
                                                type="password"
                                                className="input-field"
                                                placeholder="Introduce tu API Key..."
                                                value={tempApiKey}
                                                onChange={(e) => setTempApiKey(e.target.value)}
                                                style={{ marginBottom: 0 }}
                                            />
                                            <button
                                                onClick={() => {
                                                    setApiKey(tempApiKey);
                                                    localStorage.setItem(getUKey("clickads_api_key"), tempApiKey);
                                                    localStorage.setItem("clickads_api_key_global", tempApiKey); // Guardar también global para persistencia total
                                                    setToast({ msg: "API Key guardada correctamente", type: 'success' });
                                                }}
                                                className="btn-primary"
                                                style={{ padding: "0 24px" }}
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="glass-card" style={{ padding: 32 }}>
                                        <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Acceso Administrador</h4>
                                        {isAdmin ? (
                                            <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10B981", padding: 20, borderRadius: 16, color: "#10B981", fontWeight: 800, display: "flex", gap: 12, alignItems: "center" }}>
                                                <ShieldCheck size={24} /> MODO ADMIN ACTIVADO
                                                <button
                                                    onClick={() => {
                                                        setIsAdmin(false);
                                                        localStorage.removeItem(getUKey("clickads_admin_mode"));
                                                        setToast({ msg: "Modo Admin desactivado", type: 'success' });
                                                    }}
                                                    style={{ marginLeft: "auto", background: "none", border: "none", color: "#EF4444", fontSize: 11, fontWeight: 900, cursor: "pointer", textTransform: "uppercase" }}
                                                >
                                                    Desactivar
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                                                    Si eres parte del equipo de ClickAds, introduce tu clave secreta para gestionar contenido.
                                                </p>
                                                <div style={{ display: "flex", gap: 12 }}>
                                                    <input
                                                        type="password"
                                                        className="input-field"
                                                        placeholder="Clave secreta..."
                                                        value={secretKey}
                                                        onChange={(e) => setSecretKey(e.target.value)}
                                                        style={{ marginBottom: 0 }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            if (secretKey === "CLICKADS2025") {
                                                                setIsAdmin(true);
                                                                localStorage.setItem(getUKey("clickads_admin_mode"), "true");
                                                                setToast({ msg: "Acceso Administrador concedido", type: 'success' });
                                                                setSecretKey("");
                                                            } else {
                                                                setToast({ msg: "Clave incorrecta", type: 'error' });
                                                            }
                                                        }}
                                                        className="btn-primary"
                                                        style={{ padding: "0 24px" }}
                                                    >
                                                        Activar
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'library' && (
                        <div style={{ maxWidth: 1100 }}>
                            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Mi Biblioteca</h1>

                            {library.length > 0 && (
                                <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 8 }}>
                                    <div className={`community-cat ${libProjectFilter === 'all' ? 'active' : ''}`} onClick={() => setLibProjectFilter('all')}>Todos</div>
                                    {Array.from(new Set(library.map(ad => ad.projectName))).map(pName => (
                                        <div key={pName} className={`community-cat ${libProjectFilter === pName ? 'active' : ''}`} onClick={() => setLibProjectFilter(pName)}>
                                            {pName}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 24 }}>
                                {library.filter(ad => libProjectFilter === 'all' || ad.projectName === libProjectFilter).map(ad => (
                                    <div key={ad.id} className="glass-card" style={{ padding: 12, position: "relative" }}>
                                        <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8, zIndex: 10 }}>
                                            <button onClick={() => removeFromLibrary(ad.id)} style={{ background: "rgba(239, 68, 68, 0.2)", border: "none", color: "#EF4444", width: 32, height: 32, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
                                        </div>
                                        <div
                                            style={{ position: "relative", cursor: "zoom-in", overflow: "hidden", borderRadius: 12 }}
                                            onClick={() => setZoomedImage(ad.image)}
                                            className="image-zoom-container"
                                        >
                                            <img src={ad.image} style={{ width: "100%", transition: "transform 0.3s ease" }} className="hover-zoom" />
                                            <div className="zoom-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s ease" }}>
                                                <Search size={24} color="#fff" />
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>{ad.projectName}</div>
                                            <button onClick={() => downloadSingleImage(ad.image, ad.projectName)} style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", borderRadius: 8, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 900 }}>
                                                <Download size={14} /> Descargar
                                            </button>
                                        </div>

                                        {ad.copy && (
                                            <div style={{ marginTop: 12, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                                                <div style={{ fontSize: 10, fontWeight: 900, color: "#8B5CF6", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    AD COPY GUARDADO
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(ad.copy || "");
                                                            setToast({ msg: "Copy copiado al portapapeles", type: 'success' });
                                                        }}
                                                        style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 9, fontWeight: 700, padding: "4px 8px" }}
                                                    >
                                                        COPIAR
                                                    </button>
                                                </div>
                                                <div style={{ fontSize: 11, color: "#D1D5DB", whiteSpace: "pre-wrap", lineHeight: "1.5", maxHeight: 100, overflowY: "auto" }}>
                                                    {ad.copy}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }




                {
                    activeTab === 'logo_generator' && (
                        <div style={{ maxWidth: 1000, margin: "0 auto" }} className="anim-in">
                            <div style={{ marginBottom: 40, textAlign: "center" }}>
                                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Diseña tu Logotipo</h1>
                                <p style={{ color: "#9CA3AF", fontSize: 16 }}>Creamos una identidad visual coherente con tu sector y colores favoritos.</p>
                            </div>

                            {logoStep === 0 && (
                                <div className="glass-card" style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase" }}>Nombre de tu Negocio</label>
                                            <input className="input-field" placeholder="Ej: ClickAds Pro, BarberShop..." value={logoBusinessName} onChange={(e) => setLogoBusinessName(e.target.value)} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase" }}>Sector / Industria</label>
                                            <input className="input-field" placeholder="Ej: Ecommerce de Belleza, Tecnología..." value={logoSector} onChange={(e) => setLogoSector(e.target.value)} />
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                            <ColorPicker label="Color Primario" color={logoPrimaryColor} onChange={setLogoPrimaryColor} />
                                            <ColorPicker label="Color Secundario" color={logoSecondaryColor} onChange={setLogoSecondaryColor} />
                                        </div>
                                        <button
                                            className="btn-primary"
                                            style={{ width: "100%", justifyContent: "center", marginTop: 12, height: 60, fontSize: 18, borderRadius: 20, background: logoPrimaryColor }}
                                            onClick={() => handleGenerateLogo(false)}
                                            disabled={isGeneratingLogo}
                                        >
                                            {isGeneratingLogo ? <Loader2 className="animate-spin" /> : <><Sparkles /> GENERAR LOGO PROFESIONAL</>}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {logoStep === 1 && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }} className="anim-in">
                                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                        <div className="glass-card" style={{ padding: 40, border: "2px solid #8B5CF6", position: "relative", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {isGeneratingLogo ? (
                                                <div style={{ textAlign: "center" }}>
                                                    <Loader2 className="animate-spin" size={48} style={{ color: logoPrimaryColor, margin: "0 auto 16px" }} />
                                                    <p style={{ fontWeight: 800 }}>Generando tu logo...</p>
                                                </div>
                                            ) : (
                                                <img src={finalLogo || ""} style={{ width: "100%", borderRadius: 24 }} />
                                            )}
                                        </div>
                                        {!isGeneratingLogo && finalLogo && (
                                            <button
                                                onClick={() => downloadSingleImage(finalLogo, `${logoBusinessName}_logo`)}
                                                className="btn-primary"
                                                style={{ width: "100%", background: "#10B981", height: 60, fontSize: 18 }}
                                            >
                                                <Download /> DESCARGAR ESTE LOGO
                                            </button>
                                        )}
                                    </div>

                                    <div className="glass-card" style={{ padding: 40, minHeight: 400 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6" }}>
                                                <Edit3 size={20} />
                                            </div>
                                            <h2 style={{ fontSize: 24, fontWeight: 900 }}>Perfeccionar Logo</h2>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "#8B5CF6", marginBottom: 12, textTransform: "uppercase" }}>¿Qué te gustó de este logo?</label>
                                                <textarea
                                                    className="input-field"
                                                    placeholder="Ej: El símbolo me encanta, la tipografía es limpia..."
                                                    style={{ height: 100, fontSize: 13 }}
                                                    value={logoLikedFeedback}
                                                    onChange={(e) => setLogoLikedFeedback(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 900, color: "#EF4444", marginBottom: 12, textTransform: "uppercase" }}>¿Qué no te gustó o quieres cambiar?</label>
                                                <textarea
                                                    className="input-field"
                                                    placeholder="Ej: El color es muy oscuro, haz el icono más pequeño..."
                                                    style={{ height: 100, fontSize: 13 }}
                                                    value={logoDislikedFeedback}
                                                    onChange={(e) => setLogoDislikedFeedback(e.target.value)}
                                                />
                                            </div>

                                            <button
                                                disabled={isGeneratingLogo || (!logoLikedFeedback && !logoDislikedFeedback)}
                                                onClick={() => handleGenerateLogo(true)}
                                                className="btn-primary"
                                                style={{ width: "100%", background: logoPrimaryColor, height: 60, fontSize: 16 }}
                                            >
                                                {isGeneratingLogo ? <Loader2 className="animate-spin" /> : <><Sparkles /> GENERAR OTRA VERSIÓN REFINADA</>}
                                            </button>

                                            <button
                                                onClick={() => setLogoStep(0)}
                                                style={{ width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF", padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                            >
                                                Empezar desde cero
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }

                {
                    activeTab === 'landing' && (
                        <div style={{ maxWidth: 1100 }} className="anim-in">
                            {!activeProjectId ? (
                                <>
                                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Mis Proyectos (Landing)</h1>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                                        <div onClick={() => setShowProjectModal(true)} className="project-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, border: "2px dashed rgba(139,92,246,0.3)" }}>
                                            <Plus size={24} /> <span style={{ fontWeight: 800 }}>Nuevo Proyecto</span>
                                        </div>
                                        {projects.map(project => (
                                            <div key={project.id} onClick={() => setActiveProjectId(project.id)} className="project-card" style={{ cursor: "pointer" }}>
                                                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                                                    <div style={{ width: 32, height: 32, background: project.primaryColor || "#8B5CF6", borderRadius: 8 }} />
                                                    <div style={{ width: 16, height: 32, background: project.secondaryColor || "#FFFFFF", borderRadius: 4 }} />
                                                </div>
                                                <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: project.font }}>{project.name}</h3>
                                                <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>Seleccionar este proyecto</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                                        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                                            <button onClick={() => setActiveProjectId(null)} style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><ArrowLeft size={16} /> Volver</button>
                                            <h1 style={{ fontSize: 24, fontWeight: 900 }}>Generador de Landing Page</h1>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.5 }}>PROYECTO ACTIVO</div>
                                            <div style={{ fontWeight: 900, fontSize: 24, fontFamily: activeProject?.font, color: activeProject?.primaryColor }}>{activeProject?.name}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 40 }}>
                                        <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                                <div>
                                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>PRODUCTO</label>
                                                    <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 24, height: 260, position: "relative", marginBottom: 24, overflow: "hidden" }}>
                                                        <input type="file" onChange={handleFileChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                                        {activeProject?.productPreview ? <img src={activeProject?.productPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.3 }}><UploadCloud /> <span>Sube tu producto</span></div>}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 16, height: 100, position: "relative", marginBottom: 0, overflow: "hidden" }}>
                                                        <input type="file" onChange={handleLogoChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                                        {activeProject?.logoPreview ? <img src={activeProject?.logoPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4, opacity: 0.3 }}><Plus size={16} /> <span style={{ fontSize: 10 }}>Sube tu Logo</span></div>}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>INSTRUCCIONES ADICIONALES</label>
                                                    <textarea className="input-field" placeholder="Menciona detalles técnicos, beneficios clave..." style={{ height: 120 }} value={activeProject?.userPrompt} onChange={(e) => updateActiveProject({ userPrompt: e.target.value })} />
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                                    <div>
                                                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>TAMAÑO</label>
                                                        <select className="input-field" value={selectedOutputSize} onChange={(e) => setSelectedOutputSize(e.target.value)}>
                                                            {OUTPUT_SIZES.map(sz => <option key={sz.value} value={sz.value}>{sz.label}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>IDIOMA</label>
                                                        <select className="input-field" value={selectedOutputLanguage} onChange={(e) => setSelectedOutputLanguage(e.target.value)}>
                                                            {OUTPUT_LANGS.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>SECCIÓN A GENERAR</label>
                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
                                                        {[
                                                            'Hero', 'Oferta', 'Antes/Después', 'Beneficios', 'Tabla Comparativa', 'Testimonios', 'Prueba de Autoridad', 'Modo de Uso', 'Logística', 'Preguntas Frecuentes'
                                                        ].map(cat => (
                                                            <button
                                                                key={cat}
                                                                onClick={() => { setLandingCategory(cat); updateActiveProject({ landingCategory: cat }); }}
                                                                style={{
                                                                    padding: "12px 4px",
                                                                    borderRadius: 12,
                                                                    fontSize: 10,
                                                                    fontWeight: 800,
                                                                    cursor: "pointer",
                                                                    border: landingCategory === cat ? `2px solid ${getIconColor(activeProject?.primaryColor)}` : "1px solid rgba(255,255,255,0.1)",
                                                                    background: landingCategory === cat ? `${getIconColor(activeProject?.primaryColor)}20` : "transparent",
                                                                    color: landingCategory === cat ? getIconColor(activeProject?.primaryColor) : "#9CA3AF"
                                                                }}
                                                            >
                                                                {cat}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {landingCategory === 'Oferta' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>Configurar Precios de la Oferta (Móvil)</label>
                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                                            <input className="input-field" placeholder="Precio x1 (Ej: $39.99)" value={lPrice1} onChange={(e) => { setLPrice1(e.target.value); updateActiveProject({ lPrice1: e.target.value }); }} />
                                                            <input className="input-field" placeholder="Precio x2 (Ej: $69.99)" value={lPrice2} onChange={(e) => { setLPrice2(e.target.value); updateActiveProject({ lPrice2: e.target.value }); }} />
                                                            <input className="input-field" placeholder="Precio x3 (Ej: $99.99)" value={lPrice3} onChange={(e) => { setLPrice3(e.target.value); updateActiveProject({ lPrice3: e.target.value }); }} />
                                                            <input className="input-field" placeholder="Precio x4 (Ej: $129.99)" value={lPrice4} onChange={(e) => { setLPrice4(e.target.value); updateActiveProject({ lPrice4: e.target.value }); }} />
                                                        </div>
                                                        <p style={{ fontSize: 10, color: "#6B7280", marginTop: 10 }}>* Estos precios aparecerán en los packs de tu diseño.</p>
                                                    </div>
                                                )}

                                                {landingCategory === 'Antes/Después' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>Transformación del Cliente</label>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                                            <textarea className="input-field" placeholder="SITUACIÓN ANTES (Ej: Fatiga, cansancio extremo, dolor articular...)" value={lBefore} onChange={(e) => { setLBefore(e.target.value); updateActiveProject({ lBefore: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
                                                            <textarea className="input-field" placeholder="SITUACIÓN DESPUÉS (Ej: Energía total, recuperación rápida, vida activa...)" value={lAfter} onChange={(e) => { setLAfter(e.target.value); updateActiveProject({ lAfter: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
                                                        </div>
                                                        <p style={{ fontSize: 10, color: "#6B7280", marginTop: 10 }}>* Describe el dolor vs la solución para generar el diseño comparativo.</p>
                                                    </div>
                                                )}

                                                {landingCategory === 'Beneficios' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>Puntos Clave / Beneficios</label>
                                                        <textarea className="input-field" placeholder="Ej: - Recuperación Rápida, - Energía Prolongada, - Sabor Increíble... " value={lBenefits} onChange={(e) => { setLBenefits(e.target.value); updateActiveProject({ lBenefits: e.target.value }); }} style={{ height: 100, fontSize: 13 }} />
                                                        <p style={{ fontSize: 10, color: "#6B7280", marginTop: 10 }}>* Lista 3 o 5 beneficios para un diseño equilibrado.</p>
                                                    </div>
                                                )}

                                                {landingCategory === 'Tabla Comparativa' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>Nosotros vs Ellos</label>
                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                                                            <textarea className="input-field" placeholder="TU MARCA (PROS): Ej: - Envío Seguro, - Calidad Premium..." value={lCompBrand} onChange={(e) => { setLCompBrand(e.target.value); updateActiveProject({ lCompBrand: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
                                                            <textarea className="input-field" placeholder="OTROS (CONTRAS): Ej: - Envío 15 días, - Baja resolución..." value={lCompOthers} onChange={(e) => { setLCompOthers(e.target.value); updateActiveProject({ lCompOthers: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
                                                        </div>
                                                    </div>
                                                )}

                                                {landingCategory === 'Testimonios' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>Historias de Clientes</label>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                                            <textarea className="input-field" placeholder="Testimonio 1 (Ej: ¡Me encantó el producto! ...)" value={lTest1} onChange={(e) => { setLTest1(e.target.value); updateActiveProject({ lTest1: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
                                                            <textarea className="input-field" placeholder="Testimonio 2 (Ej: Increíble calidad y envío rápido ...)" value={lTest2} onChange={(e) => { setLTest2(e.target.value); updateActiveProject({ lTest2: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
                                                            <textarea className="input-field" placeholder="Testimonio 3 (Ej: Lo recomiendo al 100% ...)" value={lTest3} onChange={(e) => { setLTest3(e.target.value); updateActiveProject({ lTest3: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
                                                        </div>
                                                    </div>
                                                )}

                                                {landingCategory === 'Prueba de Autoridad' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>Validación Profesional</label>
                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                                                            <input className="input-field" placeholder="Nombre del Experto (Ej: Dra. Elena Ruiz)" value={lAuthExpert} onChange={(e) => { setLAuthExpert(e.target.value); updateActiveProject({ lAuthExpert: e.target.value }); }} />
                                                            <input className="input-field" placeholder="Su Especialidad (Ej: Dermatóloga Clínica)" value={lAuthTitle} onChange={(e) => { setLAuthTitle(e.target.value); updateActiveProject({ lAuthTitle: e.target.value }); }} />
                                                            <textarea className="input-field" placeholder="Lo que testifica el experto (Ej: Recomiendo este producto por sus componentes...)" value={lAuthQuote} onChange={(e) => { setLAuthQuote(e.target.value); updateActiveProject({ lAuthQuote: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
                                                        </div>
                                                        <p style={{ fontSize: 10, color: "#6B7280", marginTop: 10 }}>* Se generará un modelo fotorrealista con uniforme profesional.</p>
                                                    </div>
                                                )}

                                                {landingCategory === 'Modo de Uso' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>Manual de Uso (Pasos)</label>
                                                        <textarea className="input-field" placeholder="1. Paso uno... 2. Paso dos... 3. Disfruta..." value={lUsage} onChange={(e) => { setLUsage(e.target.value); updateActiveProject({ lUsage: e.target.value }); }} style={{ height: 100, fontSize: 13 }} />
                                                        <p style={{ fontSize: 10, color: "#6B7280", marginTop: 10 }}>* Describe 3 pasos para que la IA genere las fotos secuenciales.</p>
                                                    </div>
                                                )}

                                                {landingCategory === 'Logística' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>Información de Envío y Pago</label>
                                                        <textarea className="input-field" placeholder="Ej: Envío Seguro a todo el país, Pago Contraentrega, Recibe en 2-3 días..." value={lLogistics} onChange={(e) => { setLLogistics(e.target.value); updateActiveProject({ lLogistics: e.target.value }); }} style={{ height: 100, fontSize: 13 }} />
                                                        <p style={{ fontSize: 10, color: "#6B7280", marginTop: 10 }}>* Describe transportistas o métodos de pago para incluirlos como logos.</p>
                                                    </div>
                                                )}

                                                {landingCategory === 'Preguntas Frecuentes' && (
                                                    <div className="anim-in" style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 20, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 20 }}>
                                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 16, textTransform: "uppercase" }}>Preguntas Frecuentes (Máx. 10)</label>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: 400, overflowY: "auto", paddingRight: 8 }}>
                                                            {lFaqs.map((faq, idx) => (
                                                                <div key={idx} style={{ padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                                                                    <p style={{ fontSize: 10, fontWeight: 900, marginBottom: 8, color: activeProject?.primaryColor }}>FAQ {idx + 1}</p>
                                                                    <input
                                                                        className="input-field"
                                                                        placeholder="Escribe la pregunta..."
                                                                        value={faq.q}
                                                                        onChange={(e) => {
                                                                            const newFaqs = [...lFaqs];
                                                                            newFaqs[idx] = { ...newFaqs[idx], q: e.target.value };
                                                                            setLFaqs(newFaqs);
                                                                            updateActiveProject({ lFaqs: newFaqs });
                                                                        }}
                                                                        style={{ marginBottom: 8 }}
                                                                    />
                                                                    <textarea
                                                                        className="input-field"
                                                                        placeholder="Escribe la respuesta..."
                                                                        value={faq.a}
                                                                        onChange={(e) => {
                                                                            const newFaqs = [...lFaqs];
                                                                            newFaqs[idx] = { ...newFaqs[idx], a: e.target.value };
                                                                            setLFaqs(newFaqs);
                                                                            updateActiveProject({ lFaqs: newFaqs });
                                                                        }}
                                                                        style={{ height: 60, fontSize: 12 }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <button
                                                    className="btn-primary"
                                                    style={{ width: "100%", justifyContent: "center", background: activeProject?.primaryColor }}
                                                    disabled={isLandingLoading}
                                                    onClick={handleGenerateLanding}
                                                >
                                                    {isLandingLoading ? <Loader2 className="animate-spin" /> : <><Layout size={20} /> GENERAR SECCIÓN</>}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="glass-card" style={{ padding: 40, background: "rgba(0,0,0,0.3)", position: "relative", minHeight: 600 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Resultados</h3>
                                                {landingResults && (
                                                    <button
                                                        onClick={() => downloadSingleImage(landingResults.image, `Landing_${landingCategory}.jpg`)}
                                                        className="btn-primary"
                                                        style={{ padding: "8px 16px", fontSize: 11, background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProject?.primaryColor || "#8B5CF6"}`, color: activeProject?.primaryColor || "#8B5CF6" }}
                                                    >
                                                        <Download size={14} /> Descargar
                                                    </button>
                                                )}
                                            </div>
                                            {landingResults ? (
                                                <div style={{ position: "relative" }}>
                                                    <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                                                        <button
                                                            onClick={() => setShowLandingRefine(!showLandingRefine)}
                                                            className="btn-primary"
                                                            style={{ flex: 1, padding: "12px 16px", fontSize: 12, background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProject?.primaryColor || "#8B5CF6"}`, color: activeProject?.primaryColor || "#8B5CF6" }}
                                                        >
                                                            🎨 Ajustar esta pieza
                                                        </button>
                                                        <button
                                                            onClick={() => saveToLibrary(landingResults.image, landingResults.angle)}
                                                            className="btn-primary"
                                                            style={{ padding: "12px 16px", fontSize: 12, background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProject?.primaryColor || "#8B5CF6"}`, color: activeProject?.primaryColor || "#8B5CF6" }}
                                                        >
                                                            <Bookmark size={18} fill={library.some(a => a.image === landingResults.image) ? (activeProject?.primaryColor || "#8B5CF6") : "none"} />
                                                        </button>
                                                        <button
                                                            onClick={() => setZoomedImage(landingResults.image)}
                                                            className="btn-primary"
                                                            style={{ padding: "12px 16px", fontSize: 12, background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProject?.primaryColor || "#8B5CF6"}`, color: activeProject?.primaryColor || "#8B5CF6" }}
                                                        >
                                                            <Search size={18} />
                                                        </button>
                                                    </div>


                                                    {showLandingRefine && (
                                                        <div className="anim-in" style={{ marginBottom: 24, padding: 24, background: "rgba(139,92,246,0.1)", borderRadius: 24, border: "1px solid rgba(139,92,246,0.2)" }}>
                                                            <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: activeProject?.primaryColor, marginBottom: 12, textTransform: "uppercase" }}>¿Qué debería cambiar en este diseño?</label>
                                                            <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 16 }}>Describe qué no te gustó o qué detalle técnico debemos corregir.</p>
                                                            <textarea
                                                                className="input-field"
                                                                placeholder="Ej: No me gusta el modelo, cámbialo por una mujer joven. Haz el título en color rojo..."
                                                                value={refiningText}
                                                                onChange={(e) => setRefiningText(e.target.value)}
                                                                style={{ height: 100, fontSize: 13, marginBottom: 20 }}
                                                            />
                                                            <div style={{ display: "flex", gap: 12 }}>
                                                                <button
                                                                    disabled={isRefining}
                                                                    className="btn-primary"
                                                                    style={{ flex: 1, padding: "14px", fontSize: 12 }}
                                                                    onClick={() => handleRefine(0, true)}
                                                                >
                                                                    {isRefining ? <Loader2 className="animate-spin" size={16} /> : "REFINAR DISEÑO"}
                                                                </button>
                                                                <button className="btn-primary" style={{ padding: "14px", fontSize: 12, background: "transparent", border: "none", color: "#9CA3AF" }} onClick={() => { setShowLandingRefine(false); setRefiningText(""); }}>CANCELAR</button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div
                                                        style={{ position: "relative", cursor: "zoom-in", overflow: "hidden", borderRadius: 24 }}
                                                        onClick={() => setZoomedImage(landingResults.image)}
                                                        className="image-zoom-container"
                                                    >
                                                        <img src={landingResults.image} style={{ width: "100%", transition: "transform 0.3s ease" }} className="hover-zoom" />
                                                        <div className="zoom-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s ease" }}>
                                                            <Search size={48} color="#fff" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ height: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.1)", textAlign: "center" }}>
                                                    <Globe size={48} style={{ marginBottom: 16 }} />
                                                    <p style={{ fontWeight: 700 }}>La sección aparecerá aquí</p>
                                                    <p style={{ fontSize: 12, opacity: 0.5, marginTop: 8 }}>Potencia tu landing page con diseños únicos.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }

                {/* ===== ANÁLISIS FINANCIERO TAB ===== */}
                {
                    activeTab === 'research' && (
                        <div style={{ maxWidth: 1000 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                                <div>
                                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                                        <Search size={28} color="#8B5CF6" /> Investigación de Producto Profesional
                                    </h1>
                                    <p style={{ color: "#9CA3AF" }}>Descubre ángulos de venta, objeciones y una radiografía exacta de tu mercado en formato detallado.</p>
                                </div>
                            </div>

                            {researchResults ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <button onClick={() => setResearchResults(null)} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, padding: 0 }}><ArrowLeft size={16} /> {researchName}</button>
                                            <div style={{ color: "#6B7280", fontSize: 12, marginTop: 8 }}>Realizado con Inteligencia Artificial Experta</div>
                                        </div>
                                        <button onClick={() => window.print()} className="btn-primary" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#E5E7EB", padding: "10px 20px", fontSize: 13 }}>
                                            <Download size={16} /> Descargar PDF
                                        </button>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {researchResults.map((res, i) => {
                                            const mod = RESEARCH_MODULES[i] || { title: `Punto ${i + 1}`, desc: "Información detallada sobre este aspecto del producto." };
                                            const isExpanded = expandedResearch === i;
                                            return (
                                                <div key={i} className="print-module" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, overflow: "hidden", transition: "0.3s" }}>
                                                    <div className="print-module-header" onClick={() => setExpandedResearch(isExpanded ? null : i)} style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: isExpanded ? "rgba(139, 92, 246, 0.05)" : "transparent" }}>
                                                        <div style={{ display: "flex", gap: 24, alignItems: "center", flex: 1 }}>
                                                            <div className="print-module-num" style={{ background: isExpanded ? "#8B5CF6" : "rgba(255,255,255,0.05)", color: isExpanded ? "#fff" : "#9CA3AF", fontSize: 14, fontWeight: 900, borderRadius: 8, padding: "6px 12px", fontFamily: "monospace", transition: "0.2s" }}>
                                                                {i + 1 < 10 ? `0${i + 1}` : i + 1}
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <div className="print-module-title" style={{ fontSize: 16, fontWeight: 800, color: isExpanded ? "#fff" : "#D1D5DB", marginBottom: 4, transition: "0.2s" }}>{mod.title}</div>
                                                                <div className="print-module-desc" style={{ fontSize: 12, color: "#9CA3AF" }}>{mod.desc}</div>
                                                            </div>
                                                        </div>
                                                        <div className="no-print" style={{ color: "#6B7280", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}>
                                                            <ChevronDown size={20} />
                                                        </div>
                                                    </div>
                                                    <div className={isExpanded ? "print-module-body-open" : "print-module-body-closed"} style={{ display: isExpanded ? "block" : "none", padding: "24px", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
                                                        <div className="print-text" style={{ fontSize: 14, lineHeight: 1.8, color: "#D1D5DB", whiteSpace: "pre-wrap" }}>
                                                            {res.replace(/\*/g, '')}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                                    <div className="glass-card" style={{ padding: 40 }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#8B5CF6", marginBottom: 12 }}>NOMBRE DEL PRODUCTO</label>
                                                <input className="input-field" placeholder="Ej: Mi marca de cafe" value={researchName} onChange={e => setResearchName(e.target.value)} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#8B5CF6", marginBottom: 12 }}>INFORMACIÓN DEL PRODUCTO</label>
                                                <p style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 12 }}>Copia y pega toda la información que encuentres del producto: descripciones, ingredientes, reseñas, fichas técnicas sin importar el idioma, el formato ni la fuente. Entre más información, mejor será el resultado.</p>
                                                <textarea className="input-field" placeholder="Pega aquí la información del producto..." style={{ height: 180 }} value={researchDescription} onChange={e => setResearchDescription(e.target.value)} />
                                            </div>
                                            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "#8B5CF6" }} onClick={handleGenerateResearch} disabled={isResearchLoading}>
                                                {isResearchLoading ? <Loader2 className="animate-spin" /> : <><Sparkles /> Iniciar Investigación Intensiva (Requiere 30-40 Seg)</>}
                                            </button>
                                        </div>
                                    </div>

                                    {researchHistory.length > 0 && (
                                        <div>
                                            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Bookmark size={20} color="#8B5CF6" /> Investigaciones Anteriores</h2>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                                {researchHistory.map((hist) => (
                                                    <div key={hist.id} className="project-card" style={{ display: "flex", flexDirection: "column", gap: 12 }} onClick={() => {
                                                        setResearchName(hist.name);
                                                        setResearchDescription(hist.description);
                                                        setResearchResults(hist.results);
                                                        setExpandedResearch(0);
                                                    }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <div style={{ fontWeight: 800, fontSize: 16 }}>{hist.name}</div>
                                                            <div style={{ fontSize: 11, color: "#9CA3AF", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 6 }}>{hist.date}</div>
                                                        </div>
                                                        <div style={{ color: "#6B7280", fontSize: 13, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                            {hist.description}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                }

                {
                    activeTab === 'financial' && (() => {
                        const monedaInfo = FIN_MONEDAS.find(m => m.code === finMoneda) || FIN_MONEDAS[0];
                        const sym = monedaInfo.symbol;

                        // Live helper calculation for the preview field
                        const gastosFijosVal = parseFloat(finGastosFijos) || 0;
                        const ordenesMensualesVal = parseFloat(finOrdenesMensuales) || 1;
                        const liveGastoAdmin = ordenesMensualesVal > 0 ? gastosFijosVal / ordenesMensualesVal : 0;

                        const calcular = () => {
                            const fleteIda = parseFloat(finFleteIda) || 0;
                            const fleteDevolucion = parseFloat(finFleteDevolucion) || 0;
                            const recaudo = parseFloat(finRecaudo) || 0;
                            const gastosFijos = parseFloat(finGastosFijos) || 0;
                            const ordenesMensuales = parseFloat(finOrdenesMensuales) || 1;
                            const precioCOD = parseFloat(finPrecioCOD) || 0;
                            const costoProducto = parseFloat(finCostoProducto) || 0;
                            const pCancelaciones = parseFloat(finCancelaciones) / 100 || 0;
                            const pDevoluciones = parseFloat(finDevoluciones) / 100 || 0;
                            const pGarantias = parseFloat(finGarantias) / 100 || 0;
                            const pChargebacks = parseFloat(finChargebacks) / 100 || 0;
                            const pCPAObjetivo = parseFloat(finCPAObjetivo) / 100 || 0;
                            const pUtilidad = parseFloat(finUtilidad) / 100 || 0;
                            const gAdmin = ordenesMensuales > 0 ? gastosFijos / ordenesMensuales : 0;
                            const costoRecaudo = precioCOD * (recaudo / 100);
                            const factorEntregas = 1 - pCancelaciones;
                            const costoFleteTotal = fleteIda + (pDevoluciones * fleteDevolucion) + (pCancelaciones * fleteIda);
                            const costoCPA = precioCOD * pCPAObjetivo;
                            const costoGarantias = precioCOD * pGarantias;
                            const costoChargebacks = precioCOD * pChargebacks;
                            const totalCostos = costoProducto + gAdmin + costoRecaudo + costoFleteTotal + costoCPA + costoGarantias + costoChargebacks;
                            const utilidadNeta = precioCOD - totalCostos;
                            const margenReal = precioCOD > 0 ? (utilidadNeta / precioCOD) * 100 : 0;
                            const roiMensual = totalCostos > 0 ? (utilidadNeta / totalCostos) * 100 : 0;
                            const ordenesPagadas = ordenesMensuales * factorEntregas;
                            const utilidadMensualBruta = utilidadNeta * ordenesPagadas;
                            const precioSugerido = Math.round(totalCostos / (1 - pUtilidad));

                            // Generate optimal price tiers
                            const preciosOptimos = [0.20, 0.25, 0.30, 0.35, 0.40].map(m => ({
                                margen: m * 100,
                                precio: Math.round(totalCostos / (1 - m)),
                                label: m === 0.30 ? 'Equilibrado' : m === 0.20 ? 'Competitivo' : m === 0.40 ? 'Alta Rentabilidad' : ''
                            }));

                            setFinSnapshot({ fleteIda, fleteDevolucion, recaudo, gastosFijos, ordenesMensuales, precioCOD, costoProducto, pCancelaciones, pDevoluciones, pGarantias, pChargebacks, pCPAObjetivo, pUtilidad, gastoAdmin: gAdmin, costoRecaudo, factorEntregas, costoFleteTotal, costoCPA, costoGarantias, costoChargebacks, totalCostos, utilidadNeta, margenReal, roiMensual, ordenesPagadas, utilidadMensualBruta, precioSugerido, preciosOptimos, moneda: finMoneda, sym });
                            setFinCalculado(true);

                            // Reset AI insights when re-calculating
                            setFinAIResult("");
                        };

                        const handleGenerateFinAI = async () => {
                            if (!snap) return;
                            setIsFinAIOn(true);
                            try {
                                const prompt = `Actúa como un experto consultor financiero para Ecommerce. Analiza estos datos:
                        Moneda: ${snap.moneda}
                        Precio de Venta: ${snap.sym}${snap.precioCOD}
                        Costo de Producto: ${snap.sym}${snap.costoProducto}
                        Margen Neta por Orden: ${snap.sym}${snap.utilidadNeta} (${snap.margenReal.toFixed(1)}%)
                        Costo CPA/Marketing: ${snap.sym}${snap.costoCPA}
                        Costo Flete: ${snap.sym}${snap.costoFleteTotal}
                        Tasa de Efectividad: ${(1 - snap.pCancelaciones) * 100}%
                        Gasto Administrativo: ${snap.sym}${snap.gastoAdmin}
                        Optimiza estos resultados. Dime:
                        1. Diagnóstico rápido de rentabilidad.
                        2. Estrategia para bajar costos o subir el valor percibido.
                        3. Cuántas órdenes extras necesita para doblar la utilidad mensual (actual: ${snap.sym}${snap.utilidadMensualBruta}).
                        4. Sugerencias de packs o bundles.
                        Sé breve, directo y usa un tono profesional y motivador.`;

                                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${MASTER_KEY}`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                                });
                                const data = await response.json();
                                setFinAIResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar el análisis.");
                            } catch (error) {
                                setFinAIResult("Error al conectar con la IA.");
                            } finally {
                                setIsFinAIOn(false);
                            }
                        };

                        const snap = finSnapshot;
                        const fmt = (n: number) => n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                        const fmtPct = (n: number) => n.toFixed(1) + '%';


                        return (
                            <div style={{ maxWidth: 1200, fontFamily: 'Inter, sans-serif' }} className="anim-in">
                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}><TrendingUp size={28} color="#fff" /></div>
                                        <div>
                                            <h1 style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#10b981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Análisis Financiero</h1>
                                            <p style={{ color: '#6b7280', margin: 0, fontSize: 14 }}>Calcula tu estructura de costos, rentabilidad real y precios óptimos de venta</p>
                                        </div>
                                    </div>
                                    {/* Currency selector */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>Moneda:</span>
                                        <select value={finMoneda} onChange={e => { setFinMoneda(e.target.value); setFinCalculado(false); }} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 12, padding: '10px 16px', color: '#10b981', fontSize: 14, fontWeight: 800, cursor: 'pointer', outline: 'none', minWidth: 220 }}>
                                            {FIN_MONEDAS.map(m => <option key={m.code} value={m.code} style={{ background: '#111', color: '#fff' }}>{m.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>

                                    {/* === SECCIÓN SUPERIOR: Inputs === */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

                                        {/* Datos del Flete */}
                                        <div style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.04))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: 24 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={16} color="#10b981" /></div>
                                                <span style={{ fontWeight: 800, fontSize: 16, color: '#10b981' }}>Datos del Flete</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div>
                                                    <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Flete de Ida (COP)</label>
                                                    <input value={finFleteIda} onChange={e => setFinFleteIda(e.target.value)} type="number" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 700 }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>% Recaudo</label>
                                                    <input value={finRecaudo} onChange={e => setFinRecaudo(e.target.value)} type="number" step="0.1" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 700 }} />
                                                </div>
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Flete de Devolución (COP)</label>
                                                    <input value={finFleteDevolucion} onChange={e => setFinFleteDevolucion(e.target.value)} type="number" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 700 }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gastos Administrativos */}
                                        <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(109,40,217,0.04))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 24 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={16} color="#8b5cf6" /></div>
                                                <span style={{ fontWeight: 800, fontSize: 16, color: '#8b5cf6' }}>Gastos Administrativos</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Gastos Fijos Mensuales (COP)</label>
                                                    <input value={finGastosFijos} onChange={e => setFinGastosFijos(e.target.value)} type="number" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 700 }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Órdenes Mensuales</label>
                                                    <input value={finOrdenesMensuales} onChange={e => setFinOrdenesMensuales(e.target.value)} type="number" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 700 }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Admin por Orden</label>
                                                    <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontWeight: 800, color: '#a78bfa' }}>$ {fmt(liveGastoAdmin)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Precio y Costo */}
                                        <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.08),rgba(37,99,235,0.04))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: 24 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={16} color="#3b82f6" /></div>
                                                <span style={{ fontWeight: 800, fontSize: 16, color: '#3b82f6' }}>Precio &amp; Costo del Producto</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                <div>
                                                    <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Precio de Venta COD (COP)</label>
                                                    <input value={finPrecioCOD} onChange={e => setFinPrecioCOD(e.target.value)} type="number" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 700 }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>Costo del Producto (COP)</label>
                                                    <input value={finCostoProducto} onChange={e => setFinCostoProducto(e.target.value)} type="number" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontWeight: 700 }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Porcentajes Clave */}
                                        <div style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(217,119,6,0.04))', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: 24 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={16} color="#f59e0b" /></div>
                                                <span style={{ fontWeight: 800, fontSize: 16, color: '#f59e0b' }}>Porcentajes Clave</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                                                {[
                                                    { label: '% Cancelaciones', val: finCancelaciones, set: setFinCancelaciones },
                                                    { label: '% Devoluciones', val: finDevoluciones, set: setFinDevoluciones },
                                                    { label: '% Garantías', val: finGarantias, set: setFinGarantias },
                                                    { label: '% Chargebacks', val: finChargebacks, set: setFinChargebacks },
                                                    { label: '% CPA Objetivo', val: finCPAObjetivo, set: setFinCPAObjetivo },
                                                    { label: '% Utilidad', val: finUtilidad, set: setFinUtilidad },
                                                ].map(({ label, val, set }) => (
                                                    <div key={label}>
                                                        <label style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
                                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                                                            <input value={val} onChange={e => set(e.target.value)} type="number" step="0.1" style={{ flex: 1, background: 'transparent', border: 'none', padding: '10px 10px', color: '#fff', fontSize: 14, fontWeight: 700, minWidth: 0 }} />
                                                            <span style={{ padding: '0 10px', color: '#f59e0b', fontWeight: 800, fontSize: 13 }}>%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={calcular}
                                        style={{ width: '100%', padding: '18px 0', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontSize: 18, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 0 30px rgba(16,185,129,0.4)', letterSpacing: 0.5, transition: 'transform 0.1s, box-shadow 0.2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(16,185,129,0.6)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(16,185,129,0.4)'; }}
                                    >
                                        <TrendingUp size={22} /> Calcular Análisis
                                    </button>
                                </div>

                                {/* === SECCIÓN INFERIOR: Resultados === */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    {!finCalculado ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 400, gap: 20, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(16,185,129,0.2)', borderRadius: 20, padding: 40 }}>
                                            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={36} color="#10b981" /></div>
                                            <div>
                                                <div style={{ fontSize: 20, fontWeight: 800, color: "#e5e7eb", marginBottom: 8 }}>Completa los campos y calcula</div>
                                                <div style={{ fontSize: 14, color: "#6b7280" }}>Llena los datos anteriores y presiona el botón<br /><strong style={{ color: "#10b981" }}>"Calcular Análisis"</strong> para ver tus resultados</div>
                                            </div>
                                        </div>
                                    ) : snap && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="anim-in">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '10px 16px' }}>
                                                <span style={{ fontSize: 20 }}>{FIN_MONEDAS.find(m => m.code === snap.moneda)?.label.split(' ')[0]}</span>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>Resultados en {snap.moneda} — {snap.sym}</span>
                                                <span style={{ marginLeft: 'auto', fontSize: 11, color: "#6b7280" }}>Calculado el {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                                                <div style={{ background: snap.utilidadNeta >= 0 ? 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.08))' : 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(185,28,28,0.08))', border: `1px solid ${snap.utilidadNeta >= 0 ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`, borderRadius: 20, padding: 24, textAlign: 'center', gridColumn: '1 / span 2' }}>
                                                    <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Utilidad Neta por Orden</div>
                                                    <div style={{ fontSize: 48, fontWeight: 900, color: snap.utilidadNeta >= 0 ? "#10b981" : "#ef4444" }}>{snap.sym} {fmt(snap.utilidadNeta)}</div>
                                                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Margen Real: {fmtPct(snap.margenReal)}</div>
                                                </div>
                                                <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(37,99,235,0.06))', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
                                                    <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Utilidad Mensual</div>
                                                    <div style={{ fontSize: 24, fontWeight: 900, color: "#60a5fa", marginTop: 8 }}>{snap.sym} {fmt(snap.utilidadMensualBruta)}</div>
                                                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>ROI: {fmtPct(snap.roiMensual)}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
                                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 28 }}>
                                                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20, color: "#e5e7eb", display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <Layers size={18} color="#10b981" /> Desglose de Costos
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                        {[
                                                            { label: 'Producto', value: snap.costoProducto, color: '#8b5cf6' },
                                                            { label: 'Admin', value: snap.gastoAdmin, color: '#6366f1' },
                                                            { label: 'Recaudo', value: snap.costoRecaudo, color: '#f59e0b' },
                                                            { label: 'Flete', value: snap.costoFleteTotal, color: '#10b981' },
                                                            { label: 'CPA', value: snap.costoCPA, color: '#ec4899' },
                                                            { label: 'Garantías', value: snap.costoGarantias, color: '#f97316' },
                                                            { label: 'Chargebacks', value: snap.costoChargebacks, color: '#ef4444' },
                                                        ].map(({ label, value, color }) => {
                                                            const pct = snap.precioCOD > 0 ? (value / snap.precioCOD) * 100 : 0;
                                                            return (
                                                                <div key={label}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                                        <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{label}</span>
                                                                        <span style={{ fontSize: 12, fontWeight: 800, color }}>{snap.sym}{fmt(value)} <span style={{ fontSize: 10, color: "#6b7280" }}>({fmtPct(pct)})</span></span>
                                                                    </div>
                                                                    <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                                                                        <div style={{ width: `${Math.min(pct * 4, 100)}%`, height: '100%', background: color, transition: 'width 0.8s ease' }} />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                                        <span style={{ fontWeight: 800, fontSize: 13, color: "#9ca3af" }}>TOTAL COSTOS</span>
                                                        <span style={{ fontWeight: 900, fontSize: 20, color: "#ef4444" }}>{snap.sym} {fmt(snap.totalCostos)}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                                    <div style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.05),rgba(5,150,105,0.02))', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 24, padding: 28 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={16} color="#10b981" /></div>
                                                            <span style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>Escenarios de Precios Óptimos</span>
                                                        </div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                            {snap.preciosOptimos.map((item: any, idx: number) => (
                                                                <div key={idx} style={{
                                                                    background: item.precio === snap.precioSugerido ? 'rgba(10,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                                                                    border: item.precio === snap.precioSugerido ? '1px solid rgba(10,185,129,0.3)' : '1px solid rgba(255,255,255,0.05)',
                                                                    borderRadius: 16, padding: '14px', textAlign: 'center', transition: 'all 0.3s'
                                                                }}>
                                                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: 'uppercase', marginBottom: 4 }}>Margen {item.margen}%</div>
                                                                    <div style={{ fontSize: 16, fontWeight: 900, color: item.precio === snap.precioSugerido ? "#34d399" : "#fff" }}>{snap.sym}{fmt(item.precio)}</div>
                                                                    {item.label && <div style={{ fontSize: 9, color: "#10b981", fontWeight: 800, marginTop: 4 }}>{item.label}</div>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ flex: 1, background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(109,40,217,0.05))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, padding: 28 }}>
                                                        {!finAIResult ? (
                                                            <button
                                                                onClick={handleGenerateFinAI}
                                                                disabled={isFinAIOn}
                                                                style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 5px 20px rgba(139,92,246,0.3)' }}
                                                            >
                                                                {isFinAIOn ? <Loader2 className="animate-spin" size={20} /> : <><Brain size={18} /> ESTRATEGIA CON IA</>}
                                                            </button>
                                                        ) : (
                                                            <div className="anim-in">
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                                                    <Brain size={16} color="#c084fc" />
                                                                    <span style={{ fontWeight: 800, fontSize: 14, color: "#fff" }}>Insight de Negocio</span>
                                                                    <button onClick={() => setFinAIResult("")} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: "#6b7280", fontSize: 10, cursor: 'pointer' }}>Borrar</button>
                                                                </div>
                                                                <div style={{ fontSize: 12, color: "#d1d5db", lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', maxHeight: 150, overflowY: 'auto' }}>
                                                                    {finAIResult}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()
                }
            </main>

            {showProjectModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="glass-card" style={{ maxWidth: 600, width: "100%", padding: 40, maxHeight: "90vh", overflowY: "auto" }}>
                        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32, textAlign: "center" }}>Configurar Marca</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", textTransform: "uppercase" }}>Datos de la Marca y Producto</label>
                                <input className="input-field" placeholder="Nombre del proyecto / marca..." value={projectNameInput} onChange={(e) => setProjectNameInput(e.target.value)} />
                                <input className="input-field" placeholder="¿Qué producto es? (Ej: Abrigo de Invierno)" value={productNameInput} onChange={(e) => setProductNameInput(e.target.value)} />
                                <input className="input-field" placeholder="Avatar / Público Ideal (Ej: Dueños de perros, Amantes de la moda...)" value={targetAudienceInput} onChange={(e) => setTargetAudienceInput(e.target.value)} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>Producto</label>
                                    <div style={{ height: 100, border: "2px dashed rgba(255,255,255,0.05)", borderRadius: 12, position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => setNewProjectPreview(ev.target?.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                        {newProjectPreview ? (
                                            <img src={newProjectPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                        ) : (
                                            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}><UploadCloud size={20} /></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>Logo</label>
                                    <div style={{ height: 100, border: "2px dashed rgba(255,255,255,0.05)", borderRadius: 12, position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => setNewProjectLogo(ev.target?.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                        {newProjectLogo ? (
                                            <img src={newProjectLogo} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                                        ) : (
                                            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}><Plus size={20} /></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <ColorPicker label="Primario" color={selectedPrimary} onChange={setSelectedPrimary} />
                                <ColorPicker label="Secundario" color={selectedSecondary} onChange={setSelectedSecondary} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 900, color: "#4B5563", marginBottom: 8, textTransform: "uppercase" }}>Tipografía</label>
                                <select className="input-field" value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} style={{ fontFamily: selectedFont }}>
                                    {GOOGLE_FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                <button onClick={() => setShowProjectModal(false)} style={{ flex: 1, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "none", color: "#6B7280", fontWeight: 900, cursor: "pointer" }}>CANCELAR</button>
                                <button onClick={createProject} className="btn-primary" style={{ flex: 2, justifyContent: "center", background: selectedPrimary }}>CREAR PROYECTO</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {
                showApiModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="glass-card" style={{ maxWidth: 450, width: "100%", padding: 40 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Configurar Gemini</h2>
                            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 32 }}>Ingresa tu API Key de Google AI Studio para activar la generación de creativos.</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block" }}>TU GOOGLE API KEY</label>
                                    <input type="password" className="input-field" placeholder="sk-..." value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} />
                                </div>
                                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                    <button onClick={() => setShowApiModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer" }}>Cancelar</button>
                                    <button onClick={() => {
                                        setApiKey(tempApiKey);
                                        localStorage.setItem(getUKey("clickads_api_key"), tempApiKey);
                                        setShowApiModal(false);
                                        setToast({ msg: "Configuración guardada", type: 'success' });
                                    }} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>Guardar Cambios</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                toast && (
                    <div style={{ position: "fixed", bottom: 40, right: 40, background: toast.type === 'error' ? '#EF4444' : '#8B5CF6', color: '#fff', padding: "16px 32px", borderRadius: 16, fontWeight: 800, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 10000 }}>
                        {toast.msg}
                    </div>
                )
            }
            {
                zoomedImage && (
                    <div
                        onClick={() => setZoomedImage(null)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.9)",
                            backdropFilter: "blur(10px)",
                            zIndex: 10000,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "zoom-out",
                            padding: 40
                        }}
                    >
                        <button
                            onClick={() => setZoomedImage(null)}
                            style={{ position: "absolute", top: 30, right: 30, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 50, height: 50, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <X size={24} />
                        </button>
                        <img
                            src={zoomedImage}
                            style={{ maxWidth: "95%", maxHeight: "95%", borderRadius: 12, boxShadow: "0 20px 80px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )
            }

        </div >
    );
}
