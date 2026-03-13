"use client";

import { useState, useEffect } from "react";
import { Sparkles, UploadCloud, Download, Loader2, Key, Layers, ArrowLeft, Users, PlayCircle, LogOut, Plus, Folder, Trash2, ChevronRight, MessageSquare, ThumbsUp, Send, Library, Save, CheckCircle2, Minus, Bookmark, Palette, Type, Search, Edit3, Heart, Share2, Award, User, HelpCircle, Layout, Globe, TrendingUp, DollarSign, UserCheck, ShieldCheck, Video, X, Settings, Smile } from "lucide-react";
import JSZip from "jszip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

interface Project {
    id: string;
    name: string;
    productPreview: string;
    userPrompt: string;
    results: { image: string, title?: string }[];
    updatedAt: number;
    primaryColor?: string;
    secondaryColor?: string;
    font?: string;
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

const INITIAL_POSTS: Post[] = [
    {
        id: "1",
        author: "Alex Rivers",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
        category: "logros",
        content: "¡Acabo de lanzar mi primera campaña con ClickAds y el ROAS está en 4.5! Gracias por los consejos del módulo 3.",
        timestamp: Date.now() - 3600000,
        likes: 12,
        comments: [
            { id: "c1", author: "Sofía Chen", authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", content: "¡Excelente resultado Alex! A por el 5.0 🔥", timestamp: Date.now() - 3000000 }
        ],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: "2",
        author: "María García",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
        category: "presentacion",
        content: "Hola a todos, soy de España y estoy empezando mi tienda de nicho para mascotas. ¡Encantada de estar aquí!",
        timestamp: Date.now() - 7200000,
        likes: 24,
        comments: []
    }
];

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [activeTab, setActiveTab] = useState("generator");
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [apiKey, setApiKey] = useState("");
    const [userPhoto, setUserPhoto] = useState<string | null>(null);

    // Auth Protection
    useEffect(() => {
        const savedUser = localStorage.getItem("clickads_user");
        if (!savedUser) {
            router.push("/login");
        } else {
            setUser(JSON.parse(savedUser));
        }
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
    const [studioResult, setStudioResult] = useState<string | null>(null);
    const [isStudioLoading, setIsStudioLoading] = useState(false);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Library State
    const [library, setLibrary] = useState<SavedAd[]>([]);
    const [libProjectFilter, setLibProjectFilter] = useState("all");

    // Helper for unique storage
    const getUKey = (base: string) => user ? `${base}_${user.email}` : base;

    useEffect(() => {
        if (!user) return;

        const savedKey = localStorage.getItem(getUKey("clickads_api_key"));
        if (savedKey) setApiKey(savedKey);

        const adminStatus = localStorage.getItem(getUKey("clickads_admin_mode")) === 'true';
        setIsAdmin(adminStatus);

        const savedProjects = localStorage.getItem(getUKey("clickads_projects"));
        if (savedProjects) {
            try { setProjects(JSON.parse(savedProjects)); } catch (e) { console.error(e); }
        } else {
            setProjects([]); // Clear if new user
        }

        const savedLib = localStorage.getItem(getUKey("clickads_library"));
        if (savedLib) {
            try { setLibrary(JSON.parse(savedLib)); } catch (e) { console.error(e); }
        } else {
            setLibrary([]);
        }

        const savedPhoto = localStorage.getItem(getUKey("clickads_user_photo")) || (user as any)?.photo;
        if (savedPhoto) setUserPhoto(savedPhoto);
        else setUserPhoto(null);
    }, [user]);

    // Sync with Supabase on mount/user change
    useEffect(() => {
        if (!user?.email) return;

        const syncProfile = async () => {
            const { data } = await supabase
                .from('authorized_users')
                .select('full_name, avatar_url')
                .eq('email', user.email)
                .maybeSingle();

            if (data) {
                if (data.full_name && data.full_name !== user.name) {
                    setUser(prev => prev ? { ...prev, name: data.full_name } : null);
                }
                if (data.avatar_url && data.avatar_url !== userPhoto) {
                    setUserPhoto(data.avatar_url);
                    localStorage.setItem(getUKey("clickads_user_photo"), data.avatar_url);
                }
            }
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
        if (secretKey === "admin123") { // Llave secreta para activar modo admin
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
        setPosts(prev => prev.filter(p => p.id !== id));
        setToast({ msg: "Comentario eliminado", type: 'success' });
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
    const [selectedPrimary, setSelectedPrimary] = useState("#8B5CF6");
    const [selectedSecondary, setSelectedSecondary] = useState("#FFFFFF");
    const [selectedFont, setSelectedFont] = useState("Inter");
    const [showProjectModal, setShowProjectModal] = useState(false);

    const createProject = () => {
        if (!projectNameInput.trim()) return;
        const newProject: Project = {
            id: Math.random().toString(36).substr(2, 9),
            name: projectNameInput,
            productPreview: "",
            userPrompt: "",
            results: [],
            updatedAt: Date.now(),
            primaryColor: selectedPrimary,
            secondaryColor: selectedSecondary,
            font: selectedFont
        };
        const newProjects = [newProject, ...projects];
        setProjects(newProjects);
        localStorage.setItem(getUKey("clickads_projects"), JSON.stringify(newProjects));
        setActiveProjectId(newProject.id);
        setProjectNameInput("");
        setShowProjectModal(false);
    };

    const deleteProject = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("¿Eliminar proyecto?")) return;
        const newProjects = projects.filter(p => p.id !== id);
        setProjects(newProjects);
        localStorage.setItem(getUKey("clickads_projects"), JSON.stringify(newProjects));
        if (activeProjectId === id) setActiveProjectId(null);
    };

    const updateActiveProject = (updates: Partial<Project>) => {
        if (!activeProjectId) return;
        const newProjects = projects.map(p => p.id === activeProjectId ? { ...p, ...updates, updatedAt: Date.now() } : p);
        setProjects(newProjects);
        localStorage.setItem(getUKey("clickads_projects"), JSON.stringify(newProjects));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateActiveProject({ productPreview: reader.result as string });
        reader.readAsDataURL(file);
    };

    const handleGenerate = async (angle?: string, count: number = 1) => {
        if (!apiKey || !activeProject?.productPreview) return;
        setIsLoading(true);
        if (!angle) updateActiveProject({ results: [] });
        try {
            const res = await fetch("/api/vertex-ai/generate-1plus4", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productBase64: activeProject.productPreview,
                    userPrompt: activeProject.userPrompt,
                    apiKey: apiKey,
                    specificAngle: angle || (selectedAngle === "ALL" ? undefined : selectedAngle),
                    count: count,
                    primaryColor: activeProject.primaryColor,
                    secondaryColor: activeProject.secondaryColor,
                    font: activeProject.font
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            if (angle) {
                const newResults = [...activeProject.results, ...(data.variations || [])];
                updateActiveProject({ results: newResults });
            } else {
                updateActiveProject({ results: data.variations || [] });
            }
        } catch (error: any) { setToast({ msg: error.message, type: 'error' }); } finally { setIsLoading(false); }
    };

    const saveToLibrary = (image: string, angle: string) => {
        if (library.some(item => item.image === image)) { setToast({ msg: "Ya está en tu biblioteca", type: 'success' }); return; }
        const newAd: SavedAd = { id: Math.random().toString(36).substr(2, 9), image, angle: angle || "Mix", projectName: activeProject?.name || "Global", savedAt: Date.now() };
        const newLib = [newAd, ...library];
        setLibrary(newLib);
        localStorage.setItem(getUKey("clickads_library"), JSON.stringify(newLib));
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
            author: "Admin ClickAds",
            authorAvatar: getAvatarUrl(),
            category: postingTo,
            content: newPostContent,
            timestamp: Date.now(),
            likes: 0,
            comments: []
        };
        setPosts([newPost, ...posts]);
        setNewPostContent("");
        setToast({ msg: "Publicación compartida", type: 'success' });
    };

    const downloadSingleImage = (image: string, name: string) => {
        const link = document.createElement("a");
        link.href = image;
        link.download = `${name.replace(/\s+/g, '_')}_${Date.now()}.png`;
        link.click();
        setToast({ msg: "Iniciando descarga...", type: 'success' });
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
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const liked = !p.likedByMe;
                return { ...p, likedByMe: liked, likes: liked ? p.likes + 1 : p.likes - 1 };
            }
            return p;
        }));
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
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
        setTempComment("");
        setCommentingTo(null);
        setToast({ msg: "Comentario añadido", type: 'success' });
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
                .nav-item { display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: 100px; cursor: pointer; transition: 0.2s; color: #9CA3AF; font-weight: 700; border: 1px solid transparent; }
                .nav-item.active { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2); color: #8B5CF6; }
                .project-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; cursor: pointer; transition: 0.2s; }
                .project-card:hover { border-color: #8B5CF6; background: rgba(255,255,255,0.04); }
                .community-cat { padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 14px; color: #9CA3AF; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .community-cat.active { background: #8B5CF6; color: #fff; }
                .post-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 24px; margin-bottom: 20px; transition: 0.2s; position: relative; }
                .stat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
            `}</style>

            {/* Sidebar */}
            <aside style={{ width: 300, borderRight: "1px solid rgba(255,255,255,0.05)", padding: 32, display: "flex", flexDirection: "column", height: "100vh", position: "fixed" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
                    <img src="/logo.png" alt="ClickAds" style={{ height: 40 }} />
                    <span style={{ fontSize: 22, fontWeight: 900 }}>ClickAds</span>
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    <div className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}><Sparkles size={20} /> Genera Creativos</div>
                    <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}><Library size={20} /> Biblioteca</div>
                    <div className={`nav-item ${activeTab === 'studio' ? 'active' : ''}`} onClick={() => setActiveTab('studio')}><Video size={20} /> Photo Studio</div>
                    <div className={`nav-item ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}><Users size={20} /> Comunidad</div>
                    <div className={`nav-item ${activeTab === 'tutorials' ? 'active' : ''}`} onClick={() => setActiveTab('tutorials')}><PlayCircle size={20} /> Tutoriales</div>
                    <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={20} /> Configuración</div>

                    {isAdmin && (
                        <div className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')} style={{ marginTop: 20, color: "#10B981" }}><ShieldCheck size={20} /> Admin Center</div>
                    )}
                </nav>

                {user && (
                    <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={getAvatarUrl()} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                            <div style={{ fontSize: 10, color: "#4B5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
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
            <main style={{ marginLeft: 300, flex: 1, padding: "40px 60px" }}>
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
                                    {projects.map(project => (
                                        <div key={project.id} onClick={() => setActiveProjectId(project.id)} className="project-card">
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                                                <div style={{ display: "flex", gap: 4 }}>
                                                    <div style={{ width: 32, height: 32, background: project.primaryColor || "#8B5CF6", borderRadius: 8 }} />
                                                    <div style={{ width: 16, height: 32, background: project.secondaryColor || "#FFFFFF", borderRadius: 4 }} />
                                                </div>
                                                <button onClick={(e) => deleteProject(project.id, e)} style={{ background: "none", border: "none", color: "#4B5563", cursor: "pointer" }}><Trash2 size={16} /></button>
                                            </div>
                                            <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: project.font }}>{project.name}</h3>
                                            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{project.results.length} creativos</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                                    <button onClick={() => setActiveProjectId(null)} style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><ArrowLeft size={16} /> Volver</button>
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
                                                    {activeProject?.productPreview ? <img src={activeProject.productPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.3 }}><UploadCloud /> <span>Sube tu producto</span></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>INSTRUCCIONES ADICIONALES</label>
                                                <textarea className="input-field" placeholder="Ej: Resalta la frescura, estilo elegante..." style={{ height: 120 }} value={activeProject?.userPrompt} onChange={(e) => updateActiveProject({ userPrompt: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>ÁNGULO DE VENTA</label>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                                                    {[
                                                        { id: "ALL", name: "Mix Variado" },
                                                        { id: "TESTIMONIAL", name: "Testimonios" },
                                                        { id: "INFOGRAPHIC", name: "Infografía" },
                                                        { id: "BENEFITS", name: "Beneficios" },
                                                        { id: "BEFORE_AFTER", name: "Sin vs Con Producto" },
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
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                            {activeProject?.results.map((res, i) => (
                                                <div key={i} className="glass-card" style={{ padding: 12, position: "relative" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                                        <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 10, background: activeProject.primaryColor }} onClick={() => handleGenerate(res.title, 1)}>Más</button>
                                                        <div style={{ display: "flex", gap: 12 }}>
                                                            <button onClick={() => downloadSingleImage(res.image, activeProject.name)} style={{ background: "none", border: "none", color: activeProject.primaryColor, cursor: "pointer" }}><Download size={16} /></button>
                                                            <button onClick={() => saveToLibrary(res.image, res.title || "Mix")} style={{ background: "none", border: "none", color: activeProject.primaryColor, cursor: "pointer" }}>
                                                                <Bookmark size={16} fill={library.some(a => a.image === res.image) ? activeProject.primaryColor : "none"} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <img src={res.image} style={{ width: "100%", borderRadius: 16 }} />
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
                                                setShowApiModal(true);
                                                setToast({ msg: "Configura tu API Key primero", type: 'error' });
                                                return;
                                            }
                                            setIsStudioLoading(true);
                                            try {
                                                const res = await fetch("/api/vertex-ai/photo-studio", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        productBase64: studioImage,
                                                        mode: studioMode,
                                                        apiKey,
                                                        gender: studioGender,
                                                        customBackground: studioBackgroundDesc
                                                    })
                                                });
                                                const data = await res.json();
                                                if (data.image) {
                                                    setStudioResult(data.image);
                                                    setToast({ msg: "¡Procesado con éxito!", type: 'success' });
                                                } else {
                                                    setToast({ msg: data.error || "Error al procesar", type: 'error' });
                                                }
                                            } catch (e) {
                                                setToast({ msg: "Error de conexión", type: 'error' });
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
                                {studioResult ? (
                                    <div style={{ width: "100%", position: "relative" }}>
                                        <img src={studioResult} style={{ width: "100%", borderRadius: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }} />
                                        <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 12 }}>
                                            <button
                                                onClick={() => {
                                                    const link = document.createElement("a");
                                                    link.href = studioResult;
                                                    link.download = `photo_studio_${Date.now()}.png`;
                                                    link.click();
                                                }}
                                                className="btn-primary"
                                                style={{ padding: "10px 20px", fontSize: 12 }}
                                            >
                                                <Download size={14} /> Descargar
                                            </button>
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
                    <div style={{ maxWidth: 850, margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
                            <div style={{ width: 48, height: 48, background: "rgba(139, 92, 246, 0.2)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}><Globe color="#8B5CF6" /></div>
                            <div>
                                <h1 style={{ fontSize: 28, fontWeight: 900 }}>Comunidad ClickAds</h1>
                                <p style={{ color: "#9CA3AF", fontSize: 14 }}>Conecta, comparte y escala con otros dropshippers.</p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, marginBottom: 32, background: "rgba(255,255,255,0.02)", padding: 6, borderRadius: 12, width: "fit-content", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div className={`community-cat ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}><Layout size={16} /> All</div>
                            <div className={`community-cat ${activeCategory === 'presentacion' ? 'active' : ''}`} onClick={() => setActiveCategory('presentacion')}><User size={16} /> Presentación</div>
                            <div className={`community-cat ${activeCategory === 'soporte' ? 'active' : ''}`} onClick={() => setActiveCategory('soporte')}><HelpCircle size={16} /> Soporte</div>
                            <div className={`community-cat ${activeCategory === 'logros' ? 'active' : ''}`} onClick={() => setActiveCategory('logros')}><Award size={16} /> Logros y Wins</div>
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 24, padding: 24, border: "1px solid rgba(139, 92, 246, 0.2)", marginBottom: 40 }}>
                            <div style={{ display: "flex", gap: 16 }}>
                                <img src={getAvatarUrl()} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.05)" }} />
                                <div style={{ flex: 1 }}>
                                    <textarea
                                        className="input-field"
                                        placeholder={`¿Qué tienes en mente para ${activeCategory === 'all' ? 'la comunidad' : activeCategory}?`}
                                        style={{ background: "transparent", border: "none", minHeight: 60, padding: 0, fontSize: 16 }}
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                    />

                                    {newPostImage && (
                                        <div style={{ position: "relative", width: "fit-content", marginTop: 16 }}>
                                            <img src={newPostImage} style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 12 }} />
                                            <button
                                                onClick={() => setNewPostImage(null)}
                                                style={{ position: "absolute", top: -8, right: -8, background: "#EF4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                            <select
                                                style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#9CA3AF", padding: "4px 8px", borderRadius: 6, fontSize: 12, outline: "none" }}
                                                value={postingTo}
                                                onChange={(e) => setPostingTo(e.target.value as any)}
                                            >
                                                <option value="presentacion">📌 Presentación</option>
                                                <option value="soporte">🛠️ Soporte</option>
                                                <option value="logros">🏆 Logros y Wins</option>
                                            </select>

                                            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#9CA3AF", fontSize: 12, cursor: "pointer", fontWeight: 700, padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
                                                <UploadCloud size={16} /> Subir Imagen
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => setNewPostImage(ev.target?.result as string);
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <button className="btn-primary" style={{ padding: "8px 24px", fontSize: 14 }} onClick={() => {
                                            if (!newPostContent.trim() && !newPostImage) return;
                                            const newPost: Post = {
                                                id: Math.random().toString(36).substr(2, 9),
                                                author: user?.name || "Usuario VIP",
                                                authorAvatar: getAvatarUrl(),
                                                category: postingTo,
                                                content: newPostContent,
                                                image: newPostImage || undefined,
                                                timestamp: Date.now(),
                                                likes: 0,
                                                comments: []
                                            };
                                            setPosts([newPost, ...posts]);
                                            setNewPostContent("");
                                            setNewPostImage(null);
                                            setToast({ msg: "Publicación compartida", type: 'success' });
                                        }}>Publicar <Send size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {posts.filter(p => activeCategory === 'all' || p.category === activeCategory).map(post => (
                                <div key={post.id} className="post-card">
                                    {isAdmin && (
                                        <button onClick={() => deletePost(post.id)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#EF4444", width: 32, height: 32, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
                                    )}
                                    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                        <img src={post.authorAvatar} style={{ width: 44, height: 44, borderRadius: 12 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div style={{ fontWeight: 800, fontSize: 15 }}>{post.author}</div>
                                                <div style={{ fontSize: 12, color: "#4B5563" }}>{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
                                            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                                <span style={{ fontSize: 10, background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", padding: "2px 8px", borderRadius: 4, fontWeight: 900, textTransform: "uppercase" }}>{post.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 15, lineHeight: 1.6, color: "#E5E7EB", marginBottom: 20 }}>{post.content}</p>
                                    {post.image && <img src={post.image} style={{ width: "100%", borderRadius: 16, marginBottom: 20 }} />}
                                    <div style={{ display: "flex", gap: 24, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                                        <button
                                            onClick={() => toggleLike(post.id)}
                                            style={{ background: "none", border: "none", color: post.likedByMe ? "#8B5CF6" : "#9CA3AF", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: post.likedByMe ? 800 : 500 }}
                                        >
                                            <Heart size={16} fill={post.likedByMe ? "#8B5CF6" : "none"} /> {post.likes}
                                        </button>
                                        <button
                                            onClick={() => setCommentingTo(commentingTo === post.id ? null : post.id)}
                                            style={{ background: "none", border: "none", color: commentingTo === post.id ? "#8B5CF6" : "#9CA3AF", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}
                                        >
                                            <MessageSquare size={16} /> {post.comments.length}
                                        </button>
                                    </div>

                                    {commentingTo === post.id && (
                                        <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                                                <img src={getAvatarUrl()} style={{ width: 32, height: 32, borderRadius: 8 }} />
                                                <div style={{ flex: 1, display: "flex", gap: 8 }}>
                                                    <input
                                                        className="input-field"
                                                        placeholder="Escribe un comentario..."
                                                        style={{ height: 40, fontSize: 13 }}
                                                        value={tempComment}
                                                        onChange={(e) => setTempComment(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                                                    />
                                                    <button className="btn-primary" style={{ padding: "0 16px" }} onClick={() => addComment(post.id)}><Send size={14} /></button>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                                {post.comments.map(c => (
                                                    <div key={c.id} style={{ display: "flex", gap: 12 }}>
                                                        <img src={c.authorAvatar} style={{ width: 28, height: 28, borderRadius: 6 }} />
                                                        <div style={{ flex: 1, background: "rgba(255,255,255,0.02)", padding: "10px 14px", borderRadius: 12 }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                                <div style={{ fontSize: 12, fontWeight: 800 }}>{c.author}</div>
                                                                <div style={{ fontSize: 10, color: "#4B5563" }}>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                            </div>
                                                            <div style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.4 }}>{c.content}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'tutorials' && (
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        {!activeModuleId ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                                    <h1 style={{ fontSize: 32, fontWeight: 900 }}>Módulos de Formación</h1>
                                    {isAdmin && (
                                        <button className="btn-primary" onClick={() => setShowModuleModal(true)} style={{ background: "#10B981" }}><Plus size={18} /> Crear Módulo</button>
                                    )}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32 }}>
                                    {modules.map((mod) => (
                                        <div key={mod.id} className="glass-card clickable" onClick={() => setActiveModuleId(mod.id)} style={{ padding: 0, overflow: "hidden", position: "relative" }}>
                                            {isAdmin && (
                                                <button onClick={(e) => deleteModule(mod.id, e)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(239, 68, 68, 0.8)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={16} /></button>
                                            )}
                                            <img src={mod.cover} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                                            <div style={{ padding: 24 }}>
                                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{mod.title}</h3>
                                                <div style={{ color: "#4B5563", fontSize: 13, fontWeight: 700 }}>{mod.videos.length} LECCIONES</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div>
                                <button onClick={() => { setActiveModuleId(null); setActiveVideoId(null); }} style={{ background: "none", border: "none", color: "#9CA3AF", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 32, fontSize: 14, fontWeight: 800 }}><ArrowLeft size={16} /> VOLVER A MÓDULOS</button>

                                {(() => {
                                    const currentMod = modules.find(m => m.id === activeModuleId)!;
                                    const currentVideo = currentMod.videos.find(v => v.id === activeVideoId) || currentMod.videos[0];

                                    return (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 40 }}>
                                            <div>
                                                {currentVideo ? (
                                                    <div>
                                                        <div style={{ aspectRatio: "16/9", background: "#000", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 24 }}>
                                                            <iframe width="100%" height="100%" src={currentVideo.youtubeUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                        </div>
                                                        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>{currentVideo.title}</h2>

                                                        <div style={{ display: "flex", gap: 24, marginBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 20 }}>
                                                            <button onClick={() => toggleVideoLike(currentMod.id, currentVideo.id)} style={{ background: "none", border: "none", color: currentVideo.likedByMe ? "#8B5CF6" : "#fff", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 15, fontWeight: 800 }}>
                                                                <Heart fill={currentVideo.likedByMe ? "#8B5CF6" : "none"} size={20} /> {currentVideo.likes} Likes
                                                            </button>
                                                            <div style={{ color: "#4B5563", display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800 }}>
                                                                <MessageSquare size={20} /> {currentVideo.comments.length} Comentarios
                                                            </div>
                                                        </div>

                                                        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 24, padding: 32 }}>
                                                            <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Comentarios de la Clase</h4>
                                                            <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                                                                <img src={getAvatarUrl()} style={{ width: 40, height: 40, borderRadius: 12 }} />
                                                                <input
                                                                    className="input-field"
                                                                    placeholder="Escribe tu duda o feedback..."
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            addVideoComment(currentMod.id, currentVideo.id, e.currentTarget.value);
                                                                            e.currentTarget.value = "";
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                                                {currentVideo.comments.map(c => (
                                                                    <div key={c.id} style={{ display: "flex", gap: 16 }}>
                                                                        <img src={c.authorAvatar} style={{ width: 32, height: 32, borderRadius: 10 }} />
                                                                        <div>
                                                                            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{c.author}</div>
                                                                            <div style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.5 }}>{c.content}</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="glass-card" style={{ padding: 60, textAlign: "center", opacity: 0.5 }}>
                                                        <Video size={48} style={{ marginBottom: 16 }} />
                                                        <h3 style={{ fontSize: 20, fontWeight: 800 }}>Módulo vacío</h3>
                                                        <p>Este módulo aún no tiene videos disponibles.</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                                    <h4 style={{ fontSize: 16, fontWeight: 800, color: "#4B5563" }}>LISTA DE VIDEOS</h4>
                                                    {isAdmin && (
                                                        <button onClick={() => setShowVideoModal(true)} style={{ background: "#10B981", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={16} /></button>
                                                    )}
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                                    {currentMod.videos.map((vid, ix) => (
                                                        <div key={vid.id} style={{ position: "relative" }}>
                                                            <button
                                                                onClick={() => setActiveVideoId(vid.id)}
                                                                style={{
                                                                    width: "100%",
                                                                    background: activeVideoId === vid.id || (!activeVideoId && ix === 0) ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.03)",
                                                                    border: activeVideoId === vid.id || (!activeVideoId && ix === 0) ? "1px solid #8B5CF6" : "1px solid rgba(255,255,255,0.05)",
                                                                    padding: "16px 20px",
                                                                    borderRadius: 16,
                                                                    color: "#fff",
                                                                    textAlign: "left",
                                                                    cursor: "pointer",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 12,
                                                                    fontWeight: 700,
                                                                    paddingRight: isAdmin ? 50 : 20
                                                                }}
                                                            >
                                                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{ix + 1}</div>
                                                                <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vid.title}</span>
                                                                <PlayCircle size={14} opacity={0.5} />
                                                            </button>
                                                            {isAdmin && (
                                                                <button onClick={() => deleteVideo(currentMod.id, vid.id)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: 8, zIndex: 10 }}><Trash2 size={14} /></button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}

                {/* Modales de Tutoriales */}
                {showModuleModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="glass-card" style={{ maxWidth: 450, width: "100%", padding: 40 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>Nuevo Módulo</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block" }}>TÍTULO DEL MÓDULO</label>
                                    <input className="input-field" placeholder="Ejem: Estrategia de Escalamiento..." value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 12, display: "block" }}>PORTADA DEL MÓDULO</label>
                                    <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 16, height: 160, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {newModuleCover ? (
                                            <img src={newModuleCover} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.3 }}>
                                                <UploadCloud size={32} />
                                                <span style={{ fontSize: 12, fontWeight: 700 }}>SUBIR IMAGEN</span>
                                            </div>
                                        )}
                                        <input type="file" hidden accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => setNewModuleCover(event.target?.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }} id="module-cover-upload" />
                                        <label htmlFor="module-cover-upload" style={{ position: "absolute", inset: 0, cursor: "pointer" }}></label>
                                    </div>
                                    {newModuleCover && (
                                        <button onClick={() => setNewModuleCover("")} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 11, fontWeight: 800, marginTop: 8, cursor: "pointer" }}>Eliminar seleccionada</button>
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                    <button onClick={() => setShowModuleModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer" }}>Cancelar</button>
                                    <button onClick={addModule} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>Crear Módulo</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showVideoModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="glass-card" style={{ maxWidth: 450, width: "100%", padding: 40 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>Agregar Video</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block" }}>TÍTULO DEL VIDEO</label>
                                    <input className="input-field" placeholder="Ejem: Clase 1: Configuración..." value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 900, color: "#4B5563", marginBottom: 8, display: "block" }}>URL YOUTUBE</label>
                                    <input className="input-field" placeholder="https://youtube.com/watch?v=..." value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                                </div>
                                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                    <button onClick={() => setShowVideoModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer" }}>Cancelar</button>
                                    <button onClick={() => addVideoToModule(activeModuleId!)} className="btn-primary" style={{ flex: 2, justifyContent: "center" }}>Subir Video</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
            </main>

            {/* Modal de Creación de Proyecto */}
            {showProjectModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="glass-card" style={{ maxWidth: 500, width: "100%", padding: 48 }}>
                        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32, textAlign: "center" }}>Estilos de Marca</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            <input className="input-field" placeholder="Nombre de la marca..." value={projectNameInput} onChange={(e) => setProjectNameInput(e.target.value)} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <ColorPicker label="Primario" color={selectedPrimary} onChange={setSelectedPrimary} />
                                <ColorPicker label="Secundario" color={selectedSecondary} onChange={setSelectedSecondary} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 900, color: "#9CA3AF", marginBottom: 12, textTransform: "uppercase" }}>Tipografía</label>
                                <select className="input-field" value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
                                    {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                                <button onClick={() => setShowProjectModal(false)} style={{ flex: 1, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer" }}>Cancelar</button>
                                <button onClick={createProject} className="btn-primary" style={{ flex: 2, justifyContent: "center", background: selectedPrimary }}>Crear Proyecto</button>
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
