import React from 'react';
import {
  Chats,
  Package,
  ArrowCounterClockwise,
  CurrencyDollar,
  ChatCenteredText,
  HandWaving,
  Info,
  Target,
  Airplane,
  Envelope,
  Megaphone,
  ShoppingCart,
  Wrench,
  Lightbulb,
  CalendarBlank,
  Handshake,
  Star,
  Flame,
  Lock,
  Phone,
  Gift
} from '@phosphor-icons/react';

export function getCategoryIcon(emoji: string, categoryName: string, iconClass: string, size: number = 18) {
  // Try to match by emoji first (so custom named categories with standard emojis get mapped)
  switch (emoji) {
    case '📦':
      return <Package weight="bold" size={size} className={iconClass} />;
    case '🔄':
      return <ArrowCounterClockwise weight="bold" size={size} className={iconClass} />;
    case '💰':
      return <CurrencyDollar weight="bold" size={size} className={iconClass} />;
    case '💬':
      return <ChatCenteredText weight="bold" size={size} className={iconClass} />;
    case '👋':
      return <HandWaving weight="bold" size={size} className={iconClass} />;
    case 'ℹ️':
      return <Info weight="bold" size={size} className={iconClass} />;
    case '🎯':
      return <Target weight="bold" size={size} className={iconClass} />;
    case '✈️':
      return <Airplane weight="bold" size={size} className={iconClass} />;
    case '✉️':
      return <Envelope weight="bold" size={size} className={iconClass} />;
    case '📢':
      return <Megaphone weight="bold" size={size} className={iconClass} />;
    case '🛒':
      return <ShoppingCart weight="bold" size={size} className={iconClass} />;
    case '🛠️':
      return <Wrench weight="bold" size={size} className={iconClass} />;
    case '💡':
      return <Lightbulb weight="bold" size={size} className={iconClass} />;
    case '📅':
      return <CalendarBlank weight="bold" size={size} className={iconClass} />;
    case '🤝':
      return <Handshake weight="bold" size={size} className={iconClass} />;
    case '⭐':
      return <Star weight="bold" size={size} className={iconClass} />;
    case '🔥':
      return <Flame weight="bold" size={size} className={iconClass} />;
    case '🔒':
      return <Lock weight="bold" size={size} className={iconClass} />;
    case '📞':
      return <Phone weight="bold" size={size} className={iconClass} />;
    case '🎁':
      return <Gift weight="bold" size={size} className={iconClass} />;
  }

  // Fallback to name match (for 'All' or if emoji wasn't mapped)
  switch (categoryName.toLowerCase()) {
    case 'all':
      return <Chats weight="bold" size={size} className={iconClass} />;
    case 'shipping':
      return <Package weight="bold" size={size} className={iconClass} />;
    case 'returns':
      return <ArrowCounterClockwise weight="bold" size={size} className={iconClass} />;
    case 'pricing':
      return <CurrencyDollar weight="bold" size={size} className={iconClass} />;
    case 'general':
      return <ChatCenteredText weight="bold" size={size} className={iconClass} />;
    default:
      return <span className="text-[15px]">{emoji}</span>;
  }
}
