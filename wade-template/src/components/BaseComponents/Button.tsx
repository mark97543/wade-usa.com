// /root/projects/wade-template/src/components/BaseComponents/Button.tsx

/**
 * This will be the General Button Layout with the General Theme and Color Options 
 */

interface ButtonProps {
    children: React.ReactNode;
    type?: 'default' | 'danger' | 'neutral'; // Made optional with default value below
    onClick?: () => void;
    style?: React.CSSProperties; 
    disabled?: boolean;
    loading?: boolean;
}

function Button({ children, type = 'default', onClick, style, disabled, loading }: ButtonProps) {

  return (
    <>
        <style>{`
            .main {
                color: #ffffff;
                padding: var(--gap-sm);
                border-radius: var(--radius-md);
                cursor: pointer;
                border: none;
                transition: 0.2s ease;
                font-size: var(--font-base);
                margin: calc(var(--gap-sm)/2);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .main:hover:not(:disabled) {
                filter: brightness(1.3);
            }

            .main:active:not(:disabled) {
                transform: scale(0.95);
            }

            /* Disabled State */
            .main:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                filter: grayscale(0.5);
            }

            .default { background-color: var(--primary-color); }
            .danger { background-color: #ef4444; }
            .neutral { background-color: #6b7280; }
        `}</style>

        <div>
            {/* 🚩 Added disabled={disabled || loading} */}
            <button 
                className={`main ${type}`}  
                onClick={onClick} 
                style={style}
                disabled={disabled || loading} 
            >
                {loading && <span className="spinner">⏳</span>}
                {children}
            </button>
        </div>
    </>
  )
}

export default Button