<?xml version="1.0" encoding="UTF-8"?>
<!--
  Makes sitemaps human-readable in a browser. Crawlers ignore the stylesheet
  and read the underlying XML, so this is purely a viewing aid.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Cekat.AI sitemap</title>
        <style>
          :root { color-scheme: light dark; }
          * { box-sizing: border-box; }
          body {
            margin: 0; padding: 2rem 1.25rem;
            font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
            color: #0b1220; background: #f7f8fa;
          }
          .wrap { max-width: 1100px; margin: 0 auto; }
          h1 { margin: 0 0 .25rem; font-size: 1.5rem; letter-spacing: -.01em; }
          .meta { margin: 0 0 1.5rem; color: #5b6472; font-size: .9rem; }
          .count { font-variant-numeric: tabular-nums; font-weight: 600; color: #0b1220; }
          table { width: 100%; border-collapse: collapse; background: #fff;
                  border: 1px solid #e3e6ea; border-radius: 10px; overflow: hidden; }
          th, td { text-align: left; padding: .6rem .85rem; border-bottom: 1px solid #eef0f3;
                   vertical-align: top; word-break: break-word; }
          th { background: #f1f3f6; font-size: .72rem; letter-spacing: .07em;
               text-transform: uppercase; color: #5b6472; }
          tr:last-child td { border-bottom: 0; }
          tr:hover td { background: #fafbfc; }
          a { color: #1d4ed8; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .num { width: 3.5rem; color: #8b95a3; font-variant-numeric: tabular-nums; }
          .when { white-space: nowrap; color: #5b6472; font-size: .85rem; }
          .alts { font-size: .8rem; color: #5b6472; white-space: nowrap; }
          .tag { display: inline-block; padding: .05rem .4rem; margin-right: .25rem;
                 border: 1px solid #d8dde4; border-radius: 999px; font-size: .72rem; }
          @media (prefers-color-scheme: dark) {
            body { color: #e6e9ee; background: #0d1117; }
            .count { color: #e6e9ee; }
            table { background: #161b22; border-color: #262c36; }
            th { background: #1b2129; color: #99a3b0; }
            th, td { border-bottom-color: #222831; }
            tr:hover td { background: #1a2029; }
            a { color: #6ea8ff; }
            .tag { border-color: #303844; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <xsl:apply-templates/>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Sitemap index: the parent listing child sitemaps -->
  <xsl:template match="s:sitemapindex">
    <h1>Sitemap index</h1>
    <p class="meta">
      <span class="count"><xsl:value-of select="count(s:sitemap)"/></span>
      <xsl:text> sitemaps. Each one lists the URLs for a section of the site.</xsl:text>
    </p>
    <table>
      <tr><th class="num">#</th><th>Sitemap</th><th>Last modified</th></tr>
      <xsl:for-each select="s:sitemap">
        <tr>
          <td class="num"><xsl:value-of select="position()"/></td>
          <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
          <td class="when"><xsl:value-of select="s:lastmod"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <!-- URL set: the actual pages -->
  <xsl:template match="s:urlset">
    <h1>Sitemap</h1>
    <p class="meta">
      <span class="count"><xsl:value-of select="count(s:url)"/></span>
      <xsl:text> URLs. Language alternates are shown where a page exists in both locales.</xsl:text>
    </p>
    <table>
      <tr>
        <th class="num">#</th><th>URL</th><th>Alternates</th><th>Last modified</th>
      </tr>
      <xsl:for-each select="s:url">
        <tr>
          <td class="num"><xsl:value-of select="position()"/></td>
          <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
          <td class="alts">
            <xsl:for-each select="xhtml:link">
              <span class="tag"><xsl:value-of select="@hreflang"/></span>
            </xsl:for-each>
          </td>
          <td class="when"><xsl:value-of select="s:lastmod"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>
