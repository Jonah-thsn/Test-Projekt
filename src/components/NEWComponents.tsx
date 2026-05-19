import React from 'react';

/**
 * Headline Component
 * variants: v1 (H1), v2 (H2), h3 (H3)
 */
export const Headline: React.FC<{ 
  variant: 'v1' | 'v2' | 'h3', 
  children: React.ReactNode,
  className?: string 
}> = ({ variant, children, className = '' }) => {
  const Tag = variant === 'v1' ? 'h1' : variant === 'v2' ? 'h2' : 'h3';
  const classes = `headline-${variant} ${className}`;
  return <Tag className={classes}>{children}</Tag>;
};

/**
 * Copy Component
 * variants: intro, default, medium, small, highlighted
 */
export const Copy: React.FC<{ 
  variant?: 'intro' | 'default' | 'medium' | 'small' | 'highlighted', 
  children: React.ReactNode,
  className?: string 
}> = ({ variant = 'default', children, className = '' }) => {
  const classes = `copy${variant !== 'default' ? ` copy-${variant}` : ''} ${className}`;
  return <p className={classes}>{children}</p>;
};

/**
 * Button Component
 * variants: primary, secondary, ghost
 */
export const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost',
  onClick?: () => void,
  children: React.ReactNode,
  className?: string,
  type?: 'button' | 'submit' | 'reset',
  disabled?: boolean
}> = ({ variant = 'primary', onClick, children, className = '', type = 'button', disabled = false }) => {
  const classes = `btn btn-${variant} ${className}`;
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

/**
 * Spacer Component
 * sizes: 8, 16, 24, 32, 48, 64
 */
export const Spacer: React.FC<{ size: 8 | 16 | 24 | 32 | 48 | 64 }> = ({ size }) => {
  return <div className={`spacer-${size}`} aria-hidden="true" />;
};

/**
 * Grid Component
 */
export const Grid: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return <div className={`grid ${className}`}>{children}</div>;
};

/**
 * TeaserTextImage Component
 */
export const TeaserTextImage: React.FC<{
  title: string,
  text: string,
  imageSrc: string,
  imageAlt: string,
  reverse?: boolean,
  ctaText?: string,
  onCtaClick?: () => void
}> = ({ title, text, imageSrc, imageAlt, reverse = false, ctaText, onCtaClick }) => {
  return (
    <div className={`teaser-text-image ${reverse ? 'reverse' : ''}`}>
      <div className="teaser-content">
        <Headline variant="v2">{title}</Headline>
        <Copy variant="intro">{text}</Copy>
        {ctaText && (
          <Button variant="primary" onClick={onCtaClick}>{ctaText}</Button>
        )}
      </div>
      <div className="teaser-image">
        <img src={imageSrc} alt={imageAlt} />
      </div>
    </div>
  );
};
