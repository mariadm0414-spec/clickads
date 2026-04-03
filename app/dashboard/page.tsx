"use client";

import { useState, useEffect } from "react";
import { Sparkles, UploadCloud, Download, Loader2, Key, Layers, ArrowLeft, Users, PlayCircle, LogOut, Plus, Folder, Trash2, ChevronRight, MessageSquare, ThumbsUp, Send, Library, Save, CheckCircle2, Minus, Bookmark, Palette, Type, Search, Edit3, Heart, Share2, Award, User, HelpCircle, Layout, Globe, TrendingUp, DollarSign, UserCheck, ShieldCheck, Video, X, Settings, Smile, Stethoscope, BookOpen, Newspaper, Calendar, Image } from "lucide-react";
import JSZip from "jszip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { imageDB } from "@/app/lib/db";


interface Project {
    id: string;
    name: string;
    productName?: string;
    targetAudience?: string;
    productPreview: string;
    userPrompt: string;
    results: { image: string, title?: string, copy?: string }[];
    updatedAt: number;
    primaryColor?: string;
    secondaryColor?: string;
    font?: string;
    logoPreview?: string;
    personPreview?: string;
    type: 'ecommerce' | 'digital';
    idealSolution?: string;
    priceX1?: string;
    priceX2?: string;
    priceX3?: string;
    priceX4?: string; // New
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

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [activeTab, setActiveTab] = useState<string>("generator");
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
    const [selectedOutputSize, setSelectedOutputSize] = useState("1:1");
    const [selectedOutputLanguage, setSelectedOutputLanguage] = useState("Español");
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
                }
            ]
        }
    ]);

    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [selectedAngle, setSelectedAngle] = useState("ALL");
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

    const [showModuleModal, setShowModuleModal] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [newModuleCover, setNewModuleCover] = useState("");

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [newVideoTitle, setNewVideoTitle] = useState("");
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [showApiModal, setShowApiModal] = useState(false);
    const [tempApiKey, setTempApiKey] = useState("");

    // Photo Studio States
    const [studioImage, setStudioImage] = useState<string | null>(null);
    const [studioMode, setStudioMode] = useState<'white_3d' | 'model'>('white_3d');
    const [studioGender, setStudioGender] = useState<'male' | 'female'>('female');
    const [studioBackgroundDesc, setStudioBackgroundDesc] = useState("");
    const [studioResults, setStudioResults] = useState<{ image: string, ratio: string }[]>([]);
    const [isStudioLoading, setIsStudioLoading] = useState(false);
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
    const [logoStep, setLogoStep] = useState(0); // 0: Form, 1: Tinder, 2: Result
    const [logoOptions, setLogoOptions] = useState<string[]>([]);
    const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
    const [likedLogos, setLikedLogos] = useState<string[]>([]);
    const [finalLogo, setFinalLogo] = useState<string | null>(null);
    const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);

    // Swipe States
    const [swipeX, setSwipeX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeStart, setSwipeStart] = useState(0);


    // Landing Page States
    const [landingCategory, setLandingCategory] = useState('Hero');
    const [landingResults, setLandingResults] = useState<string | null>(null);
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

    const handleGenerate = async (angle?: string, count: number = 1) => {
        if (!apiKey) {
            setToast({ msg: "⚠️ Configura tu API Key en la pestaña de Configuración para activar la IA", type: 'error' });
            return;
        }
        if (!activeProject?.productPreview) {
            setToast({ msg: "Sube una foto de producto primero", type: 'error' });
            return;
        }
        setIsLoading(true);
        if (!angle) updateActiveProject({ results: [] });
        const ratiosToGenerate = [selectedOutputSize];
        let allVariations: any[] = [];

        try {
            for (const ratio of ratiosToGenerate) {
                const res = await fetch("/api/vertex-ai/generate-1plus4", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userPrompt: activeProject?.userPrompt,
                        productName: activeProject?.productName,
                        targetAudience: activeProject?.targetAudience,
                        apiKey: apiKey,
                        specificAngle: angle || (selectedAngle === "ALL" ? undefined : selectedAngle),
                        count: count,
                        primaryColor: activeProject?.primaryColor,
                        secondaryColor: activeProject?.secondaryColor,
                        font: activeProject?.font,
                        aspectRatio: selectedOutputSize,
                        language: selectedOutputLanguage,
                        productBase64: activeProject?.productPreview,
                        logoBase64: activeProject?.logoPreview
                    }),
                });
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error("El servidor devolvió una respuesta no válida. Es probable que se haya agotado el tiempo de espera (Timeout) debido a la gran cantidad de variaciones. Intenta seleccionar un ángulo específico.");
                }

                if (data.error) throw new Error(data.error);

                // Generar COPIES automáticos para cada variación
                const variationsWithCopies = await Promise.all((data.variations || []).map(async (v: any) => {
                    try {
                        const cRes = await fetch("/api/vertex-ai/generate-copy", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                image: v.image,
                                userPrompt: activeProject?.userPrompt,
                                productName: activeProject?.productName,
                                targetAudience: activeProject?.targetAudience,
                                apiKey: apiKey,
                                brandName: activeProject?.name
                            }),
                        });
                        const cText = await cRes.text();
                        let cData;
                        try {
                            cData = JSON.parse(cText);
                        } catch (e) {
                            return { ...v, copy: "" };
                        }
                        return { ...v, copy: cData.copy || "" };
                    } catch (e) {
                        return { ...v, copy: "" };
                    }
                }));

                allVariations = [...allVariations, ...variationsWithCopies];
            }

            if (angle) {
                const newResults = [...(activeProject?.results || []), ...allVariations];
                updateActiveProject({ results: newResults });
            } else {
                updateActiveProject({ results: allVariations });
            }
        } catch (error: any) {
            setToast({ msg: error.message || "Error: No se pudo generar el copy o la imagen correctamente.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCopy = async (index: number) => {
        if (!apiKey || !activeProject) return;
        setGeneratingCopyIndex(index);
        try {
            const res = await fetch("/api/vertex-ai/generate-copy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: activeProject?.results[index].image,
                    userPrompt: activeProject?.userPrompt,
                    productName: activeProject?.productName,
                    targetAudience: activeProject?.targetAudience,
                    apiKey: apiKey,
                    brandName: activeProject?.name
                }),
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error("Error de red o el servidor devolvió una respuesta no válida.");
            }
            if (data.error) throw new Error(data.error);

            const newResults = [...(activeProject?.results || [])];
            newResults[index].copy = data.copy;
            updateActiveProject({ results: newResults });
            setToast({ msg: "Copy generado con éxito", type: 'success' });
        } catch (error: any) {
            setToast({ msg: error?.message || "Error al generar copy.", type: 'error' });
        } finally {
            setGeneratingCopyIndex(null);
        }
    };

    const saveToLibrary = (image: string, angle: string) => {
        if (library.some(item => item.image === image)) { setToast({ msg: "Ya está en tu biblioteca", type: 'success' }); return; }
        const newAd: SavedAd = { id: Math.random().toString(36).substr(2, 9), image, angle: angle || "Mix", projectName: activeProject?.name || "Global", savedAt: Date.now() };
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

    const handleGenerateLogoVariations = async () => {
        if (!apiKey) {
            setToast({ msg: "Configura tu API Key primero", type: 'error' });
            return;
        }
        setIsGeneratingLogo(true);
        try {
            const res = await fetch("/api/vertex-ai/logo-variations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessName: logoBusinessName,
                    sector: logoSector,
                    primaryColor: logoPrimaryColor,
                    secondaryColor: logoSecondaryColor,
                    apiKey: apiKey,
                    count: 12
                }),
            });
            const data = await res.json();
            if (data.variations) {
                setLogoOptions(data.variations.map((v: any) => v.image));
                setLogoStep(1);
                setCurrentLogoIndex(0);
                setLikedLogos([]);
            } else {
                throw new Error(data.error || "Error generando logos");
            }
        } catch (error: any) {
            setToast({ msg: error.message, type: 'error' });
        } finally {
            setIsGeneratingLogo(false);
        }
    };

    const finishLogoSelection = async () => {
        setIsGeneratingLogo(true);
        try {
            const res = await fetch("/api/vertex-ai/logo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessName: logoBusinessName,
                    sector: logoSector,
                    primaryColor: logoPrimaryColor,
                    secondaryColor: logoSecondaryColor,
                    likedLogos: likedLogos,
                    apiKey: apiKey
                }),
            });
            const data = await res.json();
            if (data.logo) {
                setFinalLogo(data.logo);
                setLogoStep(2);
            } else {
                throw new Error(data.error || "Error sintetizando el logo.");
            }
        } catch (error: any) {
            setToast({ msg: error.message, type: 'error' });
        } finally {
            setIsGeneratingLogo(false);
        }
    };

    const handleLikeLogo = (updatedLiked?: string[]) => {
        const currentLogo = logoOptions[currentLogoIndex];
        const newLiked = updatedLiked || [...likedLogos, currentLogo];
        setLikedLogos(newLiked);
        if (currentLogoIndex < logoOptions.length - 1) {
            setCurrentLogoIndex(currentLogoIndex + 1);
        } else {
            setIsGeneratingLogo(true);
            fetch("/api/vertex-ai/logo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessName: logoBusinessName,
                    sector: logoSector,
                    primaryColor: logoPrimaryColor,
                    secondaryColor: logoSecondaryColor,
                    likedLogos: newLiked,
                    apiKey: apiKey
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.logo) {
                        setFinalLogo(data.logo);
                        setLogoStep(2);
                    }
                })
                .finally(() => setIsGeneratingLogo(false));
        }
    };

    const handleDislikeLogo = () => {
        if (currentLogoIndex < logoOptions.length - 1) {
            setCurrentLogoIndex(currentLogoIndex + 1);
        } else {
            finishLogoSelection();
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
            const res = await fetch("/api/vertex-ai/landing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    images: [activeProject.productPreview, activeProject.logoPreview].filter(Boolean),
                    category: landingCategory,
                    size: selectedOutputSize,
                    language: selectedOutputLanguage,
                    idealSolution: activeProject.idealSolution,
                    prices: { x1: lPrice1, x2: lPrice2, x3: lPrice3, x4: lPrice4 },
                    before: lBefore,
                    after: lAfter,
                    benefits: lBenefits,
                    comparison: { brand: lCompBrand, others: lCompOthers },
                    testimonials: [lTest1, lTest2, lTest3].filter(Boolean),
                    authoritarian: { expert: lAuthExpert, title: lAuthTitle, quote: lAuthQuote },
                    usage: lUsage,
                    logistics: lLogistics,
                    faqs: lFaqs.filter(f => f.q && f.a),
                    bonuses: activeProject.bonuses,
                    guarantees: activeProject.guarantees,
                    primaryColor: activeProject.primaryColor,
                    secondaryColor: activeProject.secondaryColor,
                    font: activeProject.font,
                    apiKey
                })
            });
            const data = await res.json();
            if (data.image) {
                setLandingResults(data.image);
            } else {
                throw new Error(data.error || "Error al generar landing");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsLandingLoading(false);
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
                const byteString = atob(image.split(',')[1]);
                const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
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
                    let base64Data = image.split(',')[1];
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
                                base64Data = canvas.toDataURL("image/jpeg", 0.95).split(',')[1];
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
            const res = await fetch("/api/vertex-ai/generate-1plus4", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mainImage: clinicBefore,
                    secondaryImage: clinicAfter,
                    prompt: clinicTreatment,
                    apiKey,
                    angle: selectedClinicAngle === "ALL" ? "" : selectedClinicAngle
                })
            });
            const data = await res.json();
            if (data.results) setClinicResults(data.results);
            else throw new Error(data.error || "Error al generar");
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsClinicLoading(false);
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
            const res = await fetch("/api/vertex-ai/generate-1plus4", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mainImage: digitalProduct,
                    secondaryImage: digitalPerson || digitalLogo,
                    prompt: digitalPrompt,
                    apiKey,
                    angle: selectedDigitalAngle === "ALL" ? "" : selectedDigitalAngle,
                    primaryColor: activeProject?.primaryColor,
                    secondaryColor: activeProject?.secondaryColor,
                    font: activeProject?.font
                })
            });
            const data = await res.json();
            if (data.results) {
                setDigitalResults(data.results);
                if (activeProjectId) {
                    updateActiveProject({ results: [...(activeProject?.results || []), ...data.results.map((r: any) => ({ image: r.image }))] });
                }
            } else {
                throw new Error(data.error || "Error al generar");
            }
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        } finally {
            setIsDigitalLoading(false);
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
                .progress-fill { height: 100%; background: #8B5CF6; border-radius: 10px; transition: 0.4s; }

            `}</style>

            {/* Sidebar */}
            <aside style={{ width: 280, borderRight: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", background: "#050505" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, padding: "0 12px" }}>
                    <img src="/logo.png" alt="ClickAds" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }} />
                    <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-1px" }}>ClickAds</span>
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                    <div className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}><Sparkles size={18} /> Genera Creativos</div>
                    <div className={`nav-item ${activeTab === 'landing' ? 'active' : ''}`} onClick={() => setActiveTab('landing')}><Layout size={18} /> Generar Landing Page</div>
                    <div className={`nav-item ${activeTab === 'logo_generator' ? 'active' : ''}`} onClick={() => setActiveTab('logo_generator')}><Sparkles size={18} /> Generar Logo</div>
                    <div className={`nav-item ${activeTab === 'studio' ? 'active' : ''}`} onClick={() => setActiveTab('studio')}>
                        <Image size={18} /> Photo Studio
                        <span style={{ background: "rgba(139, 92, 246, 0.1)", color: "#A78BFA", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, marginLeft: "auto" }}>Nuevo</span>
                    </div>
                    <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}><Bookmark size={18} /> Mi Biblioteca</div>

                    <a href="https://www.skool.com/de-cero-a-10x-3705/about" target="_blank" rel="noopener noreferrer" className="nav-item">
                        <BookOpen size={18} /> Curso
                    </a>

                    <div className={`nav-item ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}><Users size={18} /> Comunidad</div>
                    <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={18} /> Configuración</div>

                    {isAdmin && (
                        <div className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')} style={{ marginTop: 20, color: "#10B981" }}><ShieldCheck size={18} /> Admin Center</div>
                    )}
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
                    {!isAdmin ? (
                        <div style={{ position: "relative" }}>
                            <input
                                type="password"
                                placeholder="Clave Administrador..."
                                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "8px 16px", fontSize: 11, outline: "none", color: "#fff" }}
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && toggleAdmin()}
                            />
                        </div>
                    ) : (
                        <button onClick={() => { setIsAdmin(false); localStorage.setItem(getUKey("clickads_admin_mode"), "false"); }} style={{ border: "1px solid #10B981", color: "#10B981", background: "none", padding: "8px 16px", borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Salir de Modo Admin</button>
                    )}
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

                {activeTab === 'admin' && isAdmin && (
                    <div style={{ maxWidth: 1100 }}>
                        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, color: "#10B981" }}>Panel de Control Admin</h1>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 48 }}>
                            <div className="stat-card">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF" }}>CLIENTES ACTIVOS</span>
                                    <UserCheck size={16} color="#10B981" />
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 900 }}>{adminStats.activeClients}</div>
                                <div style={{ color: "#10B981", fontSize: 12, fontWeight: 700 }}>+{adminStats.newClientsToday} hoy</div>
                            </div>
                            <div className="stat-card">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF" }}>MRR (INGRESOS MENSUALES)</span>
                                    <DollarSign size={16} color="#10B981" />
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 900 }}>${adminStats.mrr}</div>
                                <div style={{ color: "#10B981", fontSize: 12, fontWeight: 700 }}>{adminStats.mrrGrowth} este mes</div>
                            </div>
                            <div className="stat-card">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF" }}>CONVERTIDOS</span>
                                    <TrendingUp size={16} color="#10B981" />
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 900 }}>84%</div>
                                <div style={{ color: "#9CA3AF", fontSize: 12 }}>Tasa de éxito anuncios</div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: 40 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>Lista de Clientes Recientes</h2>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ textAlign: "left", color: "#4B5563", fontSize: 12, textTransform: "uppercase" }}>
                                        <th style={{ paddingBottom: 20 }}>Cliente</th>
                                        <th style={{ paddingBottom: 20 }}>Plan</th>
                                        <th style={{ paddingBottom: 20 }}>Estado</th>
                                        <th style={{ paddingBottom: 20 }}>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4].map(i => (
                                        <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                            <td style={{ padding: "16px 0", fontWeight: 700 }}>Usuario #{i + 100}</td>
                                            <td style={{ padding: "16px 0" }}>Premium Pro</td>
                                            <td style={{ padding: "16px 0" }}><span style={{ color: "#10B981", background: "rgba(16, 185, 129, 0.1)", padding: "4px 12px", borderRadius: 100, fontSize: 10 }}>ACTIVO</span></td>
                                            <td style={{ padding: "16px 0" }}><button style={{ background: "none", border: "none", color: "#4B5563", cursor: "pointer" }}><X size={16} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{(project.results || []).length} creativos</p>
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
                                                        { id: "ALL", name: "Mix Variado" },
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
                                                                border: selectedAngle === ang.id ? `2px solid ${activeProject?.primaryColor}` : "1px solid rgba(255,255,255,0.1)",
                                                                background: selectedAngle === ang.id ? `${activeProject?.primaryColor}20` : "transparent",
                                                                color: selectedAngle === ang.id ? activeProject?.primaryColor : "#9CA3AF"
                                                            }}
                                                        >
                                                            {ang.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: activeProject?.primaryColor }} onClick={() => handleGenerate()} disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : <><Sparkles /> Generar Creativos</>}</button>
                                        </div>
                                    </div>
                                    <div>
                                        {(activeProject?.results || []).length > 0 && (
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Resultados</h3>
                                                {(activeProject?.results?.length || 0) > 1 && (
                                                    <button
                                                        onClick={() => downloadAsZip((activeProject?.results || []).map((r, idx) => ({ image: r.image, name: `${activeProject?.name || 'proj'}_${idx}` })), "clickads_generador")}
                                                        className="btn-primary"
                                                        style={{ padding: "8px 16px", fontSize: 11, background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProject?.primaryColor || "#8B5CF6"}`, color: activeProject?.primaryColor || "#8B5CF6" }}
                                                    >
                                                        <Layers size={14} /> Descargar Todos (.ZIP)
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                            {(activeProject?.results || []).map((res, i) => (
                                                <div key={i} className="glass-card" style={{ padding: 12, position: "relative" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                                        <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 10, background: activeProject?.primaryColor || "#8B5CF6" }} onClick={() => handleGenerate(res.title, 1)}>Más</button>
                                                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                            <button onClick={() => downloadSingleImage(res.image, activeProject?.name || "image")} style={{ background: "none", border: "none", color: activeProject?.primaryColor || "#8B5CF6", cursor: "pointer" }}><Download size={16} /></button>
                                                            <button onClick={() => saveToLibrary(res.image, res.title || "Mix")} style={{ background: "none", border: "none", color: activeProject?.primaryColor || "#8B5CF6", cursor: "pointer" }}>
                                                                <Bookmark size={16} fill={library.some(a => a.image === res.image) ? (activeProject?.primaryColor || "#8B5CF6") : "none"} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <img src={res.image} style={{ width: "100%", borderRadius: 16 }} />
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
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'studio' && (
                    <div style={{ maxWidth: 1100 }}>
                        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Photo Studio Pro</h1>
                        <p style={{ color: "#9CA3AF", fontSize: 16, marginBottom: 40 }}>Transforma tus fotos básicas en contenido publicitario de alto nivel.</p>

                        <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 40 }}>
                            <div className="glass-card" style={{ padding: 40, height: "fit-content" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#8B5CF6", marginBottom: 12 }}>PRODUCTO</label>
                                        <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 24, height: 260, position: "relative", marginBottom: 24, overflow: "hidden" }}>
                                            <input type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => setStudioImage(ev.target?.result as string);
                                                    reader.readAsDataURL(file);
                                                }
                                            }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                            {studioImage ? (
                                                <img src={studioImage} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.3 }}>
                                                    <UploadCloud /> <span>Sube la foto del producto</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 16, height: 100, position: "relative", marginBottom: 0, overflow: "hidden" }}>
                                            <input type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => updateActiveProject({ logoPreview: ev.target?.result as string });
                                                    reader.readAsDataURL(file);
                                                }
                                            }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                            {projects.find(p => p.id === activeProjectId)?.logoPreview ? (
                                                <img src={projects.find(p => p.id === activeProjectId)?.logoPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4, opacity: 0.3 }}>
                                                    <Plus size={16} /> <span style={{ fontSize: 10 }}>Sube tu Logo</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#8B5CF6", marginBottom: 12 }}>HERRAMIENTA</label>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                            <button
                                                onClick={() => setStudioMode('white_3d')}
                                                style={{ padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer", border: studioMode === 'white_3d' ? "2px solid #8B5CF6" : "1px solid rgba(255,255,255,0.1)", background: studioMode === 'white_3d' ? "rgba(139,92,246,0.1)" : "transparent", color: studioMode === 'white_3d' ? "#8B5CF6" : "#9CA3AF" }}
                                            >
                                                Fondo Blanco 3D
                                            </button>
                                            <button
                                                onClick={() => setStudioMode('model')}
                                                style={{ padding: "12px", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer", border: studioMode === 'model' ? "2px solid #8B5CF6" : "1px solid rgba(255,255,255,0.1)", background: studioMode === 'model' ? "rgba(139,92,246,0.1)" : "transparent", color: studioMode === 'model' ? "#8B5CF6" : "#9CA3AF" }}
                                            >
                                                Foto con Modelo
                                            </button>
                                        </div>
                                    </div>

                                    {studioMode === 'model' && (
                                        <>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#8B5CF6", marginBottom: 12 }}>GÉNERO DEL MODELO</label>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                                    <button
                                                        onClick={() => setStudioGender('female')}
                                                        style={{ padding: "10px", borderRadius: 12, fontSize: 11, fontWeight: 800, cursor: "pointer", border: studioGender === 'female' ? "2px solid #8B5CF6" : "1px solid rgba(255,255,255,0.1)", background: studioGender === 'female' ? "rgba(139,92,246,0.1)" : "transparent", color: studioGender === 'female' ? "#8B5CF6" : "#9CA3AF" }}
                                                    >
                                                        Mujer
                                                    </button>
                                                    <button
                                                        onClick={() => setStudioGender('male')}
                                                        style={{ padding: "10px", borderRadius: 12, fontSize: 11, fontWeight: 800, cursor: "pointer", border: studioGender === 'male' ? "2px solid #8B5CF6" : "1px solid rgba(255,255,255,0.1)", background: studioGender === 'male' ? "rgba(139,92,246,0.1)" : "transparent", color: studioGender === 'male' ? "#8B5CF6" : "#9CA3AF" }}
                                                    >
                                                        Hombre
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#8B5CF6", marginBottom: 12 }}>ESCENARIO / FONDO</label>
                                                <textarea
                                                    className="input-field"
                                                    placeholder="Ej: En un baño de lujo con mármol... (Dejar vacío para fondo blanco)"
                                                    style={{ height: 80 }}
                                                    value={studioBackgroundDesc}
                                                    onChange={(e) => setStudioBackgroundDesc(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <button
                                        className="btn-primary"
                                        style={{ width: "100%", justifyContent: "center" }}
                                        onClick={async () => {
                                            if (!studioImage) {
                                                setToast({ msg: "Por favor, sube una foto primero", type: 'error' });
                                                return;
                                            }
                                            if (!apiKey) {
                                                setToast({ msg: "⚠️ Ve a Configuración y guarda tu API Key de Gemini para usar esta herramienta", type: 'error' });
                                                setActiveTab('settings'); // Opcional: llevarlo a configuración
                                                return;
                                            }
                                            setIsStudioLoading(true);
                                            setStudioResults([]);
                                            const ratios = selectedRatio === 'both' ? ['4:5', '9:16'] : [selectedRatio];
                                            const newResults: { image: string, ratio: string }[] = [];

                                            try {
                                                for (const ratio of ratios) {
                                                    const res = await fetch("/api/vertex-ai/photo-studio", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            mode: studioMode,
                                                            apiKey,
                                                            gender: studioGender,
                                                            customBackground: studioBackgroundDesc,
                                                            aspectRatio: ratio
                                                        })
                                                    });
                                                    const data = await res.json();
                                                    if (data.image) {
                                                        newResults.push({ image: data.image, ratio });
                                                    } else {
                                                        throw new Error(data.error || "Error al procesar");
                                                    }
                                                }
                                                setStudioResults(newResults);
                                                setToast({ msg: "¡Procesado con éxito!", type: 'success' });
                                            } catch (e: any) {
                                                setToast({ msg: e.message || "Error de conexión", type: 'error' });
                                            } finally {
                                                setIsStudioLoading(false);
                                            }
                                        }}
                                        disabled={isStudioLoading}
                                    >
                                        {isStudioLoading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Procesar en Studio</>}
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.01)" }}>
                                {studioResults.length > 0 ? (
                                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
                                        <div style={{ display: "grid", gridTemplateColumns: studioResults.length > 1 ? "1fr 1fr" : "1fr", gap: 24 }}>
                                            {studioResults.map((res, idx) => (
                                                <div key={idx} style={{ position: "relative" }}>
                                                    <img src={res.image} style={{ width: "100%", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }} />
                                                    <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
                                                        <button
                                                            onClick={() => downloadSingleImage(res.image, `studio_${res.ratio}`)}
                                                            style={{ background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                        >
                                                            <Download size={14} />
                                                        </button>
                                                    </div>
                                                    <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(139, 92, 246, 0.9)", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 900 }}>
                                                        {res.ratio}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                                            <button
                                                onClick={() => {
                                                    setStudioResults([]);
                                                    setStudioImage(null);
                                                }}
                                                className="btn-primary"
                                                style={{ padding: "14px 28px", fontSize: 13, background: "rgba(255, 255, 255, 0.05)", color: "#fff" }}
                                            >
                                                Empezar de nuevo
                                            </button>
                                            {studioResults.length > 1 ? (
                                                <button
                                                    onClick={() => downloadAsZip(studioResults.map(r => ({ image: r.image, name: `studio_${r.ratio}` })), "clickads_studio")}
                                                    className="btn-primary"
                                                    style={{ padding: "14px 32px", fontSize: 13 }}
                                                >
                                                    <Layers size={18} /> Descargar Ambas (.ZIP)
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => downloadSingleImage(studioResults[0].image, `studio_${studioResults[0].ratio}`)}
                                                    className="btn-primary"
                                                    style={{ padding: "14px 32px", fontSize: 13 }}
                                                >
                                                    <Download size={18} /> Descargar Imagen
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center", opacity: 0.3 }}>
                                        <Video size={64} style={{ marginBottom: 20 }} />
                                        <h3 style={{ fontSize: 20, fontWeight: 800 }}>Esperando Acción</h3>
                                        <p>Configura los parámetros a la izquierda y pulsa Procesar.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'community' && (
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
                )}




                {activeTab === 'tutorials' && (
                    <div style={{ height: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <a
                            href="https://www.skool.com/de-cero-a-10x-3705/about"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{
                                padding: "48px 80px",
                                fontSize: "28px",
                                borderRadius: "32px",
                                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                                boxShadow: "0 20px 50px rgba(139, 92, 246, 0.4)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "24px",
                                transition: "all 0.3s ease",
                                textAlign: "center",
                                maxWidth: "800px"
                            }}
                        >
                            <PlayCircle size={64} />
                            <span style={{ fontWeight: 900, letterSpacing: "1px" }}>ACCEDER A COMUNIDAD DE CLASES Y TUTORIALES</span>
                        </a>
                    </div>
                )
                }

                {activeTab === 'settings' && (
                    <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
                )}

                {activeTab === 'library' && (
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
                                    <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
                                        <button onClick={() => downloadSingleImage(ad.image, ad.projectName)} style={{ background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Download size={14} /></button>
                                        <button onClick={() => removeFromLibrary(ad.id)} style={{ background: "rgba(239, 68, 68, 0.2)", border: "none", color: "#EF4444", width: 32, height: 32, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
                                    </div>
                                    <img src={ad.image} style={{ width: "100%", borderRadius: 12 }} />
                                    <div style={{ fontSize: 11, marginTop: 10, fontWeight: 700, color: "#9CA3AF" }}>{ad.projectName}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}




                {activeTab === 'logo_generator' && (
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
                                        style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
                                        onClick={handleGenerateLogoVariations}
                                        disabled={isGeneratingLogo}
                                    >
                                        {isGeneratingLogo ? <Loader2 className="animate-spin" /> : <><Sparkles /> Crear 20 Propuestas</>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {logoStep === 1 && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
                                <div style={{ textAlign: "center", background: "rgba(139, 92, 246, 0.1)", padding: "12px 24px", borderRadius: 100, border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                                    <span style={{ color: "#A78BFA", fontWeight: 800, fontSize: 13 }}>{currentLogoIndex + 1} de {logoOptions.length} — Dale "Like" si te gusta</span>
                                </div>

                                <div
                                    style={{
                                        position: "relative",
                                        width: 400,
                                        height: 400,
                                        perspective: "1000px",
                                        cursor: isSwiping ? "grabbing" : "grab",
                                        touchAction: "none"
                                    }}
                                    onMouseDown={(e) => { setSwipeStart(e.clientX); setIsSwiping(true); }}
                                    onMouseMove={(e) => { if (isSwiping) setSwipeX(e.clientX - swipeStart); }}
                                    onMouseUp={() => {
                                        if (!isSwiping) return;
                                        if (swipeX > 100) handleLikeLogo();
                                        else if (swipeX < -100) handleDislikeLogo();
                                        setSwipeX(0); setIsSwiping(false);
                                    }}
                                    onMouseLeave={() => {
                                        if (isSwiping) {
                                            setSwipeX(0); setIsSwiping(false);
                                        }
                                    }}
                                    onTouchStart={(e) => { setSwipeStart(e.touches[0].clientX); setIsSwiping(true); }}
                                    onTouchMove={(e) => { if (isSwiping) setSwipeX(e.touches[0].clientX - swipeStart); }}
                                    onTouchEnd={() => {
                                        if (!isSwiping) return;
                                        if (swipeX > 100) handleLikeLogo();
                                        else if (swipeX < -100) handleDislikeLogo();
                                        setSwipeX(0); setIsSwiping(false);
                                    }}
                                >
                                    <div
                                        className="glass-card"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: 40,
                                            border: "2px solid rgba(139,92,246,0.2)",
                                            position: "relative",
                                            transform: `translateX(${swipeX}px) rotate(${swipeX / 20}deg)`,
                                            transition: isSwiping ? "none" : "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                            opacity: 1 - Math.abs(swipeX) / 500,
                                            pointerEvents: "none"
                                        }}
                                    >
                                        <img src={logoOptions[currentLogoIndex]} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 20 }} />

                                        {swipeX > 50 && (
                                            <div style={{ position: "absolute", top: 40, left: 40, border: "4px solid #10B981", color: "#10B981", padding: "8px 16px", borderRadius: 12, fontSize: 24, fontWeight: 900, transform: "rotate(-20deg)", zIndex: 10 }}>SI</div>
                                        )}
                                        {swipeX < -50 && (
                                            <div style={{ position: "absolute", top: 40, right: 40, border: "4px solid #EF4444", color: "#EF4444", padding: "8px 16px", borderRadius: 12, fontSize: 24, fontWeight: 900, transform: "rotate(20deg)", zIndex: 10 }}>NO</div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 32 }}>
                                    <button
                                        onClick={handleDislikeLogo}
                                        style={{ width: 80, height: 80, borderRadius: 100, background: "rgba(239, 68, 68, 0.1)", border: "2px solid #EF4444", color: "#EF4444", cursor: "pointer", transition: "0.2s" }}
                                    >
                                        <X size={32} />
                                    </button>
                                    <button
                                        onClick={() => handleLikeLogo()}
                                        style={{ width: 80, height: 80, borderRadius: 100, background: "rgba(16, 185, 129, 0.1)", border: "2px solid #10B981", color: "#10B981", cursor: "pointer", transition: "0.2s" }}
                                    >
                                        <Heart size={32} fill="#10B981" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {logoStep === 2 && (
                            <div style={{ textAlign: "center" }} className="anim-in">
                                <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, color: "#10B981" }}>¡Logo Creado!</h2>
                                <p style={{ color: "#9CA3AF", marginBottom: 32 }}>Este logo ha sido sintetizado en base a tus preferencias.</p>

                                <div className="glass-card" style={{ maxWidth: 500, margin: "0 auto", padding: 32, border: "2px solid #10B981" }}>
                                    {isGeneratingLogo ? (
                                        <div style={{ padding: 40 }}>
                                            <Loader2 className="animate-spin" size={48} style={{ color: "#10B981", margin: "0 auto 16px" }} />
                                            <p style={{ fontWeight: 700 }}>Combinando estilos...</p>
                                        </div>
                                    ) : (
                                        <img src={finalLogo || ""} style={{ width: "100%", borderRadius: 16 }} />
                                    )}
                                </div>

                                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 32 }}>
                                    <button onClick={() => setLogoStep(0)} style={{ padding: "16px 32px", borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", fontWeight: 800, cursor: "pointer" }}>Crear Nuevo</button>
                                    <button onClick={() => finalLogo && downloadSingleImage(finalLogo, `${logoBusinessName}_logo`)} className="btn-primary" style={{ background: "#10B981" }}>
                                        <Download size={20} /> DESCARGAR LOGO
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'landing' && (
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
                                                                border: landingCategory === cat ? `2px solid ${activeProject?.primaryColor}` : "1px solid rgba(255,255,255,0.1)",
                                                                background: landingCategory === cat ? `${activeProject?.primaryColor}20` : "transparent",
                                                                color: landingCategory === cat ? activeProject?.primaryColor : "#9CA3AF"
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
                                                        <textarea className="input-field" placeholder="TU MARCA (PROS): Ej: - Envío Gratis, - Calidad Premium..." value={lCompBrand} onChange={(e) => { setLCompBrand(e.target.value); updateActiveProject({ lCompBrand: e.target.value }); }} style={{ height: 60, fontSize: 13 }} />
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
                                                    <textarea className="input-field" placeholder="Ej: Envío Gratis a todo el país, Pago Contraentrega, Recibe en 2-3 días..." value={lLogistics} onChange={(e) => { setLLogistics(e.target.value); updateActiveProject({ lLogistics: e.target.value }); }} style={{ height: 100, fontSize: 13 }} />
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
                                                    onClick={() => downloadSingleImage(landingResults, `Landing_${landingCategory}.jpg`)}
                                                    className="btn-primary"
                                                    style={{ padding: "8px 16px", fontSize: 11, background: "rgba(255,255,255,0.05)", border: `1px solid ${activeProject?.primaryColor || "#8B5CF6"}`, color: activeProject?.primaryColor || "#8B5CF6" }}
                                                >
                                                    <Download size={14} /> Descargar
                                                </button>
                                            )}
                                        </div>
                                        {landingResults ? (
                                            <img src={landingResults} style={{ width: "100%", borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }} />
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
                )}

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
                                <select className="input-field" value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
                                    {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
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

            {showApiModal && (
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
            )}

            {toast && (
                <div style={{ position: "fixed", bottom: 40, right: 40, background: toast.type === 'error' ? '#EF4444' : '#8B5CF6', color: '#fff', padding: "16px 32px", borderRadius: 16, fontWeight: 800, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 10000 }}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}