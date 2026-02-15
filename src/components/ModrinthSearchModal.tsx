import { useState, useEffect } from "react";
import { searchMods, getVersions, installVersion } from "../api/modrinth";
import { ModrinthProject, ModrinthVersion, LauncherProfile } from "../types";
import { Search, Download, Loader2, X, ChevronLeft } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

interface ModrinthSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: LauncherProfile | null;
    currentLoaderType?: string; // e.g. "Fabric"
    currentGameVersion?: string; // e.g. "1.20.1"
    onModInstalled: () => void;
}

export function ModrinthSearchModal({ isOpen, onClose, currentProfile, currentLoaderType, currentGameVersion, onModInstalled }: ModrinthSearchModalProps) {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [projects, setProjects] = useState<ModrinthProject[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ModrinthProject | null>(null);
    const [versions, setVersions] = useState<ModrinthVersion[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [installing, setInstalling] = useState<string | null>(null); // Version ID
    const [useFilters, setUseFilters] = useState(true);

    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            setProjects([]);
            setSelectedProject(null);
            setVersions([]);
            setUseFilters(true);
        }
    }, [isOpen]);

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSelectedProject(null);
        try {
            const results = await searchMods(query);
            setProjects(results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProject = async (project: ModrinthProject) => {
        setSelectedProject(project);
        fetchVersions(project.project_id, useFilters);
    };

    const fetchVersions = async (projectId: string, enableFilters: boolean) => {
        setLoadingVersions(true);
        try {
            const loader = enableFilters ? currentLoaderType?.toLowerCase() : undefined;
            const version = enableFilters ? currentGameVersion : undefined;

            const results = await getVersions(projectId, loader, version);
            setVersions(results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingVersions(false);
        }
    };

    const toggleFilters = () => {
        const newState = !useFilters;
        setUseFilters(newState);
        if (selectedProject) {
            fetchVersions(selectedProject.project_id, newState);
        }
    };

    const handleInstall = async (version: ModrinthVersion) => {
        if (!currentProfile) return;

        const primaryFile = version.files.find(f => f.primary) || version.files[0];
        if (!primaryFile) return;

        setInstalling(version.id);
        try {
            await installVersion(primaryFile.url, primaryFile.filename, currentProfile.mods_dir);
            onModInstalled();
            // Optional: Show success toast
        } catch (err) {
            console.error(err);
            // Optional: Show error toast
        } finally {
            setInstalling(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#252526]">
                    <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                        {/* <img src="/modrinth-logo.svg" className="w-6 h-6" /> */}
                        {t('modrinth.title')}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {!selectedProject ? (
                        <>
                            <div className="p-4 border-b border-white/5">
                                <form onSubmit={handleSearch} className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={t('modrinth.search_placeholder')}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                        autoFocus
                                    />
                                </form>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                                {loading ? (
                                    <div className="flex items-center justify-center h-40 text-indigo-400">
                                        <Loader2 className="animate-spin" size={32} />
                                    </div>
                                ) : projects.length > 0 ? (
                                    projects.map(project => (
                                        <div
                                            key={project.project_id}
                                            onClick={() => handleSelectProject(project)}
                                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5 group"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-gray-800 shrink-0 overflow-hidden">
                                                {project.icon_url ? (
                                                    <img src={project.icon_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold text-xl">
                                                        {project.title.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-medium text-gray-200 truncate pr-2 group-hover:text-indigo-400 transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                                        {project.downloads.toLocaleString()} dl
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400 line-clamp-2">
                                                    {project.description}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{project.author}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : query && (
                                    <div className="text-center text-gray-500 py-12">
                                        {t('modrinth.no_results')}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-white/5 bg-[#252526] flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-2 -ml-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-800 shrink-0 overflow-hidden">
                                        {selectedProject.icon_url && <img src={selectedProject.icon_url} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-200">{selectedProject.title}</h3>
                                        <div className="text-xs text-gray-500">by {selectedProject.author}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                                <div className="mb-6">
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {selectedProject.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t('modrinth.versions')}</h4>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={useFilters}
                                                onChange={toggleFilters}
                                                className="rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-offset-0 focus:ring-1 focus:ring-indigo-500"
                                            />
                                            {t('modrinth.compatible_only')} ({currentLoaderType || t('modrinth.any')}, {currentGameVersion || t('modrinth.any')})
                                        </label>
                                    </div>
                                </div>
                                {loadingVersions ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="animate-spin text-indigo-500" size={24} />
                                    </div>
                                ) : versions.length > 0 ? (
                                    <div className="space-y-2">
                                        {versions.map(version => {
                                            // Optional: Client-side highlight if we disabled server-side filtering
                                            // But for now, if filtering is disabled, we show everything.

                                            return (
                                                <div key={version.id} className="bg-black/20 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-gray-200">{version.name}</span>
                                                            <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                                                                {version.version_number}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{version.game_versions.join(', ')}</span>
                                                            <span>•</span>
                                                            <span>{version.loaders.join(', ')}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleInstall(version)}
                                                        disabled={installing !== null}
                                                        className={clsx(
                                                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                                            installing === version.id
                                                                ? "bg-indigo-500/20 text-indigo-400 cursor-wait"
                                                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                                        )}
                                                    >
                                                        {installing === version.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Download size={16} />
                                                        )}
                                                        {t('modrinth.install')}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <p>{t('modrinth.no_versions')}</p>
                                        {useFilters && (
                                            <p className="text-xs mt-2 text-gray-600">
                                                {t('modrinth.try_unchecking')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
