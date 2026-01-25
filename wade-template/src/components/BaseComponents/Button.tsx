// /root/projects/wade-template/src/components/BaseComponents/Button.tsx

/**
 * This will be the General Button Layout with the General Theme and Color Options 
 */

import React from 'react'

interface ButtonProps{
    children:React.ReactNode;
    type:'default' | 'danger' | 'neutral';
    onClick?: ()=>void;
    style?:React.CSSProperties //For Inline Styles
}

function Button({children, type='default', onClick, style}:ButtonProps) {

  return (
    <>
        <style>{`
            .main{
                color:#ffffff;
                padding:var(--gap-sm);
                border-radius:var(--radius-md);
                cursor:pointer;
                border:none;
                transition: 0.2s ease;
                font-size:var(--font-base);
                margin:calc(var(--gap-sm)/2);
            }

            .main:hover{
                filter:brightness(1.3);
            }

            .main:active{
                transform:scale(0.9);
            }

            .default{
                background-color:var(--primary-color);
            }

            .danger{
                background-color:#ef4444;
            }

            .neutral{
                background-color:#6b7280;
            }
        `}</style>

        <div>
            <button className={`main ${type}`}  onClick={onClick} style={style}>
                {children}
            </button>
        </div>
    </>
  )
}

export default Button