/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://in-flames-closet.kiriancaumes.fr',
    generateRobotsTxt: true,
    changefreq: 'monthly',
    exclude: ['/server-sitemap.xml'],
    robotsTxtOptions: {
        additionalSitemaps: [
            `${process.env.SITE_URL || 'https://in-flames-closet.kiriancaumes.fr'}/server-sitemap.xml`,
        ],
        policies: [
            {
                userAgent: '*',
                disallow: '/', // Disable SEO
            },
            {
                userAgent: '*',
                disallow: ['/404'],
            },
        ],
    },
}
