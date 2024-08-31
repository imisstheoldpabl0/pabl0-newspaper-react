import React, { useEffect } from 'react';

const AdSense = ({ client, slot, format = "auto", responsive = "true" }) => {
  useEffect(() => {
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      data-adtest="on">
    </ins>
  );
};

export default AdSense;
