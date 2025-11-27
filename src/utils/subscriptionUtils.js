// Utilidades para manejar la lógica de suscripciones de manera consistente

export const SUBSCRIPTION_TIERS = {
  free: 'free',
  premium: 'premium',
  vip: 'vip'
};

export const SUBSCRIPTION_LABELS = {
  [SUBSCRIPTION_TIERS.free]: 'Gratis',
  [SUBSCRIPTION_TIERS.premium]: 'Premium',
  [SUBSCRIPTION_TIERS.vip]: 'VIP'
};

export const SUBSCRIPTION_COLORS = {
  [SUBSCRIPTION_TIERS.free]: 'text-slate-400 bg-slate-500/10',
  [SUBSCRIPTION_TIERS.premium]: 'text-red-400 bg-red-500/10',
  [SUBSCRIPTION_TIERS.vip]: 'text-purple-400 bg-purple-500/10'
};

export const SUBSCRIPTION_AVATAR_GRADIENTS = {
  [SUBSCRIPTION_TIERS.free]: 'from-slate-600 to-slate-700',
  [SUBSCRIPTION_TIERS.premium]: 'from-red-500 to-red-600',
  [SUBSCRIPTION_TIERS.vip]: 'from-purple-500 to-purple-600'
};

export const SUBSCRIPTION_BADGE_GRADIENTS = {
  [SUBSCRIPTION_TIERS.free]: 'from-slate-600 to-slate-700',
  [SUBSCRIPTION_TIERS.premium]: 'from-red-500 to-red-600',
  [SUBSCRIPTION_TIERS.vip]: 'from-purple-500 to-purple-600'
};

// Funciones de utilidad
export const getSubscriptionColor = (tier) => {
  return SUBSCRIPTION_COLORS[tier] || SUBSCRIPTION_COLORS[SUBSCRIPTION_TIERS.free];
};

export const getSubscriptionLabel = (tier) => {
  return SUBSCRIPTION_LABELS[tier] || SUBSCRIPTION_LABELS[SUBSCRIPTION_TIERS.free];
};

export const getSubscriptionAvatarGradient = (tier) => {
  return SUBSCRIPTION_AVATAR_GRADIENTS[tier] || SUBSCRIPTION_AVATAR_GRADIENTS[SUBSCRIPTION_TIERS.free];
};

export const getSubscriptionBadgeGradient = (tier) => {
  return SUBSCRIPTION_BADGE_GRADIENTS[tier] || SUBSCRIPTION_BADGE_GRADIENTS[SUBSCRIPTION_TIERS.free];
};

// Iconos usando lucide-react (deben importarse donde se usen)
export const getSubscriptionIcon = (tier) => {
  switch (tier) {
    case SUBSCRIPTION_TIERS.vip:
      return 'Crown';
    case SUBSCRIPTION_TIERS.premium:
      return 'Star';
    default:
      return 'Shield';
  }
};

// Para casos donde solo se muestra premium/vip (como en Header)
export const shouldShowSubscriptionBadge = (tier) => {
  return tier === SUBSCRIPTION_TIERS.premium || tier === SUBSCRIPTION_TIERS.vip;
};

export const getSubscriptionDisplayText = (tier) => {
  switch (tier) {
    case SUBSCRIPTION_TIERS.premium:
      return 'Premium';
    case SUBSCRIPTION_TIERS.vip:
      return 'VIP';
    default:
      return 'Miembro';
  }
};
