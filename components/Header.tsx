import { WHATSAPP_NUMBER } from '@/data/products';

export default function Header() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quiero consultar sobre sus suplementos 💪')}`;

  return (
    <header className="site-header">
      <div className="logo-wrap">
        {/* Replace with <Image src="/images/logo.webp" alt="Makako Fit" height={44} priority /> when you have the logo file */}
        <span className="logo-text">
          MAKAKO <span>FIT</span>
        </span>
      </div>

      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M11.99 2C6.476 2 2 6.477 2 11.99c0 1.76.464 3.409 1.276 4.838L2 22l5.308-1.256A9.95 9.95 0 0 0 11.99 22C17.505 22 22 17.522 22 12.01 22 6.477 17.505 2 11.99 2zm0 18.011a8 8 0 0 1-4.08-1.116l-.292-.173-3.152.747.766-3.07-.19-.315A8.001 8.001 0 0 1 3.989 12 8 8 0 0 1 12 4a8 8 0 0 1 8 8c0 4.411-3.588 8.011-8.01 8.011z" />
        </svg>
        PEDIR
      </a>
    </header>
  );
}
