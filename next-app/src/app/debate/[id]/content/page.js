'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {constants} from "../../../../../constants/constants.js";

const STRAPI_URL = constants.STRAPI_URL;
const API_TOKEN = constants.API_TOKEN;

const DebateContent = () => {
  const { id: documentId } = useParams();
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDebateHtml = async () => {
      try {
        const response = await fetch(`${STRAPI_URL}/api/debates/${documentId}?populate=html`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch debate content');
        }
        const data = await response.json();
        console.log("Data: ", data);
        setHtmlContent(data.data.html.html);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDebateHtml();
  }, [documentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Debate Content</h1>
      {htmlContent ? (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
};

export default DebateContent;
