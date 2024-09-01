import { useEffect } from 'react';
// import dotenv from 'dotenv'
// dotenv.config();

function AdSense() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.setAttribute('data-ad-client', 'YOUR_ADSENSE_CLIENT_ID');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={`${process.env.VITE_ADSENSE_CLIENT}`}
      data-ad-slot={`${process.env.VITE_ADSENSE_SLOT}`}
      data-ad-format={`${process.env.VITE_ADSENSE_FORMAT}`}
      data-full-width-responsive={`${process.env.VITE_ADSENSE_RESPONSIVE}`}
    />
  );
}

export default AdSense;