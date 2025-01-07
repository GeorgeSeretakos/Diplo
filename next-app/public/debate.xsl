<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:ns="http://docs.oasis-open.org/legaldocml/ns/akn/3.0"
                exclude-result-prefixes="ns">

    <xsl:output method="html" indent="yes" encoding="UTF-8"/>

    <!-- elements without templates are skipped: The processor skips over elements with no defined template. -->
    <!-- child elements with templates are processed: If the <container> element has child elements with matching -->
    <!-- templates (e.g., <p>), those children will still be processed and output as defined by their own templates. -->

    <!-- Root template to match the akomaNtoso root element -->
    <xsl:template match="/ns:akomaNtoso">
        <html>
            <body>
                <div class="debate-container">
                    <h1>Debate Content</h1>
                    <xsl:apply-templates select="ns:debate"/>
                </div>
            </body>
        </html>
    </xsl:template>

    <!-- Template for the debate element, extracting metadata and body -->
    <xsl:template match="ns:debate">
        <div class="debate">

            <!-- Display the Metadata -->
            <h2>Metadata</h2>
            <p><strong>Date: </strong> <xsl:value-of select="ns:meta/ns:identification/ns:FRBRWork/ns:FRBRdate/@date"/></p>
            <p><strong>Session Number: </strong> <xsl:value-of select="ns:meta/ns:identification/ns:FRBRWork/ns:FRBRalias/@value"/></p>
            <p><strong>Language: </strong> <xsl:value-of select="ns:meta/ns:identification/ns:FRBRExpression/ns:FRBRlanguage/@language"/></p>

            <!-- Display the Parliament Details -->
            <h2>Parliament Details</h2>
            <xsl:apply-templates select="ns:preface/ns:container" />

            <!-- Display the Opening Section -->
            <h2>Opening Section</h2>
            <xsl:apply-templates select="ns:debateBody/ns:debateSection[@name='opening']"/>

            <!-- Display the Main Debate Section -->
            <h2>Main Debate Section</h2>
            <xsl:apply-templates select="ns:debateBody/ns:debateSection[@name='main_debate_section']"/>
        </div>
    </xsl:template>

    <!-- Template for the debateSection element, processing speeches and paragraphs -->
    <xsl:template match="ns:debateSection">
        <div class="section">
<!--            <h3>Section: <xsl:value-of select="@name"/></h3>-->
            <xsl:apply-templates select="*" />
        </div>
    </xsl:template>

    <!-- Template for each paragraph in a debateSection or speech -->
    <xsl:template match="ns:p">
        <p><xsl:value-of select="."/></p>
    </xsl:template>

    <!-- Template for each speech element, displaying the speakerId and content -->
    <xsl:template match="ns:speech">
        <div class="speech">
            <p><strong>Speaker: </strong> <xsl:value-of select="ns:from"/></p>
            <div class="speech-text">
                <xsl:apply-templates select="ns:p"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="ns:scene">
        <div class="scene">
            <p><em>Scene: </em><xsl:value-of select="." /></p>
        </div>
    </xsl:template>

</xsl:stylesheet>
