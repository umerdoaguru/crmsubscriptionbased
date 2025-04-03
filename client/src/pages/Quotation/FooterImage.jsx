

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FooterImage = ({ quotationId }) => {
  const [footerImageData, setFooterImageData] = useState(null);

  useEffect(() => {
    const fetchFooterImageData = async () => {
      try {
        const response = await axios.get(`/api/images/${quotationId}/footer`);
        setFooterImageData(response.data);
      } catch (error) {
        console.error('Error fetching footer image data:', error);
      }
    };

    fetchFooterImageData();
  }, [quotationId]);

  // Check if footerImageData is available
  if (!footerImageData) {
    return <div>Loading footer image...</div>;
  }

  // Destructure relevant data from footerImageData
  const { file_path, otherData } = footerImageData;

  return (
    <div>
      {/* Display the footer image */}
      <img src={file_path} alt="Footer Image" />

      {/* Display other data if needed */}
      <p>{otherData}</p>
    </div>
  );
};

export default FooterImage;
