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
    logoPreview?: string;
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
    const [activeTab, setActiveTab] = useState("generator");
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [apiKey, setApiKey] = useState("");
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [selectedRatio, setSelectedRatio] = useState<'4:5' | '9:16' | 'both'>('4:5');

    // Auth Protection RESTORED - Selective access check
    useEffect(() => {
        const savedUser = localStorage.getItem("clickads_user");
        if (!savedUser) {
            router.push("/login");
        } else {
            setUser(JSON.parse(savedUser));
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

        // Cargar API Key (Primero por usuario, luego Global como fallback)
        const savedKey = localStorage.getItem(getUKey("clickads_api_key")) || localStorage.getItem("clickads_api_key_global");
        if (savedKey) {
            setApiKey(savedKey);
            setTempApiKey(savedKey);
        }

        const adminStatus = localStorage.getItem(getUKey("clickads_admin_mode")) === 'true';
        setIsAdmin(adminStatus);

        const savedProjects = localStorage.getItem(getUKey("clickads_projects"));
        const legacyProjects = localStorage.getItem("clickads_projects");

        if (savedProjects) {
            try { setProjects(JSON.parse(savedProjects)); } catch (e) { console.error(e); }
        } else if (legacyProjects && user?.email) {
            // Migración: Mover proyectos sin email al perfil del usuario
            try {
                const parsed = JSON.parse(legacyProjects);
                setProjects(parsed);
                localStorage.setItem(getUKey("clickads_projects"), legacyProjects);
                localStorage.removeItem("clickads_projects"); // Limpiar legacy
            } catch (e) { console.error(e); }
        } else {
            setProjects([]);
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

        const savedPosts = localStorage.getItem("clickads_community_posts");
        if (savedPosts) {
            try { setPosts(JSON.parse(savedPosts)); } catch (e) { console.error(e); }
        }
    }, [user]);

    // Auto-save Projects persistence loop with Quota Handling
    useEffect(() => {
        if (user) {
            const key = getUKey("clickads_projects");
            const data = JSON.stringify(projects);
            try {
                localStorage.setItem(key, data);
            } catch (e: any) {
                if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    console.warn("Local storage full, attempting to prune oldest results...");
                    // Si el disco está lleno, quitamos las imágenes (que es lo más pesado) de los proyectos más antiguos
                    // Excepto del proyecto activo para no interrumpir el trabajo actual
                    const pruned = [...projects].sort((a, b) => a.updatedAt - b.updatedAt).map(p => {
                        if (p.id !== activeProjectId) {
                            return { ...p, results: [] }; // Borramos solo las imágenes generadas para liberar espacio
                        }
                        return p;
                    });

                    try {
                        localStorage.setItem(key, JSON.stringify(pruned));
                        setProjects(pruned);
                        setToast({ msg: "⚠️ Memoria llena: Se han limpiado imágenes antiguas para ahorrar espacio.", type: 'error' });
                    } catch (finalErr) {
                        setToast({ msg: "❌ Memoria CRÍTICA: Elimina proyectos manualmente para continuar.", type: 'error' });
                    }
                }
            }
        }
    }, [projects, user, activeProjectId]);

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
            font: selectedFont,
            logoPreview: ""
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
        const ratiosToGenerate = selectedRatio === 'both' ? ['4:5', '9:16'] : [selectedRatio];
        let allVariations: any[] = [];

        try {
            for (const ratio of ratiosToGenerate) {
                const res = await fetch("/api/vertex-ai/generate-1plus4", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productBase64: activeProject.productPreview,
                        logoBase64: activeProject.logoPreview,
                        userPrompt: activeProject.userPrompt,
                        apiKey: apiKey,
                        specificAngle: angle || (selectedAngle === "ALL" ? undefined : selectedAngle),
                        count: count,
                        primaryColor: activeProject.primaryColor,
                        secondaryColor: activeProject.secondaryColor,
                        font: activeProject.font,
                        aspectRatio: ratio
                    }),
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                allVariations = [...allVariations, ...(data.variations || [])];
            }

            if (angle) {
                const newResults = [...activeProject.results, ...allVariations];
                updateActiveProject({ results: newResults });
            } else {
                updateActiveProject({ results: allVariations });
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
                                                    {activeProject?.productPreview ? <img src={activeProject.productPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.3 }}><UploadCloud /> <span>Sube tu producto</span></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 16, height: 100, position: "relative", marginBottom: 0, overflow: "hidden" }}>
                                                    <input type="file" onChange={handleLogoChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                                                    {activeProject?.logoPreview ? <img src={activeProject.logoPreview} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4, opacity: 0.3 }}><Plus size={16} /> <span style={{ fontSize: 10 }}>Sube tu Logo</span></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>INSTRUCCIONES ADICIONALES</label>
                                                <textarea className="input-field" placeholder="Ej: Resalta la frescura, estilo elegante..." style={{ height: 120 }} value={activeProject?.userPrompt} onChange={(e) => updateActiveProject({ userPrompt: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: activeProject?.primaryColor, marginBottom: 12 }}>FORMATO / DIMENSIONES</label>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
                                                    <button
                                                        onClick={() => setSelectedRatio('4:5')}
                                                        style={{ padding: "12px", borderRadius: 12, fontSize: 10, fontWeight: 800, cursor: "pointer", border: selectedRatio === '4:5' ? `2px solid ${activeProject?.primaryColor}` : "1px solid rgba(255,255,255,0.1)", background: selectedRatio === '4:5' ? `${activeProject?.primaryColor}10` : "transparent", color: selectedRatio === '4:5' ? activeProject?.primaryColor : "#9CA3AF" }}
                                                    >
                                                        Feed (4:5)
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedRatio('9:16')}
                                                        style={{ padding: "12px", borderRadius: 12, fontSize: 10, fontWeight: 800, cursor: "pointer", border: selectedRatio === '9:16' ? `2px solid ${activeProject?.primaryColor}` : "1px solid rgba(255,255,255,0.1)", background: selectedRatio === '9:16' ? `${activeProject?.primaryColor}10` : "transparent", color: selectedRatio === '9:16' ? activeProject?.primaryColor : "#9CA3AF" }}
                                                    >
                                                        Stories (9:16)
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedRatio('both')}
                                                        style={{ padding: "12px", borderRadius: 12, fontSize: 10, fontWeight: 800, cursor: "pointer", border: selectedRatio === 'both' ? `2px solid ${activeProject?.primaryColor}` : "1px solid rgba(255,255,255,0.1)", background: selectedRatio === 'both' ? `${activeProject?.primaryColor}10` : "transparent", color: selectedRatio === 'both' ? activeProject?.primaryColor : "#9CA3AF" }}
                                                    >
                                                        Ambas
                                                    </button>
                                                </div>

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
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#8B5CF6", marginBottom: 12 }}>FORMATO</label>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
                                            <button
                                                onClick={() => setSelectedRatio('4:5')}
                                                style={{ padding: "12px", borderRadius: 12, fontSize: 10, fontWeight: 800, cursor: "pointer", border: selectedRatio === '4:5' ? "2px solid #8B5CF6" : "1px solid rgba(255,255,255,0.1)", background: selectedRatio === '4:5' ? "rgba(139,92,246,0.1)" : "transparent", color: selectedRatio === '4:5' ? "#8B5CF6" : "#9CA3AF" }}
                                            >
                                                Feed (4:5)
                                            </button>
                                            <button
                                                onClick={() => setSelectedRatio('9:16')}
                                                style={{ padding: "12px", borderRadius: 12, fontSize: 10, fontWeight: 800, cursor: "pointer", border: selectedRatio === '9:16' ? "2px solid #8B5CF6" : "1px solid rgba(255,255,255,0.1)", background: selectedRatio === '9:16' ? "rgba(139,92,246,0.1)" : "transparent", color: selectedRatio === '9:16' ? "#8B5CF6" : "#9CA3AF" }}
                                            >
                                                Stories (9:16)
                                            </button>
                                            <button
                                                onClick={() => setSelectedRatio('both')}
                                                style={{ padding: "12px", borderRadius: 12, fontSize: 10, fontWeight: 800, cursor: "pointer", border: selectedRatio === 'both' ? "2px solid #8B5CF6" : "1px solid rgba(255,255,255,0.1)", background: selectedRatio === 'both' ? "rgba(139,92,246,0.1)" : "transparent", color: selectedRatio === 'both' ? "#8B5CF6" : "#9CA3AF" }}
                                            >
                                                Ambas
                                            </button>
                                        </div>

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
                                            try {
                                                const res = await fetch("/api/vertex-ai/photo-studio", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        productBase64: studioImage,
                                                        logoBase64: activeProject?.logoPreview,
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
                                                    setStudioResult(null);
                                                    setStudioImage(null);
                                                }}
                                                className="btn-primary"
                                                style={{ padding: "10px 20px", fontSize: 12, background: "rgba(239, 68, 68, 0.8)" }}
                                            >
                                                Empezar de nuevo
                                            </button>
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

