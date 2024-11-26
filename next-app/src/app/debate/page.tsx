'use client';

import {useEffect, useState} from "react";
import {fetchAndTransformClientSide} from "@/utils/clientTransformToHtml";

const DebatePage = () => {
    const [htmlContent, setHtmlContent] = useState<string>('');

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Toggle between client-side and server-side transformation
                const isClientSide = false; // Change to true to use client-side transformation

                let html = '';

                if (isClientSide) {
                    html = await fetchAndTransformClientSide();
                } else {
                    const HtmlResponse = await fetch('/api/transformAPI?format=html');
                    if (!HtmlResponse.ok) throw new Error("Failed to fetch transformed Html");
                    html = await HtmlResponse.text();
                    console.log("HTML response: ", html);
                }
                setHtmlContent(html);
            } catch (error) {
                console.error("Error loading debate content: ", error);
            }
        };

        loadContent();
    }, []);

    return (
        <div>
            <h1>This is the Debate Page</h1>
            <div
                id="debate-content"
                dangerouslySetInnerHTML={{__html: htmlContent}}
            />
        </div>
    );
}

export default DebatePage;
