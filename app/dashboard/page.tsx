"use client";

import { useState, useEffect } from "react";
import { Home, Play, Sparkles, UploadCloud, Download, Loader2, Key, Layers, ArrowLeft, Users, PlayCircle, LogOut, Plus, Folder, Trash2, ChevronRight, ChevronDown, MessageSquare, ThumbsUp, Send, Library, Save, CheckCircle2, Minus, Bookmark, Palette, Type, Search, Edit3, Heart, Share2, Award, User, HelpCircle, Layout, Globe, TrendingUp, DollarSign, UserCheck, ShieldCheck, Video, X, Settings, Smile, Stethoscope, BookOpen, Newspaper, Calendar, Image, Camera, Box, ShieldAlert, Zap, Brain, Activity, ShieldOff, Target } from "lucide-react";
import JSZip from "jszip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { imageDB } from "@/app/lib/db";
import * as htmlToImage from "html-to-image";

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
const WA_CLIENT_TYPES = [
    "Escéptico e indeciso",
    "Impulsivo y con prisa",
    "Analítico y técnico",
    "Buscador de descuentos",
    "Emocional y soñador",
    "El que manda solo audios",
    "El 'Ya te aviso' (Desaparecido)",
    "Defensivo por malas experiencias",
    "El que necesita todo explicado con manzanas",
    "Profesional / Enfoque B2B"
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
    const [tutorialVideoOpen, setTutorialVideoOpen] = useState<string | null>(null);

    // UGC Image Generator States
    const [ugcWho, setUgcWho] = useState("Mujer");
    const [ugcAge, setUgcAge] = useState("25-34");
    const [ugcScenario, setUgcScenario] = useState("Baño");
    const [ugcPhotoType, setUgcPhotoType] = useState("Selfie");
    const [ugcStyle, setUgcStyle] = useState("iPhone");
    const [ugcExpression, setUgcExpression] = useState("Feliz");
    const [ugcGenerating, setUgcGenerating] = useState(false);
    const [ugcProduct, setUgcProduct] = useState("");
    const [activeUgcExample, setActiveUgcExample] = useState(0);
    const [ugcProductImage, setUgcProductImage] = useState<string | null>(null);
    const [ugcOutputSize, setUgcOutputSize] = useState("1:1");
    const [ugcResults, setUgcResults] = useState<{image: string, title: string, desc: string}[]>([]);
    const [refiningUgcIndex, setRefiningUgcIndex] = useState<number | null>(null);
    const [refiningUgcText, setRefiningUgcText] = useState("");
    const [isRefiningUgc, setIsRefiningUgc] = useState(false);

    const [waReviewStyle, setWaReviewStyle] = useState('Chats'); // 'Chats', 'Grupo', 'Estados'
    const [waReviewConvType, setWaReviewConvType] = useState('Cliente satisfecho');
    const [waReviewClientName, setWaReviewClientName] = useState('María Cliente');
    const [waReviewProductName, setWaReviewProductName] = useState('');
    const [waReviewClientPhotoType, setWaReviewClientPhotoType] = useState('upload'); // 'upload' | 'ia_avatar'
    const [waReviewClientPhoto, setWaReviewClientPhoto] = useState<string | null>(null);
    const [waReviewAvatarSex, setWaReviewAvatarSex] = useState('Mujer');
    const [waReviewAvatarAge, setWaReviewAvatarAge] = useState('25-34');
    const [waReviewAvatarEthnicity, setWaReviewAvatarEthnicity] = useState('Latina');
    const [waReviewAvatarCountry, setWaReviewAvatarCountry] = useState('Colombia');
    const [waReviewAvatarStyle, setWaReviewAvatarStyle] = useState('Casual');
    const [waReviewLang, setWaReviewLang] = useState('Español');
    const [waReviewTone, setWaReviewTone] = useState('Natural');
    const [waReviewLength, setWaReviewLength] = useState('Media');
    const [waReviewEmojis, setWaReviewEmojis] = useState(true);
    const [waReviewMsgCount, setWaReviewMsgCount] = useState(4);
    const [waReviewProductImageType, setWaReviewProductImageType] = useState('upload'); // 'upload' | 'ugc'
    const [waReviewProductImage, setWaReviewProductImage] = useState<string | null>(null);
    const [waReviewMessages, setWaReviewMessages] = useState<{id: string, sender: 'company' | 'client', text?: string, image?: string, time: string}[]>([
        { id: '1', sender: 'company', text: 'Hola María! 👋 ¿Cómo te ha parecido el producto?', time: '9:41 a.m.' },
        { id: '2', sender: 'client', text: '¡Me encantó este producto! 😍 Lo llevo usando 2 semanas y he visto cambios increíbles. 100% recomendado, vale cada peso. ✨', time: '9:43 a.m.' },
        { id: '3', sender: 'client', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', time: '9:44 a.m.' },
        { id: '4', sender: 'company', text: '¡Qué felicidad! 🥰 Gracias por confiar en nosotros 🙌', time: '9:45 a.m.' }
    ]);
    const [waReviewClientAvatarImg, setWaReviewClientAvatarImg] = useState<string | null>(null);
    const [isGeneratingWaReview, setIsGeneratingWaReview] = useState(false);
    const [isGeneratingWaAvatar, setIsGeneratingWaAvatar] = useState(false);
    const [isGeneratingWaUgcProduct, setIsGeneratingWaUgcProduct] = useState(false);
    const [editingWaMsgIndex, setEditingWaMsgIndex] = useState<number | null>(null);

    // === LANDING AI STATE ===
    const [landingAiStep, setLandingAiStep] = useState<'analyze'|'structure'|'generating'|'preview'|'export'>('analyze');
    const [landingAiUrl, setLandingAiUrl] = useState('');
    const [landingAiImages, setLandingAiImages] = useState<string[]>([]);
    const [landingAiAnalysis, setLandingAiAnalysis] = useState<any>(null);
    const [landingAiStructure, setLandingAiStructure] = useState<string[]>(['hero','benefits','howItWorks','reviews','faq','cta']);
    const [landingAiData, setLandingAiData] = useState<any>(null);
    const [landingAiStyle, setLandingAiStyle] = useState('beauty');
    const [isAnalyzingLanding, setIsAnalyzingLanding] = useState(false);
    const [isGeneratingLandingAi, setIsGeneratingLandingAi] = useState(false);
    const [landingAiGenProgress, setLandingAiGenProgress] = useState(0);
    const [landingAiGenStatus, setLandingAiGenStatus] = useState('');
    const [editingLandingSection, setEditingLandingSection] = useState<string|null>(null);
    const [editLandingSectionInstruction, setEditLandingSectionInstruction] = useState('');
    const [isEditingLandingSection, setIsEditingLandingSection] = useState(false);
    const [landingAiChat, setLandingAiChat] = useState<Array<{role:'user'|'ai', content:string}>>([]);
    const [landingAiChatInput, setLandingAiChatInput] = useState('');
    const [isLandingChatLoading, setIsLandingChatLoading] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number|null>(null);
    const [expandedLandingSection, setExpandedLandingSection] = useState<string|null>(null);

    // === LANDING AI CUSTOMIZATION STATES ===
    const [landingAiCustomPrimary, setLandingAiCustomPrimary] = useState('');
    const [landingAiCustomBg, setLandingAiCustomBg] = useState('');
    const [landingAiCustomCardBg, setLandingAiCustomCardBg] = useState('');
    const [landingAiCustomText, setLandingAiCustomText] = useState('');
    const [landingAiCodName, setLandingAiCodName] = useState('');
    const [landingAiCodPhone, setLandingAiCodPhone] = useState('');
    const [landingAiCodAddress, setLandingAiCodAddress] = useState('');
    const [landingAiCodCity, setLandingAiCodCity] = useState('');
    const [landingAiActiveControlTab, setLandingAiActiveControlTab] = useState<'sections'|'colors'|'content'|'chat'>('content');
    const [landingAiSelectedVariant, setLandingAiSelectedVariant] = useState('300g / Vainilla');
    const [landingAiQuantity, setLandingAiQuantity] = useState(1);
    const [landingAiSelectedSectionToEdit, setLandingAiSelectedSectionToEdit] = useState('hero');



    const ugcExamples = [
        {
            title: "Ejemplo 1: Suero de Cabello",
            product: "Suero Capilar",
            who: "Mujer",
            age: "25-34",
            scenario: "Baño",
            photoType: "Selfie",
            style: "iPhone",
            expression: "Feliz",
            desc: "Una mujer de 28 años frente al espejo del baño sosteniendo el producto y sonriendo. Cabello largo y brillante. Luz natural. Estilo selfie de iPhone.",
            resultDesc: "Parece que una influencer realmente tomó esa foto.",
            image: "/ugc/ugc_woman_1.png"
        },
        {
            title: "Ejemplo 2: Protector Solar",
            product: "Protector Solar",
            who: "Mujer",
            age: "18-24",
            scenario: "Playa",
            photoType: "Foto espontánea",
            style: "Instagram",
            expression: "Relajado",
            desc: "Una chica en la playa aplicándose el protector solar. Lleva gafas de sol, toalla sobre la arena, cielo azul y foto espontánea.",
            resultDesc: "Una foto veraniega orgánica lista para pauta.",
            image: "/ugc/ugc_woman_2.png"
        },
        {
            title: "Ejemplo 3: Proteína Fit",
            product: "Proteína Shaker",
            who: "Hombre",
            age: "25-34",
            scenario: "Gimnasio",
            photoType: "Lifestyle",
            style: "TikTok",
            expression: "Emocionado",
            desc: "Un hombre saliendo del gimnasio, sudado, con el shaker en una mano y la proteína en la otra bajo luz de atardecer golden hour.",
            resultDesc: "Contenido aspiracional y deportivo de alta credibilidad.",
            image: "/ugc/ugc_man_1.png"
        },
        {
            title: "Ejemplo 4: Perfume Lujo",
            product: "Perfume Premium",
            who: "Mujer",
            age: "25-34",
            scenario: "Casa",
            photoType: "Espejo",
            style: "Pinterest",
            expression: "Relajado",
            desc: "Una mujer arreglándose frente a un espejo antes de salir, aplicándose el perfume en una habitación moderna y elegante.",
            resultDesc: "Estética de lujo premium súper aspiracional.",
            image: "/ugc/ugc_woman_1.png"
        },
        {
            title: "Ejemplo 5: Crema Facial",
            product: "Crema Facial",
            who: "Mujer",
            age: "35-44",
            scenario: "Baño",
            photoType: "Review",
            style: "Profesional",
            expression: "Relajado",
            desc: "Rutina nocturna de crema facial. Mujer con bata blanca, cabello recogido aplicando la crema en un ambiente minimalista.",
            resultDesc: "Genera confianza inmediata en nicho de cosmética.",
            image: "/ugc/ugc_woman_2.png"
        }
    ];

    const selectUgcExample = (index: number) => {
        setUgcGenerating(true);
        setActiveUgcExample(index);
        const ex = ugcExamples[index];
        setTimeout(() => {
            setUgcWho(ex.who);
            setUgcAge(ex.age);
            setUgcScenario(ex.scenario);
            setUgcPhotoType(ex.photoType);
            setUgcStyle(ex.style);
            setUgcExpression(ex.expression);
            setUgcProduct(ex.product);
            setUgcGenerating(false);
        }, 500);
    };

    const ugcTemplates = [
        { name: "Influencer recomendando el producto", who: "Influencer", age: "25-34", scenario: "Casa", photoType: "Selfie", style: "TikTok", expression: "Feliz", product: "Suero Capilar", imageIndex: 0 },
        { name: "Rutina de mañana", who: "Mujer", age: "25-34", scenario: "Baño", photoType: "Lifestyle", style: "Instagram", expression: "Relajado", product: "Crema Facial", imageIndex: 4 },
        { name: "Rutina de noche", who: "Mujer", age: "35-44", scenario: "Baño", photoType: "Review", style: "Pinterest", expression: "Relajado", product: "Crema Facial", imageIndex: 4 },
        { name: "Mi compra favorita de Amazon", who: "Influencer", age: "18-24", scenario: "Casa", photoType: "Unboxing", style: "TikTok", expression: "Emocionado", product: "Suero Capilar", imageIndex: 1 },
        { name: "Producto viral de TikTok", who: "Influencer", age: "18-24", scenario: "Cafetería", photoType: "Foto espontánea", style: "TikTok", expression: "Emocionado", product: "Protector Solar", imageIndex: 1 },
        { name: "Lo que llevo en mi bolso", who: "Mujer", age: "25-34", scenario: "Cafetería", photoType: "Lifestyle", style: "Instagram", expression: "Feliz", product: "Perfume Premium", imageIndex: 3 },
        { name: "Get Ready With Me (GRWM)", who: "Mujer", age: "25-34", scenario: "Casa", photoType: "Espejo", style: "TikTok", expression: "Feliz", product: "Perfume Premium", imageIndex: 3 },
        { name: "Favoritos del mes", who: "Influencer", age: "25-34", scenario: "Cocina", photoType: "Review", style: "Instagram", expression: "Relajado", product: "Protector Solar", imageIndex: 1 },
        { name: "Unboxing en casa", who: "Mamá", age: "35-44", scenario: "Casa", photoType: "Unboxing", style: "Facebook", expression: "Feliz", product: "Crema Facial", imageIndex: 4 },
        { name: "Después del gimnasio", who: "Deportista", age: "25-34", scenario: "Gimnasio", photoType: "Lifestyle", style: "Instagram", expression: "Emocionado", product: "Proteína Shaker", imageIndex: 2 }
    ];

    const applyUgcTemplate = (template: typeof ugcTemplates[0]) => {
        setUgcGenerating(true);
        setTimeout(() => {
            setUgcWho(template.who);
            setUgcAge(template.age);
            setUgcScenario(template.scenario);
            setUgcPhotoType(template.photoType);
            setUgcStyle(template.style);
            setUgcExpression(template.expression);
            setUgcProduct(template.product);
            setActiveUgcExample(template.imageIndex);
            setUgcGenerating(false);
        }, 500);
    };

    const handleGenerateUgc = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }

        const imageToUse = ugcProductImage || activeProject?.productPreview;
        if (!imageToUse) {
            setToast({ msg: "Sube una foto de tu producto en el panel izquierdo primero", type: 'error' });
            return;
        }

        setUgcGenerating(true);

        const base64Data = imageToUse.split(",")[1] || "";
        const mimeType = imageToUse.includes("image/png") ? "image/png" : "image/jpeg";

        const mirrorInstruction = ugcPhotoType === 'Espejo' ? " Since the composition is a mirror selfie ('Espejo'), the model must be holding an iPhone in one hand, taking a mirror selfie photo of herself in front of a mirror, with the phone visible and the product realistically visible in the shot/reflection." : "";

        const productName = ugcProduct || activeProject?.productName || "producto";

        const finalPrompt = `UGC PHOTO STYLE: Real photo taken by a customer or content creator. Authentic amateur look, natural lighting, iPhone/social media style: ${ugcStyle}. 
SUBJECT: A highly attractive, beautiful, and photogenic ${ugcWho} model (${ugcAge} years old) looking directly at the camera, making eye contact with the camera, with a ${ugcExpression} facial expression. She must look like a real, authentic person but with beautiful model-like features. She is stylishly well-dressed in high-quality casual clothing (smart casual outfit).
SCENARIO: In a ${ugcScenario}. 
PHOTO COMPOSITION: ${ugcPhotoType} showing the model holding the product "${productName}" in her hands naturally. The model is looking directly into the camera lens. The product "${productName}" must NOT float in the air and must NOT be duplicated or copied.${mirrorInstruction}
The product "${productName}" from the uploaded image must be perfectly held by the model or placed naturally on a table/counter, integrated naturally and realistically into the scene. 
CRITICAL RULE: The model must ALWAYS look directly at the camera. The product must NOT float in the air and must NOT be duplicated or copied. The final image must look like a real, high-quality, organic photo taken by an attractive creator, not a professional studio render. No text, logos, or artificial overlays unless they are part of the product.
DIMENSIONS: ${ugcOutputSize}.`;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

            const reqParts = [
                { inlineData: { mimeType, data: base64Data } },
                { text: finalPrompt }
            ];

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
                const newImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                const newResult = {
                    image: newImage,
                    title: `UGC: ${productName} en ${ugcScenario}`,
                    desc: `Modelo ${ugcWho} (${ugcAge} años) - Escenario: ${ugcScenario} - Estilo: ${ugcStyle} (${ugcPhotoType})`
                };
                setUgcResults(prev => [newResult, ...prev]);
                setToast({ msg: "✅ Escena UGC generada con éxito", type: 'success' });
            } else {
                throw new Error("La API de Gemini no devolvió una imagen válida.");
            }
        } catch (error: any) {
            setToast({ msg: error.message || "Error en la generación UGC.", type: 'error' });
        } finally {
            setUgcGenerating(false);
        }
    };

    const handleRefineUgc = async (index: number) => {
        if (!refiningUgcText.trim()) return;
        setIsRefiningUgc(true);

        const target = ugcResults[index];
        if (!target) return;

        const prevImage = target.image;
        const base64Data = prevImage?.split(",")[1] || "";
        const mimeType = prevImage.includes("image/png") ? "image/png" : "image/jpeg";

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;

            const prompt = `ADJUSTMENT REQUESTED BY USER: "${refiningUgcText}". 
            Context: This image is a UGC (User Generated Content) photo for "${ugcProduct}".
            TASK: Re-generate the UGC image making the specific changes requested. KEEP the exact same model, composition, scenario, and casual realistic aesthetic, but apply this adjustment: "${refiningUgcText}". 
            IMPORTANT: Do not invent a completely new scene, just refine and adjust the current one according to the user feedback. The model must still look directly at the camera.`;

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { inlineData: { data: base64Data, mimeType } },
                            { text: prompt }
                        ]
                    }]
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                const newImg = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setUgcResults(prev => prev.map((item, idx) => idx === index ? {
                    ...item,
                    image: newImg,
                    desc: `${item.desc} (Ajustado: ${refiningUgcText})`
                } : item));
                setRefiningUgcIndex(null);
                setRefiningUgcText("");
                setToast({ msg: "✅ Ajuste aplicado con éxito", type: 'success' });
            } else {
                throw new Error("La API no devolvió una imagen válida.");
            }
        } catch (error: any) {
            setToast({ msg: error.message || "Error al aplicar cambios.", type: 'error' });
        } finally {
            setIsRefiningUgc(false);
        }
    };

    const handleGenerateWaReview = async () => {
        setIsGeneratingWaReview(true);
        try {
            const productName = waReviewProductName || activeProject?.productName || "Producto";
            const systemPrompt = `You are an expert copywriter and marketer for e-commerce. 
Generate a realistic WhatsApp conversation where a company agent asks a customer about their experience, and the customer replies with a highly positive, authentic review and sends a photo of the product.
You MUST respond with a valid JSON array of messages. No markdown code blocks, no backticks, no other text. Just raw JSON.
Each message in the array must have:
- "sender": "company" or "client"
- "text": The message text (if it's a text message)
- "image": "true" (ONLY for one message where the client sends the product image)
- "time": A timestamp string, e.g. "9:41 a.m.", "9:43 a.m." (incrementing sequentially)

Example format:
[
  {"sender": "company", "text": "Hola ${waReviewClientName}! 👋 ¿Cómo te fue con el producto?", "time": "9:41 a.m."},
  {"sender": "client", "text": "Holaaa 😍 La verdad me encantó...", "time": "9:43 a.m."},
  {"sender": "client", "image": "true", "time": "9:44 a.m."},
  {"sender": "company", "text": "¡Qué felicidad! 🥰...", "time": "9:45 a.m."}
]`;

            const prompt = `Product Name: ${productName}
Conversation Type: ${waReviewConvType}
Client Name: ${waReviewClientName}
Language: ${waReviewLang}
Tone: ${waReviewTone}
Length: ${waReviewLength}
Include Emojis: ${waReviewEmojis ? 'Yes' : 'No'}
Number of messages: ${waReviewMsgCount}

Generate a natural, high-converting marketing WhatsApp chat of exactly ${waReviewMsgCount} messages. One of the client messages MUST be a product photo (set "image": "true"). The rest must be text messages. The messages should be highly organic, realistic, and contain typical typos or casual expressions suited for the tone. Ensure the conversation flows logically.`;

            const res = await fetch("/api/vertex-ai/generate-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, systemPrompt })
            });
            const data = await res.json();
            if (data.success) {
                let cleanJson = data.result.trim();
                if (cleanJson.startsWith("```")) {
                    cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
                }
                const parsed = JSON.parse(cleanJson);
                
                // Format messages and add unique IDs
                const formatted = parsed.map((m: any, idx: number) => ({
                    id: String(idx + 1),
                    sender: m.sender,
                    text: m.text,
                    image: m.image === "true" ? (waReviewProductImage || activeProject?.productPreview || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80") : undefined,
                    time: m.time || `${9 + idx}:${40 + idx} a.m.`
                }));
                
                setWaReviewMessages(formatted);
                setToast({ msg: "✅ Conversación generada con éxito", type: 'success' });
            } else {
                throw new Error("No se pudo generar la conversación.");
            }
        } catch (e: any) {
            setToast({ msg: "Error al generar chat: " + e.message, type: 'error' });
        } finally {
            setIsGeneratingWaReview(false);
        }
    };

    const handleGenerateWaAvatar = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }
        setIsGeneratingWaAvatar(true);
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const prompt = `A highly realistic, authentic personal profile photo headshot of a ${waReviewAvatarSex} from ${waReviewAvatarCountry}, ${waReviewAvatarAge} years old, ${waReviewAvatarEthnicity} ethnicity, style: ${waReviewAvatarStyle}. Natural lighting, shot on iPhone camera, selfie look or simple portrait, looking directly at the camera, plain background, natural skin texture, everyday clothing.`;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.[0];
            if (part?.inlineData) {
                const newImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setWaReviewClientAvatarImg(newImage);
                setToast({ msg: "✅ Avatar IA generado con éxito", type: 'success' });
            } else {
                throw new Error("No se pudo generar la imagen del avatar.");
            }
        } catch (e: any) {
            setToast({ msg: "Error al generar avatar: " + e.message, type: 'error' });
        } finally {
            setIsGeneratingWaAvatar(false);
        }
    };

    const handleGenerateWaUgcProduct = async () => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }
        const inputImg = waReviewProductImage || activeProject?.productPreview;
        if (!inputImg) {
            setToast({ msg: "Sube un producto en el paso 1 primero o selecciona un proyecto", type: 'error' });
            return;
        }
        setIsGeneratingWaUgcProduct(true);
        try {
            const base64Data = inputImg.split(",")[1] || "";
            const mimeType = inputImg.includes("image/png") ? "image/png" : "image/jpeg";
            const productName = waReviewProductName || activeProject?.productName || "producto";

            const prompt = `UGC PHOTO STYLE: Real photo taken by a customer or content creator. Authentic amateur look, natural lighting, iPhone/social media style: casual.
SUBJECT: A highly attractive and beautiful female/male model holding the product "${productName}" in their hands naturally. The model is looking directly into the camera lens.
The product "${productName}" from the uploaded image must be perfectly held by the model or placed naturally on a table/counter, integrated naturally and realistically into the scene.
CRITICAL RULE: The model must ALWAYS look directly at the camera. The product must NOT float in the air and must NOT be duplicated or copied. The final image must look like a real, high-quality, organic photo taken by an attractive creator, not a professional studio render. No text, logos, or artificial overlays. DIMENSIONS: 1:1.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { inlineData: { mimeType, data: base64Data } },
                            { text: prompt }
                        ]
                    }]
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "Error Gemini");

            const part = data.candidates?.[0]?.content?.parts?.[0];
            if (part?.inlineData) {
                const newImg = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                setWaReviewProductImage(newImg);
                
                // Update in messages if one exists
                setWaReviewMessages(prev => prev.map(m => m.image ? { ...m, image: newImg } : m));
                setToast({ msg: "✅ Foto UGC generada con éxito", type: 'success' });
            } else {
                throw new Error("No se pudo generar la foto UGC.");
            }
        } catch (e: any) {
            setToast({ msg: "Error al generar UGC: " + e.message, type: 'error' });
        } finally {
            setIsGeneratingWaUgcProduct(false);
        }
    };

    const downloadWaCapture = async (format: 'png' | 'jpg') => {
        const node = document.getElementById("whatsapp-capture-node");
        if (!node) {
            setToast({ msg: "Error: No se encontró la vista previa de WhatsApp", type: 'error' });
            return;
        }
        try {
            let dataUrl = "";
            if (format === 'png') {
                dataUrl = await htmlToImage.toPng(node, { cacheBust: true, pixelRatio: 2 });
            } else {
                dataUrl = await htmlToImage.toJpeg(node, { cacheBust: true, pixelRatio: 2, quality: 0.95 });
            }
            const link = document.createElement("a");
            link.download = `whatsapp_review_${Date.now()}.${format}`;
            link.href = dataUrl;
            link.click();
            setToast({ msg: `✅ Captura descargada como ${format.toUpperCase()}`, type: 'success' });
        } catch (e: any) {
            setToast({ msg: "Error al descargar captura: " + e.message, type: 'error' });
        }
    };

    const copyWaToClipboard = async () => {
        const node = document.getElementById("whatsapp-capture-node");
        if (!node) {
            setToast({ msg: "Error: No se encontró la vista previa de WhatsApp", type: 'error' });
            return;
        }
        try {
            const dataUrl = await htmlToImage.toPng(node, { cacheBust: true, pixelRatio: 2 });
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            setToast({ msg: "✅ Captura copiada al portapapeles", type: 'success' });
        } catch (e: any) {
            setToast({ msg: "Error al copiar: " + e.message, type: 'error' });
        }
    };



    // === LANDING AI CONSTANTS ===
    const LANDING_STYLES = [
        { id: 'terranova', label: '🛍️ Terranova COD (Alta Conversión)', primary: '#25d366', bg: '#ffffff', cardBg: '#f9fafb', text: '#111827', font: 'Outfit' },
        { id: 'beauty', label: '💄 Beauty', primary: '#e91e8c', bg: '#fff0f6', cardBg: '#fce4ec', text: '#1a1a1a', font: 'Outfit' },
        { id: 'minimal', label: '◻️ Minimal', primary: '#111', bg: '#fff', cardBg: '#f5f5f5', text: '#111', font: 'Inter' },
        { id: 'luxury', label: '✨ Luxury', primary: '#c9a96e', bg: '#0f0f0f', cardBg: '#1a1a1a', text: '#f5e6d3', font: 'Playfair Display' },
        { id: 'supplements', label: '💪 Supplements', primary: '#00c853', bg: '#f1f8e9', cardBg: '#e8f5e9', text: '#1b5e20', font: 'Roboto' },
        { id: 'fashion', label: '👗 Fashion', primary: '#212121', bg: '#fafafa', cardBg: '#f0f0f0', text: '#212121', font: 'Montserrat' },
        { id: 'tech', label: '🖥 Tech', primary: '#2979ff', bg: '#05070f', cardBg: '#0d1117', text: '#e0e0e0', font: 'Roboto Mono' },
        { id: 'wellness', label: '🌿 Wellness', primary: '#388e3c', bg: '#f9fbe7', cardBg: '#f1f8e9', text: '#1b5e20', font: 'Lato' },
        { id: 'petstore', label: '🐾 Pet Store', primary: '#ff6f00', bg: '#fff8e1', cardBg: '#fff3e0', text: '#bf360c', font: 'Nunito' },
    ];
    const LANDING_SECTION_LABELS: Record<string, string> = {
        hero: '🚀 Hero Banner',
        benefits: '✅ Beneficios',
        howItWorks: '⚙️ Cómo Funciona',
        beforeAfter: '🔄 Antes y Después',
        reviews: '⭐ Testimonios',
        whatsapp: '💬 WhatsApp Review',
        faq: '❓ Preguntas Frecuentes',
        cta: '🛒 Llamada a la Acción',
    };
    const ALL_LANDING_SECTIONS = ['hero','benefits','howItWorks','beforeAfter','reviews','whatsapp','faq','cta'];

    // === LANDING AI HANDLERS ===
    const handleAnalyzeLandingProduct = async () => {
        if (!landingAiUrl.trim() && landingAiImages.length === 0) {
            setToast({ msg: 'Ingresa una URL o sube imágenes del producto', type: 'error' }); return;
        }
        setIsAnalyzingLanding(true);
        try {
            const prompt = `Eres un experto en e-commerce y conversión. Analiza el siguiente producto y responde ÚNICAMENTE con un JSON válido (sin markdown, sin backticks).

Producto URL: ${landingAiUrl || 'No proporcionada'}
${landingAiImages.length > 0 ? 'Se adjuntan imágenes del producto.' : ''}

Responde con este JSON exacto:
{
  "productName": "Nombre del producto",
  "productType": "Categoría (ej: Suero capilar, Suplemento, Ropa)",
  "targetAvatar": "Descripción del cliente ideal",
  "estimatedPrice": "Precio estimado",
  "mainBenefits": ["Beneficio 1", "Beneficio 2", "Beneficio 3", "Beneficio 4"],
  "painPoints": ["Dolor 1", "Dolor 2", "Dolor 3"],
  "objections": ["Objeción 1", "Objeción 2", "Objeción 3"],
  "angles": ["Ángulo emocional", "Ángulo de resultado", "Ángulo de urgencia"],
  "recommendedStyle": "beauty",
  "recommendedSections": ["hero","benefits","howItWorks","reviews","faq","cta"],
  "reasoning": "Breve explicación de por qué recomiendas estas secciones para este producto.",
  "heroHeadline": "Titular poderoso para este producto",
  "heroSubtitle": "Subtítulo que complementa el titular"
}`;
            const res = await fetch('/api/vertex-ai/landing-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, systemPrompt: 'Eres un experto en e-commerce. Responde ÚNICAMENTE con JSON válido.', images: landingAiImages })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            const analysis = JSON.parse(data.result);
            setLandingAiAnalysis(analysis);
            setLandingAiStructure(analysis.recommendedSections || ['hero','benefits','howItWorks','reviews','faq','cta']);
            if (analysis.recommendedStyle) setLandingAiStyle(analysis.recommendedStyle);
            setLandingAiStep('structure');
        } catch (e: any) {
            setToast({ msg: 'Error al analizar: ' + e.message, type: 'error' });
        } finally {
            setIsAnalyzingLanding(false);
        }
    };

    const handleGenerateLandingAi = async () => {
        if (!landingAiAnalysis) return;
        setIsGeneratingLandingAi(true);
        setLandingAiStep('generating');
        setLandingAiGenProgress(0);
        const style = LANDING_STYLES.find(s => s.id === landingAiStyle) || LANDING_STYLES[0];
        try {
            setLandingAiGenStatus('Creando estructura de contenido...');
            setLandingAiGenProgress(10);
            const sectionsToGenerate = landingAiStructure.join(', ');
            const prompt = `Eres un experto copywriter y diseñador de landing pages de alta conversión para e-commerce.

PRODUCTO:
- Nombre: ${landingAiAnalysis.productName}
- Tipo: ${landingAiAnalysis.productType}
- Avatar: ${landingAiAnalysis.targetAvatar}
- Precio: ${landingAiAnalysis.estimatedPrice}
- Beneficios: ${landingAiAnalysis.mainBenefits?.join(', ')}
- Dolores: ${landingAiAnalysis.painPoints?.join(', ')}
- Objeciones: ${landingAiAnalysis.objections?.join(', ')}
- Ángulos: ${landingAiAnalysis.angles?.join(', ')}
- Estilo visual: ${style.label}

Genera ÚNICAMENTE un JSON válido (sin markdown) con estas secciones: ${sectionsToGenerate}

Formato exacto (incluye solo las secciones solicitadas):
{
  "hero": {
    "badge": "Texto pequeño encima del título (ej: #1 en Colombia)",
    "title": "Titular principal poderoso (max 10 palabras)",
    "subtitle": "Subtítulo convincente que amplía el titular (max 20 palabras)",
    "button": "Texto del botón CTA (ej: Comprar Ahora)",
    "buttonSecondary": "Texto botón secundario (ej: Ver más)",
    "trustBadges": ["🔒 Pago seguro", "🚚 Envío gratis", "⭐ 4.9/5 estrellas"]
  },
  "benefits": {
    "title": "Título de la sección",
    "subtitle": "Subtítulo explicativo",
    "items": [
      {"emoji": "💧", "title": "Nombre beneficio", "desc": "Descripción 1 línea"},
      {"emoji": "✨", "title": "Nombre beneficio", "desc": "Descripción 1 línea"},
      {"emoji": "🌿", "title": "Nombre beneficio", "desc": "Descripción 1 línea"},
      {"emoji": "💪", "title": "Nombre beneficio", "desc": "Descripción 1 línea"}
    ]
  },
  "howItWorks": {
    "title": "Cómo Funciona",
    "steps": [
      {"number": 1, "emoji": "📦", "title": "Paso 1", "desc": "Descripción breve"},
      {"number": 2, "emoji": "💆", "title": "Paso 2", "desc": "Descripción breve"},
      {"number": 3, "emoji": "✨", "title": "Paso 3", "desc": "Descripción breve"}
    ]
  },
  "beforeAfter": {
    "title": "La Transformación",
    "beforeLabel": "Antes",
    "afterLabel": "Después",
    "beforePoints": ["Problema 1", "Problema 2", "Problema 3"],
    "afterPoints": ["Resultado 1", "Resultado 2", "Resultado 3"]
  },
  "reviews": {
    "title": "Lo que dicen nuestros clientes",
    "subtitle": "Más de X clientes satisfechos",
    "items": [
      {"name": "Nombre Cliente", "location": "Ciudad, País", "rating": 5, "text": "Reseña auténtica y específica de 2-3 líneas"},
      {"name": "Nombre Cliente", "location": "Ciudad, País", "rating": 5, "text": "Reseña auténtica y específica de 2-3 líneas"},
      {"name": "Nombre Cliente", "location": "Ciudad, País", "rating": 5, "text": "Reseña auténtica y específica de 2-3 líneas"}
    ]
  },
  "whatsapp": {
    "title": "Resultados reales de nuestros clientes",
    "clientName": "Nombre del cliente",
    "messages": [
      {"sender": "company", "text": "Hola! ¿Cómo te fue con el producto?"},
      {"sender": "client", "text": "¡Increíble! Los resultados son impresionantes 😍"},
      {"sender": "company", "text": "¡Qué alegría! 🥰"},
      {"sender": "client", "text": "Lo recomiendo 100% ✨"}
    ]
  },
  "faq": {
    "title": "Preguntas Frecuentes",
    "items": [
      {"q": "Pregunta relevante 1?", "a": "Respuesta clara y convincente que elimina dudas."},
      {"q": "Pregunta relevante 2?", "a": "Respuesta clara y convincente que elimina dudas."},
      {"q": "Pregunta relevante 3?", "a": "Respuesta clara y convincente que elimina dudas."},
      {"q": "¿Cuánto demora el envío?", "a": "Respuesta sobre envío."}
    ]
  },
  "cta": {
    "title": "Título urgente y persuasivo",
    "subtitle": "Subtítulo que refuerza la decisión",
    "button": "Texto del botón final",
    "urgency": "⚡ Texto de urgencia (ej: Solo 47 unidades disponibles)",
    "guarantee": "🔒 Texto de garantía (ej: 30 días de garantía sin preguntas)"
  }
}`;

            setLandingAiGenStatus('Generando contenido de alta conversión...');
            setLandingAiGenProgress(40);

            const res = await fetch('/api/vertex-ai/landing-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, systemPrompt: 'Eres un experto copywriter de e-commerce. Responde ÚNICAMENTE con JSON válido siguiendo el schema exacto indicado.' })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setLandingAiGenStatus('Procesando secciones...');
            setLandingAiGenProgress(80);

            const landingData = JSON.parse(data.result);
            setLandingAiData(landingData);
            setLandingAiGenProgress(100);
            setLandingAiGenStatus('¡Landing generada con éxito!');
            await new Promise(r => setTimeout(r, 800));
            setLandingAiStep('preview');
            setLandingAiChat([{ role: 'ai', content: `✅ Tu landing de alta conversión está lista con ${landingAiStructure.length} secciones. Puedes usar el chat para pedir cambios como: "Haz el hero más premium", "Agrega más urgencia al CTA", "Cambia el tono a más emocional".` }]);
        } catch (e: any) {
            setToast({ msg: 'Error generando landing: ' + e.message, type: 'error' });
            setLandingAiStep('structure');
        } finally {
            setIsGeneratingLandingAi(false);
        }
    };

    const handleEditLandingSection = async (sectionKey: string, instruction: string) => {
        if (!landingAiData || !instruction.trim()) return;
        setIsEditingLandingSection(true);
        setEditingLandingSection(sectionKey);
        try {
            const style = LANDING_STYLES.find(s => s.id === landingAiStyle) || LANDING_STYLES[0];
            const currentSection = JSON.stringify(landingAiData[sectionKey], null, 2);
            const prompt = `Eres un experto copywriter. Modifica SOLO esta sección de landing page según la instrucción.

PRODUCTO: ${landingAiAnalysis?.productName}
ESTILO VISUAL: ${style.label}
SECCIÓN ACTUAL (${sectionKey}):
${currentSection}

INSTRUCCIÓN: ${instruction}

Responde ÚNICAMENTE con el JSON de la sección modificada (misma estructura, sin markdown):`;

            const res = await fetch('/api/vertex-ai/landing-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, systemPrompt: 'Responde ÚNICAMENTE con JSON válido de la sección indicada. Misma estructura exacta.' })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            const updatedSection = JSON.parse(data.result);
            setLandingAiData((prev: any) => ({ ...prev, [sectionKey]: updatedSection }));
            setEditLandingSectionInstruction('');
            setEditingLandingSection(null);
            setToast({ msg: `✅ Sección actualizada`, type: 'success' });
        } catch (e: any) {
            setToast({ msg: 'Error al editar: ' + e.message, type: 'error' });
        } finally {
            setIsEditingLandingSection(false);
        }
    };

    const handleLandingAiChat = async () => {
        if (!landingAiChatInput.trim() || !landingAiData) return;
        const userMsg = landingAiChatInput.trim();
        setLandingAiChat(prev => [...prev, { role: 'user', content: userMsg }]);
        setLandingAiChatInput('');
        setIsLandingChatLoading(true);
        try {
            const style = LANDING_STYLES.find(s => s.id === landingAiStyle) || LANDING_STYLES[0];
            const prompt = `Eres un asistente de diseño web conversacional. El usuario tiene una landing page de "${landingAiAnalysis?.productName}" con estilo "${style.label}".

Landing actual:
${JSON.stringify(landingAiData, null, 2)}

El usuario dice: "${userMsg}"

Analiza qué sección(es) debe modificar. Responde con JSON:
{
  "response": "Respuesta amigable explicando qué cambiaste",
  "updatedSections": {
    "nombreSeccion": { /* nuevo contenido de esa sección con la misma estructura */ }
  }
}`;
            const res = await fetch('/api/vertex-ai/landing-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, systemPrompt: 'Eres un asistente de diseño web conversacional. Responde ÚNICAMENTE con JSON válido con las claves response y updatedSections.' })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            const result = JSON.parse(data.result);
            if (result.updatedSections) {
                setLandingAiData((prev: any) => ({ ...prev, ...result.updatedSections }));
            }
            setLandingAiChat(prev => [...prev, { role: 'ai', content: result.response || 'Hecho! He actualizado la landing según tu instrucción.' }]);
        } catch (e: any) {
            setLandingAiChat(prev => [...prev, { role: 'ai', content: '❌ Error al procesar tu solicitud. Intenta de nuevo.' }]);
        } finally {
            setIsLandingChatLoading(false);
        }
    };

    const handleExportLandingHtml = () => {
        if (!landingAiData) return;
        const style = LANDING_STYLES.find(s => s.id === landingAiStyle) || LANDING_STYLES[0];
        const customPrimary = landingAiCustomPrimary || style.primary;
        const customBg = landingAiCustomBg || style.bg;
        const customCardBg = landingAiCustomCardBg || style.cardBg;
        const customText = landingAiCustomText || style.text;
        const d = landingAiData;
        let html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${landingAiAnalysis?.productName || 'Landing Page'}</title>
<link href="https://fonts.googleapis.com/css2?family=${style.font?.replace(/ /g,'+')}:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'${style.font}',sans-serif;background:${customBg};color:${customText}}
.hero{background:${customPrimary};color:#fff;padding:80px 40px;text-align:center}
.hero h1{font-size:3rem;font-weight:900;margin-bottom:16px}
.hero p{font-size:1.25rem;margin-bottom:32px;opacity:.9}
.hero .btn{background:#fff;color:${customPrimary};padding:18px 48px;border-radius:50px;font-weight:900;font-size:1.1rem;text-decoration:none;display:inline-block}
.section{padding:80px 40px;max-width:1200px;margin:0 auto;text-align:center}
.section h2{font-size:2.2rem;font-weight:800;margin-bottom:16px}
.section p{color:#666;margin-bottom:40px;font-size:1.05rem}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.card{background:${customCardBg};padding:32px;border-radius:16px;text-align:center}
.card .emoji{font-size:2.5rem;margin-bottom:16px}
.card h3{font-size:1.1rem;font-weight:700;margin-bottom:8px}
.faq-item{text-align:left;background:${customCardBg};padding:24px;border-radius:12px;margin-bottom:16px}
.faq-item h4{font-weight:700;margin-bottom:8px}
.cta-section{background:${customPrimary};color:#fff;padding:80px 40px;text-align:center}
.cta-section h2{font-size:2.5rem;font-weight:900;margin-bottom:16px}
.cta-btn{background:#fff;color:${customPrimary};padding:20px 56px;border-radius:50px;font-weight:900;font-size:1.2rem;text-decoration:none;display:inline-block;margin-top:24px}
</style>
</head>
<body>`;
        if (d.hero) html += `<div class="hero"><p style="font-size:.85rem;opacity:.7;margin-bottom:12px">${d.hero.badge||''}</p><h1>${d.hero.title}</h1><p>${d.hero.subtitle}</p><a href="#" class="btn">${d.hero.button}</a></div>`;
        if (d.benefits) html += `<div class="section"><h2>${d.benefits.title}</h2><p>${d.benefits.subtitle||''}</p><div class="grid-3">${(d.benefits.items||[]).map((b: any)=>`<div class="card"><div class="emoji">${b.emoji}</div><h3>${b.title}</h3><p>${b.desc}</p></div>`).join('')}</div></div>`;
        if (d.reviews) html += `<div class="section" style="background:${customCardBg}"><div style="max-width:1200px;margin:0 auto"><h2>${d.reviews.title}</h2><div class="grid-3">${(d.reviews.items||[]).map((r: any)=>`<div class="card"><p>${'⭐'.repeat(r.rating)}</p><p style="margin:16px 0;font-style:italic">"${r.text}"</p><strong>${r.name}</strong><br><small>${r.location}</small></div>`).join('')}</div></div></div>`;
        if (d.faq) html += `<div class="section"><h2>${d.faq.title}</h2>${(d.faq.items||[]).map((f: any)=>`<div class="faq-item"><h4>${f.q}</h4><p>${f.a}</p></div>`).join('')}</div>`;
        if (d.cta) html += `<div class="cta-section"><h2>${d.cta.title}</h2><p>${d.cta.subtitle}</p><p style="opacity:.8;margin-top:12px">${d.cta.urgency||''}</p><a href="#" class="cta-btn">${d.cta.button}</a><p style="opacity:.7;margin-top:16px;font-size:.9rem">${d.cta.guarantee||''}</p></div>`;
        html += `</body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `landing-${(landingAiAnalysis?.productName||'page').replace(/\s+/g,'-').toLowerCase()}.html`;
        a.click(); URL.revokeObjectURL(url);
        setToast({ msg: '✅ HTML descargado', type: 'success' });
    };

    const handleExportShopifyLiquid = () => {
        if (!landingAiData) return;
        const style = LANDING_STYLES.find(s => s.id === landingAiStyle) || LANDING_STYLES[0];
        const customPrimary = landingAiCustomPrimary || style.primary;
        const customCardBg = landingAiCustomCardBg || style.cardBg;
        const d = landingAiData;
        const files: Record<string, string> = {};
        if (d.hero) files['sections/hero-banner.liquid'] = `{% schema %}{"name":"Hero Banner","settings":[{"type":"text","id":"title","label":"Title","default":"${d.hero.title}"},{"type":"text","id":"subtitle","label":"Subtitle","default":"${d.hero.subtitle}"},{"type":"text","id":"button","label":"Button","default":"${d.hero.button}"}]}{% endschema %}\n<section style="background:${customPrimary};color:#fff;padding:80px 40px;text-align:center"><h1 style="font-size:3rem;font-weight:900">{{ section.settings.title }}</h1><p style="font-size:1.2rem;margin:16px 0">{{ section.settings.subtitle }}</p><a href="/collections/all" style="background:#fff;color:${customPrimary};padding:16px 40px;border-radius:50px;font-weight:900;text-decoration:none">{{ section.settings.button }}</a></section>`;
        if (d.faq) files['sections/faq.liquid'] = `{% schema %}{"name":"FAQ","settings":[{"type":"text","id":"title","label":"Title","default":"${d.faq.title}"}],"blocks":[{"type":"faq_item","name":"FAQ Item","settings":[{"type":"text","id":"question","label":"Question"},{"type":"textarea","id":"answer","label":"Answer"}]}]}{% endschema %}\n<section style="padding:80px 40px;max-width:900px;margin:0 auto"><h2 style="text-align:center;font-size:2rem;font-weight:800;margin-bottom:40px">{{ section.settings.title }}</h2>{% for block in section.blocks %}<details style="background:${customCardBg};padding:20px;border-radius:12px;margin-bottom:12px"><summary style="font-weight:700;cursor:pointer">{{ block.settings.question }}</summary><p style="margin-top:12px;color:#666">{{ block.settings.answer }}</p></details>{% endfor %}</section>`;
        if (d.cta) files['sections/cta-final.liquid'] = `{% schema %}{"name":"CTA Final","settings":[{"type":"text","id":"title","label":"Title","default":"${d.cta.title}"},{"type":"text","id":"button","label":"Button","default":"${d.cta.button}"},{"type":"text","id":"urgency","label":"Urgency","default":"${d.cta.urgency||''}"}]}{% endschema %}\n<section style="background:${customPrimary};color:#fff;padding:80px 40px;text-align:center"><h2 style="font-size:2.5rem;font-weight:900">{{ section.settings.title }}</h2><p style="margin:16px 0;opacity:.8">{{ section.settings.urgency }}</p><a href="/cart" style="background:#fff;color:${customPrimary};padding:20px 56px;border-radius:50px;font-weight:900;text-decoration:none;display:inline-block;margin-top:24px">{{ section.settings.button }}</a></section>`;
        Object.entries(files).forEach(([filename, content]) => {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename.split('/').pop()!;
            a.click(); URL.revokeObjectURL(url);
        });
        setToast({ msg: `✅ ${Object.keys(files).length} archivos Shopify Liquid descargados`, type: 'success' });
    };

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

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    const activeProject = projects.find(p => p.id === activeProjectId) || null;

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
    // Financial Helpers & Logic
    const fmt = (v: any) => new Intl.NumberFormat().format(Math.round(Number(v) || 0));
    const fmtPct = (v: any) => (Number(v) || 0).toFixed(1) + '%';
    const snap = finSnapshot;
    const liveGastoAdmin = Number(finOrdenesMensuales) > 0 ? (Number(finGastosFijos) / Number(finOrdenesMensuales)) : 0;

    const calcular = () => {
        const pVenta = Number(finPrecioCOD);
        const cProd = Number(finCostoProducto);
        const fIda = Number(finFleteIda);
        const fDev = Number(finFleteDevolucion);
        const pRec = Number(finRecaudo) / 100;
        const oMens = Number(finOrdenesMensuales);
        const gFijos = Number(finGastosFijos);

        const pCan = Number(finCancelaciones) / 100;
        const pDevol = Number(finDevoluciones) / 100;
        const pGar = Number(finGarantias) / 100;
        const pChar = Number(finChargebacks) / 100;
        const pCpa = Number(finCPAObjetivo) / 100;

        const costoRecaudo = pVenta * pRec;
        const costoCPA = pVenta * pCpa;
        const gastoAdmin = oMens > 0 ? gFijos / oMens : 0;
        const costoGarantias = cProd * pGar;
        const costoChargebacks = pVenta * pChar;
        const costoFleteTotal = fIda + (pDevol * fDev);

        const entregadas = 1 - pCan - pDevol;
        const ingresoPorVenta = pVenta * entregadas;
        const totalCostos = costoFleteTotal + cProd + costoRecaudo + gastoAdmin + costoCPA + costoGarantias + costoChargebacks;

        const utilidadNeta = ingresoPorVenta - totalCostos;
        const margenReal = pVenta > 0 ? (utilidadNeta / pVenta) * 100 : 0;
        const utilidadMensualBruta = utilidadNeta * oMens;
        const roiMensual = totalCostos > 0 ? (utilidadNeta / totalCostos) * 100 : 0;

        const preciosOptimos = [
            { margen: 15, precio: totalCostos / (entregadas - 0.15) },
            { margen: 25, precio: totalCostos / (entregadas - 0.25) },
            { margen: 35, precio: totalCostos / (entregadas - 0.35) },
            { margen: 45, precio: totalCostos / (entregadas - 0.45), label: 'Recomendado' }
        ];

        setFinSnapshot({
            utilidadNeta,
            margenReal,
            utilidadMensualBruta,
            roiMensual,
            costoProd: cProd,
            gastoAdmin,
            costoRecaudo,
            costoFleteTotal,
            costoCPA,
            costoGarantias,
            costoChargebacks,
            totalCostos,
            precioCOD: pVenta,
            preciosOptimos,
            precioSugerido: preciosOptimos[3].precio,
            moneda: finMoneda,
            sym: FIN_MONEDAS.find(m => m.code === finMoneda)?.symbol || '$'
        });
        setFinCalculado(true);
        setToast({ msg: "Análisis financiero calculado", type: 'success' });
    };

    const handleGenerateFinAI = async () => {
        if (!snap) return;
        setIsFinAIOn(true);
        try {
            const prompt = `Analiza estos números financieros de un negocio de E-commerce (COD):
            - Precio: ${snap.sym}${fmt(snap.precioCOD)}
            - Costo Producto: ${snap.sym}${fmt(snap.costoProd)}
            - Utilidad Neta: ${snap.sym}${fmt(snap.utilidadNeta)}
            - Margen Real: ${fmtPct(snap.margenReal)}
            - ROI Mensual: ${fmtPct(snap.roiMensual)}
            
            Dame 3 consejos estratégicos breves para mejorar la rentabilidad.`;

            const res = await fetch("/api/vertex-ai/generate-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, systemPrompt: "Eres un analista financiero experto en E-commerce." })
            });
            const data = await res.json();
            if (data.success) {
                setFinAIResult(data.result);
                setToast({ msg: "Estrategia generada con éxito", type: 'success' });
            }
        } catch (e: any) {
            setToast({ msg: "Error en IA Financiera: " + e.message, type: 'error' });
        } finally {
            setIsFinAIOn(false);
        }
    };

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
    const [waSimEvaluation, setWaSimEvaluation] = useState<any | null>(null);
    const [waSimMessages, setWaSimMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [waSimInput, setWaSimInput] = useState("");
    const [waSimClientType, setWaSimClientType] = useState("Escéptico e indeciso");
    const [isWaSimLoading, setIsWaSimLoading] = useState(false);
    const [objectionProductName, setObjectionProductName] = useState("");
    const [objectionTargetAudience, setObjectionTargetAudience] = useState("");
    const [manualObjections, setManualObjections] = useState("");
    const [isObjectionLoading, setIsObjectionLoading] = useState(false);
    const [objectionResults, setObjectionResults] = useState<{ objection: string, hiddenFear: string, script: string, psychology: string }[] | null>(null);



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
                        const copyRes = await fetch('/api/vertex-ai/generate-copy', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                productName: activeProject.productName,
                                targetAudience: activeProject.targetAudience,
                                angle: targetAngle.name,
                                imageBase64: part.inlineData.data,
                                mimeType: part.inlineData.mimeType,
                                apiKey: apiKey
                            })
                        });
                        const copyData = await copyRes.json();
                        newVar.copy = copyData.copy || "";
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

            const res = await fetch('/api/vertex-ai/generate-copy', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName: activeProject.productName,
                    targetAudience: activeProject.targetAudience,
                    angle: activeProject.results[index].angle || "General",
                    imageBase64: base64Data,
                    mimeType: mimeType,
                    apiKey: apiKey
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
            const data = await res.json();
            const copy = data.copy || "";

            const newResults = [...(activeProject?.results || [])];
            newResults[index].copy = copy;
            updateActiveProject({ results: newResults });
            setToast({ msg: "Copy generado con éxito", type: 'success' });
        } catch (error: any) {
            console.error("Error generating copy:", error);
            setToast({ msg: error.message || "Error al generar copy.", type: 'error' });
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
        let currentAngle = "Refinamiento";

        if (isLanding) {
            if (!landingResults) return;
            prevImage = landingResults.image;
            currentAngle = landingResults.angle || "Landing";
        } else {
            const target = activeProject!.results[index];
            if (!target) return;
            prevImage = target.image;
            currentAngle = target.angle || "Refinamiento";
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

                // Generate new copy based on adjusted image using OpenAI backend
                try {
                    const copyRes = await fetch('/api/vertex-ai/generate-copy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            productName: activeProject!.productName,
                            targetAudience: activeProject!.targetAudience,
                            angle: currentAngle,
                            imageBase64: part.inlineData.data,
                            mimeType: part.inlineData.mimeType,
                            apiKey: apiKey
                        })
                    });
                    const copyData = await copyRes.json();
                    newCopy = copyData.copy || "";
                } catch (e) {
                    console.error("Copy error", e);
                }

                if (isLanding) {
                    setLandingResults({ image: newImg, angle: currentAngle });
                    setShowLandingRefine(false);
                } else {
                    const newResults = [...activeProject!.results];
                    newResults[index] = {
                        ...newResults[index],
                        image: newImg,
                        copy: newCopy || newResults[index].copy
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

    const handleResearch = async () => {
        if (!researchName.trim()) {
            setToast({ msg: "Escribe el nombre del producto", type: 'error' });
            return;
        }
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        setIsResearchLoading(true);
        setResearchResults(null);
        try {
            const res = await fetch("/api/vertex-ai/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: researchName, description: researchDescription, apiKey: apiKey })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }

            const data = await res.json();
            if (data.success) {
                setResearchResults(data.results);
                const newHistory = [{ id: Math.random().toString(), name: researchName, description: researchDescription, date: new Date().toLocaleDateString(), results: data.results }, ...researchHistory];
                setResearchHistory(newHistory);
                localStorage.setItem(getUKey("clickads_research_history"), JSON.stringify(newHistory));
                setToast({ msg: "Investigación completada con éxito", type: 'success' });
            } else {
                throw new Error(data.error || "Error en investigación");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsResearchLoading(false);
        }
    };


    const handleObjections = async () => {
        if (!objectionProductName.trim()) {
            setToast({ msg: "Escribe el nombre del producto", type: 'error' });
            return;
        }
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        setIsObjectionLoading(true);
        setObjectionResults(null);
        try {
            const res = await fetch("/api/vertex-ai/objections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName: objectionProductName, targetAudience: objectionTargetAudience, manualObjections: manualObjections, apiKey: apiKey })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
            const data = await res.json();
            if (data.success) {
                setObjectionResults(data.objections);
                setToast({ msg: "Objeciones destruidas con éxito", type: 'success' });
            } else {
                throw new Error(data.error || "Error al procesar objeciones");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsObjectionLoading(false);
        }
    };


    const handleWaSimEvaluate = async () => {
        if (waSimMessages.length < 2) {
            setToast({ msg: "Necesitas al menos 2 mensajes para evaluar", type: 'error' });
            return;
        }
        setIsEvaluatingWa(true);
        setWaSimEvaluation(null);
        try {
            const chatStr = waSimMessages.map(m => `${m.role === 'user' ? 'Vendedor' : 'Cliente'}: ${m.content}`).join("\n");
            const res = await fetch("/api/vertex-ai/whatsapp-closer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "evaluate",
                    userMessage: chatStr,
                    clientType: waSimClientType,
                    apiKey: apiKey,
                    productName: activeProject?.productName,
                    targetAudience: activeProject?.targetAudience
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = `Error del servidor: ${res.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }

            const data = await res.json();
            if (data.success && data.evaluation) {
                console.log("Evaluación recibida correctamente:", data.evaluation);
                setWaSimEvaluation(data.evaluation);
                setToast({ msg: "Evaluación generada con éxito", type: 'success' });
            } else {
                throw new Error(data.error || "La IA no devolvió una evaluación válida.");
            }
        } catch (e: any) {
            console.error("Error crítico en evaluación:", e);
            setToast({ msg: "Error al evaluar: " + e.message, type: 'error' });
        } finally {
            setIsEvaluatingWa(false);
        }
    };

    const handleWaSimStart = async () => {
        if (isWaSimLoading) return;
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        if (!activeProjectId) {
            setToast({ msg: "Selecciona un proyecto arriba para comenzar", type: 'error' });
            return;
        }

        setWaSimMessages([]);
        setWaSimEvaluation(null);
        setIsWaSimLoading(true);

        try {
            const res = await fetch("/api/vertex-ai/whatsapp-closer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "simulate",
                    chatHistory: [],
                    clientType: waSimClientType,
                    userMessage: "Hola, vi el anuncio y me interesa. Por favor, inicia tú la conversación como si fueras el cliente escribiéndome.",
                    apiKey: apiKey,
                    productName: activeProject?.productName,
                    targetAudience: activeProject?.targetAudience
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
            const data = await res.json();
            if (data.success) {
                setWaSimMessages([{ role: 'assistant', content: data.response }]);
                setToast({ msg: "Simulación iniciada por el cliente", type: 'success' });
            } else {
                throw new Error(data.error || "Error al iniciar simulación");
            }
        } catch (e: any) {
            setToast({ msg: "Error: " + e.message, type: 'error' });
        } finally {
            setIsWaSimLoading(false);
        }
    };

    const handleWaSimMessage = async () => {
        if (!waSimInput.trim() || isWaSimLoading) return;
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }

        const newUserMsg = { role: 'user' as const, content: waSimInput };
        const updatedMessages = [...waSimMessages, newUserMsg];
        setWaSimMessages(updatedMessages);
        setWaSimInput("");
        setIsWaSimLoading(true);

        try {
            const res = await fetch("/api/vertex-ai/whatsapp-closer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "simulate",
                    chatHistory: updatedMessages,
                    clientType: waSimClientType,
                    userMessage: waSimInput,
                    apiKey: apiKey,
                    productName: activeProject?.productName,
                    targetAudience: activeProject?.targetAudience
                })
            });
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
            const data = await res.json();
            if (data.success) {
                setWaSimMessages([...updatedMessages, { role: 'assistant', content: data.response }]);
            } else {
                throw new Error(data.error || "Error en la simulación");
            }
        } catch (e: any) {
            setToast({ msg: "Error: " + e.message, type: 'error' });
        } finally {
            setIsWaSimLoading(false);
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
            if (!res.ok) {
                const errorText = await res.text();
                let errorMsg = "Error en el servidor (404/500)";
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
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
            {tutorialVideoOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', padding: 24 }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: 1000, background: '#000', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
                        <button onClick={() => setTutorialVideoOpen(null)} style={{ position: 'absolute', top: -20, right: -20, background: '#EF4444', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: 20, cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                            <X size={20} />
                        </button>
                        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 24, overflow: 'hidden' }}>
                            <iframe
                                src={tutorialVideoOpen}
                                frameBorder="0"
                                allowFullScreen
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                            </iframe>
                        </div>
                    </div>
                </div>
            )}
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
                    <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => { setActiveTab('home'); setActiveProjectId(null); }}><Home size={18} /> Inicio</div>
                    <div className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => { setActiveTab('generator'); setActiveProjectId(null); }}><Sparkles size={18} /> Genera Creativos</div>
                    <div className={`nav-item ${activeTab === 'ugc_generator' ? 'active' : ''}`} onClick={() => { setActiveTab('ugc_generator'); setActiveProjectId(null); }}><Sparkles size={18} /> UGC Image Generator <span style={{ fontSize: 9, background: "#8B5CF6", color: "#fff", padding: "2px 6px", borderRadius: 4, marginLeft: 8, fontWeight: 900 }}>HOT</span></div>
                    <div className={`nav-item ${activeTab === 'wa_reviews' ? 'active' : ''}`} onClick={() => { setActiveTab('wa_reviews'); setActiveProjectId(null); }}><MessageSquare size={18} /> WhatsApp Reviews AI <span style={{ fontSize: 9, background: "#10B981", color: "#fff", padding: "2px 6px", borderRadius: 4, marginLeft: 8, fontWeight: 900 }}>NUEVO</span></div>
                    <div className={`nav-item ${activeTab === 'landing' ? 'active' : ''}`} onClick={() => { setActiveTab('landing'); setActiveProjectId(null); }}><Layout size={18} /> Generar Landing Page</div>
                    <div className={`nav-item ${activeTab === 'logo_generator' ? 'active' : ''}`} onClick={() => setActiveTab('logo_generator')}><Sparkles size={18} /> Generar Logo</div>
                    <div className={`nav-item ${activeTab === 'photo_studio' ? 'active' : ''}`} onClick={() => setActiveTab('photo_studio')}><Camera size={18} /> Photo Studio</div>
                    <div className={`nav-item ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}><Search size={18} /> Investigación de Producto <span style={{ fontSize: 9, background: "#8B5CF6", color: "#fff", padding: "2px 6px", borderRadius: 4, marginLeft: 8, fontWeight: 900 }}>NUEVO</span></div>
                    <div className={`nav-item ${activeTab === 'objections' ? 'active' : ''}`} onClick={() => setActiveTab('objections')}><ShieldOff size={18} /> Destructor de Objeciones <span style={{ fontSize: 9, background: "#EF4444", color: "#fff", padding: "2px 6px", borderRadius: 4, marginLeft: 8, fontWeight: 900 }}>PRO</span></div>


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
            <main style={{ marginLeft: 300, flex: 1, padding: "40px 20px", overflowX: 'hidden' }}>

                {/* ===== HOME TAB ===== */}
                {activeTab === 'home' && (
                    <div style={{ width: "100%" }} className="anim-in">
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
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24, padding: 32 }}>
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
                                <div className="home-tool-card" onClick={() => setActiveTab('wa_reviews')}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800 }}>WhatsApp Reviews AI</div>
                                        <div style={{ fontSize: 11, color: "#6B7280" }}>Reseñas en captura de chat</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {activeTab === 'generator' && (
                    <div style={{ width: "100%" }}>
                        <div style={{ marginBottom: 24 }}>
                            <button onClick={() => setTutorialVideoOpen('https://www.loom.com/embed/0d6c811957394d4e822ddef39cf57978')} style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                                <PlayCircle size={16} /> Ir a video tutorial de esta sección
                            </button>
                        </div>
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


                {activeTab === 'ugc_generator' && (
                    <div style={{ width: "100%" }}>
                        {!activeProjectId ? (
                            <>
                                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Mis Proyectos (UGC)</h1>
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
                            <div className="anim-in">
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                                        <button onClick={() => setActiveProjectId(null)} style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><ArrowLeft size={16} /> Volver</button>
                                        <button onClick={() => { setUgcProductImage(null); setUgcResults([]); }} style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444", padding: "6px 16px", borderRadius: 100, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Empezar de nuevo</button>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.5 }}>PROYECTO ACTIVO UGC</div>
                                        <div style={{ fontWeight: 900, fontSize: 24, fontFamily: activeProject?.font, color: activeProject?.primaryColor }}>{activeProject?.name}</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 32 }}>
                                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                                        <Sparkles size={28} color="#8B5CF6" /> UGC Image Generator
                                    </h1>
                                    <p style={{ color: "#9CA3AF" }}>Crea una escena que parece una foto real tomada por un cliente o creador de contenido, optimizada para anuncios.</p>
                                </div>

                                {/* Main Grid: Left Controls (400px), Right Results (1fr) */}
                                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "400px 1fr", gap: 40, alignItems: "start", marginBottom: 40 }}>
                                    
                                    {/* Left Panel: Vertical Controls */}
                                    <div className="glass-card" style={{ padding: 32, height: "fit-content" }}>
                                        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                            <Camera size={18} color="#8B5CF6" /> Estudio Creativo
                                        </h2>

                                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                            
                                            {/* Product Upload */}
                                            <div>
                                                <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                                                    📸 1. Sube tu producto
                                                </label>
                                                <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 24, height: 200, position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
                                                    {!(ugcProductImage || activeProject?.productPreview) ? (
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.3, padding: 20, textAlign: "center" }}>
                                                            <UploadCloud size={24} />
                                                            <span style={{ fontSize: 12 }}>Sube una foto de tu producto</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const reader = new FileReader();
                                                                        reader.onloadend = () => setUgcProductImage(reader.result as string);
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <img src={ugcProductImage || activeProject?.productPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                            <button
                                                                onClick={() => {
                                                                    setUgcProductImage(null);
                                                                    if (activeProject) {
                                                                        updateActiveProject({ productPreview: "" });
                                                                    }
                                                                }}
                                                                style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11 }}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Name */}
                                            <div>
                                                <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                                                    Nombre del Producto
                                                </label>
                                                <input
                                                    className="input-field"
                                                    placeholder="Ej: Suero Capilar, Protector Solar..."
                                                    value={ugcProduct || activeProject?.productName || ""}
                                                    onChange={(e) => setUgcProduct(e.target.value)}
                                                />
                                            </div>

                                            {/* Auto-fill Template */}
                                            <div>
                                                <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                                                    ⭐ Plantillas Listas para Anuncios
                                                </label>
                                                <select
                                                    className="input-field"
                                                    onChange={(e) => {
                                                        const selected = ugcTemplates[parseInt(e.target.value, 10)];
                                                        if (selected) applyUgcTemplate(selected);
                                                    }}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Selecciona una plantilla...</option>
                                                    {ugcTemplates.map((t, idx) => (
                                                        <option key={idx} value={idx}>⭐ {t.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)" }} />

                                            {/* Selectors list */}
                                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                                
                                                <div>
                                                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>¿Quién aparece?</label>
                                                    <select
                                                        value={ugcWho}
                                                        onChange={(e) => setUgcWho(e.target.value)}
                                                        className="input-field"
                                                    >
                                                        {["Mujer", "Hombre", "Pareja", "Familia", "Adulto mayor", "Deportista", "Mamá", "Influencer"].map(v => <option key={v} value={v}>{v}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Edad</label>
                                                    <select
                                                        value={ugcAge}
                                                        onChange={(e) => setUgcAge(e.target.value)}
                                                        className="input-field"
                                                    >
                                                        {["18-24", "25-34", "35-44", "45-60"].map(v => <option key={v} value={v}>{v} años</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Escenario</label>
                                                    <select
                                                        value={ugcScenario}
                                                        onChange={(e) => setUgcScenario(e.target.value)}
                                                        className="input-field"
                                                    >
                                                        {["Baño", "Cocina", "Gimnasio", "Playa", "Oficina", "Casa", "Auto", "Cafetería"].map(v => <option key={v} value={v}>{v}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Tipo de foto</label>
                                                    <select
                                                        value={ugcPhotoType}
                                                        onChange={(e) => setUgcPhotoType(e.target.value)}
                                                        className="input-field"
                                                    >
                                                        {["Selfie", "Espejo", "Lifestyle", "Producto en mano", "Unboxing", "Antes y después", "Review", "Foto espontánea"].map(v => <option key={v} value={v}>{v}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Estilo</label>
                                                    <select
                                                        value={ugcStyle}
                                                        onChange={(e) => setUgcStyle(e.target.value)}
                                                        className="input-field"
                                                    >
                                                        {["iPhone", "Profesional", "TikTok", "Instagram", "Pinterest"].map(v => <option key={v} value={v}>{v}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Expresión</label>
                                                    <select
                                                        value={ugcExpression}
                                                        onChange={(e) => setUgcExpression(e.target.value)}
                                                        className="input-field"
                                                    >
                                                        {["Feliz", "Sorprendido", "Relajado", "Emocionado"].map(v => <option key={v} value={v}>{v}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Tamaño de Salida</label>
                                                    <select
                                                        value={ugcOutputSize}
                                                        onChange={(e) => setUgcOutputSize(e.target.value)}
                                                        className="input-field"
                                                    >
                                                        {OUTPUT_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                    </select>
                                                </div>

                                            </div>

                                            {/* Action Button */}
                                            <button
                                                type="button"
                                                onClick={handleGenerateUgc}
                                                disabled={ugcGenerating}
                                                style={{
                                                    width: "100%",
                                                    padding: "16px 24px",
                                                    borderRadius: 12,
                                                    background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
                                                    border: "none",
                                                    color: "#fff",
                                                    fontSize: 15,
                                                    fontWeight: 800,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 8,
                                                    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.25)"
                                                }}
                                            >
                                                {ugcGenerating ? <Loader2 className="animate-spin" size={18} /> : <><Sparkles size={16} /> Generar Escena UGC</>}
                                            </button>

                                        </div>
                                    </div>

                                    {/* Right Column: Results List */}
                                    <div>
                                        {ugcResults.length > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                                <h3 style={{ fontSize: 20, fontWeight: 900 }}>Resultados Generados</h3>
                                                <button
                                                    onClick={() => downloadAsZip(ugcResults.map((r, idx) => ({ image: r.image, name: `ugc_${idx}` })), "clickads_ugc")}
                                                    className="btn-primary"
                                                    style={{ padding: "8px 16px", fontSize: 11, background: "rgba(255,255,255,0.05)", border: "1px solid #8B5CF6", color: "#8B5CF6" }}
                                                >
                                                    <Layers size={14} /> Descargar Todos (.ZIP)
                                                </button>
                                            </div>
                                        )}

                                        {/* Results Grid */}
                                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
                                            
                                            {ugcGenerating && (
                                                <div className="glass-card" style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, minHeight: 320, gridColumn: "1 / -1", border: "1px dashed rgba(139, 92, 246, 0.4)" }}>
                                                    <Loader2 className="animate-spin" size={40} style={{ color: "#8B5CF6" }} />
                                                    <span style={{ fontSize: 14, color: "#A78BFA", fontWeight: 700, letterSpacing: "0.05em", textAlign: "center" }}>GENERANDO FOTO REALISTA UGC CON GEMINI IA...</span>
                                                    <span style={{ fontSize: 11, color: "#6B7280" }}>Por favor espera de 5 a 10 segundos.</span>
                                                </div>
                                            )}

                                            {ugcResults.map((res, i) => (
                                                <div key={i} className="glass-card" style={{ padding: 16, position: "relative", display: "flex", flexDirection: "column" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                            <div style={{ fontSize: 11, fontWeight: 900, color: "#8B5CF6", textTransform: "uppercase" }}>{res.title}</div>
                                                            <button 
                                                                className="btn-primary" 
                                                                style={{ padding: "4px 8px", fontSize: 9, background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6 }} 
                                                                onClick={() => { setRefiningUgcIndex(i); setRefiningUgcText(""); }}
                                                            >
                                                                Ajustar
                                                            </button>
                                                        </div>
                                                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                            <button onClick={() => downloadSingleImage(res.image, `${res.title}.jpg`)} style={{ background: "none", border: "none", color: "#8B5CF6", cursor: "pointer" }}><Download size={16} /></button>
                                                            <button onClick={() => saveToLibrary(res.image, res.title, res.desc)} style={{ background: "none", border: "none", color: "#8B5CF6", cursor: "pointer" }}>
                                                                <Bookmark size={16} fill={library.some(a => a.image === res.image) ? "#8B5CF6" : "none"} />
                                                            </button>
                                                            <button onClick={() => setZoomedImage(res.image)} style={{ background: "none", border: "none", color: "#8B5CF6", cursor: "pointer" }}>
                                                                <Search size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    <div
                                                        style={{ position: "relative", cursor: "zoom-in", overflow: "hidden", borderRadius: 16, aspectRatio: "1/1", background: "#0d0d14", marginBottom: 12 }}
                                                        onClick={() => setZoomedImage(res.image)}
                                                        className="image-zoom-container"
                                                    >
                                                        <img src={res.image} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} className="hover-zoom" />
                                                    </div>

                                                    {refiningUgcIndex === i && (
                                                        <div className="anim-in" style={{ padding: 12, background: "rgba(139,92,246,0.1)", borderRadius: 12, border: "1px solid rgba(139,92,246,0.2)", marginBottom: 12 }}>
                                                            <label style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#8B5CF6", marginBottom: 8 }}>¿QUÉ QUIERES CAMBIAR EN ESTA FOTO?</label>
                                                            <textarea
                                                                className="input-field"
                                                                placeholder="Ej: Cambia el fondo a una cocina, haz que sonría más..."
                                                                value={refiningUgcText}
                                                                onChange={(e) => setRefiningUgcText(e.target.value)}
                                                                style={{ height: 60, fontSize: 11, marginBottom: 10 }}
                                                            />
                                                            <div style={{ display: "flex", gap: 8 }}>
                                                                <button
                                                                    disabled={isRefiningUgc}
                                                                    className="btn-primary"
                                                                    style={{ flex: 1, padding: "8px", fontSize: 10 }}
                                                                    onClick={() => handleRefineUgc(i)}
                                                                >
                                                                    {isRefiningUgc ? <Loader2 className="animate-spin" size={14} /> : "APLICAR CAMBIOS"}
                                                                </button>
                                                                <button className="btn-primary" style={{ padding: "8px 12px", fontSize: 10, background: "transparent", color: "#9CA3AF" }} onClick={() => setRefiningUgcIndex(null)}>X</button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div style={{ padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 12, fontSize: 12, color: "#9CA3AF", lineHeight: 1.4, marginTop: "auto" }}>
                                                        {res.desc}
                                                    </div>
                                                </div>
                                            ))}

                                            {ugcResults.length === 0 && !ugcGenerating && (
                                                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px" }}>
                                                    <Sparkles size={40} style={{ color: "#8B5CF6", opacity: 0.25, marginBottom: 16, margin: "0 auto" }} />
                                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#E5E7EB", marginBottom: 8 }}>No hay imágenes UGC generadas aún</h3>
                                                    <p style={{ color: "#6B7280", fontSize: 13, maxWidth: 420, margin: "0 auto" }}>Sube la foto de tu producto en el panel izquierdo y haz clic en "Generar Escena UGC" para crear escenas hiperrealistas.</p>
                                                </div>
                                            )}

                                        </div>


                                        {/* Advantage info panel */}
                                        <div className="glass-card" style={{ padding: 24, textAlign: "left", marginTop: 32 }}>
                                            <h4 style={{ fontSize: 15, fontWeight: 800, color: "#A78BFA", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                                <span>💡</span> Beneficios Clave
                                            </h4>
                                            <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.5, margin: 0 }}>
                                                Con un solo clic obtienes múltiples variaciones de fotos orgánicas (ej. aplicándose el producto, selfie con el frasco, sobre el lavamanos, antes y después). La ventaja es que no necesitas contratar modelos ni fotógrafos para probar distintos conceptos creativos.
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'photo_studio' && (
                    <div style={{ width: "100%" }}>
                        <div style={{ marginBottom: 24 }}>
                            <button onClick={() => setTutorialVideoOpen('https://www.loom.com/embed/b9b611cefb724181b755d62b06dd96fe')} style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                                <PlayCircle size={16} /> Ir a video tutorial de esta sección
                            </button>
                        </div>
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

                {activeTab === 'research' && (
                    <div style={{ width: "100%" }} className="anim-in">
                        <div style={{ marginBottom: 24 }}>
                            <button onClick={() => setTutorialVideoOpen('https://www.loom.com/embed/f83638978b4f4c1db4608b1930080389')} style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                                <PlayCircle size={16} /> Ir a video tutorial de esta sección
                            </button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, gap: 24 }}>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                                    <Search size={28} color="#8B5CF6" /> Investigación de Producto
                                </h1>
                                <p style={{ color: "#9CA3AF" }}>Analiza profundamente tu nicho, detecta dolores y crea ofertas irresistibles.</p>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
                            <div className="glass-card" style={{ padding: 40 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#8B5CF6", marginBottom: 12, textTransform: "uppercase" }}>Nombre del Producto</label>
                                        <input className="input-field" placeholder="Ej: Melatonina en Gomitas, Curso de Ads..." value={researchName} onChange={(e) => setResearchName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#8B5CF6", marginBottom: 12, textTransform: "uppercase" }}>Breve Descripción (Opcional)</label>
                                        <textarea className="input-field" placeholder="Ej: Es un suplemento natural para dormir mejor sin efectos secundarios..." style={{ height: 120 }} value={researchDescription} onChange={(e) => setResearchDescription(e.target.value)} />
                                    </div>
                                    <button
                                        className="btn-primary"
                                        style={{ width: "100%", justifyContent: "center", height: 60, fontSize: 18 }}
                                        onClick={handleResearch}
                                        disabled={isResearchLoading}
                                    >
                                        {isResearchLoading ? <Loader2 className="animate-spin" /> : <><Sparkles /> GENERAR INVESTIGACIÓN MAESTRA</>}
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: 40, minHeight: 400 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Historial Reciente</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {researchHistory.length > 0 ? researchHistory.map(item => (
                                        <div key={item.id} onClick={() => { setResearchResults(item.results); setResearchName(item.name); setResearchDescription(item.description); }} className="home-proj-row" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800 }}>{item.name}</div>
                                                <div style={{ fontSize: 11, color: "#4B5563" }}>{item.date}</div>
                                            </div>
                                            <ChevronRight size={18} color="#4B5563" />
                                        </div>
                                    )) : (
                                        <div style={{ textAlign: "center", opacity: 0.3, marginTop: 60 }}>
                                            <BookOpen size={48} style={{ margin: "0 auto 16px" }} />
                                            <p>No hay investigaciones aún</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {researchResults && (
                            <div className="glass-card anim-in" style={{ padding: 40, marginTop: 40, border: "2px solid #8B5CF6" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                                    <h2 style={{ fontSize: 24, fontWeight: 900 }}>Biblia de Investigación</h2>
                                    <button onClick={() => window.print()} className="btn-primary" style={{ padding: "8px 20px", fontSize: 12, background: "rgba(255,255,255,0.05)", border: "1px solid #8B5CF6", color: "#8B5CF6" }}>
                                        <Download size={14} /> EXPORTAR PDF
                                    </button>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {RESEARCH_MODULES.map((mod, idx) => (
                                        <div key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 16 }}>
                                            <div
                                                onClick={() => setExpandedResearch(expandedResearch === idx ? null : idx)}
                                                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>{idx + 1}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: 16 }}>{mod.title}</div>
                                                        <div style={{ fontSize: 11, color: "#6B7280" }}>{mod.desc}</div>
                                                    </div>
                                                </div>
                                                {expandedResearch === idx ? <ChevronDown size={20} color="#4B5563" /> : <ChevronRight size={20} color="#4B5563" />}
                                            </div>
                                            {expandedResearch === idx && (
                                                <div className="anim-in" style={{ padding: "20px 0 20px 48px", color: "#D1D5DB", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                                                    {researchResults[idx] || "Pendiente..."}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                        <div style={{ width: "100%" }}>
                            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 20 }}>Tutoriales de ClickAds</h1>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Tutorial para instalar API KEY #1</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/5f7aac1db4324dcca9e04965846c98b4"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Tutorial para instagram API KEY #2</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/0dda97d5c28940b9b3b9a1526890e731"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Seccion Generar Creativos</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/0d6c811957394d4e822ddef39cf57978"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Seccion Generar Landing Pages</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/0ecfd7bdd76f4522b10a72dc7c1e93aa"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Seccion Generar Logo</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/9ba599ab743a4eec963c918564590b6c"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Seccion Photo Studio</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/b9b611cefb724181b755d62b06dd96fe"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Seccion Investigacion de productos</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/f83638978b4f4c1db4608b1930080389"
                                            frameBorder="0"
                                            allowFullScreen
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}>
                                        </iframe>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Seccion Destructor de objeciones</h3>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            src="https://www.loom.com/embed/e13dd66b16104cf9973c8d10c772dbb8"
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
                        <div style={{ width: "100%" }}>
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
                        <div style={{ width: "100%" }}>
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
                        <div style={{ width: "100%" }} className="anim-in">
                            <div style={{ marginBottom: 24 }}>
                                <button onClick={() => setTutorialVideoOpen('https://www.loom.com/embed/9ba599ab743a4eec963c918564590b6c')} style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                                    <PlayCircle size={16} /> Ir a video tutorial de esta sección
                                </button>
                            </div>
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
                        <div style={{ width: "100%" }} className="anim-in">
                            <div style={{ marginBottom: 24 }}>
                                <button onClick={() => setTutorialVideoOpen('https://www.loom.com/embed/0ecfd7bdd76f4522b10a72dc7c1e93aa')} style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                                    <PlayCircle size={16} /> Ir a video tutorial de esta sección
                                </button>
                            </div>
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



                {
                    activeTab === 'wa_reviews' && (
                        <div style={{ width: "100%" }} className="anim-in">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, gap: 24 }}>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                                        <MessageSquare size={28} color="#10B981" /> WhatsApp Reviews AI
                                        <span style={{ fontSize: 10, background: "#10B981", color: "#fff", padding: "2px 8px", borderRadius: 10, fontWeight: 900 }}>NUEVO</span>
                                    </h1>
                                    <p style={{ color: "#9CA3AF", fontSize: 14, margin: 0 }}>
                                        Genera capturas de pantalla de WhatsApp hiperrealistas con reseñas de clientes para usar en anuncios, landing pages y redes sociales.
                                    </p>
                                </div>
                            </div>

                            {/* Template quick-select tags */}
                            <div style={{ marginBottom: 32 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 800, color: "#fff", textTransform: "uppercase", marginBottom: 12 }}>💡 Plantillas de Reseñas Rápidas</h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                    {[
                                        { label: "⭐⭐⭐⭐⭐ Resultado increíble", text: "¡Hola! 😍 La verdad superó por completo mis expectativas. Llevo 2 semanas usándolo y los cambios son increíbles. ¡Totalmente recomendado! ✨" },
                                        { label: "📦 Ya llegó mi pedido", text: "¡Acaba de llegar mi pedido! 📦 Súper rápido, todo en perfectas condiciones y el empaque está divino. ¡Muchas gracias! ❤️" },
                                        { label: "😍 Me encantó", text: "¡Me encantó este producto! 😍 Vale cada centavo. La textura es riquísima y huele delicioso. Definitivamente volveré a comprar." },
                                        { label: "❤️ Lo recomiendo", text: "Holaa, paso por aquí a decirles que el producto es una maravilla. Lo recomiendo al 100%, mi familia también lo empezó a usar." },
                                        { label: "🔥 Antes y después", text: "Miren el cambio tan drástico en mi piel 🔥 Llevo solo un mes usándolo todas las noches y ya no tengo manchas. ¡Es magia!" },
                                        { label: "💬 Conversación real", text: "Hola! Quería agradecerles por el excelente servicio y atención. El producto llegó súper a tiempo y me ha servido muchísimo." },
                                        { label: "📷 Cliente envía foto", text: "¡Hola! Aquí te mando la foto de cómo se ve el producto en mi baño. ¡Me fascina! 🥰" },
                                        { label: "🎁 Unboxing", text: "¡Hola! Acabo de hacer el unboxing y viene con un regalo sorpresa. ¡Qué lindo detalle! Me hicieron el día. 🎁" }
                                    ].map((t, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setWaReviewMessages(prev => prev.map(m => m.sender === 'client' && !m.image ? { ...m, text: t.text } : m));
                                                setToast({ msg: `Plantilla cargada: ${t.label}`, type: 'success' });
                                            }}
                                            style={{
                                                background: "rgba(255,255,255,0.03)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                borderRadius: 20,
                                                padding: "8px 16px",
                                                color: "#D1D5DB",
                                                fontSize: 12,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                            className="hover-scale"
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 420px", gap: 32, alignItems: "flex-start" }}>
                                
                                {/* Left Column: Configuration Panel */}
                                <div className="glass-card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
                                    
                                    {/* Select Style (Step 0) */}
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#A78BFA", textTransform: "uppercase", marginBottom: 12 }}>1. Selecciona el Estilo</label>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                                            {[
                                                { id: 'Chats', label: 'Chats', desc: 'Conversación de 2 personas', icon: MessageSquare },
                                                { id: 'Grupo', label: 'Grupo', desc: 'Conversación de grupo', icon: Users },
                                                { id: 'Estados', label: 'Estados', desc: 'Estado de WhatsApp', icon: Sparkles }
                                            ].map(s => {
                                                const Icon = s.icon;
                                                const isSel = waReviewStyle === s.id;
                                                return (
                                                    <div
                                                        key={s.id}
                                                        onClick={() => setWaReviewStyle(s.id)}
                                                        style={{
                                                            padding: "16px",
                                                            borderRadius: 16,
                                                            background: isSel ? "rgba(139, 92, 246, 0.1)" : "rgba(255,255,255,0.01)",
                                                            border: isSel ? "2px solid #8B5CF6" : "1px solid rgba(255,255,255,0.05)",
                                                            cursor: "pointer",
                                                            textAlign: "center",
                                                            transition: "all 0.2s"
                                                        }}
                                                        className="hover-scale"
                                                    >
                                                        <Icon size={20} style={{ color: isSel ? "#8B5CF6" : "#6B7280", margin: "0 auto 8px" }} />
                                                        <div style={{ fontSize: 13, fontWeight: 800, color: isSel ? "#fff" : "#9CA3AF" }}>{s.label}</div>
                                                        <div style={{ fontSize: 9, color: "#6B7280", marginTop: 4 }}>{s.desc}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)" }} />

                                    <h3 style={{ fontSize: 13, fontWeight: 800, color: "#A78BFA", textTransform: "uppercase", margin: 0 }}>2. Personaliza la Conversación</h3>

                                    {/* Paso 1: Subir producto */}
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Paso 1: Foto del Producto</label>
                                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                            <div style={{ width: 64, height: 64, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                                {waReviewProductImage || activeProject?.productPreview ? (
                                                    <img src={waReviewProductImage || activeProject?.productPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <Image size={20} style={{ opacity: 0.3 }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    type="file"
                                                    id="wa-review-product-upload"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setWaReviewProductImage(reader.result as string);
                                                                setWaReviewMessages(prev => prev.map(m => m.image ? { ...m, image: reader.result as string } : m));
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    style={{ display: "none" }}
                                                />
                                                <button
                                                    onClick={() => document.getElementById("wa-review-product-upload")?.click()}
                                                    className="btn-primary"
                                                    style={{ padding: "8px 16px", fontSize: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                                                >
                                                    <UploadCloud size={14} /> Subir Imagen del Producto
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input: Product Name Override */}
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Nombre del Producto</label>
                                        <input
                                            className="input-field"
                                            placeholder="Ej: Suero Capilar, Protector Solar..."
                                            value={waReviewProductName}
                                            onChange={(e) => setWaReviewProductName(e.target.value)}
                                        />
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                        {/* Paso 2: Tipo de conversación */}
                                        <div>
                                            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Paso 2: Tipo de Conversación</label>
                                            <select
                                                value={waReviewConvType}
                                                onChange={(e) => setWaReviewConvType(e.target.value)}
                                                className="input-field"
                                            >
                                                {["Cliente satisfecho", "Cliente sorprendido", "Antes y después", "Cliente recomendando", "Cliente recompra", "Cliente enviando resultados", "Cliente agradeciendo", "Cliente mostrando el producto"].map(v => (
                                                    <option key={v} value={v}>{v}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Paso 3: Nombre del cliente */}
                                        <div>
                                            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Paso 3: Nombre del Cliente</label>
                                            <input
                                                className="input-field"
                                                placeholder="Ej: María Cliente"
                                                value={waReviewClientName}
                                                onChange={(e) => setWaReviewClientName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Paso 4: Foto del cliente (Upload or IA Avatar) */}
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 12 }}>Paso 4: Foto de Perfil del Cliente</label>
                                        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                            <button
                                                onClick={() => setWaReviewClientPhotoType('upload')}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px",
                                                    fontSize: 12,
                                                    borderRadius: 8,
                                                    border: "1px solid",
                                                    borderColor: waReviewClientPhotoType === 'upload' ? "#8B5CF6" : "rgba(255,255,255,0.1)",
                                                    background: waReviewClientPhotoType === 'upload' ? "rgba(139, 92, 246, 0.1)" : "transparent",
                                                    color: "#fff",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Subir Foto
                                            </button>
                                            <button
                                                onClick={() => setWaReviewClientPhotoType('ia_avatar')}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px",
                                                    fontSize: 12,
                                                    borderRadius: 8,
                                                    border: "1px solid",
                                                    borderColor: waReviewClientPhotoType === 'ia_avatar' ? "#8B5CF6" : "rgba(255,255,255,0.1)",
                                                    background: waReviewClientPhotoType === 'ia_avatar' ? "rgba(139, 92, 246, 0.1)" : "transparent",
                                                    color: "#fff",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Generar Avatar IA ✦
                                            </button>
                                        </div>

                                        {waReviewClientPhotoType === 'upload' ? (
                                            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                                <div style={{ width: 48, height: 48, borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                                                    <img src={waReviewClientPhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                </div>
                                                <div>
                                                    <input
                                                        type="file"
                                                        id="wa-review-avatar-upload"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => setWaReviewClientPhoto(reader.result as string);
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        style={{ display: "none" }}
                                                    />
                                                    <button
                                                        onClick={() => document.getElementById("wa-review-avatar-upload")?.click()}
                                                        className="btn-primary"
                                                        style={{ padding: "8px 16px", fontSize: 11, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
                                                    >
                                                        Cargar Foto Perfil
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 16 }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                                                    <div>
                                                        <label style={{ display: "block", fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>Sexo</label>
                                                        <select value={waReviewAvatarSex} onChange={(e) => setWaReviewAvatarSex(e.target.value)} className="input-field" style={{ padding: 8, fontSize: 11 }}>
                                                            {["Mujer", "Hombre"].map(v => <option key={v} value={v}>{v}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: "block", fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>Edad</label>
                                                        <select value={waReviewAvatarAge} onChange={(e) => setWaReviewAvatarAge(e.target.value)} className="input-field" style={{ padding: 8, fontSize: 11 }}>
                                                            {["18-24", "25-34", "35-44", "45-60"].map(v => <option key={v} value={v}>{v} años</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: "block", fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>Etnia</label>
                                                        <select value={waReviewAvatarEthnicity} onChange={(e) => setWaReviewAvatarEthnicity(e.target.value)} className="input-field" style={{ padding: 8, fontSize: 11 }}>
                                                            {["Latina", "Blanca", "Negra", "Asiática"].map(v => <option key={v} value={v}>{v}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: "block", fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>País</label>
                                                        <select value={waReviewAvatarCountry} onChange={(e) => setWaReviewAvatarCountry(e.target.value)} className="input-field" style={{ padding: 8, fontSize: 11 }}>
                                                            {["Colombia", "México", "España", "Estados Unidos", "Brasil"].map(v => <option key={v} value={v}>{v}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                    <div style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                                                        <img src={waReviewClientAvatarImg || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    </div>
                                                    <button
                                                        disabled={isGeneratingWaAvatar}
                                                        onClick={handleGenerateWaAvatar}
                                                        className="btn-primary"
                                                        style={{ flex: 1, padding: "8px 16px", fontSize: 11, background: "linear-gradient(90deg, #8B5CF6, #EC4899)", justifyContent: "center" }}
                                                    >
                                                        {isGeneratingWaAvatar ? <Loader2 className="animate-spin" size={14} /> : "Generar Avatar con IA"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)" }} />

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                        {/* Paso 5: Idioma */}
                                        <div>
                                            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Paso 5: Idioma</label>
                                            <select value={waReviewLang} onChange={(e) => setWaReviewLang(e.target.value)} className="input-field">
                                                {["Español", "Inglés", "Portugués", "Francés"].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>

                                        {/* Paso 6: Tono */}
                                        <div>
                                            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Paso 6: Tono de Voz</label>
                                            <select value={waReviewTone} onChange={(e) => setWaReviewTone(e.target.value)} className="input-field">
                                                {["Natural", "Muy emocionado", "Elegante", "Casual", "Divertido"].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                        {/* Paso 7: Longitud */}
                                        <div>
                                            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Paso 7: Longitud</label>
                                            <select value={waReviewLength} onChange={(e) => setWaReviewLength(e.target.value)} className="input-field">
                                                {["Corta", "Media", "Larga"].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>

                                        {/* Paso 8: Emojis switch */}
                                        <div>
                                            <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Paso 8: Incluir Emojis</label>
                                            <div style={{ display: "flex", gap: 12, height: 50, alignItems: "center" }}>
                                                <button
                                                    onClick={() => setWaReviewEmojis(true)}
                                                    style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "1px solid", borderColor: waReviewEmojis ? "#8B5CF6" : "rgba(255,255,255,0.05)", background: waReviewEmojis ? "rgba(139,92,246,0.1)" : "transparent", color: waReviewEmojis ? "#fff" : "#9CA3AF", cursor: "pointer" }}
                                                >
                                                    SÍ
                                                </button>
                                                <button
                                                    onClick={() => setWaReviewEmojis(false)}
                                                    style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "1px solid", borderColor: !waReviewEmojis ? "#8B5CF6" : "rgba(255,255,255,0.05)", background: !waReviewEmojis ? "rgba(139,92,246,0.1)" : "transparent", color: !waReviewEmojis ? "#fff" : "#9CA3AF", cursor: "pointer" }}
                                                >
                                                    NO
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Paso 9: Número de mensajes */}
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase" }}>Paso 9: Número de Mensajes</label>
                                            <span style={{ fontSize: 11, fontWeight: 800, color: "#8B5CF6" }}>{waReviewMsgCount} mensajes</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="2"
                                            max="10"
                                            step="2"
                                            value={waReviewMsgCount}
                                            onChange={(e) => setWaReviewMsgCount(Number(e.target.value))}
                                            style={{ width: "100%", accentColor: "#8B5CF6", cursor: "pointer" }}
                                        />
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "#6B7280", fontSize: 10, marginTop: 4 }}>
                                            <span>2</span>
                                            <span>4</span>
                                            <span>6</span>
                                            <span>8</span>
                                            <span>10</span>
                                        </div>
                                    </div>

                                    {/* Paso 10: Imagen del producto */}
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 12 }}>Paso 10: Imagen enviada por el cliente</label>
                                        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                            <button
                                                onClick={() => setWaReviewProductImageType('upload')}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px",
                                                    fontSize: 12,
                                                    borderRadius: 8,
                                                    border: "1px solid",
                                                    borderColor: waReviewProductImageType === 'upload' ? "#8B5CF6" : "rgba(255,255,255,0.1)",
                                                    background: waReviewProductImageType === 'upload' ? "rgba(139, 92, 246, 0.1)" : "transparent",
                                                    color: "#fff",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Usar Imagen Subida
                                            </button>
                                            <button
                                                onClick={() => setWaReviewProductImageType('ugc')}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px",
                                                    fontSize: 12,
                                                    borderRadius: 8,
                                                    border: "1px solid",
                                                    borderColor: waReviewProductImageType === 'ugc' ? "#8B5CF6" : "rgba(255,255,255,0.1)",
                                                    background: waReviewProductImageType === 'ugc' ? "rgba(139, 92, 246, 0.1)" : "transparent",
                                                    color: "#fff",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Generar Foto UGC IA ✦
                                            </button>
                                        </div>

                                        {waReviewProductImageType === 'ugc' && (
                                            <button
                                                disabled={isGeneratingWaUgcProduct}
                                                onClick={handleGenerateWaUgcProduct}
                                                className="btn-primary"
                                                style={{ width: "100%", background: "linear-gradient(90deg, #8B5CF6, #EC4899)", justifyContent: "center" }}
                                            >
                                                {isGeneratingWaUgcProduct ? <Loader2 className="animate-spin" size={16} /> : "Generar Foto UGC de Producto con IA"}
                                            </button>
                                        )}
                                    </div>

                                    {/* Action button */}
                                    <button
                                        disabled={isGeneratingWaReview}
                                        onClick={handleGenerateWaReview}
                                        className="btn-primary"
                                        style={{ width: "100%", padding: "16px 24px", justifyContent: "center", fontSize: 16, background: "linear-gradient(90deg, #8B5CF6, #EC4899)" }}
                                    >
                                        {isGeneratingWaReview ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Generar captura de WhatsApp</>}
                                    </button>

                                </div>

                                {/* Right Column: WhatsApp Live iPhone Mockup */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 20 }}>
                                    
                                    {/* iPhone Mockup Container */}
                                    <div
                                        id="whatsapp-capture-node"
                                        style={{
                                            width: 375,
                                            height: 680,
                                            borderRadius: 40,
                                            border: "12px solid #1a1a1a",
                                            background: "#efeae2",
                                            backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
                                            backgroundSize: "cover",
                                            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                            position: "relative"
                                        }}
                                    >
                                        {/* iOS Status Bar */}
                                        <div style={{ height: 44, background: "#f6f6f6", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", color: "#000", fontSize: 14, fontWeight: 600 }}>
                                            <span>9:41</span>
                                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 10 }}>
                                                    <div style={{ width: 3, height: 3, background: "#000", borderRadius: 1 }} />
                                                    <div style={{ width: 3, height: 5, background: "#000", borderRadius: 1 }} />
                                                    <div style={{ width: 3, height: 7, background: "#000", borderRadius: 1 }} />
                                                    <div style={{ width: 3, height: 9, background: "#000", borderRadius: 1 }} />
                                                </div>
                                                <span>5G</span>
                                                <div style={{ width: 22, height: 11, border: "1px solid #000", borderRadius: 3, padding: 1, display: "flex" }}>
                                                    <div style={{ flex: 1, background: "#000", borderRadius: 1 }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* WhatsApp Chat Header */}
                                        <div style={{ background: "#f6f6f6", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, height: 60 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#007AFF", cursor: "pointer" }}>
                                                <span style={{ fontSize: 24 }}>‹</span>
                                                <span style={{ fontSize: 16 }}>12</span>
                                            </div>
                                            <img
                                                src={waReviewClientPhotoType === 'upload' ? (waReviewClientPhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80") : (waReviewClientAvatarImg || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80")}
                                                style={{ width: 36, height: 36, borderRadius: 18, objectFit: "cover", border: "1px solid rgba(0,0,0,0.05)" }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                                                <div style={{ fontSize: 15, fontWeight: 700, color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{waReviewClientName}</div>
                                                <div style={{ fontSize: 11, color: "#8E8E93" }}>en línea</div>
                                            </div>
                                            <div style={{ display: "flex", gap: 20, color: "#007AFF" }}>
                                                <span style={{ fontSize: 18, cursor: "pointer" }}>📹</span>
                                                <span style={{ fontSize: 18, cursor: "pointer" }}>📞</span>
                                            </div>
                                        </div>

                                        {/* Message List area */}
                                        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
                                            
                                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                                                <div style={{ background: "rgba(225, 238, 246, 0.9)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#546E7A" }}>
                                                    Hoy
                                                </div>
                                            </div>

                                            {waReviewMessages.map((m, idx) => {
                                                const isClient = m.sender === 'client';
                                                return (
                                                    <div
                                                        key={m.id}
                                                        style={{
                                                            alignSelf: isClient ? "flex-start" : "flex-end",
                                                            maxWidth: "75%",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            position: "relative"
                                                        }}
                                                    >
                                                        {editingWaMsgIndex === idx ? (
                                                            <div style={{ background: "rgba(0,0,0,0.9)", padding: 12, borderRadius: 12, marginBottom: 4, zIndex: 10, width: 220 }}>
                                                                <input
                                                                    className="input-field"
                                                                    value={m.text || ""}
                                                                    onChange={(e) => {
                                                                        const updatedText = e.target.value;
                                                                        setWaReviewMessages(prev => prev.map((item, curIdx) => curIdx === idx ? { ...item, text: updatedText } : item));
                                                                    }}
                                                                    style={{ padding: 8, fontSize: 12, background: "#222", border: "1px solid #444", marginBottom: 8, color: "#fff" }}
                                                                />
                                                                <button
                                                                    className="btn-primary"
                                                                    style={{ padding: "6px 12px", fontSize: 11, width: "100%", justifyContent: "center" }}
                                                                    onClick={() => setEditingWaMsgIndex(null)}
                                                                >
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        ) : null}

                                                        <div
                                                            onClick={() => setEditingWaMsgIndex(idx)}
                                                            title="Haz clic para editar mensaje"
                                                            style={{
                                                                background: isClient ? "#ffffff" : "#d9fdd3",
                                                                color: "#000",
                                                                borderRadius: isClient ? "0px 12px 12px 12px" : "12px 0px 12px 12px",
                                                                padding: m.image ? "4px" : "8px 12px 10px 12px",
                                                                fontSize: 14.2,
                                                                lineHeight: 1.4,
                                                                boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                                                                textAlign: "left",
                                                                cursor: "pointer",
                                                                border: isClient ? "none" : "1px solid rgba(0,0,0,0.02)"
                                                            }}
                                                        >
                                                            {m.image ? (
                                                                <div style={{ borderRadius: 10, overflow: "hidden", display: "flex", position: "relative" }}>
                                                                    <img src={m.image} style={{ width: "100%", maxHeight: 220, objectFit: "cover" }} />
                                                                    <div style={{
                                                                        position: "absolute",
                                                                        bottom: 4,
                                                                        right: 6,
                                                                        fontSize: 10,
                                                                        color: "#fff",
                                                                        background: "rgba(0,0,0,0.4)",
                                                                        padding: "2px 6px",
                                                                        borderRadius: 8
                                                                    }}>
                                                                        {m.time}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <span>{m.text}</span>
                                                                    <span style={{
                                                                        fontSize: 10,
                                                                        color: "#8E8E93",
                                                                        marginLeft: 16,
                                                                        float: "right",
                                                                        marginTop: 4,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 2
                                                                    }}>
                                                                        {m.time}
                                                                        {!isClient && (
                                                                            <span style={{ color: "#53bdeb", fontSize: 13, fontWeight: "bold" }}>✓✓</span>
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Bottom Message Input Bar */}
                                        <div style={{ background: "#f6f6f6", padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, height: 50, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                                            <span style={{ color: "#007AFF", fontSize: 22, fontWeight: "bold", cursor: "pointer" }}>+</span>
                                            <div style={{ flex: 1, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 18, height: 32, display: "flex", alignItems: "center", padding: "0 12px" }} />
                                            <span style={{ color: "#007AFF", fontSize: 20, cursor: "pointer" }}>📷</span>
                                            <span style={{ color: "#007AFF", fontSize: 20, cursor: "pointer" }}>🎙️</span>
                                        </div>

                                    </div>

                                    {/* Download Actions Panel */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        <button
                                            onClick={() => downloadWaCapture('png')}
                                            className="btn-primary"
                                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, padding: "10px 16px", justifyContent: "center" }}
                                        >
                                            Descargar PNG
                                        </button>
                                        <button
                                            onClick={() => downloadWaCapture('jpg')}
                                            className="btn-primary"
                                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, padding: "10px 16px", justifyContent: "center" }}
                                        >
                                            Descargar JPG
                                        </button>
                                        <button
                                            onClick={copyWaToClipboard}
                                            className="btn-primary"
                                            style={{ gridColumn: "1 / -1", background: "linear-gradient(90deg, #8B5CF6, #EC4899)", color: "#fff", fontSize: 12, padding: "12px 16px", justifyContent: "center" }}
                                        >
                                            Copiar al Portapapeles 📋
                                        </button>
                                    </div>

                                </div>

                            </div>
                        </div>
                    )
                }

                {activeTab === 'objections' && (
                    <div style={{ width: "100%" }} className="anim-in">
                        <div style={{ marginBottom: 24 }}>
                            <button onClick={() => setTutorialVideoOpen('https://www.loom.com/embed/e13dd66b16104cf9973c8d10c772dbb8')} style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                                <PlayCircle size={16} /> Ir a video tutorial de esta sección
                            </button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, gap: 24 }}>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                                    <ShieldOff size={28} color="#EF4444" /> Destructor de Objeciones
                                </h1>
                                <p style={{ color: "#9CA3AF" }}>Convierte el "No" en un "Sí" automático con scripts de persuasión avanzada.</p>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
                            <div className="glass-card" style={{ padding: 40 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#EF4444", marginBottom: 12, textTransform: "uppercase" }}>Nombre del Producto / Servicio</label>
                                        <input className="input-field" placeholder="Ej: Curso de Facebook Ads, Suplemento de Magnesio..." value={objectionProductName} onChange={(e) => setObjectionProductName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#EF4444", marginBottom: 12, textTransform: "uppercase" }}>Público Objetivo (Opcional)</label>
                                        <input className="input-field" placeholder="Ej: Dueños de agencia, Personas con insomnio..." value={objectionTargetAudience} onChange={(e) => setObjectionTargetAudience(e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#EF4444", marginBottom: 12, textTransform: "uppercase" }}>Objeciones Específicas (Opcional)</label>
                                        <textarea className="input-field" placeholder="Ej: Está muy caro, No tengo tiempo, No confío..." style={{ height: 100 }} value={manualObjections} onChange={(e) => setManualObjections(e.target.value)} />
                                    </div>
                                    <button
                                        className="btn-primary"
                                        style={{ width: "100%", justifyContent: "center", height: 60, fontSize: 18, background: "#EF4444" }}
                                        onClick={handleObjections}
                                        disabled={isObjectionLoading}
                                    >
                                        {isObjectionLoading ? <Loader2 className="animate-spin" /> : <><Target /> DESTRUIR OBJECIONES</>}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {!objectionResults && !isObjectionLoading && (
                                    <div className="glass-card" style={{ padding: 60, textAlign: "center", opacity: 0.5 }}>
                                        <ShieldCheck size={64} style={{ margin: "0 auto 24px", color: "#EF4444" }} />
                                        <h3 style={{ fontSize: 20, fontWeight: 800 }}>Esperando Acción</h3>
                                        <p>Completa los datos de la izquierda para generar los scripts destructores.</p>
                                    </div>
                                )}
                                {isObjectionLoading && (
                                    <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                                        <Loader2 size={48} className="animate-spin" style={{ margin: "0 auto 24px", color: "#EF4444" }} />
                                        <h3 style={{ fontSize: 20, fontWeight: 800 }}>Analizando Psicología...</h3>
                                        <p>Buscando grietas en las dudas de tus clientes...</p>
                                    </div>
                                )}
                                {objectionResults && objectionResults.map((item, idx) => (
                                    <div key={idx} className="glass-card anim-in" style={{ padding: 32, borderLeft: "4px solid #EF4444" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                                            <h3 style={{ fontSize: 18, fontWeight: 900 }}>{item.objection}</h3>
                                            <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 900 }}>{item.psychology}</div>
                                        </div>
                                        <div style={{ marginBottom: 20 }}>
                                            <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8, fontWeight: 800, textTransform: "uppercase" }}>El Miedo Oculto</p>
                                            <p style={{ fontSize: 14, color: "#D1D5DB", fontStyle: "italic" }}>"{item.hiddenFear}"</p>
                                        </div>
                                        <div style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
                                            <p style={{ fontSize: 11, color: "#EF4444", marginBottom: 8, fontWeight: 900, textTransform: "uppercase" }}>Script Destructor</p>
                                            <p style={{ fontSize: 15, color: "#fff", lineHeight: 1.6, fontWeight: 500 }}>{item.script}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}



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
            </main>
        </div >
    );
}