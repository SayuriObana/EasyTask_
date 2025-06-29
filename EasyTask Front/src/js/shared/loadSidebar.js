// Função para carregar e inicializar a sidebar
async function loadSidebar() {
    try {
        // Carregar o HTML da sidebar
        const response = await fetch('../../src/components/shared/sidebar.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sidebarHtml = await response.text();

        // Inserir a sidebar no início do body
        document.body.insertAdjacentHTML('afterbegin', sidebarHtml);

        // Inicializar a sidebar após inserir no DOM
        initializeSidebar();

        // Marcar o item de menu ativo
        setActiveMenuItem();

        console.log('Sidebar carregada com sucesso!');
    } catch (error) {
        console.error('Erro ao carregar a sidebar:', error);
    }
}

// Função para inicializar a sidebar
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (!sidebar || !menuToggle) {
        console.error('Elementos da sidebar não encontrados');
        return;
    }

    // Carregar informações do usuário
    const userData = authUtils.getUserData();
    if (userData) {
        const userNameElement = document.getElementById('userNameSidebar');
        const userLevelElement = document.getElementById('userLevel');
        
        if (userNameElement) {
            userNameElement.textContent = userData.nome;
        }
        if (userLevelElement) {
            userLevelElement.textContent = userData.accessLevel.replace('ROLE_', '');
        }
    }

    // Configurar o botão de logout
    const logoutBtn = document.getElementById('logout-sidebar');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authUtils.logout();
        });
    }

    // Configurar o botão de tema
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    }

    // Função para abrir a sidebar
    function openSidebar() {
        sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Função para fechar a sidebar
    function closeSidebar() {
        sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Eventos da sidebar
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeSidebar();
        }
    });

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Configurar dropdowns do menu
    const dropdowns = document.querySelectorAll('.sidebar-dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = dropdown.parentElement;
            parent.classList.toggle('active');
        });
    });
}

// Função para marcar o item de menu ativo
function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.sidebar-menu a');

    menuItems.forEach(item => {
        if (currentPath.includes(item.getAttribute('href'))) {
            // Remove active de todos os itens
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            // Adiciona active ao item atual
            item.parentElement.classList.add('active');
            
            // Se estiver em um submenu, ativa o dropdown pai
            const parentDropdown = item.closest('.sidebar-dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('active');
            }
        }
    });
}

// Carregar a sidebar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadSidebar);
