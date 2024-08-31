import React, { useEffect } from 'react';

const AdSense = () => {
  useEffect(() => {
    // Ensure that the adsbygoogle script is loaded
    const loadAds = () => {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    };

    // Load ads script if it hasn't been loaded already
    if (!document.querySelector('script[src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = loadAds;
    } else {
      loadAds();
    }
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: 'block' }}
         data-ad-client="ca-pub-0000000000000000"  // Test Ad Client ID
         data-ad-slot="0000000000"  // Test Ad Slot ID
         data-ad-format="auto"></ins>
  );
};

export default AdSense;
