type IconProps = { size?: number; className?: string };

const stroke = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function IconSearch({ size = 17, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function IconPhone({ size = 14, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function IconMapPin({ size = 14, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IconClock({ size = 16, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function IconMail({ size = 15, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M22 6 12 13 2 6" />
      <path d="M2 6h20v12H2z" />
    </svg>
  );
}

export function IconUser({ size = 14, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IconHeart({ size = 17, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export function IconCart({ size = 19, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}

export function IconMenu({ size = 18, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function IconClose({ size = 16, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function IconArrowRight({ size = 16, className }: IconProps) {
  return (
    <svg {...stroke(size)} strokeWidth={2.3} className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function IconChevronLeft({ size = 16, className }: IconProps) {
  return (
    <svg {...stroke(size)} strokeWidth={2.3} className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function IconChevronRight({ size = 16, className }: IconProps) {
  return (
    <svg {...stroke(size)} strokeWidth={2.3} className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function IconCheck({ size = 18, className }: IconProps) {
  return (
    <svg {...stroke(size)} strokeWidth={2.5} className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconAlertTriangle({ size = 18, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function IconTruck({ size = 16, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function IconHome({ size = 16, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function IconCreditCard({ size = 20, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export function IconCheckCircle({ size = 20, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function IconTelegram({ size = 13, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.5 3.5 2.7 10.9c-1.2.5-1.2 1.2-.2 1.5l4.8 1.5 1.9 5.7c.2.6.4.8.9.8.5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.8-.9l3.2-15c.3-1.3-.5-1.9-1.9-1.8z" />
    </svg>
  );
}

export function IconWhatsApp({ size = 13, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1zm4.4-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4L9.2 8.2c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3a2.3 2.3 0 0 0-.7 1.7c0 1 .7 2 .8 2.1.1.2 1.5 2.4 3.7 3.3.5.2.9.4 1.2.5.5.2 1 .1 1.3-.1.4-.2 1.2-.9 1.3-1.2.2-.3.2-.5.1-.6z" />
    </svg>
  );
}

export function IconInstagram({ size = 13, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.3" cy="6.7" r="1" />
    </svg>
  );
}

export function IconVk({ size = 13, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M2 8c0-2.2 0-3.4.7-4.1S4.6 3 6.8 3h10.4c2.2 0 3.4 0 4.1.9S22 6 22 8v8c0 2.2 0 3.4-.7 4.1S19.4 21 17.2 21H6.8c-2.2 0-3.4 0-4.1-.9S2 18 2 16z" opacity=".18" />
      <text x="12" y="16.5" fontSize="11" fontFamily="Arial" textAnchor="middle">VK</text>
    </svg>
  );
}

export function IconSun({ size = 15, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="4.5" y1="4.5" x2="6.2" y2="6.2" />
      <line x1="17.8" y1="17.8" x2="19.5" y2="19.5" />
      <line x1="1.5" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22.5" y2="12" />
      <line x1="4.5" y1="19.5" x2="6.2" y2="17.8" />
      <line x1="17.8" y1="6.2" x2="19.5" y2="4.5" />
    </svg>
  );
}

export function IconMoon({ size = 15, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
    </svg>
  );
}

export function IconUpload({ size = 18, className }: IconProps) {
  return (
    <svg {...stroke(size)} className={className}>
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      <polyline points="7 9 12 4 17 9" />
      <line x1="12" y1="4" x2="12" y2="15" />
    </svg>
  );
}
