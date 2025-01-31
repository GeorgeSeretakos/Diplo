await strapi.db.query('api::debate.debate').deleteMany({});
await strapi.db.query('api::speech.speech').deleteMany({});
await strapi.db.query('api::speaker.speaker').deleteMany({});
await strapi.db.query('api::html.html').deleteMany({});
await strapi.db.query('api::political-party.political-party').deleteMany({});