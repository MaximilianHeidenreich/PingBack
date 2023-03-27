export const width = () => Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

export const isMobile = () => width() < 768;