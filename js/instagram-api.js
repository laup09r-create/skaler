// ===================================
// INSTAGRAM API - Integração Simplificada
// API: https://papayawhip-vulture-297276.hostingersite.com/api.php
// ===================================

const API_BASE_URL = 'https://springgreen-antelope-381827.hostingersite.com/api.php';

// ===================================
// PROXY DE IMAGENS
// ===================================

function getProxyImageUrl(imageUrl) {
    if (!imageUrl || imageUrl.trim() === '') {
        return './images/perfil-sem-foto.jpeg';
    }
    if (imageUrl.startsWith('./') || imageUrl.startsWith('/') || imageUrl.startsWith('../')) {
        return imageUrl;
    }
    if (imageUrl.includes('images.weserv.nl') || imageUrl.includes('proxt-insta.projetinho-solo.workers.dev')) {
        return imageUrl;
    }
    if (!imageUrl.startsWith('http')) {
        return imageUrl;
    }
    return `https://proxt-insta.projetinho-solo.workers.dev/?url=${encodeURIComponent(imageUrl)}`;
}

function getProxyImageUrlLight(imageUrl) {
    if (!imageUrl || imageUrl.trim() === '') {
        return './images/perfil-sem-foto.jpeg';
    }
    if (imageUrl.startsWith('./') || imageUrl.startsWith('/') || imageUrl.startsWith('../')) {
        return imageUrl;
    }
    if (imageUrl.includes('images.weserv.nl') || imageUrl.includes('proxt-insta.projetinho-solo.workers.dev')) {
        return imageUrl;
    }
    if (!imageUrl.startsWith('http')) {
        return imageUrl;
    }
    const urlWithoutProtocol = imageUrl.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(urlWithoutProtocol)}&w=80&h=80&fit=cover&q=50`;
}

// ===================================
// FUNÇÕES DA API
// ===================================

/**
 * Buscar perfil básico (RÁPIDO - para modal de confirmação)
 * Endpoint: ?tipo=perfil&username=USUARIO
 */
async function fetchProfileByUsername(username) {
    const cleanUsername = username.replace(/^@+/, '').trim();
    
    console.log('🔍 Buscando perfil:', cleanUsername);
    
    const response = await fetch(`${API_BASE_URL}?tipo=perfil&username=${encodeURIComponent(cleanUsername)}`);
    const data = await response.json();
    
    console.log('📦 Resposta da API:', data);
    
    if (!data || data.error) {
        throw new Error(data?.error || 'Erro ao buscar perfil');
    }
    
    // Retornar perfil no formato esperado
    return {
        pk: data.user_id || String(Math.floor(Math.random() * 1000000000)),
        username: data.username || cleanUsername,
        full_name: data.full_name || '',
        biography: data.biography || '',
        profile_pic_url: data.profile_pic_url || './images/perfil-sem-foto.jpeg',
        is_verified: data.is_verified || false,
        is_private: data.is_private || false,
        is_business: data.is_business || false,
        media_count: data.media_count || 0,
        follower_count: data.follower_count || 0,
        following_count: data.following_count || 0
    };
}

/**
 * Buscar dados completos (após confirmar perfil)
 * Endpoint: ?tipo=busca_completa&username=USUARIO
 */
async function fetchCompleteData(username) {
    const cleanUsername = username.replace(/^@+/, '').trim();
    
    console.log('🔎 Buscando dados completos:', cleanUsername);
    
    const response = await fetch(`${API_BASE_URL}?tipo=busca_completa&username=${encodeURIComponent(cleanUsername)}`);
    const data = await response.json();
    
    console.log('📦 Dados completos:', data);
    
    return data;
}

/**
 * Buscar perfis sugeridos
 * Endpoint: ?campo=perfis_sugeridos&username=USUARIO
 */
async function fetchSuggestedProfiles(username) {
    const cleanUsername = username.replace(/^@+/, '').trim();
    
    const response = await fetch(`${API_BASE_URL}?campo=perfis_sugeridos&username=${encodeURIComponent(cleanUsername)}`);
    const data = await response.json();
    
    return data;
}

/**
 * Buscar lista de seguidores
 * Endpoint: ?campo=lista_seguidores&username=USUARIO&amount=20
 */
async function fetchFollowers(username, amount = 20) {
    const cleanUsername = username.replace(/^@+/, '').trim();
    
    const response = await fetch(`${API_BASE_URL}?campo=lista_seguidores&username=${encodeURIComponent(cleanUsername)}&amount=${amount}`);
    const data = await response.json();
    
    return data;
}

// ===================================
// SALVAR NO LOCALSTORAGE
// ===================================

function saveProfileToStorage(profile) {
    try {
        const profileData = {
            username: profile.username,
            full_name: profile.full_name || '',
            biography: profile.biography || '',
            profile_pic_url: profile.profile_pic_url,
            is_private: profile.is_private || false,
            is_verified: profile.is_verified || false,
            is_business: profile.is_business || false,
            media_count: profile.media_count || 0,
            follower_count: profile.follower_count || 0,
            following_count: profile.following_count || 0,
            pk: profile.pk || '',
            timestamp: Date.now()
        };

        localStorage.setItem('instagram_profile', JSON.stringify(profileData));
        localStorage.setItem('espionado_username', profile.username);
        localStorage.setItem('username', profile.username);
        localStorage.removeItem('is_fallback_data'); // REMOVER flag de fallback

        if (profile.pk) {
            localStorage.setItem('userId', profile.pk);
            localStorage.setItem('userPk', profile.pk);
            localStorage.setItem('user_id', profile.pk);
        }

        console.log('💾 Perfil salvo no localStorage:', profile.username);
    } catch (error) {
        console.error('❌ Erro ao salvar perfil:', error);
    }
}

function getProfileFromStorage() {
    try {
        const data = localStorage.getItem('instagram_profile');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('❌ Erro ao ler perfil:', error);
        return null;
    }
}

// ===================================
// EXPORTAR PARA WINDOW
// ===================================

if (typeof window !== 'undefined') {
    window.InstagramAPI = {
        fetchProfileByUsername,
        fetchCompleteData,
        fetchSuggestedProfiles,
        fetchFollowers,
        saveProfileToStorage,
        getProfileFromStorage,
        getProxyImageUrl,
        getProxyImageUrlLight
    };

    // Compatibilidade com código antigo
    window.fetchInstagramProfile = fetchProfileByUsername;
    window.fetchCompleteData = fetchCompleteData;
    window.getProxyImageUrl = getProxyImageUrl;
    window.getProxyImageUrlLight = getProxyImageUrlLight;
}

console.log('✅ Instagram API carregada (Hostinger API)');
