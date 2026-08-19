import { useId, type CSSProperties } from 'react';

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  onError?: () => void;
};

export default function LiquidImage({ src, alt, width, height, loading = 'lazy', fetchPriority, onError }: Props) {
  const id = `liquid-${useId().replace(/:/g, '')}`;
  const style = { '--liquid-filter': `url(#${id})` } as CSSProperties;

  return <span className="liquid-image">
    <svg className="liquid-image-defs" aria-hidden="true" focusable="false">
      <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="2" seed="7" result="noise">
          <animate attributeName="baseFrequency" values="0.012 0.025;0.02 0.012;0.012 0.025" dur="1.4s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B">
          <animate attributeName="scale" values="0;16;0" dur="1.4s" repeatCount="indefinite" />
        </feDisplacementMap>
      </filter>
    </svg>
    <img src={src} alt={alt} width={width} height={height} loading={loading} fetchPriority={fetchPriority} style={style} onError={onError} />
  </span>;
}
